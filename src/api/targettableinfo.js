import fetch from  './fetch';
import Qs from 'qs';


//TargetTableInfo
 export const requestGetTargetTableInfoPageList=params=>{
        return fetch({ 
            url: '/api/services/app/targetTableInfo/GetTargetTableInfoPageList',
            method: 'post',
            data: params
        })
    };
 export const requestCreateOrUpdateTargetTableInfo=params=>{
        return fetch({ 
            url: '/api/services/app/targetTableInfo/CreateOrUpdateTargetTableInfo',
            method: 'post',
            data: params
        })
    };
export const requestDeleteTargetTableInfo=params=>{
    return fetch({ 
        url: '/api/services/app/targetTableInfo/DeleteTargetTableInfo',
        method: 'post',
        data: params
    })
   };
