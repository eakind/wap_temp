import axios from 'axios';
import apiObj from './api.js';
let baseURL = process.env.http_env === 'hk' ? 'https://bi.datacube.hk' : '';
let configUrl = '';
axios.defaults.baseURL = baseURL;

axios.interceptors.request.use(
  (config) => {
    // 做一些参数处理
    configUrl = config.url;
    let curUrl = window.location.href;
    if (config.method==='get'){
      config.params.dc_current_time=Date.now();
    }
    // localStorage.getItem('dcUserToken')||
    let token = localStorage.getItem('dcBIUserToken');//'eyJhbGciOiJIUzUxMiIsImlhdCI6MTYxNTI3Njc0MCwiZXhwIjoxNjE1MzYzMTQwfQ.eyJ1c2VyX2lkIjoiYTk0MWY3YWVkNmZiMTFlYWFlYzYwMjQyYWMxNDAwMDMiLCJ1c2VyX25hbWUiOiIyMjJfOTQiLCJjb21wYW55X2lkIjoiYmJiNDhhNGNiYzhmNDkxN2IxYWRhZTgzOGVkNGIxMGYifQ.gS2LJh0RjrKKuoNCM3jfFYD_xDNvdATRfSgfc7wcS8XNDKPb-eMQuGAvZgIs0De7VSZiiqObI1PGZhmElEmvjQ';//localStorage.getItem('dcUserToken');//'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7ImNvbXBhbnlfaWQiOiJlNDdmZTJiMWJiOTU0ZjE2OWMyMTJmYjE1YjkwZmNlNCIsInVzZXJfaWQiOiI0OTE1NGE3YWNhMDM0MDNkYTVhOTljYTA5MGE1NTEwZSIsInVzZXJfbmFtZSI6ImphbmVfMSIsImFjdGl2YXRlIjpmYWxzZX0sImV4cCI6MTYxNDkxNjA4NX0.spSDbCJrpImNIbnUz7ey380izHINZTVTqbnacjWM7J8';// 
    // let token = 'eyJhbGciOiJIUzUxMiIsImlhdCI6MTYyMjE2NjIxOSwiZXhwIjoxNjIyMjUyNjE5fQ.eyJ1c2VyX2lkIjoiNDkxNTRhN2FjYTAzNDAzZGE1YTk5Y2EwOTBhNTUxMGUiLCJjb21wYW55X2lkIjoiZTQ3ZmUyYjFiYjk1NGYxNjljMjEyZmIxNWI5MGZjZTQiLCJ1c2VyX25hbWUiOiJqYW5lXzEifQ.S95BUtfXchRSX3JlsXUf55IFKah3MJ8jJ53-M2AcNFqei4wB_AKjTmFHmYV7fhmOOPpjIzfZeHHYreuyOvz8wA';
    if (token) {
      config.headers.Authorization = token;
    }
    if (curUrl) {
      if (config.url === '/dccp/bi/logout') {
        let frontendRoute = `${window.location.origin}/dist-biwap/#/?aiManager=${localStorage.getItem('projectId')}`;
        config.headers['frontend-route'] = frontendRoute;
      } else {
        config.headers['frontend-route'] = curUrl;
      }
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  (res) => {
    if (res.status === 200) {
      if (typeof (res.data) === 'object') {
        if (res.data.code === 0) {
          return res.data;
        } else if (res.data.code === 302) {
          if (configUrl === '/dccp/bi/logout') {
            let loginItem = localStorage.getItem('dcAUUserLoginForm');
            localStorage.clear();
            localStorage.setItem('dcAUUserLoginForm', loginItem);
          }
          window.location.href = res.data.location;
        }
      } else {
        return eval('(' + res.data + ')');
      }
      // if (res.data.code === 0) {
      //   return res.data;
      // } else if (res.data.code === 302) {
      //   window.location.href = res.data.location;
      // }
    } else if (res.status === 401 || res.status === 403) {
      // 跳转到登录
    }
  },
  (err) => {
    if (err.response) {
      if (err.response.status === 401) {
        sessionStorage.clear();
        window.location.href = err.response.data.location;
      }
    }
    return Promise.reject(err);
  }
);

const get = (api, params) => axios.get(apiObj[api], { params:params });

const post = (api, params) => axios.post(apiObj[api], params);

export { get, post };
