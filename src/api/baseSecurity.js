import fetch from './fetch';
import Qs from 'qs';


export const requestGetMainAllList = params => {
  return fetch({
    url: '/api/services/app/securityConf/getMainAllList',
    method: 'post',
    data: params
  })
};
export const requestGetMainPageList = params => {
  return fetch({
    url: '/api/services/app/securityConf/getMainPageList',
    method: 'post',
    data: params
  })
};
export const requestCreateOrUpdateMainObject = params => {
  return fetch({
    url: '/api/services/app/securityConf/createOrUpdateMainObject',
    method: 'post',
    data: params
  })    
};
export const requestDeleteMainObject = params => {
  return fetch({
    url: '/api/services/app/securityConf/deleteMainObject',
    method: 'post',
    data: params
  })
};

export const requestCreateMainList = params => {
  return fetch({
    url: '/api/services/app/securityConf/CreateMainList',
    method: 'post',
    data: params
  })
};

export const requestGetMainObjectForEdit = params => {
  return fetch({
    url: '/api/services/app/securityConf/getMainObjectForEdit',
    method: 'post',
    data: params
  })
};
