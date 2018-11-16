import fetch from  './fetch';
import Qs from 'qs';


//User
 export const requestGetCommentPageList=params=>{
        return fetch({ 
            url: '/api/services/app/comment/getMainPageList',
            method: 'post',
            data: params
        })
    };
 export const requestCreateOrUpdateComment=params=>{
        return fetch({ 
            url: '/api/services/app/comment/createOrUpdateMainObject',
            method: 'post',
            data: params
        })
    };
export const requestDeleteComment=params=>{
    return fetch({ 
        url: '/api/services/app/comment/deleteMainObject',
        method: 'post',
        data: params
    })
   };







