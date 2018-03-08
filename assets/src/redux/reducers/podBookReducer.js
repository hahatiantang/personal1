import * as Types from '../utils/actionsTypes.js';
/**
 *pod预览接口
 * @param state
 * @param action
 * @returns {*}
 */
export function podStore (state={}, action) {
  switch(action.type){
    case Types.POD_VIEW:
      return action.podStore;
    default:
      return state;
  }
}