import fetch from  './fetch';
import Qs from 'qs';


//InformationPublish
 export const requestGetInformationPublishPageList=params=>{
        return fetch({ 
            url: '/api/services/app/informationPublish/getMainPageList',
            method: 'post',
            data: params
        })
    };
 export const requestCreateOrUpdateInformationPublish=params=>{
        return fetch({ 
            url: '/api/services/app/informationPublish/createOrUpdateMainObject',
            method: 'post',
            data: params
        })
    };
export const requestDeleteInformationPublish=params=>{
    return fetch({ 
        url: '/api/services/app/informationPublish/deleteMainObject',
        method: 'post',
        data: params
    })
   };
