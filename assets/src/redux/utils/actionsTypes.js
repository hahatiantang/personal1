/**
 * 文件说明:redux action type 定义
 * 详细描述:
 * 创建者: 余成龍
 * 创建时间: 2016/6/28
 * 变更记录:
 */

export const GET_INCEX_DATA = 'GET_INCEX_DATA';
export const ERROR_MESSAGE = 'ERROR_MESSAGE';
/*================ alertMsg 消息========================== */
export const ALERT_MESSAGE = 'ALERT_MESSAGE';
export const CLOSE_MESSAGE = 'CLOSE_MESSAGE';

//获取未读信息与密函
export const GET_UNREAD = 'GET_UNREAD';
//用户信息
export const GET_PROFILE = 'GET_PROFILE';
//购物车数量
export const GET_CART_NUMBER = 'GET_CART_NUMBER';
//网站logo
export const WEB_LOGO = 'WEB_LOGO';

/* ====  登录框相关 =======*/
export const LOGIN_USER = 'LOGIN_USER';
export const RESET_TEMP_USER_INFO = 'RESET_TEMP_USER_INFO';

//台历获取数据
export const POD_CREATE_DATA = 'POD_CREATE_DATA';
//更改文字
export const EDIT_CALENDAR_TEXT = 'EDIT_CALENDAR_TEXT';
//更改版式
export const EDIT_CALENDAR_TEMP = 'EDIT_CALENDAR_TEMP';
//更改风格
export const EDIT_CALENDAR_STYLE = 'EDIT_CALENDAR_STYLE';
//上传视频
export const UPLOAD_VIDEO = 'UPLOAD_VIDEO';
//上传图片
export const UPLOAD_IMAGE = 'UPLOAD_IMAGE';
//图片裁剪
export const IMAGE_CROP = 'IMAGE_CROP';
//图片旋转
export const ROTATION_IMAGE = 'ROTATION_IMAGE';
//批量上传
export const  BULK_UPLOAD = 'BULK_UPLOAD';
//纪念日修改
export const MEMORY_EDIT = 'MEMORY_EDIT';
export const MEMORY_EDIT_LIST = 'MEMORY_EDIT_LIST';

//替换照片
export const REPLACE_PHOTO = 'REPLACE_PHOTO';

//台历预览
export const POD_VIEW = 'POD_VIEW';
//打印方式选择
export const PRINT_CHOICE = 'PRINT_CHOICE';