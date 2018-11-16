function detectBrowser()
      {
        var browser=navigator.userAgent;
         if(Chrome(browser)||IEVersion(browser)===11||IEVersion(browser)==='edge'){
              return true;
         }else{
            alert("应用程序在当前版本的浏览器中运行不佳，请更换（IE11、IE（edge）、chrome(60+)）版本的浏览器！");
           // window.open('https://support.microsoft.com/zh-cn/help/18520/download-internet-explorer-11-offline-installer');
            return false;
        }
      }
function Chrome(userAgent){
      var regStr_ie = /msie [\d.]+;/gi ;
      var regStr_ff = /firefox\/[\d.]+/gi
      var regStr_chrome = /chrome\/[\d.]+/gi ;
      var regStr_saf = /safari\/[\d.]+/gi ;
    if(userAgent.indexOf('Chrome')>-1){
        //是chrome
        var version=userAgent.match(regStr_chrome);
        if(Number(version[0].slice(7,9))>=60){
            return true;
        }else{
            return false;
        }
    }
}
function IEVersion(userAgent) { //ie浏览器
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
            var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
            var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            if(isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if(fIEVersion == 7) {
                    return 7;
                } else if(fIEVersion == 8) {
                    return 8;
                } else if(fIEVersion == 9) {
                    return 9;
                } else if(fIEVersion == 10) {
                    return 10;
                } else {
                    return 6;//IE版本<=7
                }   
            } else if(isEdge) {
                return 'edge';//edge
            } else if(isIE11) {
                return 11; //IE11  
            }else{
                return -1;//不是ie浏览器
            }
 }