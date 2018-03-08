/**
 * 文件说明:编辑台历Api
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/10/12
 * 变更记录:
 */

import Q from 'q';
import HttpClient from '../assets/src/redux/utils/httpClient';

/**
 * 更改文字
 * @param params
 * @returns {*}
 */
export function editTxt(params){
  let defer = Q.defer();
  HttpClient.post('/calendar/edittext',params)
    .then((res) => {
      defer.resolve(res);
    }, (err)=> {
      defer.reject(err);
    });
  return defer.promise;
}

/**
 * 版式列表
 * @param params
 * @returns {*}
 */
export function tempList(params){
  let defer = Q.defer();
  HttpClient.post('/calendar/templist',params)
    .then((res) => {
      defer.resolve(res);
    }, (err)=> {
      defer.reject(err);
    });
  return defer.promise;
}

/**
 * 更换版式
 * @param params
 * @returns {*}
 */
export function editTemp(params){
  let defer = Q.defer();
  HttpClient.post('/calendar/edittemp',params)
    .then((res) => {
      defer.resolve(res);
    }, (err)=> {
      defer.reject(err);
    });
  return defer.promise;
}

/**
 * 风格列表
 * @param params
 * @returns {*}
 */
export function styleList(params){
  let defer = Q.defer();
  HttpClient.post('/calendar/stylelist',params)
    .then((res) => {
      defer.resolve(res);
    }, (err)=> {
      defer.reject(err);
    });
  return defer.promise;
}

/**
 * 更换风格
 * @param params
 * @returns {*}
 */
export function changestyle(params){
  let defer = Q.defer();
  HttpClient.post('/calendar/changestyle',params)
    .then((res) => {
      defer.resolve(res);
    }, (err)=> {
      defer.reject(err);
    });
  return defer.promise;
}

//台历保存
export function saveBook(params) {
  let defer = Q.defer();
  HttpClient.post('/calendar/save',params)
    .then((res) => {
      defer.resolve(res);
    }, (err)=> {
      defer.reject(err);
    });
  return defer.promise;
}

//纪念日列表
export function memoryList(params) {
  let defer = Q.defer();
  HttpClient.post('/calendar/memorylist',params)
    .then((res) => {
      defer.resolve(res);
    }, (err)=> {
      defer.reject(err);
    });
  return defer.promise;
}

//新增或修改纪念日
export function memoryAdd(params) {
  let defer = Q.defer();
  HttpClient.post('/calendar/editmemory',params)
    .then((res) => {
      defer.resolve(res);
    }, (err)=> {
      defer.reject(err);
    });
  return defer.promise;
}