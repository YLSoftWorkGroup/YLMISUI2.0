
import fetch from  './fetch';
import Qs from 'qs';


//ModuleConf
 export const requestGetModuleConfPageList=params=>{
        return fetch({ 
            url: '/api/services/app/moduleConf/GetModuleConfPageList',
            method: 'post',
            data: params
        })
    };
 export const requestCreateOrUpdateModuleConf=params=>{
        return fetch({ 
            url: '/api/services/app/moduleConf/CreateOrUpdateModuleConf',
            method: 'post',
            data: params
        })
    };
export const requestDeleteModuleConf=params=>{
    return fetch({ 
        url: '/api/services/app/moduleConf/DeleteModuleConf',
        method: 'post',
        data: params
    })
   };
export const requestGetModuleConfForEdit=params=>{
    return  fetch({ 
        url: '/api/services/app/moduleConf/GetModuleConfForEdit',
        method: 'post',
        data: params
      })
   };

  
