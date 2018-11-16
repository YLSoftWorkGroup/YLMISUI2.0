import axios from 'axios';
import util from '@/common/js/util';

//判断接口token
export default function fetchIo(options,axiosConfig={baseURL:'',authorization:''}) {
    if(axiosConfig.baseURL!=''){
        axios.defaults.baseURL=axiosConfig.baseURL;
    }else{
            axios.defaults.baseURL=window.getClientObj().ioConf.url;
    }
    if(util.getLocalStorage(ioAuthorization)==''){
        axios({
            url: '/Token',
            method: 'post',
            data:`clientId=${window.getClientObj().ioConf.clientId}&
                  clientSecret=${window.getClientObj().ioConf.clientSecret}&
                  grant_type=client_credentials`
        }).then(data=>{
            let access_token="Bearer " +data.access_token;
            util.setLocalStorage(ioAuthorization,access_token);
                //实例化的对象
            const instance = axios.create(author==='none'?{}:{
                headers: { 'Authorization':access_token}
            });
             //初始化配置
            instance(options)
            .then(response => {
                const res = response.data;
                if (response.status!== 200) {
                        //错误处理
                        console.log(options); // for debug
                        console.error('请求错误：'+error); 
                    reject(res);
                }
                    resolve(res);
                })
                .catch(error => {
                    console.error('请求异常：'+error); 
                    reject(error);
                });
        })
    }else{
        const instance = axios.create(author==='none'?{}:{
            headers: { 'Authorization':access_token}
        });
         //初始化配置
        instance(options)
        .then(response => {
            const res = response.data;
            if (response.status!== 200) {
                    //错误处理
                    console.log(options); // for debug
                    console.error('请求异常：'+res.error); 
                reject(res);
            }
                resolve(res);
            })
            .catch(error => {
                console.error('请求异常：'+error); 
            reject(error);
            });
    }
   
}


