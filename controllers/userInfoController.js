/**
 * 文件说明:获取用户信息
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/9/29
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

  console.log("/member/profile接口请求失败",errJsonData,err);
  return errJsonData
}

/**
 *获取用户信息接口
 */
exports.getUserInfo = function (data,headers) {
  console.log('获取用户接口',headers);
  var defer = q.defer();
  var url = BASE_URL + '/member/profile';
  request.post(url)
    .set(headers)
    .timeout(10 * 10000)
    .type('json')
    .send(data)
    .end((err, res) => {
      if (err) {
        console.log("获取用户信息失败");
        defer.reject(errDataHandle(err,res));
      } else {
        defer.resolve(res.body);
      }
    });
  return defer.promise;
};