/**
 * 文件说明: 登录对话框
 * 详细描述:
 * 创建者:   卢怀建
 * 创建时间: 15/12/6
 * 变更记录:
 */

import React from 'react';
import ReactDOM from 'react-dom';
let $ = require('jquery');
/**
 * custom modules
 */
// component common modules
import DialogBox from './DialogBox.jsx';
import LoginForm from './LoginForm.jsx';
import authMixin from '../tools/authMixin';

class LoginDialog extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: props.open
    };

  }


  render() {

    let open = typeof window !== 'undefined' ? (window.loginDialog ? this.state.open : this.props.open) : this.props.open;

    return (
      <DialogBox
        {...this.props}
        open={open}
        close={this.props.close ? this.props.close : this.close.bind(this)}
        modal={true}
        width={520}
        hasFooter={false}
        title={this.title || "登录"}>

        <LoginForm
          {...this.props}
          dispatch={this.dispatch}
          handlerLoginSuccess={this.handlerLoginSuccess}/>

      </DialogBox>
    )
  }

  componentDidMount() {

  }

  /**
   * 打开登录框
   * @param ops
   * @param handlerLoginSuccess
   */
  open(ops, handlerLoginSuccess) {
    let token = authMixin.getToken();
    let handlerLoginSuccessCallback;

    this.dispatch = ops.dispatch;
    this.title = ops.title;
    // 将自定义的登录后方法赋值给组件
    this.handlerLoginSuccess = handlerLoginSuccess;

    // 如果未登录, 弹出登录框
    if(!token) {
      this.setState({
        open: true
      });
    } else {
      // 如果登录, 执行后续操作
      if(handlerLoginSuccess) {
        handlerLoginSuccessCallback = this.handlerLoginSuccess();
      }
    }

    return handlerLoginSuccessCallback;
  }

  /**
   * 关闭
   */
  close() {
    this.setState({
      open: false
    });
  }

}

// 为非纯react页面临时调用登录组件
if (typeof window != 'undefined') {
  let $loginDialog = $('<div>', {
    id: 'loginDialog'
  }).appendTo(document.body);

  // 传入初始化的登录成功回调,并返回渲染的登录组件
  window.loginDialog = ReactDOM.render(
    <LoginDialog />,
    $loginDialog[0]
  );
}

// 导出模块
export default LoginDialog;