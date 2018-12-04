
import Vue from 'vue'
import des from './des'
import router from '@/router';
import {encode,decode} from './base64';
import i18n from '@/lang'
export default {
     //获取模块配置信息
     //数字转化为大写
     turnDX:function(n) {
        var fraction = ['角', '分'];    
        var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];    
        var unit = [ ['元', '万', '亿'], ['', '拾', '佰', '仟']  ];    
        var head = n < 0? '-': '';    
        n = Math.abs(n);    
        var s = '';    
        for (var i = 0; i < fraction.length; i++)     
        {    
            s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');    
        }    
        s = s || '整';    
        n = Math.floor(n);    
        for (var i = 0; i < unit[0].length && n > 0; i++)     
        {    
            var p = '';    
            for (var j = 0; j < unit[1].length && n > 0; j++)     
            {    
                p = digit[n % 10] + unit[1][j] + p;    
                n = Math.floor(n / 10);    
            }    
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零')  + unit[0][i] + s;    
        }    
        return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整'); 
     },
     NoToChinese:function(num) { 
        if (!/^\d*(\.\d*)?$/.test(num)) { return "非法数据!"; } 
        var AA = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); 
        var BB = new Array("", "拾", "佰", "仟", "萬", "億", "点", ""); 
        var a = ("" + num).replace(/(^0*)/g, "").split("."), k = 0, re = ""; 
        if(a[0]==''){ re='零'}
        for (var i = a[0].length - 1; i >= 0; i--) { 
        switch (k) { 
        case 0: re = BB[7] + re; break; 
        case 4: if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0])) 
        re = BB[4] + re; break; 
        case 8: re = BB[5] + re; BB[7] = BB[5]; k = 0; break; 
        } 
        if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re; 
        if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re; k++; 
        } 
        
        if (a.length > 1) //加上小数部分(如果有小数部分)
        { 
        re += BB[6]; 
        for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)]; 
        } 
        return re; 
        },
    getDefaultToken:function (){
        return "Basic " +encode(window.getClientObj().sysConf.clientId+":"+window.getClientObj().sysConf.clientSecret);
     },
    resetLogin:function(){
                this.clearAllCookie();
                this.clearLocalStorage();
                this.clearSessionStorage();

    },
    setLogin:function(token){
                this.setCookie('Authorization',"Bearer " +token,1);
                this.setCookie('loginStatus',"on",1);
    },
    //判断权限
    isAuth:function(url){
        //鉴权
            let noPermissionUrl=[
                '/login',
                '/RedirectPage',
                '/Page404'
            ],ispermissionUrl=true;
            noPermissionUrl.map(i=>{
                if(url.toUpperCase()===i.toUpperCase()){
                    ispermissionUrl=false;
                }
            }); 
            if(ispermissionUrl){
                //鉴权
                let value=this.getCookieValue('Authorization');
                if(value===''){
                    //token过期
                    if(!getClientObj().loginType){
                        router.replace('/login')
                    }else{
                        window.location = getClientObj().singleLogin.url+'/cas/login?service='+getClientObj().sysConf.url+'/api/Cas';
                    }
                    return false;
                }
            }
            return true;
    },
    //操作cookie
    setCookie:function (name, value, iDay) {
        var oDate=new Date();
        oDate.setDate(oDate.getDate()+iDay);
        document.cookie=name+'='+encodeURIComponent(value)+';expires='+oDate;
    },
    //删除所有cookie
    clearAllCookie:function(){
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);  
            if(keys) {  
                for(var i = keys.length; i--;)  
                    document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()  
            }  
    },
    getCookieValue:function (name)
    {
        var arr=document.cookie.split('; ');
        var i=0;
        for(i=0;i<arr.length;i++)
        {
            var arr2=arr[i].split('=');
            if(arr2[0]==name)
            {  
                var getC = decodeURIComponent(arr2[1]);
                return getC;
            }
        }
        return '';
    },
    getCookie:function(name){
        var result=this.getCookieValue(name)
        return result;
    },
    removeCookie:function (name)
    {
        this.setCookie(name, '1', -1);
    },
    //添加LocalStorage
    setLocalStorage:function (name, value) 
    {
        localStorage.setItem(name,encode(value));
    },
    //读取LocalStorage
    getLocalStorage:function (name) 
    {
        let value=localStorage.getItem(name);
        if(value===null){
            return '';
        }else{
            return JSON.parse(decode(value),this.dealFunction);
        }
    },
    //删除指定localStorage
    removeLocalStorage:function (name) 
    {
        localStorage.removeItem(name);
    },

   //清楚所有
    clearLocalStorage:function () 
    {
        localStorage.clear();
    },
    //清楚所有
    clearSessionStorage:function () 
    {
        sessionStorage.clear();
    },

    //将平行数据根据子父节点处理为树形数据
    returnDatabyTree:function fn(data,pid){
            let result = [] , temp;
            for(let i in data){
                if(data[i].parent==pid){
                    result.push(data[i]);
                    temp = fn(data,data[i].id);           
                    if(temp.length>0){
                        data[i].children=temp;
                    }           
                }       
            }
            return result;
    },

    //根据ID在树形结构中返回名称
    node:{
        nodeName:'',
        getNameByID:function (data,id){
                let temp;
                for(let i in data){
                    if(data[i].id==id){
                        this.nodeName=data[i].text;
                        break;
                    }else{
                        if(data[i].children!=null){
                            temp = data[i].children;
                            this.getNameByID(temp,id); 
                        }
                    
                    }    
                } 
        }
    },
    dealFunction:function(k,v) {
        if(v===null){ return v;}
        if(v.indexOf&&v.indexOf('function')>-1){
            return eval("(function(){ return "+v+" })()")
        }
        if(v.indexOf&&v.indexOf('$t')>-1){
           return  new Vue({i18n}).$t(v.split('|')[1])
        }
        return v;
    },
    base64Decrypt:function(value){
            return  decode(value);
    },
    base64Encrypt:function(value){
             return  encode(value);
    },
    convertBety(str){
        let result=encodeURIComponent(str).replace(/%00/g,"");
        return  decodeURIComponent(result)
    },
    jsDecrypt:function(value){
            return  des.jsdecrypt('ylrj',value);
    },
    jsEncrypt:function(value){
        return  des.jsencrypt('ylrj',value);
    },
    // 深拷贝
    deepCopy:function (o) {
        // return  JSON.parse(JSON.stringify(o))
        if (o instanceof Array) {
            var n = [];
            for (var i = 0; i < o.length; ++i) {
                n[i] = this.deepCopy(o[i]);
            }
            return n;
        } else if (o instanceof Function) {
            var n = new Function("return " + o.toString())();
            return n
        } else if (o instanceof Object) {
            var n = {}
            for (var i in o) {
                n[i] = this.deepCopy(o[i]);
            }
            return n;
        } else {
            return o;
        }
    },
    filterArr:function(targetArr,targetfileds,mapingArr,mapingfileds){
            let tempArr=[],sourceArr=[];
            //深拷贝源数据
            sourceArr=this.deepCopy(targetArr);
            mapingArr.map(mi=>{
                sourceArr.map(ti=>{
                    if(mi[mapingfileds]===ti[targetfileds]){
                        tempArr.push(ti);
                    }
                })
            })
            return tempArr;
    },
    jsonSort:function(array, field){
    if(array.length < 2 || typeof array[0] !== "object") return array;
        if(typeof array[0][field] === "number") {
        array.sort(function(x, y) { return x[field] - y[field]});
        }
        if(typeof array[0][field] === "string") {
        array.sort(function(x, y) { return x[field].localeCompare(y[field])});
        }
        return array;
    },
    newGuid:function(isnull=false){
        let UUID = require('uuid-js');
        let guid = "";
        if(!isnull){
            // Generate a V4 UUID
             guid = UUID.create();
            return guid.toString();    
        }else{
            guid = "00000000-0000-0000-0000-000000000000";
        }
        return guid; 
    },
    
    //随机获取色值
    getColor:function(index){
        let colorArr=[
            '#455A64',
            '#1D8CE0',
            '#13CE66',
            '#F7BA2A',
            '#FF4949',
            '#1F2D3D',
            '#475669',
            '#EF9A9A',
            '#B71C1C',
            '#FF1744',
            '#C51162',
            '#7B1FA2',
            '#EA80FC',
            '#D500F9',
            '#4A148C',
            '#00796B',
            '#80CBC4',
            '#1DE9B6',
            '#CDDC39',
            '#827717',
            '#81C784',
            '#FFF59D',
            '#E65100',
            '#607D8B',
            '#4E342E',
            '#58B7FF',
            '#424242'
        ]
        if(index!=undefined){
            return colorArr[index];
        }else{
            return colorArr[Math.floor(Math.random()*(colorArr.length))];
        }
       
    },

    //改变主题
    changeTheme:function(themeValue) {
        function loadCss(path) {
            var head = document.getElementsByTagName('head')[0]
            var link = document.createElement('link')
            link.href = path
            link.rel = 'stylesheet'
            link.type = 'text/css'
            head.appendChild(link)
          }

        // 需要移到单独的文件存放.
        var itemPath = './theme/' + themeValue.toLowerCase() + '/index.css' 
        localStorage.setItem('themeValue', themeValue)
        loadCss(itemPath)
        loadCss('./theme/reset/index.css')
        loadCss('./theme/globalTheme/' + themeValue.toLowerCase() + '.css')
        loadCss('./theme/globalTheme/globalStyle.css')
       
      }

}