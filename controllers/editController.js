/**
 * 文件说明:编辑台历服务端代码
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/10/10
 * 变更记录:
 */

var request = require('superagent');
var q = require('q');
var config = require('../config');
var BASE_URL = config.API_SERVER.host + config.API_SERVER.path;

/**
 * 接口请求错误处理
 * @param err
 * @param res
 * @returns {{}}
 */
function errDataHandle(err,res){
  var errJsonData = {};
  try{
    try{
      errJsonData = {code: res.statusCode,data:JSON.parse(err.response.text)} ;
    }catch(error){
      errJsonData = {code: res.statusCode, data: res.body};
    }
  }catch (error){
    errJsonData = {code: 500, data: {}};
  }
  return errJsonData
}

/**
 *获取编辑台历数据
 */
exports.getPodCreate = function (data,headers) {
  console.log('headers111',headers);
  var defer = q.defer();
  var url = BASE_URL + '/calendar/podcreate';
  request.post(url)
    .set(headers)
    .timeout(10 * 10000)
    .type('json')
    .send(data)
    .end((err, res) => {
      if (err) {
        defer.reject(errDataHandle(err,res));
      } else {
        defer.resolve(res.body);
      }
    });
  return defer.promise;
};