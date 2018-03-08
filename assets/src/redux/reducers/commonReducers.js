/**
 * 文件说明: 网站公用的 reducers 集合
 * 详细描述:
 * 创建者: 陳明峰
 * 创建时间: 15/12/16
 * 变更记录:
 */
import * as Types from '../utils/actionsTypes';

/*登录用户信息*/
export function getProfile(state = {}, action) {
  switch (action.type) {
    case Types.GET_PROFILE:
      return action.store;
    default:
      return state;
  }
}

/*获取未读信息*/
export function unreadMsgStore(state = {}, action) {
  switch (action.type) {
    case Types.GET_UNREAD:
      return action.store;
    default:
      return state;
  }
}

//获取购物车数量
export function cartNumberStore(state = 0, action = {}) {
  switch (action.type) {
    case Types.GET_CART_NUMBER:
      return action.store;
    default:
      return state;
  }
}


/**
 * 网站logo信息
 * */
export function getLogoStore(state = {},action = {}){
  switch (action.type) {
    case Types.WEB_LOGO:
      return  action.store;
    default:
      return state;
  }
}

//选择打印方式
export function printChoiceStore(state = {},action = {}) {
  switch (action.type){
    case Types.PRINT_CHOICE:
      return action.store;
    default:
      return state;
  }
}

export function videoStore(state = {},action = {}) {
  switch (action.type){
    case Types.UPLOAD_VIDEO:
      return action.store;
    default:
      return state;
  }
}

