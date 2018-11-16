import fetch from './fetch';


export const requestGetMainAllList = params => {
  return fetch({
    url: '/api/services/app/securityApiOrder/getMainAllList',
    method: 'post',
    data: params
  })
};
export const requestGetMainPageList = params => {
  return fetch({
    url: '/api/services/app/securityApiOrder/getMainPageList',
    method: 'post',
    data: params
  })
};
export const requestCreateOrUpdateMainObject = params => {
  return fetch({
    url: '/api/services/app/securityApiOrder/createOrUpdateMainObject',
    method: 'post',
    data: params
  })    
};
export const requestDeleteMainObject = params => {
  return fetch({
    url: '/api/services/app/securityApiOrder/deleteMainObject',
    method: 'post',
    data: params
  })
};

export const requestCreateMainList = params => {
  return fetch({
    url: '/api/services/app/securityApiOrder/CreateMainList',
    method: 'post',
    data: params
  })
};

export const requestGetMainObjectForEdit = params => {
  return fetch({
    url: '/api/services/app/securityApiOrder/getMainObjectForEdit',
    method: 'post',
    data: params
  })
};

export const requestDeleteItemObject = params => {
  return fetch({
    url: '/api/services/app/securityApiOrder/deleteItemObject',
    method: 'post',
    data: params
  })
};

export const requestGetItemPageList=params=>{//选择框API
  return fetch({ 
          url: '/api/services/app/securityApiConf/getMainPageList',
          method: 'post',
          data: params
  })
};
export const requestUpdateAllSecurityApi=params=>{//选择框更新API
  return fetch({ 
          url: '/api/services/app/securityApiConf/createAllSecurityApiConf',
          method: 'post',
          data: {}
  })
};

export const requestGetItemPageListView=params=>{//预览明细
  return fetch({ 
          url: '/api/services/app/securityApiOrder/getItemPageList',
          method: 'post',
          data: params
  })
};
