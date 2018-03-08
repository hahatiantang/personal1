/**
 * 文件说明: 对话框外壳组件
 * 详细描述:
 * 创建者:   huaijian
 * 创建时间: 15/12/5
 * 变更记录:
 */

/** ░░░░░░░░▌▒█░░░░░░░░░░░▄▀▒▌   **/
/** ░░░░░░░░▌▒▒█░░░░░░░░▄▀▒▒▒▐   **/
/** ░░░░░░░▐▄▀▒▒▀▀▀▀▄▄▄▀▒▒▒▒▒▐   **/
/** ░░░░░▄▄▀▒░▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐   **/
/** ░░░▄▀▒▒▒░░░▒▒▒░░░▒▒▒▀██▀▒▌   **/
/** ░░▐▒▒▒▄▄▒▒▒▒░░░▒▒▒▒▒▒▒▀▄▒▒   **/
/** ░░▌░░▌█▀▒▒▒▒▒▄▀█▄▒▒▒▒▒▒▒█▒▐  **/
/** ░▐░░░▒▒▒▒▒▒▒▒▌██▀▒▒░░░▒▒▒▀▄  **/
/** ░▌░▒▄██▄▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒  **/
/** ▀▒▀▐▄█▄█▌▄░▀▒▒░░░░░░░░░░▒▒▒  **/

/* Developed by ${USER}                                   */
/* The single doge JUST LOOKING AT YOU without any words. */
/* 单身犬默默地看着你，一句话也不说。                          */

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
require("react-tap-event-plugin")();
//let Dialog = require('material-ui/lib/dialog');
import {Dialog, FlatButton } from 'material-ui';
/**
 * custom modules
 */


class DialogBox extends React.Component {

  constructor(props) {

    super(props);

    /*let open = this.props.open;

     this.state = {
     open: open
     }*/

  }

  render() {
    require('./less/dialogBox.less');

    let standardActions = [];

    let style = {
      marginTop: this.props.offset,
      background: 'transparent',
      zIndex: this.props.zindex || 5000

    };
    //添加了是否居中显示,参数为textAlign
    let contentStyle = {
      padding: 0,
      width: this.props.width||'580px',
      maxWidth: this.props.maxWidth,
      height: this.props.height,
      textAlign: this.props.textAlign,
      maxHeight: this.props.maxHeight,
      minHeight: this.props.minHeight,
      overflow: 'visible',
      overflowX: 'visible',
      overflowY: 'visible',
      background: 'transparent'
    };

    let bodyStyle = {
      padding: 0,
      width: this.props.width,
      maxWidth: this.props.maxWidth,
      height: this.props.height,
      maxHeight: this.props.maxHeight,
      minHeight: this.props.minHeight,
      overflow: 'visible',
      overflowX: 'visible',
      overflowY: 'visible',
      boxSizing: 'border-box',
      background: 'transparent'
    };

    let overlayStyle = {
      // todo ie 8 不支持背景透明, 需用 opacity 实现?
      background: this.props.modal ? 'rgba(0,0,0,0.3)' : "transparent"
    };

    let dialogBoxCls = classNames('tf-dialog-box', this.props.className);


    // 根据配置添加弹框按钮
    if (this.props.hasFooter) {

      if (this.props.hasOk) {
        standardActions.push(<FlatButton
          key={2}
          label={this.props.okText || '确定'}
          primary={true}
          className="okBtn"
          onTouchTap={this._onDialogSubmit.bind(this)}/>);
      }

      if (this.props.hasCancel) {
        standardActions.push(<FlatButton
            key={1}
            label={this.props.cancelText || '取消'}
            secondary={true}
            className="cancelBtn"
            onTouchTap={this._onDialogCancel.bind(this)}/>);
      }
    }


    // 渲染DOM
    return (
      <Dialog
        style={style}
        bodyStyle={bodyStyle}
        contentStyle={contentStyle}
        overlayStyle={overlayStyle}
        className={dialogBoxCls}
        contentClassName="dialog_box"

        open={this.props.open}
        actions={standardActions}
        onRequestClose={this._dismiss.bind(this)}>

        {/*对话框 header */}
        {this.props.hasTitle &&
        <div className="dialog_box_header">

          <h3 className="dialog_box_header_title">{this.props.title}</h3>

          { this.props.hasCloseBtn && <button type="button"
                                              className="dialog_box_header_close"
                                              onClick={this._dismiss.bind(this, true)} /> }

        </div> }
        {/*对话框 header end */}

        {/*对话框 body */}
        <div className={this.props.hasTitle?'dialog_box_body':'dialog_box_body noTitle'}>
          <div className="dialog_box_body_concls">
            {React.cloneElement(this.props.children, {dialog: this})}
          </div>
        </div>
        {/*对话框 body end */}

      </Dialog>
    )
  }

