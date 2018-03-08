import React from 'react';
import classNames from 'classnames';
var ParseURL = require('url-parse');

import LoginThirdWeiXin from './LoginThirdWeiXin.jsx';
import loginThirdBtnCss from './less/loginThirdBtn.less';

class LoginThirdBtn extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className={loginThirdBtnCss['third_icon_' + this.props.thirdType]}
           title="腾讯QQ帐号登录"
           onClick={this.thirdLogin.bind(this,'qq')}>
        <span>QQ登录</span>
      </div>
    )
  }

  /**
   * 生命周期方法
   * 调用--获取第三方信息
   */
  componentDidMount() {

  }

}

export default LoginThirdBtn;