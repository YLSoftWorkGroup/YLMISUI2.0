
//  易龙物资现场综合管理系统V8.0
//  易龙称重影像系统V8.0
//  易龙条码管理系统V2.0
//  掌上易龙 V3.0
//  易龙混凝土核算系统V3.0
//  易龙钢筋核算系统 V3.0 

 //系统连接配置
function getClientObj() {
    return {
        sysConf:{
            //url:'http://192.168.20.15:7001', 
            url:'http://192.168.20.250:8080', 
            timeout:'90000', //本机请求响应时间
            clientId:"C1BC4CCED8B544FC15268B8F29CB0386",
            clientSecret:"8F3D3BF3E3EA2895CD7E8E6173385AC57A39C27870714B66",
            titleName:"易龙物资现场综合管理系统V8.0",
            companyInfo:true //是否显示公司信息
        },
        loginType:0,  //登录方式 0为自主登录方式 1为单点登录方式
        singleLogin:{
            url:'http://59.110.144.216', //单点登录IP端口
            loginform:{
                fieldName:"OriBigId" //登录userid主键类型
            }
        }
    }
}




