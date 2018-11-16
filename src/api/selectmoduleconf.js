
import fetch from  './fetch';
import Qs from 'qs';


//SelectModuleConf
 export const requestGetSelectModuleConfPageList=params=>{
        return fetch({ 
            url: '/api/services/app/selectModuleConf/GetSelectModuleConfPageList',
            method: 'post',
            data: params
        })
    };
 export const requestCreateOrUpdateSelectModuleConf=params=>{
        return fetch({ 
            url: '/api/services/app/selectModuleConf/CreateOrUpdateSelectModuleConf',
            method: 'post',
            data: params
        })
    };
export const requestDeleteSelectModuleConf=params=>{
    return fetch({ 
        url: '/api/services/app/selectModuleConf/DeleteSelectModuleConf',
        method: 'post',
        data: params
    })
   };

 export const requestGetSelectModuleConfForEdit=params=>{
    return  fetch({ 
        url: '/api/services/app/selectModuleConf/GetSelectModuleConfForEdit',
        method: 'post',
        data: params
      })
   };
