import fetch from  './fetch';


//AttachMent
 export const requestGetAttachMentPageList=params=>{
        return fetch({ 
            url: '/api/services/app/attachMent/getMainPageList',
            method: 'post',
            data: params
        })
    };
 export const requestCreateOrUpdateAttachMent=params=>{
        return fetch({ 
            url: '/api/services/app/attachMent/createOrUpdateMainObject',
            method: 'post',
            data: params
        })
    };
export const requestDeleteAttachMent=params=>{
    return fetch({ 
        url: '/api/services/app/attachMent/deleteMainObject',
        method: 'post',
        data: params
    })
   };
