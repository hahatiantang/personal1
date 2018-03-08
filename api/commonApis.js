/**
 * 文件说明: 网站公用的 apis 集合
 * 详细描述:
 * 创建者: 陳明峰
 * 创建时间: 15/12/16
 * 变更记录:
 */
import Q from 'q';
import HttpClient from './../assets/src/redux/utils/httpClient.js';
var CalConfig = require('../config.js');

/*
 * 获取用户信息
 * */
export function getProfile(params, headers = {}) {
  let defer = Q.defer();
  HttpClient.post('/member/profile', params, headers)
      .then((res) => {
        defer.resolve(res);
      }, defer.reject);
  return defer.promise;
}


/**
 * 未读接口
 * @param params
 * @returns {*}
 */
export function unread(params) {
  let defer = Q.defer();
  HttpClient.post('/member/unread', params)
      .then((res) => {
        defer.resolve(res);
      }, defer.reject);
  return defer.promise;
}


/**
 * 发送日志
 * @param params
 * @returns {*|promise.promise|jQuery.promise|r.promise|promise}
 */
export function log(params) {
  let defer = Q.defer();
  HttpClient.post('/common/log', params)
    .then(defer.resolve, defer.reject);
  return defer.promise;
}


/**
 * 免密登录验证码
 * @param req
 * @returns {*}
 */

export function apiGetFreeCode(req) {

  let defer = Q.defer();
  HttpClient.post('/auth/captcha', req)
    .then(res => {
      defer.resolve(res);
    }, err => {
      defer.reject(err);
    });

  return defer.promise;
}

/**
 * 获取购物车数量
 * @param params
 * @param headers
 * @returns {*|promise.promise|jQuery.promise|r.promise|promise}
 */
export function cartcount(params, headers={}){
  let defer = Q.defer();
  HttpClient.post('/member/cartcount', params, headers)
    .then(defer.resolve, defer.reject);
  return defer.promise;
}

/**
 * 网站logo
 * */
export function getLogo(){
  let defer = Q.defer();
  HttpClient.post('/common/getLogo')
    .then((res)=> {
      defer.resolve(res);
    }, defer.reject);
  return defer.promise;
}

/**
 *图片上传
 * @param params
 * @returns {*}
 */
export function uploadImg(params) {
    let defer = Q.defer();
    HttpClient.upload('/common/openuploadimg', params)
        .then((res) => {
            defer.resolve(res);
        }, defer.reject);
    return defer.promise;
}

/**
 *视频上传
 * @param params
 * @returns {*}
 */
export function uploadVedio(params) {
  let defer = Q.defer();
  HttpClient.upload('/calendar/uploadvedio', params)
    .then((res) => {
      defer.resolve(res);
    }, defer.reject);
  return defer.promise;
}

/**
 * 加入印刷车
 * */
export function addCart(params) {
  let defer = Q.defer();
  HttpClient.post('/cart/add', params)
    .then(res => {
      defer.resolve(res);
    }, defer.reject);
  return defer.promise;
}

//打印方式选择
export function printchoice(params){
  let defer = Q.defer();
  HttpClient.post('/order/printchoice',params)
    .then(res => {
      defer.resolve(res);
    },defer.reject);
  return defer.promise;
}

//得到文件后缀名
const getSuffix = (filename)=> {
  let pos = filename.lastIndexOf('.');
  let suffix = '';
  if (pos != -1) {
    suffix = filename.substring(pos)
  }
  return suffix;
};

//初次请求授权服务
export function aLiSignature(handleCb) {
  HttpClient.filterPost(CalConfig.ALiConfig.aLiSTS, {url:CalConfig.ALiConfig.aLiUploadUrl,dir:CalConfig.ALiConfig.aLiUploadDir})
    .then((res)=>{
      window.STSOBJEACT = res;
      handleCb.handleSuccess(res);
    },(err)=>{
      handleCb && handleCb.handelError(err);
    });
}

//计算文件的 MD5 值
const calculateImageMD5 = (params, handleCb)=> {
  let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
    file = params.file,
    chunkSize = 2097152,                             // Read in chunks of 2MB
    chunks = Math.ceil(file.size / chunkSize),
    currentChunk = 0,
    spark = new SparkMD5.ArrayBuffer(),
    fileReader = new FileReader();
  fileReader.onload = function (e) {
    spark.append(e.target.result);                   // Append array buffer
    currentChunk++;

    if (currentChunk < chunks) {
      loadNext();
    } else {
      console.log('finished loading');
      let filename = '/' + spark.end() + getSuffix(params.file.name);
      //开始阿里云上传
      uploadForALiYun(params, filename, handleCb);
    }
  };

  fileReader.onerror = function () {
    console.warn('oops, something went wrong.');
  };

  function loadNext() {
    var start = currentChunk * chunkSize,
      end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  }

  loadNext();
};

