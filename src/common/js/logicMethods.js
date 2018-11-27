import fetch from '@/api/fetch';
export default {
  //方式示例
  getThisMonthStore: function (mon, orgId) {
    return new Promise(function (resolve, reject) {
      let arr = mon.split('-');
      let year = arr[0];
      let month = parseInt(arr[1]) + 1;
      if (month == 13) {
        year = parseInt(year) + 1;
        month = 1;
      };
      if (month < 10) {
        month = '0' + month;
      };
      let rstmon = year + '-' + month;
      let params = {
        queryConditionItem: [{
            dataField: 'OrgId',
            dataValue: orgId,
            op: 'EQ',
            relation: 'and'
          },
          {
            dataField: 'V_Col10',
            dataValue: rstmon,
            op: 'EQ',
            relation: 'and'
          }
        ],
        maxResultCount: 1,
        skipCount: 1,
        sorting: '',
        draw: 1
      };
      fetch({
        url: 'api/services/app/singleTable31/getMainPageList',
        method: 'post',
        data: params
      }).then((data) => {
        resolve(data);
      }).catch((err) => {
        reject(new Error('执行结果异常！' + err))
      });
    });
  },
  getThisMonthTurnoverStore: function (mon, orgId) {
    return new Promise(function (resolve, reject) {
      let arr = mon.split('-');
      let year = arr[0];
      let month = parseInt(arr[1]) + 1;
      if (month == 13) {
        year = parseInt(year) + 1;
        month = 1;
      };
      if (month < 10) {
        month = '0' + month;
      };
      let rstmon = year + '-' + month;
      let params = {
        queryConditionItem: [{
            dataField: 'OrgId',
            dataValue: orgId,
            op: 'EQ',
            relation: 'and'
          },
          {
            dataField: 'V_Col8',
            dataValue: rstmon,
            op: 'EQ',
            relation: 'and'
          }
        ],
        maxResultCount: 1,
        skipCount: 1,
        sorting: '',
        draw: 1
      };
      fetch({
        url: 'api/services/app/singleTable38/getMainPageList',
        method: 'post',
        data: params
      }).then((data) => {
        resolve(data);
      }).catch((err) => {
        reject(new Error('执行结果异常！' + err))
      });
    });
  },
  getThisMonthEquipmentStore: function (mon, orgId) {
    return new Promise(function (resolve, reject) {
      let arr = mon.split('-');
      let year = arr[0];
      let month = parseInt(arr[1]) + 1;
      if (month == 13) {
        year = parseInt(year) + 1;
        month = 1;
      };
      if (month < 10) {
        month = '0' + month;
      };
      let rstmon = year + '-' + month;
      let params = {
        queryConditionItem: [{
            dataField: 'OrgId',
            dataValue: orgId,
            op: 'EQ',
            relation: 'and'
          },
          {
            dataField: 'V_Col8',
            dataValue: rstmon,
            op: 'EQ',
            relation: 'and'
          }
        ],
        maxResultCount: 1,
        skipCount: 1,
        sorting: '',
        draw: 1
      };
      fetch({
        url: 'api/services/app/singleTable5/getMainPageList',
        method: 'post',
        data: params
      }).then((data) => {
        resolve(data);
      }).catch((err) => {
        reject(new Error('执行结果异常！' + err))
      });
    });
  },
   //租赁中心动态表审核
  getThisMonthLeaseStore: function (mon, orgId) {
    return new Promise(function (resolve, reject) {
      let arr = mon.split('-');
      let year = arr[0];
      let month = parseInt(arr[1]) + 1;
      if (month == 13) {
        year = parseInt(year) + 1;
        month = 1;
      };
      if (month < 10) {
        month = '0' + month;
      };
      let rstmon = year + '-' + month;
      let params = {
        queryConditionItem: [{
            dataField: 'OrgId',
            dataValue: orgId,
            op: 'EQ',
            relation: 'and'
          },
          {
            dataField: 'V_Col8',
            dataValue: rstmon,
            op: 'EQ',
            relation: 'and'
          }
        ],
        maxResultCount: 1,
        skipCount: 1,
        sorting: '',
        draw: 1
      };
      fetch({
        url: 'api/services/app/singleTable33/getMainPageList',
        method: 'post',
        data: params
      }).then((data) => {
        resolve(data);
      }).catch((err) => {
        reject(new Error('执行结果异常！' + err))
      });
    });
  },

  //打印导出函数
  orderPrintEvent: function (option, _this, LODOP, userConf) {
    let property = _this.utilObject.getLocalStorage('SysGlobConf').print.order;
    let propertys = userConf.order;
  //判断是否用户自定义
    if (userConf.order != null) {
      let orderHeight = _this.outPutConf.displayModel.orderHeight;
      var printName = _this.outPutConf.displayModel.titleName + '打印预览_设置属性';
      if (option.dataModel !== undefined) {
        let url = _this.utilObject.getLocalStorage('SysGlobConf').phoneViewUrl;
        let menuCode=encodeURIComponent(_this.menuCode);
        var barCode=url+'?'+'id='+option.dataModel.order.id+'&'+'menuCode='+menuCode;
        var orderCode = option.dataModel.order.orderCode;
      } else {
        barCode = '暂无内容';
        orderCode = '暂无内容'
      };
      LODOP.PRINT_INITA(0, 0, propertys.width, propertys.height, printName);
      LODOP.SET_PREVIEW_WINDOW(1, 0, 1, 0, 0, '预览查看.开始打印');
      LODOP.SET_PRINT_MODE('POS_BASEON_PAPER', true);
      LODOP.ADD_PRINT_TABLE(propertys.marginRight, propertys.marginLeft, propertys.width, 50, option.title);
      LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
      //判断是否是三联单
      if (propertys.paper == '三联单') {
        if (propertys.sB_Col8 != true) {
          LODOP.SET_PRINT_PAGESIZE(1, 2100, 1400, propertys.paper);
        } else {
          LODOP.SET_PRINT_PAGESIZE(2, 2100, 1400, propertys.paper);
        }
      } else {
      //判断是否横纵向 
        if (propertys.sB_Col8 != true) {
          LODOP.SET_PRINT_PAGESIZE(1, 0, 0, propertys.paper);
        } else {
          LODOP.SET_PRINT_PAGESIZE(2, 0, 0, propertys.paper);
        }
      };
      LODOP.ADD_PRINT_TABLE(propertys.marginRight + 60, propertys.marginLeft, propertys.width, orderHeight, option.strBodyStyle + "<body>" + option.order + "</body>");
      LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
      LODOP.ADD_PRINT_TABLE(propertys.marginRight + orderHeight + 70, propertys.marginLeft, propertys.width, propertys.rowHeight * propertys.tableRows + 60, option.strBodyStyle + "<body>" + option.item.thead + option.item.tbody + option.item.blank + option.item.tfoot + "</body>");
      LODOP.SET_PRINT_STYLEA(0, "TableHeightScope", 2);
      LODOP.SET_PRINT_STYLEA(0, "HtmWaitMilSecs", 500);
      //判断是否含有合计行
      if(_this.outPutConf.displayModel.sumRowModel.length==0){
        LODOP.ADD_PRINT_TABLE(30 + propertys.rowHeight * propertys.tableRows + orderHeight + propertys.marginRight + 80, propertys.marginLeft, propertys.width, _this.outPutConf.displayModel.footModel[0].height + 25, option.strBodyStyle + "<body>" + option.foot + "</body>");
      }else{
        LODOP.ADD_PRINT_TABLE(60 + propertys.rowHeight * propertys.tableRows + orderHeight + propertys.marginRight + 80, propertys.marginLeft, propertys.width, _this.outPutConf.displayModel.footModel[0].height + 25, option.strBodyStyle + "<body>" + option.foot + "</body>");
      }
      LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
      if (propertys.paper == '三联单') {
        if (propertys.isPageNum != false) {
          LODOP.ADD_PRINT_TEXT(10, propertys.marginRight + propertys.width - 100, 240, 30, '第#页/共&页');
          LODOP.SET_PRINT_STYLEA(0, 'ItemType', 2);
        } else {}
      } else {
        if (propertys.isPageNum != false) {
          LODOP.ADD_PRINT_TEXT(propertys.height - 15, propertys.width / 2, 240, 30, '第#页/共&页');
          LODOP.SET_PRINT_STYLEA(0, 'ItemType', 2);
        } else {};
      };
      if (property.barcode != false) {
        LODOP.ADD_PRINT_BARCODE(propertys.marginRight, propertys.width -30, 130, 110, "QRCode", barCode);
      } else {
        LODOP.ADD_PRINT_BARCODE(5000, 7777, 0, 0, "QRCode", barCode);
      };
      LODOP.SET_PRINT_STYLEA(0, 'QRCodeVersion', 14);
      LODOP.SET_PRINT_STYLEA(0, 'QRCodeErrorLevel', 'H');
      LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
      LODOP.ADD_PRINT_IMAGE(propertys.marginRight, propertys.marginLeft, 76, 64, "<img style='z-index:5;position:absolute;left:0px;top:0px;border:0;' src='static/img/zgztlogo2.png'/>");
      LODOP.SET_PRINT_STYLEA(0, "Stretch", 2);
      LODOP.SET_PRINT_STYLEA(0, "TransColor", "#FFFFFF");
      LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
      LODOP.SET_PRINT_STYLEA(0, 'QRCodeVersion', 14);
      LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);  
      LODOP.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW', 1);
      LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED", 1);
    } else {
      let orderHeight = _this.outPutConf.displayModel.orderHeight;
      var printName = _this.outPutConf.displayModel.titleName + '打印预览_设置属性';
      if (option.dataModel !== undefined) {
        let url = _this.utilObject.getLocalStorage('SysGlobConf').phoneViewUrl;
        let menuCode=encodeURIComponent(_this.menuCode);
        var barCode=url+'?'+'id='+option.dataModel.order.id+'&'+'menuCode='+menuCode;
        var orderCode = option.dataModel.order.orderCode;
      } else {
        barCode = '暂无内容';
        orderCode = '暂无内容'
      };
      LODOP.PRINT_INITA(property.margin.top, property.margin.left, property.width, property.height, printName);
      LODOP.SET_PREVIEW_WINDOW(1, 0, 1, 0, 0, '预览查看.开始打印');
      LODOP.SET_PRINT_MODE('POS_BASEON_PAPER', true);
      LODOP.ADD_PRINT_TABLE(property.padding.top, property.padding.left, property.width, 50, option.title);
      LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
      if (property.paper == '三联单') {
        LODOP.SET_PRINT_PAGESIZE(property.intOrient, 2100, 1400, property.paper);
      } else {
        LODOP.SET_PRINT_PAGESIZE(property.intOrient, 0, 0, property.paper);
      };
      LODOP.ADD_PRINT_TABLE(property.padding.top + 60, property.padding.left, property.width, orderHeight, option.strBodyStyle + "<body>" + option.order + "</body>");
      LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
      LODOP.ADD_PRINT_TABLE(property.padding.top + orderHeight + 70, property.padding.left, property.width, property.table.rowNum * property.table.lineHeight + 60, option.strBodyStyle + "<body>" + option.item.thead + option.item.tbody + option.item.blank + option.item.tfoot + "</body>");
      LODOP.SET_PRINT_STYLEA(0, "TableHeightScope", 2);
      LODOP.SET_PRINT_STYLEA(0, "HtmWaitMilSecs", 500);
      if(_this.outPutConf.displayModel.sumRowModel.length==0){
        LODOP.ADD_PRINT_TABLE(30 + property.table.rowNum * property.table.lineHeight + orderHeight + property.padding.top + 80, property.padding.left, property.width, _this.outPutConf.displayModel.footModel[0].height + 25, option.strBodyStyle + "<body>" + option.foot + "</body>");
      }else{
        LODOP.ADD_PRINT_TABLE(60 + property.table.rowNum * property.table.lineHeight + orderHeight + property.padding.top + 80, property.padding.left, property.width, _this.outPutConf.displayModel.footModel[0].height + 25, option.strBodyStyle + "<body>" + option.foot + "</body>");
      }
      LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
      if (property.paper == '三联单') {
        if (property.pageNum.isOn != false) {
          LODOP.ADD_PRINT_TEXT(10, property.width -70, 120, 30, '第#页/共&页');
          LODOP.SET_PRINT_STYLEA(0, 'ItemType', 2);
        } else {}
      } else {
        LODOP.ADD_PRINT_TEXT(property.pageNum.padding.top, property.padding.left + property.width / 2-20, 240, 30, '第#页/共&页');
        LODOP.SET_PRINT_STYLEA(0, 'ItemType', 2);
      };
      LODOP.ADD_PRINT_BARCODE(property.padding.top, property.width-30 , 130, 110, "QRCode", barCode);
      LODOP.SET_PRINT_STYLEA(0, 'QRCodeVersion', 14);
      LODOP.SET_PRINT_STYLEA(0, 'QRCodeErrorLevel', 'H');
      LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
      LODOP.ADD_PRINT_IMAGE(property.padding.top, property.padding.left, 76, 64, "<img style='z-index:5;position:absolute;left:0px;top:0px;border:0;' src='static/img/zgztlogo2.png'/>");
      LODOP.SET_PRINT_STYLEA(0, "Stretch", 2);
      LODOP.SET_PRINT_STYLEA(0, "TransColor", "#FFFFFF");
      LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
      LODOP.SET_PRINT_STYLEA(0, 'QRCodeVersion', 14);
      LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
      LODOP.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW', 1);
      LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED", 1);
    }
  },
  orderPrintRander: function (option, _this, userConf) {
    let property = _this.utilObject.getLocalStorage('SysGlobConf').print.order;
    let propertys = userConf.order;
    //判断是否用户自定义
    if (userConf.order != null) {
      let displayModel = {};
      if (propertys.paper != 'A4') {
        displayModel = _this.outPutConf.displayModelB5;
      } else {
        displayModel = _this.outPutConf.displayModel;
      }
      option.title = '<div  align="centrr" ><table  width="' + propertys.width + '" class="print-tablecss" id="title"><tr><td align="center" nowrap><span style="font-size: 28px;color:blue;"><b><u>' + displayModel.titleName + '</u></b></span></td></tr></table>';
      let torder = '',
        cellhead = '',
        cellbody = '',
        cellbody1 = '',
        cellfoot = '',
        tfoot = '';
      displayModel.orderModel.forEach(function (row) {
        let cell = '<td colspan="' + row.colspan + '"><div align="left">' + row.label + ': #' + row.prop + '#</div><td>';
        if (row.alone) {
          torder += '</tr><tr>' + cell;
        } else {
          torder += cell;
        }
      });
      option.order = '<table  class="print-tablecss" height="' + displayModel.orderHeight + '" width="' + propertys.width + '" id="order"><tr >' + torder + '</tr></table>';
      if (option.order) {
        displayModel.orderModel.forEach(function (row) {
          for (var att in row) {
            let orderStr = row[att]
          };
        })
      };
      displayModel.itemsModel.forEach(function (row) {
        cellhead += '<th style="font-size:11px;" height="30" nowrap class="print-tdcss" width="' + row.width + '"><div align="center">' + row.label + '</div></th>';
        cellbody += '<td height="' + propertys.tableRows + '" style="border-width: 1px;border-style:solid;border-collapse:collapse;font-size:11px;overflow:hidden;font-family:宋体;" ><div align="' + row.align + '" style="max-height:' + propertys.tableRows + ';overflow:hidden;padding-right:2px">#' + row.prop + '#<div></td>';
      });
      //循环空格补齐
      let num = propertys.rowHeight;
      let a = num - option.dataModel.items.length % num;
      if (a != num) {
        for (var x = 1; x <= a; x++) {
          cellbody1 += '<tr>';
          for (var y = 1; y <= displayModel.itemsModel.length; y++) {
            cellbody1 += '<td height="' + propertys.tableRows + '"  style="border-width: 1px;border-style:solid;border-collapse:collapse;font-size:11px;overflow:hidden;font-family:宋体;" ></td>'
          };
          cellbody1 += '</tr>';
        };
      } else {};
      option.item.thead = '<table  class="print-MaterialTable" width="' + propertys.width + '" style="border: solid thin #000000" id="item"><thead><tr>' + cellhead + '</thead></tr>';
      option.item.tbody = '<tr>' + cellbody + '</tr>';
      option.item.blank = '<tbody>' + cellbody1 + '</tbody>';
      displayModel.sumRowModel.forEach(function (row) {
      //判断是否含有合计行  
        if(displayModel.sumRowModel.length==0){
          cellfoot += '<td style="font-size:11px;" height="0" colspan="' + row.colspan + '" class="print-tdcss"><div align="' + row.align + '"><font tdata="' + row.font.tdata + '" format="' + row.font.format + '" tindex="' + row.font.tindex + '">' + row.text + '</font></div></td>';
        }else{
          cellfoot += '<td style="font-size:11px;" height="30" colspan="' + row.colspan + '" class="print-tdcss"><div align="' + row.align + '"><font tdata="' + row.font.tdata + '" format="' + row.font.format + '" tindex="' + row.font.tindex + '">' + row.text + '</font></div></td>';
        }
      });
      option.item.tfoot = '<tfoot><tr>' + cellfoot + '</tr></tfoot></table>';
      displayModel.footModel.forEach(function (row) {
        let cell = '<td style="font-size:11px;"  valign="' + row.valign + '" width="' + row.width + '" height="' + row.height + '" colspan="' + row.colspan + '">' + row.label + ': #' + row.prop + '#</td>';
        if (row.alone) {
          tfoot += '</tr><tr>' + cell;
        } else {
          tfoot += cell;
        };
      });
      option.foot = '<table  class="print-tablecss" width="' + propertys.width + '" id="foot"><tr>' + tfoot + '</tr></table></div>';

    } else {
      let displayModel = {};
      if (property.paper != 'A4') {
        displayModel = _this.outPutConf.displayModelB5;
      } else {
        displayModel = _this.outPutConf.displayModel;
      }
      option.title = '<div  align="centrr" ><table  width="' + property.width + '" class="print-tablecss" id="title"><tr><td align="center" nowrap><span style="font-size: 28px;color:blue;"><b><u>' + displayModel.titleName + '</u></b></span></td></tr></table>';
      let torder = '',
        cellhead = '',
        cellbody = '',
        cellbody1 = '',
        cellfoot = '',
        tfoot = '';
      displayModel.orderModel.forEach(function (row) {
        let cell = '<td colspan="' + row.colspan + '"><div align="left">' + row.label + ': #' + row.prop + '#</div><td>';
        if (row.alone) {
          torder += '</tr><tr>' + cell;
        } else {
          torder += cell;
        }
      });
      option.order = '<table  class="print-tablecss" height="' + displayModel.orderHeight + '" width="' + property.width + '" id="order"><tr >' + torder + '</tr></table>';
      if (option.order) {
        displayModel.orderModel.forEach(function (row) {
          for (var att in row) {
            let orderStr = row[att]
          };
        })
      };
      displayModel.itemsModel.forEach(function (row) {
        cellhead += '<th style="font-size:11px;" height="30" nowrap class="print-tdcss" width="' + row.width + '"><div align="center">' + row.label + '</div></th>';
        cellbody += '<td height="' + property.table.lineHeight + 'px" style="border-width: 1px;border-style:solid;border-collapse: collapse;font-size:11px;overflow:hidden;font-family:宋体;"><div align="' + row.align + '" style="max-height:' + property.table.lineHeight + ';overflow:hidden;padding-right:2px">#' + row.prop + '#<div></td>';
      });
      let num = property.table.rowNum;
      let a = num - option.dataModel.items.length % num;
      if (a != num) {
        for (var x = 1; x <= a; x++) {
          cellbody1 += '<tr>';
          for (var y = 1; y <= displayModel.itemsModel.length; y++) {
            cellbody1 += '<td height="' + property.table.lineHeight + '" class="print-tdcss" style="font-size:11px;"></td>'
          };
          cellbody1 += '</tr>';
        };
      } else {};
      option.item.thead = '<table  class="print-MaterialTable" width="' + property.width + '" style="border: solid thin #000000" id="item"><thead><tr>' + cellhead + '</thead></tr>';
      option.item.tbody = '<tr>' + cellbody + '</tr>';
      option.item.blank = '<tbody>' + cellbody1 + '</tbody>';
      displayModel.sumRowModel.forEach(function (row) {
        if(displayModel.sumRowModel.length==0){
          cellfoot += '<td style="font-size:11px;" height="0" colspan="' + row.colspan + '" class="print-tdcss"><div align="' + row.align + '"><font tdata="' + row.font.tdata + '" format="' + row.font.format + '" tindex="' + row.font.tindex + '">' + row.text + '</font></div></td>';
        }else{
          cellfoot += '<td style="font-size:11px;" height="30" colspan="' + row.colspan + '" class="print-tdcss"><div align="' + row.align + '"><font tdata="' + row.font.tdata + '" format="' + row.font.format + '" tindex="' + row.font.tindex + '">' + row.text + '</font></div></td>';
        }
      });
      option.item.tfoot = '<tfoot><tr>' + cellfoot + '</tr></tfoot></table>';
      displayModel.footModel.forEach(function (row) {
        let cell = '<td style="font-size:11px;"  valign="' + row.valign + '" width="' + row.width + '" height="' + row.height + '" colspan="' + row.colspan + '">' + row.label + ': #' + row.prop + '#</td>';
        if (row.alone) {
          tfoot += '</tr><tr>' + cell;
        } else {
          tfoot += cell;
        };
      });
      option.foot = '<table  class="print-tablecss" width="' + property.width + '" id="foot"><tr>' + tfoot + '</tr></table></div>';
    }
  },
  orderExcelEvent: function (option, _this, userConf) {
    let propertys={};
    if (userConf.order != null) {
        propertys = userConf.order;
    } else {
      propertys = _this.utilObject.getLocalStorage('SysGlobConf').print.order;
    }
      let displayModel = {};
      if (propertys.paper != 'A4') {
        displayModel = _this.outPutConf.displayModelB5;
      } else {
        displayModel = _this.outPutConf.displayModel;
      }
        var strResult = _this.utilObject.turnDX(option.upperSum);
        option.item.tfoot = option.item.tfoot.replace('#大写合计#', '金额合计(大写):' + strResult);
        _this.exportHtmlToExcel(option.order + option.item.thead + option.item.tbody + option.item.tfoot + option.foot, {
          fileName:displayModel.titleName,
          titleName:displayModel.titleName,
          HeaderColspan:displayModel.excelHeaderColspan
        });

  },
  orderExcelRander: function (option, _this, userConf) {
      let propertys={};
      if (userConf.order != null) { 
          propertys = userConf.order;
      } else {
        propertys = _this.utilObject.getLocalStorage('SysGlobConf').print.order;
      }
      let displayModel = {};
      if (propertys.paper != 'A4') {
        displayModel = _this.outPutConf.displayModelB5;
      } else {
        displayModel = _this.outPutConf.displayModel;
      }
        let torder = '',
          sumfoot = 0,
          cellhead = '',
          cellbody = '',
          cellfoot = '',
          tfoot = '';
        displayModel.orderModel.forEach(function (row) {
          let cell = '<td style="border-collapse: collapse;" border=1 colspan="' + row.colspan + '"><div align="left">' + row.label + ': #' + row.prop + '#</div></td>';
          if (row.alone) {
            torder += '</tr><tr>' + cell
          } else {
            torder += cell
          }
        });
        
        option.order = '<table style="border-collapse: collapse;" border=1 id="order" width="100%"><tr>' + torder + '</tr></table>';
        displayModel.itemsModel.forEach(function (row) {
          cellhead += '<th height="25" style="border-collapse: collapse;" border=1 rowspan="2" width="' + row.width + '"><div align="center">' + row.label + '</div></th>';
          cellbody += '<td height="27" style="border-collapse: collapse;" border=1><div align="' + row.align + '">#' + row.prop + '#</div></td>'
        });
        option.item.thead = '<table style="border-collapse: collapse;" border=1 width="100%" id="item"><thead><tr>' + cellhead + '</tr></thead>';
        option.item.tbody = '<tr>' + cellbody + '</tr>';
        displayModel.footModel.forEach(function (row) {
          let cell = '<td style="border-collapse: collapse;" border=1 width="' + row.width + '" colspan="' + row.colspan + '">' + row.label + ': #' + row.prop + '#</td>';
          if (row.alone) {
            tfoot += '</tr><tr>' + cell
          } else {
            tfoot += cell
          }
        });
        option.foot = '<table width="90%" style="border: solid thin #000000" id="foot" style="border-collapse: collapse;" border=1><tr>' + tfoot + '</tr></table>';
        displayModel.sumRowModel.forEach(function (row) {
          if (row.font.format !== 'UpperMoney') {
            row.value = 0;
            option.dataModel.items.map(function (item, index) {
              row.value = Decimal(row.value).plus(item[row.key]).toFixed(2).toString()
            })
          } else {
            sumfoot = row.font.tindex
          }
        });
        for (let i = 0; i < displayModel.sumRowModel.length; i++) {
          if (displayModel.sumRowModel[i].font.format !== 'UpperMoney' && displayModel.sumRowModel[i].font.tindex == sumfoot) {
            option.upperSum = displayModel.sumRowModel[i].value
          };
        };
        displayModel.sumRowModel.forEach(function (row) {
          cellfoot += '<td height="30" colspan="' + row.colspan + '" style="border-collapse: collapse;" border=1><div align="' + row.align + '">' + row.value + '</div></td>'
        });
        //导出是判断是否含有合计行
        if(displayModel.sumRowModel.length==0){}else{option.item.tfoot = '<tfoot><tr>' + cellfoot + '</tr></tfoot></table>'}
  }
}
