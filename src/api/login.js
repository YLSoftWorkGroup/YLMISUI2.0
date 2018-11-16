import axios from 'axios';
import Qs from 'qs';
import fetch from  './fetch';
import util from '@/common/js/util';
//login
    export function requestToken(params){
        let sysbaseURL=window.getClientObj().sysConf.url;
       return new Promise((resolve, reject) => {
        //实例化的对象
        let options={};
        options.url="/Token";
        options.method="post";
        options.data=Qs.stringify(params);
        const instance = axios.create({
                baseURL:sysbaseURL,
                timeout:window.getClientObj().sysConf.timeout,
                headers: {'Authorization':util.getDefaultToken()}
            });
            instance(options)
                    .then(response => {
                        resolve(response);
                    })
            .catch(function(error){
                reject(error);
            });
       })
    };
    export const requestGetMenuAppList=params=>{
        return fetch({ 
            url: '/api/services/app/menu/GetMenuAppList',
            method: 'post',
            data: params
        })
    };
    export const requestGetUserMenu=params=>{
        return fetch({ 
            url: '/api/services/app/usermenu/GetUserMenu?'+Qs.stringify(params),
            method: 'post'
        })
    };  
    export const requestGetCurrentLoginInformations=params=>{
        return fetch({ 
            url: '/api/services/app/session/GetCurrentLoginInformations',
            method: 'post',
            data: params
        })
    };  
      export const requestUpdateCurrentUserInfo=params=>{
        return fetch({ 
            url: '/api/services/app/session/UpdateCurrentUserInfo',
            method: 'post',
            data: params
        })
    };  
    export const requestGetGlobConfigInfo=params=>{
        return fetch({ 
            url: '/api/services/app/globConfig/getMainAllList',
            method: 'post',
            data: params
        })
    };  
    export const requestReturnSystemRoam=params=>{
        return fetch({ 
            url: '/api/services/app/session/ReturnSystemRoam',
            method: 'post',
            data: params
        })
    };  
    export const requestSystemRoam=params=>{
        return fetch({ 
            url: '/api/services/app/session/SystemRoam',
            method: 'post',
            data: params
        })
    };  