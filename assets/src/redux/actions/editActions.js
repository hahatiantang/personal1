/**
 * 文件说明:编辑台历
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/10/12
 * 变更记录:
 */

import * as Types from '../utils/actionsTypes.js';
import * as Api from '../../../../api/editApi.js';

//台历保存
export function saveBook(params,callBack){
  return (dispatch) =>{
    Api.saveBook(params)
      .then((res) =>{
        if(callBack&&callBack.handSuccess){
          callBack.handSuccess(res);
        }
      }, (error) => {
        if(callBack&&callBack.handError){
          callBack.handError(error);
        }
        dispatch({
          type: Types.ERROR_MESSAGE,
          error
        })
      })
  }
}

//更改文字
export function editText(params,callBack){
  return (dispatch) =>{
    Api.editTxt(params)
      .then((res) =>{
        if(callBack&&callBack.handelSuccess){
          callBack.handelSuccess(res);
        }
      }, (error) => {
        if(callBack&&callBack.handelError){
          callBack.handelError(error);
        }
        dispatch({
          type: Types.ERROR_MESSAGE,
          error
        })
      })
  }
}

//台历文字保存
export function editCalendarText(textData,index,currentIndex){
  return (dispatch) => {
    dispatch({
      type: Types.EDIT_CALENDAR_TEXT,
      textData,
      index,
      currentIndex
    });
  }
}

//获取台历版式列表
export function tempListAction(params,callBack){
  return (dispatch) =>{
    Api.tempList(params)
      .then((res) =>{
        if(callBack&&callBack.handelSuc){
          callBack.handelSuc(res);
        }
      }, (error) => {
        if(callBack&&callBack.handelError){
          callBack.handelError(error);
        }
        dispatch({
          type: Types.ERROR_MESSAGE,
          error
        })
      })
  }
}

//更改版式
export function editTemp(params,callBack){
  return (dispatch) =>{
    Api.editTemp(params)
      .then((res) =>{
        if(callBack&&callBack.handelSucc){
          callBack.handelSucc(res);
        }
      }, (error) => {
        if(callBack&&callBack.handelError){
          callBack.handelError(error);
        }
        dispatch({
          type: Types.ERROR_MESSAGE,
          error
        })
      })
  }
}

//更改版式确定
export function editCalendarTemp(tempData,currentIndex){
  return (dispatch) => {
    dispatch({
      type: Types.EDIT_CALENDAR_TEMP,
      tempData,
      currentIndex
    });
  }
}

//获取台历风格列表
export function styleListAction(params,callBack){
  return (dispatch) =>{
    Api.styleList(params)
      .then((res) =>{
        if(callBack&&callBack.handelSuc){
          callBack.handelSuc(res);
        }
      }, (error) => {
        if(callBack&&callBack.handelError){
          callBack.handelError(error);
        }
        dispatch({
          type: Types.ERROR_MESSAGE,
          error
        })
      })
  }
}

//更换风格
export function changeStyle(params,callBack){
  return (dispatch) =>{
    Api.changestyle(params)
      .then((res) =>{
        if(callBack&&callBack.handelSucc){
          callBack.handelSucc(res);
        }
      }, (error) => {
        if(callBack&&callBack.handelError){
          callBack.handelError(error);
        }
        dispatch({
          type: Types.ERROR_MESSAGE,
          error
        })
      })
  }
}

//更换风格确定
export function editCalendarStyle(styleData,params){
  return (dispatch) => {
    dispatch({
      type: Types.EDIT_CALENDAR_STYLE,
      styleData,
      params
    });
  }
}

//图片裁剪
export function imageCrop(crop,index){
  return (dispatch) => {
    dispatch({
      type: Types.IMAGE_CROP,
      crop,
      index
    });
  }
}

//图片旋转
export function rotationImage(cropData,index,currentIndex) {
  return {
    type: Types.ROTATION_IMAGE,
    cropData,
    index,
    currentIndex
  }
}

//批量上传
export function bulkUpload(file,index,cenIndex){
  return (dispatch) => {
    dispatch({
      type: Types.BULK_UPLOAD,
      file,
      index,
      cenIndex
    });
  }
}

//纪念日列表
export function memoryListAction(params,callBack){
  return (dispatch) =>{
    Api.memoryList(params)
      .then((res) =>{
        if(callBack&&callBack.handelSu){
          callBack.handelSu(res);
        }
      }, (error) => {
        if(callBack&&callBack.handelError){
          callBack.handelError(error);
        }
        dispatch({
          type: Types.ERROR_MESSAGE,
          error
        })
      })
  }
}

//新增或修改纪念日
export function addMemoryAction(params,callback) {
  return (dispatch) =>{
    Api.memoryAdd(params)
      .then((res) =>{
        callback&&callback.handSuc(res);
      }, (error) => {
        if(callback&&callback.handErr){
          callback.handErr(error);
        }
        dispatch({
          type: Types.ERROR_MESSAGE,
          error
        })
      })
  }
}

//纪念日保存
export function memoryHand(memoryData,currentIndex){
  return (dispatch) => {
    dispatch({
      type: Types.MEMORY_EDIT,
      memoryData,
      currentIndex
    });
  }
}

//替换照片
export function replacePhoto(oldImgList,newImgList) {
  return (dispatch) => {
    dispatch({
      type: Types.REPLACE_PHOTO,
      oldImgList,
      newImgList
    });
  }
}