/*
 * STS授权
 * */
export function uploadImageApi(params,handleCb) {
  let defer = Q.defer();
  if(!window.STSOBJEACT){
    HttpClient.filterPost(CalConfig.ALiConfig.aLiSTS, {url: CalConfig.ALiConfig.aLiUploadUrl, dir: CalConfig.ALiConfig.aLiUploadDir})
      .then((res) => {
        window.STSOBJEACT = res;
        //计算图片  MD5
        calculateImageMD5(params,handleCb);
        defer.resolve(res);
      }, (err)=> {
        if(err.code = 'timeout'){
          handleCb&&handleCb.handleError(err);
        }
        defer.reject(err);
      });
  }else{
    calculateImageMD5(params,handleCb);
  }
  return defer.promise;
}
//阿里云上传
function uploadForALiYun(param, filename, handleCb) {
  let defer = Q.defer();
  let params = {
    name: 'file',
    file: param.file,
    fields: [
      {name: 'key', value: window.STSOBJEACT.dir + filename},
      {name: 'policy', value: window.STSOBJEACT.policy},
      {name: 'OSSAccessKeyId', value: window.STSOBJEACT.accessid},
      {name: 'success_action_status', value: 200},
      {name: 'signature', value: window.STSOBJEACT.signature}
    ]
  };
  let imageALiPath = 'http://' + CalConfig.ALiConfig.aLiUploadUrl + '/' + CalConfig.ALiConfig.aLiUploadDir + filename;
  //判断图片是否存在
  HttpClient.head(imageALiPath+'@info').then(()=>{
    //直接得到图片信息
    getImageInfo(imageALiPath,handleCb);
  },()=>{
    //上传图片
    HttpClient.upload('http://'+CalConfig.ALiConfig.aLiUploadUrl, params)
      .then(() => {
        getImageInfo(imageALiPath,handleCb);
        defer.resolve();
      },(err)=>{
        if(err.code == 403){
          window.STSOBJEACT = null;
          uploadImageApi(params,handleCb);
        }else{
          handleCb&&handleCb.handleError(err);
        }
        defer.reject(err);
      });
  });
  return defer.promise;
}

//得到图片信息，并返回
function getImageInfo(imageALiPath,handleCb) {
  let defer = Q.defer();
  console.warn('阿里云上传完成，开始获取图片信息', new Date());
  //获取图片地址
  HttpClient.get(imageALiPath + '@infoexif')
    .then((result)=>{
      let image_result_object = {
        "data": {
          "image_rotation": 0.0,
          "image_tags": [],
          "imageHwlv": 0.0,
          "image_padding_right": 0.0,
          "image_primary_color": "",
          "image_height": 0.0,
          "image_padding_top": 0.0,
          "image_date": '',
          "image_id": "0",
          "image_orientation": 0,
          "image_start_point_x": 0.0,
          "image_flip_vertical": 0,
          "imageWhlv": 0.0,
          "image_start_point_y": 0.0,
          "image_remark": "",
          "image_scale_vertical": 0.0,
          "image_padding_left": 0.0,
          "image_url": "",
          "image_padding_bottom": 0.0,
          "image_width": 0.0,
          "image_scale": 0.0,
          "image_flip_horizontal": 0,
          "image_content": ""
        },
        "error_code": 10000,
        "info": "接口响应正常！"
      };
      image_result_object.data.image_orientation = result.Orientation&&result.Orientation.value || '0';
      image_result_object.data.image_width = result.ImageWidth.value;
      image_result_object.data.image_height = result.ImageHeight.value;
      image_result_object.data.image_url = imageALiPath;
      image_result_object.data.image_date = result.DateTimeOriginal&&new Date(result.DateTimeOriginal.value.split(" ")[0].replace(/:/g,'-'))
          .getTime() || '-28800000';
      //处理成功回调
      handleCb&&handleCb.handleSuccess(Object.assign({},image_result_object));
      defer.resolve(Object.assign({},image_result_object));
    },(err) => {
      handleCb&&handleCb.handleError(err);
      defer.reject(err);
    })
}