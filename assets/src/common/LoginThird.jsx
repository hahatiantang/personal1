import React from 'react';
import classNames from 'classnames';
var ParseURL = require('url-parse');

import LoginThirdWeiXin from './LoginThirdWeiXin.jsx';
import './less/loginForm.less';

class LoginThird extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="third_box" style={{'textAlign':'center','paddingBottom':'25px'}}>
        <span className="moreAccount">更多帐号登录</span>
        <div className="third_icon_list">
          <div
            className="third_icon_qq"
            title="腾讯QQ帐号登录"
            onClick={this.thirdLogin.bind(this,'qq')}>
          </div>
          <div
            className="third_icon_weibo"
            title="微博帐号登录"
            onClick={this.thirdLogin.bind(this,'weibo')}>
          </div>
          <LoginThirdWeiXin {...this.props}/>
        </div>
      </div>
    )
  }

  /**
   * 生命周期方法
   * 调用--获取第三方信息
   */
  componentDidMount() {

  }

  /**
   * 第三方登录跳转链接方式
   * @param type
   */
  thirdLogin(type) {
    //var f = this.props.location.query.f;
    //var urlR = this.props.location.query.r || '';
    //从qq相册传来的action参数
    //var urlAction = this.props.location.query.action;
    //event.preventDefault();
    let callbackUrl, url;
    //let preUrl = location.host;
    let preUrl = 'www.timeface.cn';

    let parseRedirectUrl = ParseURL(location.href, true);

    // 重定向地址添加登录类型
    let parseRedirectTypeUrl = parseRedirectUrl.set('query', Object.assign(parseRedirectUrl.query, {logintype: type}));

    callbackUrl = location.protocol + '//' + preUrl + '/thirdlogin?rurl=' + encodeURIComponent(parseRedirectTypeUrl);


    switch (type) {
      case 'qq':
        var id = '101006551';
        url = 'https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=' + id + '&scope=all&state=timeface' + '&redirect_uri=' + encodeURIComponent(callbackUrl);
        location.href = url;
        break;
      case 'weibo':
        url = 'https://api.weibo.com/oauth2/authorize?client_id=2889481671&scope=all&display=default' + '&redirect_uri=' + encodeURIComponent(callbackUrl);
        location.href = url;
        break;
    }
  }
}

export default LoginThird;