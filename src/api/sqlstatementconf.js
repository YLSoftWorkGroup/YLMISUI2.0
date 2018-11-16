import fetch from  './fetch';
import Qs from 'qs';


//SQLStatement
   export const requestgetMainAllList=params=>{
        return fetch({ 
            url: '/api/services/app/sQLStatementConf/getMainAllList',
            method: 'post',
            data: params
        })
    };

    export const requestgetMainPageList=params=>{
        return fetch({ 
            url: '/api/services/app/sQLStatementConf/getMainPageList',
            method: 'post',
            data: params
        })
    };

    export const requestcreateOrUpdateMainObject=params=>{
        return fetch({ 
            url: '/api/services/app/sQLStatementConf/createOrUpdateMainObject',
            method: 'post',
            data: params
        })
    };

    export const requestdeleteMainObject=params=>{
        return fetch({ 
            url: '/api/services/app/sQLStatementConf/deleteMainObject',
            method: 'post',
            data: params
        })
    };

    export const requestCreateMainList=params=>{
        return fetch({ 
            url: '/api/services/app/sQLStatementConf/CreateMainList',
            method: 'post',
            data: params
        })
    };

    export const requestgetMainObjectForEdit=params=>{
        return fetch({ 
            url: '/api/services/app/sQLStatementConf/getMainObjectForEdit',
            method: 'post',
            data: params
        })
    };