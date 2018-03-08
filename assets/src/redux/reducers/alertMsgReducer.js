/**
 * 文件说明: 弹出提示框 store
 * 详细描述:
 * 创建者: 卢淮建
 * 创建时间: 15/12/03
 * 变更记录:
 */
import {ALERT_MESSAGE, CLOSE_MESSAGE} from '../utils/actionsTypes';

export function storeAlertMsg(state = null, action) {
  if (action.type === ALERT_MESSAGE) {
    return action;
  } else if (action.type === CLOSE_MESSAGE) {
    return null;
  }else {
    return state;
  }
}