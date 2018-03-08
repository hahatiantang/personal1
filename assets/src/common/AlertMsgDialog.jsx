/**
 * 文件说明: 提示框, 确认框组件
 * 详细描述:
 * 创建者:   卢淮建
 * 创建时间: 15/11/24
 * 变更记录:
 */

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import reactMixin from 'react-mixin';
import { connect } from 'react-redux';

import dialogMixin from '../tools/dialogMixin';
import DialogBox from './DialogBox.jsx';
import * as actionTypes from '../redux/utils/actionsTypes';


class AlertMsgDialog extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        // store 控制弹框
        let storeAlertMsg = this.props.store.storeAlertMsg;
        // state 控制弹框
        let ops = this.state.ops;

        /**
         * 配置弹框
         * @type {string}
         */
        // 提示内容
        let msg = storeAlertMsg ? storeAlertMsg.msg : (ops ? ops.msg : '操作成功');

        // 标题文字
        let title = storeAlertMsg ? storeAlertMsg.title : (ops ? ops.title : '提示');

        // 确定文字
        let okText = this.okText = storeAlertMsg ? storeAlertMsg.okText : (ops ? ops.okText : '确定');

        // 取消文字
        let cancelText = this.cancelText = storeAlertMsg ? storeAlertMsg.cancelText : (ops ? ops.cancelText : '取消');

        // 对话框宽度
        let width = storeAlertMsg ? storeAlertMsg.width : (ops ? ops.width : 500);

        let height = storeAlertMsg ? storeAlertMsg.height : (ops ? ops.height : 500);

        let maxWidth = storeAlertMsg ? storeAlertMsg.maxWidth : (ops ? ops.maxWidth : 'none');

        let msgLineHeight = storeAlertMsg ? storeAlertMsg.msgLineHeight : (ops ? ops.msgLineHeight : '35px');


        // 添加了是否居中显示,参数为textAlign,
        // 原因: 某些actions里dispatch调用的弹窗可能需要文字居中显示
        // 在本页面及DialogBox.jsx里的contentStyle定义中做了textAlign的适配修改
        let textAlign = storeAlertMsg ? storeAlertMsg.textAlign : (ops ? ops.textAlign : 'left');

        // 对话框偏移量
        let offset = storeAlertMsg ? storeAlertMsg.offset : (ops ? ops.offset : '-20%');

        // 确定回调
        let okCall = this.okCall = storeAlertMsg ? storeAlertMsg.okCall : (ops ? ops.okCall : null);

        // 取消回调
        let cancelCall = this.cancelCall = storeAlertMsg ? storeAlertMsg.cancelCall : (ops ? ops.cancelCall : null);

        // 是否模态对话框
        let modal = storeAlertMsg ? storeAlertMsg.modal : (ops ? ops.modal : false);

        // 是否有关闭按钮
        let hasCloseBtn = storeAlertMsg ? storeAlertMsg.hasCloseBtn : (ops ? ops.hasCloseBtn : true);

        // 是否有标题
        let hasTitle = storeAlertMsg ? storeAlertMsg.hasTitle : (ops ? ops.hasTitle : true);

        // 是否有确定按钮
        let hasOk = storeAlertMsg ? storeAlertMsg.hasOk || storeAlertMsg.okText : (ops ? ops.hasOk || ops.okText : false);

        // 是否有取消按钮
        let hasCancel = storeAlertMsg ? storeAlertMsg.hasCancel || storeAlertMsg.cancelText : (ops ? ops.hasCancel || ops.cancelText : false);

        // 是否有页脚按钮
        let hasFooter = storeAlertMsg ? storeAlertMsg.hasFooter : (ops ? ops.hasFooter : false);

        // textAlign: 'left'  修改为  textAlign: textAlign ? textAlign : 'left'
        let contentStyle = {
            lineHeight: '35px',
            textAlign:textAlign,
            color:'#626262',
            fontSize:'18px',
            padding:'5px'
        };

        let msgContentStyle = {
            lineHeight:msgLineHeight||'35px'
        }

        let alertMsgFlag = this.props.flag?this.props.flag:'alertMsgDialog';
        return (

            <DialogBox {...this.props}
                className="tf-dialog-alert"
                open={this.state[alertMsgFlag]}
                close={this.closeAlertMsgDialog.bind(this)}
                width={width||490}
                height={height||115}
                maxWidth={maxWidth}
                textAlign={textAlign}
                //offset={offset}
                zindex={5010}
                modal={modal}
                hasCloseBtn={hasCloseBtn}
                hasOk={hasOk}
                hasCancel={hasCancel}
                hasTitle={hasTitle}
                title={title}
                okText={okText}
                cancelText={cancelText}
                onHandlerOk={okCall}
                onHandlerCancel={cancelCall}>

                <div style={contentStyle}>

                    {React.cloneElement(<div style = {msgContentStyle}>{msg}</div>)}

                    {hasFooter && <div className="tf-dialog-alert-footer">
                        { hasOk && <button type="button"
                                           className="tf-btn tf-btn-primary"
                                           onClick={this.handleOk.bind(this)}>
                            {this.okText || "确定"}
                        </button> }

                        { hasCancel && <button type="button"
                                               className="tf-btn tf-btn-cancel"
                                               onClick={this.handleCancel.bind(this)}>
                            {this.cancelText || "取消"}
                        </button> }

                    </div> }

                </div>

            </DialogBox>
        )
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

        let duration;

        if (!this.props.store.storeAlertMsg && nextProps.store.storeAlertMsg) {

            // 获取设置的关闭时间
            duration = nextProps.store.storeAlertMsg.duration;

            // 打开窗口
            this.openDialog('alertMsgDialog');
            // todo 自动关闭窗口(销毁store)
            if (duration) {
                setTimeout(() => {

                    if (this.okCall) {
                        this.okCall();
                    }
                    this.closeAlertMsgDialog();

                }, duration);
            }
        }

    }

    /**
     * 重定义关闭函数(清除 storeAlertMsg)
     */
    closeAlertMsgDialog() {
        this.closeDialog('alertMsgDialog');
        this.props.dispatch({
            type: actionTypes.CLOSE_MESSAGE
        });
    }


    /**
     * 确定按钮事件
     */
    handleOk() {
        this.closeAlertMsgDialog();
        if (this.okCall) {
            this.okCall();
        }
    }

    /**
     * 取消按钮事件
     */
    handleCancel() {
        this.closeAlertMsgDialog();
        if (this.cancelCall) {
            this.cancelCall();
        }
    }


}

// 为非纯react页面临时调用登录组件
/*if (window) {
 window.tfAlertMsg = {
 init: function () {
 if (window.alertMsg) {
 return window.alertMsg;
 }
 let $alertMsg = $('<div>', {
 id: 'alertMsg'
 }).appendTo(document.body);

 // 传入初始化的登录成功回调,并返回渲染的登录组件
 return window.alertMsg = ReactDOM.render(
 <AlertMsg {...this.props}></AlertMsg>,
 $alertMsg[0]
 );
 }
 };
 }*/

// mixin
dialogMixin(AlertMsgDialog, ['alertMsgDialog']);

function mapStateToProps(store) {
    return {
        store: {storeAlertMsg: store.storeAlertMsg}
    };

}
// 导出模块
export default connect(mapStateToProps)(AlertMsgDialog);
