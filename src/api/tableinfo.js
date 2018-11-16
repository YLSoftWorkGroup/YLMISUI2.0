import fetch from  './fetch';
import Qs from 'qs';


//TableInfo
 export const requestGetTableInfoPageList=params=>{
        return fetch({ 
            url: '/api/services/app/tableInfo/GetTableInfoPageList',
            method: 'post',
            data: params
        })
    };
 export const requestCreateOrUpdateTableInfo=params=>{
        return fetch({ 
            url: '/api/services/app/tableInfo/CreateOrUpdateTableInfo',
            method: 'post',
            data: params
        })
    };
export const requestDeleteTableInfo=params=>{
    return fetch({ 
        url: '/api/services/app/tableInfo/DeleteTableInfo',
        method: 'post',
        data: params
    })
   };
