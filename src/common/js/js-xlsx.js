//execl api list:

//public params
import fs from 'file-saver';
import _XLSX from 'xlsx';
import moment from 'moment';
import util from './util';
const X = typeof XLSX !== 'undefined' ? XLSX : _XLSX;
const make_cols = refstr => Array(X.utils.decode_range(refstr).e.c + 1).fill(0).map((x,i) => ({name:X.utils.encode_col(i), key:i}));

export default {
sheetJSFT:function(){
    return ["xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
        ].map(function(x) { return "." + x; }).join(",");
},

s2ab:function(s){
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
},
//import

importToJsonData:function(file,callback) {
    /* Boilerplate to set up FileReader */
    let data=[];
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
        /* Parse data */
        const bstr = e.target.result;
        const wb = X.read(bstr, {type:'binary'});
        
        /* Get first worksheet */
        wb.SheetNames.map(name=>{
            let wsname=name;
            let ws=wb.Sheets[wsname];
            let sheetData= X.utils.sheet_to_json(ws);
            data.push(sheetData);
        })
        callback(data);
    };
    
},
//export

 sheet_from_array_of_arrays:function(data, opts) {
    var ws = {};
    var range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
    for (var R = 0; R != data.length; ++R) {
        for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            var cell = {
                v: data[R][C],
                s: {
                    fill: {
                      patternType: "none",
                      fgColor: {rgb: "FF000000"},
                      bgColor: {rgb: "FFFFFFFF"}
                    },
                    font: {
                      name: 'Times New Roman',
                      sz: 16,
                      color: {rgb: "#FF000000"},
                      bold: false,
                      italic: false,
                      underline: false
                    },
                    border: {
                      top: {style: "thin", color: {auto: 1}},
                      right: {style: "thin", color: {auto: 1}},
                      bottom: {style: "thin", color: {auto: 1}},
                      left: {style: "thin", color: {auto: 1}}
                    }
                  }
            };
            if (cell.v == null) continue;
            var cell_ref = X.utils.encode_cell({c: C, r: R});

            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
                cell.t = 'n';
                cell.z = X.SSF._table[14];
                cell.v = datenum(cell.v);
            }
            else cell.t = 's';
            ws[cell_ref] = cell;
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = X.utils.encode_range(range);
    return ws;
},

//导出html流
exportHtmlToExecl:function(Str){
    
    var objE = document.createElement("div");
    objE.innerHTML = Str;
    fetch({
        url:'/api/Upload/ExportHtmlToXls?dto='+Str,
        method:'get'
    }).then(data=>{
        console.log(data);
    }).catch(e=>{
        console.log(e);
    })
    const ws = X.utils.table_to_sheet(objE);
    const wb = X.utils.book_new();
    X.utils.book_append_sheet(wb, ws, "SheetJS");
    X.utils.book_append_sheet(wb, ws, "SheetJS1");
    const wbout = X.write(wb, {type:"binary", bookType:"xlsx"});
    fs.saveAs(new Blob([this.s2ab(wbout)],{type:"application/octet-stream"}), "sheetjs.xlsx");
},

exportForExecl:function(data,conf) {
    /* Boilerplate to set up FileReader */
    const ws = this.sheet_from_array_of_arrays(data);
    const wb = X.utils.book_new();
    X.utils.book_append_sheet(wb, ws, "SheetJS");
    /* generate X file */
    const wbout = X.write(wb, {type:"binary", bookType:"xlsx"});
    /* send to client */
    fs.saveAs(new Blob([this.s2ab(wbout)],{type:"application/octet-stream"}), "sheetjs.xlsx");
    
},  

//==================================================
//导出指定数据
exportCommonTemplate:function(ColumnConf,DataList,titleName){
    let tableinfo=ColumnConf;
    let thead='<tr style=\"background:#58B7FF\" height=\"25\">';
    let colNum=0,dataModel=[];
    tableinfo.map(data=>{
             if(data.attr.label!='序号'&&data.attr.label!='全选'&&data.attr.label!='预览'&&data.attr.label!='详情'){
                 colNum++;
                 dataModel.push(data.attr.prop);
                 thead=thead+`<td nowrap align=\"${data.attr.align}\" width=\"${data.attr.width}\" colspan=\"1\">${data.attr.label}</td>`
             }
         })
     thead=thead+'</tr>';   
     let tbody='';
     DataList.map((data,index)=>{
             let rows='';
             if(index%2===0){
                 rows="<tr style=\"background:#E5E9F2\" height=\"20\">"
             }else{
                 rows="<tr  height=\"20\">"
             }
             dataModel.map(i=>{
                 rows=rows+`<td nowrap >${data[i]}</td>`
             })
             tbody=tbody+rows+'</tr>';
      })
     let tfoot=`<tr  height=\"25\"><td colspan=\"${colNum}\" align=\"left\">总行数：${DataList.length}</td></tr>`;
     let tableSkeleton=`
                     <table border=1 bordercolor=\"#324057\">
                         <thead >${thead}</thead>
                         <tbody >${tbody}</tbody>
                         <tfoot>${tfoot}</tfoot>
                     </table>
                     `;
     this.exportHtmlToExcel(tableSkeleton,{
                         withDate:true,
                         fileName:titleName,
                         titleName:titleName,
                         HeaderColspan:colNum
                     }
                 );
},

//根据数据和配置导出execl
exportHtmlToExcel:function(str,fileConf){
    const userInfo=JSON.parse(util.getCookie('userInfo')).user;
    const defaultFileConf={
        fileName:'导出文档',
        titleName:'测试报表',
        withDate:true,
        withReportHeader:true,
        HeaderColspan:15,
        blobType:'application/vnd.ms-excel',
        docType:'.xls',
    };
    const execlConf = Object.assign({}, defaultFileConf, fileConf); 
    let header=`
        <table style=\" \">
            <tr>
                <td align=\"left\"  colspan=\"${execlConf.HeaderColspan}\" height=\"35\" style=\"font-size: 12px; margin-left:200px\"> 
                    <span style=\"font-size: 20px;\"><b><u>&nbsp; ${execlConf.titleName} &nbsp;</u></b></span>
                    <span style=\"display:inline-block;margin-left:20px\">&nbsp;导出日期：${moment(new Date()).format('LL')}&nbsp;|&nbsp;导出人：${userInfo.realName} &nbsp;|&nbsp;导出单位： ${userInfo.manageOrgName} </span>
                    </td>
            </tr>
        </table>
    `
    let html = `<html>
                <head><meta charset='utf-8' /></head>
                <body>
                <div>
                    ${execlConf.withReportHeader?header:''}
                </div>
                <div style=\"background-color:#eee\">
                    ${str}
                </div>
                </body></html>`
    var blob = new Blob([html], { type:execlConf.blobType});
    let fileName=execlConf.fileName;
    if(execlConf.withDate){
        fileName=fileName+'_'+moment(new Date()).format('LL')+execlConf.docType
    }
    fs.saveAs(blob,fileName);
}

}


