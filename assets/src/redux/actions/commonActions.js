/**
 * 文件说明: 网站公用的 actions 集合
 * 详细描述:
 * 创建者: 陳明峰
 * 创建时间: 15/12/16
 * 变更记录:
 */
import * as Api from '../../../../api/commonApis';
import * as Types from '../utils/actionsTypes';
/**
 * 获取用户信息
 *
 * */
export function getProfile(params) {
  return (dispatch) => {
    Api.getProfile(params)
        .then((res) => {
          dispatch({
            type: Types.GET_PROFILE,
            store: res.data
          })
        }, (error)=> {
          dispatch({
            type: Types.ERROR_MESSAGE,
            error
          })
        })
  }
}

export function resetProfile(params,flag) {
  return (dispatch) => {
        dispatch({
          type: Types.RESET_TEMP_USER_INFO
        })
  }
}

//获取未读信息
export function unread(params) {
  return (dispatch) => {
    Api.unread(params)
      .then((res) => {
        dispatch({
          type: Types.GET_UNREAD,
          store: res.data
        })
      }, (error)=> {
        dispatch({
          type: Types.ERROR_MESSAGE,
          error
        })
      })
  }
}

//免密登录
export function getFreeCode(params, callback) {
  return (dispatch) => {
    Api.apiGetFreeCode(params)
      .then((res)=> {
        callback.sucBack(res);
      }, (error)=> {
        callback.errorBack(error);
        dispatch({
          type: Types.ERROR_MESSAGE,
          error
        })
      });
  }
}

/*免密登录提示*/
export function freeLoginTip (msg) {
  return (dispatch) => {
    dispatch({
      type: Types.ALERT_MESSAGE,
      width: 300,
      duration: 2000,
      msg: msg,
      hasTitle: false,
      hasFooter: false
    });
  }
}

export function getCartNumber(params = {}) {
  return (dispatch) => {
    Api.cartcount(params)
      .then((res) => {
        dispatch({
          type: Types.GET_CART_NUMBER,
          store: res.data
        })
      }, (error)=> {
        dispatch({
          type: Types.ERROR_MESSAGE,
          error
        })
      })
  }
}

//网站logo
export function getLogo() {
  return (dispatch) => {
    Api.getLogo()
      .then((res)=> {
        dispatch({
          type: Types.WEB_LOGO,
          store: res.data
        })
      }, (error)=> {
        dispatch({
          type: Types.ERROR_MESSAGE,
          error
        })
      });
  }
}

//获取购物车数量
export function cartNumber() {
  return (dispatch) => {
    Api.cartcount()
      .then((res)=> {
        dispatch({
          type: Types.GET_CART_NUMBER,
          store: res.data
        })
      }, (error)=> {
        dispatch({
          type: Types.ERROR_MESSAGE,
          error
        })
      });
  }
}

//视频上传
export function uploadVideo(params,callback) {
  return (dispatch) => {
    Api.uploadVedio(params)
      .then((res) => {
        if(callback){
          callback.handleSuccess(res);
        }
        dispatch({
          type: Types.UPLOAD_VIDEO,
          store: res.data
        });
      }, (error)=> {
        if (callback) {
          callback.handleError(error);
        }
        dispatch({
          type: Types.ERROR_MESSAGE,
          error:error
        });
      });
  }
}

//图片上传
export function uploadImage(params,index,callback) {
  return (dispatch) => {
    Api.uploadImg(params)
      .then((res) => {
        if(callback){
          callback.handleSuccess(res);
        }
        dispatch({
          type: Types.UPLOAD_IMAGE,
          store: res.data,
          index
        });
      }, (error)=> {
        if (callback) {
          callback.handleError(error);
        }
        dispatch({
          type: Types.ERROR_MESSAGE,
          error:error
        });
      });
  }
}

export function printChoice(params) {
  return (dispatch) => {
    Api.printchoice(params)
      .then((res) => {
        dispatch({
          type: Types.PRINT_CHOICE,
          store: res.data
        });
      }, (error)=> {
        
        dispatch({
          type: Types.ERROR_MESSAGE,
          error
        })
      })
  }
}

//加入印刷车
export function addCart(params, successBack, errorBack) {
  return (dispatch) => {
    Api.addCart(params)
      .then((res) => {
        successBack&&successBack.handelSuccess(res);
      }, (error)=> {
        errorBack&&errorBack.handelError();
        dispatch({
          type: Types.ERROR_MESSAGE,
          error
        })
      })
  }
}

// 获取sys签名
export function getSignature(successBack, errorBack) {
  return (dispatch) => {
    Api.aLiSignature({
      handleSuccess: (res) => {
        successBack.handleSuccess(res);
      },
      handelError: (err) => {
        errorBack.handelError(err);
      }
    });
  }
}

// 上传照片
export function uploadImageDao(params,callback) {
  return (dispatch) => {
    imageCompress(params,dispatch,callback);
  }
}

const imageCompress = (param, dispatch,callback) => {
  
  Api.uploadImageApi(param, {
    handleSuccess: (res) => {
      if(callback){
        callback.handleSuccess(res);
      }
      dispatch({
        type: Types.UPLOAD_IMAGE,
        store: res.data
      });
    },
    handleError:(err)=>{
      if (callback) {
        callback.handleError(err);
      }
    }
  }).then((res) => {
    //授权成功
  }, (err) => {
    if (callback) {
      callback.handleError(err);
    }
    dispatch({
      type: Types.ERROR_MESSAGE,
      error:error
    });
  });
};

/*//压缩图片 为符合要求格式
const imageCompress = (param,dispatch,callback) => {
  console.warn('开始压缩',new Date());
  let defer = Q.defer();
  new html5ImgCompress(param.file, {
    maxWidth: 4096,
    maxHeight: 4096,
    quality: 1,
    before: function(file) {

    },
    done: function (file, base64){
      // ajax和服务器通信上传base64图片等操作
      console.log('未压缩高宽前',file);
      // EXIF.getData(file, function() {
      //   param.exifData = null;
      //   const exifData =  EXIF.getAllTags(this);
      //   param.exifData = exifData;
      // });
      base64 = base64.split(';');
      let blob = base64toBlob(base64[1].split(',')[1],base64[0].split(':')[1]);
      const blobUrl = URL.createObjectURL(blob);
      blob.name = param.file.name;
      blob.lastModified = param.file.lastModified;
      blob.lastModifiedDate = param.file.lastModifiedDate;
      blob.preview = blobUrl;
      param.file = null;
      param.file = blob;
      console.warn('压缩高宽后,文件大小',file.size/1024);
      console.warn('压缩完成，开始授权请求',new Date());
      Api.uploadImageApi(param,{
        handleSuccess: (res)=> {
          if(callback){
            callback.handleSuccess(res);
          }
          dispatch({
            type: Types.UPLOAD_IMAGE,
            store: res.data
          });
          defer.resolve(res);
        }
      }).then((res) => {
        //授权成功
      }, (err) => {
        if (callback) {
          callback.handleError(err);
        }
        dispatch({
          type: Types.ERROR_MESSAGE,
          error:error
        });
      });
      return defer.promise;
    },
    fail: function() {
      
    },
    complete: function() {
      
    },
    notSupport: function() {
      
    }
  });
};*/
//base64 转成流
const base64toBlob = (base64Data, contentType='', sliceSize=512) => {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
};