/**
 * 文件说明: 首页Actions
 * 详细描述:
 * 创建者:   韩波
 * 创建时间: 2016/9/23
 * 变更记录:
 */

import * as Types from '../utils/actionsTypes.js';
import * as Apis from '../../../../api/indexApi.js';

// index
export function indexQuestion(data) {
  return (dispatch) => {
    Apis.indexQuestion(data)
      .then((res)=> {
        dispatch({
          type: Types.GET_INCEX_DATA,
          store: res.data
        });
      }, (err)=> {
        dispatch({
          type: Types.ERROR_MESSAGE
        });
      })
  }

}