  componentWillReceiveProps(nextProps, nextState) {

  }

  /**
   * 点击默认提供的确定按钮
   * @private
   */
  _onDialogSubmit() {
    // 如果有 okCall 执行
    if (this.props.onHandlerOk) {
      this.props.onHandlerOk();
    }

    this._close();

  }

  /**
   * 点击默认提供的取消按钮
   * @private
   */
  _onDialogCancel() {
    // 关闭窗口
    this._dismiss(true)

  }

  /**
   * 确定按钮后关闭对话框
   * @private
   */
  _close() {
    // 关闭窗口
    this.props.close();
  }

  /**
   * 解散对话框
   * @private
   */
  _dismiss(isBtnClicked) {

    console.log('isBtnClicked', isBtnClicked);
    // 拦截操作: 如果为模态框 并且 不是点击窗口内按钮触发 (比如点击窗口外部, 按键 ESC触发)
    if (this.props.modal && !isBtnClicked) {
      return false;
    }

    // 关闭窗口
    this._close();

    // 如果有 onHandlerCancel 则执行
    if (this.props.onHandlerCancel) {
      this.props.onHandlerCancel();
    }

  }

}


DialogBox.defaultProps = {
  open: false,

  hasCloseBtn: true,

  title: '提示',
  hasTitle: true,

  hasOk: true,
  hasCancel: true,

  offset: 0,
  width: 600,
  height: 'auto'
};


/**

 DialogBox.propTypes = {
  open: PropTypes.boolean.isRequired, // 控制窗口打开,关闭布尔值
  close: PropTypes.func.isRequired, // 关闭窗口方法

  title: PropTypes.string.isRequired, // 窗口标题

  okText: PropTypes.string.isRequired, // 确定按钮文字 (默认: 确定)
  cancelText: PropTypes.string.isRequired, // 取消按钮文字 (默认: 取消)

  offset: PropTypes.number.isRequired, // 窗口上下偏移值 (默认: 0 不偏移)

  width: PropTypes.number.isRequired, // 窗口宽度  (默认: 600px)
  height: PropTypes.height.isRequired, // 窗口高度  (默认: auto)

  modal: PropTypes.boolean.isRequired, // 是否是模态对话框  (默认: false 不是)

  hasTitle: PropTypes.boolean.isRequired, // 是否是有标题栏  (默认: true 有)

  hasCloseBtn: PropTypes.boolean.isRequired, // 是否关闭按钮  (默认: true 有)

  hasOk: PropTypes.boolean.isRequired, // 是否是有默认确定按钮 (默认: true 有)
  hasCancel: PropTypes.boolean.isRequired, // 是否是有默认取消按钮 (默认: false 无)

  hasFooter: PropTypes.boolean.isRequired, // 是否是有按钮栏 (默认: false 无)

  onHandlerCancel: PropTypes.func.isRequired, // 关闭窗口后, 执行的回调方法
}

 */

export default DialogBox;