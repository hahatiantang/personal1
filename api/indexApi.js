/**
 * 文件说明:首页Api
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/9/23
 * 变更记录:
 */
import Q from 'q';
import HttpClient from '../assets/src/redux/utils/httpClient';

/*
* index
* */
export function indexQuestion(data) {
  let defer = Q.defer();
  HttpClient.post('/test', data)
    .then((res) => {
      defer.resolve(res);
    }, (err)=> {
      defer.reject(err);
    });
  return defer.promise;
}
