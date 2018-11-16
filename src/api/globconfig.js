import fetch from  './fetch';
import Qs from 'qs';


//GlobConfig
 export const requestgetMainPageList=params=>{
        return fetch({ 
            url: '/api/services/app/globConfig/getMainPageList',
            method: 'post',
            data: params
        })
    };
 export const requestcreateOrUpdateMainObject=params=>{
        return fetch({ 
            url: '/api/services/app/globConfig/createOrUpdateMainObject',
            method: 'post',
            data: params
        })
    };
export const requestdeleteMainObject=params=>{
    return fetch({ 
        url: '/api/services/app/globConfig/deleteMainObject',
        method: 'post',
        data: params
    })
   };
