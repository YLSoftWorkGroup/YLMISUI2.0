import fetch from  './fetch';
import Qs from 'qs';


//OrigiTableInfo
 export const requestGetOrigiTableInfoPageList=params=>{
        return fetch({ 
            url: '/api/services/app/origiTableInfo/GetOrigiTableInfoPageList',
            method: 'post',
            data: params
        })
    };
 export const requestCreateOrUpdateOrigiTableInfo=params=>{
        return fetch({ 
            url: '/api/services/app/origiTableInfo/CreateOrUpdateOrigiTableInfo',
            method: 'post',
            data: params
        })
    };
export const requestDeleteOrigiTableInfo=params=>{
    return fetch({ 
        url: '/api/services/app/origiTableInfo/DeleteOrigiTableInfo',
        method: 'post',
        data: params
    })
   };
