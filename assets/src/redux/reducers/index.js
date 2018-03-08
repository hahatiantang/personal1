/**
 * 文件说明:根reducer
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/9/23
 * 变更记录:
 */
import {combineReducers} from 'redux';
import {indexQuestionStore} from './indexReaucers';
import {storeAlertMsg} from './alertMsgReducer';
import * as commonReducers from './commonReducers';
import * as editReducer from './editReducer';
import * as podBookReducer from './podBookReducer';

const rootReducer = combineReducers({
    indexQuestionStore,
    storeAlertMsg,
    ...commonReducers,
    ...editReducer,
    ...podBookReducer
});
export default rootReducer;