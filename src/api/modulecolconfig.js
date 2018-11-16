import fetch from  './fetch';
import Qs from 'qs';

//MouduleColInfoConfig 模块列配置
export const requestGetMainAllList=params=>{
    return fetch({ 
        url: '/api/services/app/moduleColInfoConfig/getMainAllList',
        method: 'post',
        data: params
    })
};

export const requestGetMainPageList=params=>{
    return fetch({ 
        url: '/api/services/app/moduleColInfoConfig/getMainPageList',
        method: 'post',
        data: params
    })
};

export const requestCreateOrUpdateMainObject=params=>{
    return fetch({ 
        url: '/api/services/app/moduleColInfoConfig/createOrUpdateMainObject',
        method: 'post',
        data: params
    })
};

export const requestCreateMainList=params=>{
    return fetch({ 
        url: '/api/services/app/moduleColInfoConfig/CreateMainList',
        method: 'post',
        data: params
    })
};
export const requestDeleteMainObject=params=>{
    return fetch({ 
        url: '/api/services/app/moduleColInfoConfig/deleteMainObject',
        method: 'post',
        data: params
    })
};






