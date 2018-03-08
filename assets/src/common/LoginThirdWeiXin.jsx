import React from 'react';
import classNames from 'classnames';
import ParseURL from 'url-parse';
let classNamesBind = require('classnames/bind');


import './less/loginForm.less';

class LoginThirdWeiXin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      //设置显示二维码id
      barcodeId: '',
      //微信显示框不显示
      isShowWxBox: false
    }
  }


  /**
   * weixin框鼠标滑过隐藏
   */
  _hideBarcode() {
    this.setState({
      isShowWxBox: false
    })
  }


  /**
   * weixin登录框显示
   */
  _showWxBarcode() {
    this.setState({
      isShowWxBox: true
    })
  }


  /**
   * weixin加载js方法
   */
  initial() {

    this.setState({
      barcodeId: 'weixin' + Date.now()
    });
    var js = document.createElement('script');
    js.onload = this.initialCallBack.bind(this);
    js.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js';
    document.body.appendChild(js);
  }

  /**
   *weixin传递的参数方法
   */
  initialCallBack() {
    //设置显示二维码id
    let barcodeId = this.state.barcodeId;

    // 重定向地址添加登录类型
    let host = location.host.indexOf('timeface') >= 0 ? 'www.timeface.cn' : 'www.timeface.cn';
    let parseRedirectUrl = ParseURL(location.href, true);
    let parseRedirectTypeUrl = parseRedirectUrl.set('query', Object.assign(parseRedirectUrl.query, {
      logintype: 'weixin'
    }));
    let callbackUrl = location.protocol + '//' + host + '/thirdlogin?rurl=' + encodeURIComponent(parseRedirectTypeUrl);

    //weixin传递的参数
    var weixinObj = new WxLogin({
      id: barcodeId,
      appid: 'wx59614bdff7202183',
      scope: 'snsapi_login',
      redirect_uri: encodeURIComponent(callbackUrl)
    });
  }


  /**
   * 生命周期方法
   */
  componentDidMount() {
    //调用微信js方法
    this.initial();
  }

  render() {

    // use css modules
    let cxStyle = classNamesBind.bind({
      normal: "tfBarcode",
      show:"tfBarcodeShow"
    });
    let barcodeCls = cxStyle({
      normal: true,
      show: this.state.isShowWxBox
    });


    return (
      <div className="third_icon_weixin"
           title="微信帐号登录"
           onClick={this._showWxBarcode.bind(this)}>
        <div id={this.state.barcodeId}
             className={barcodeCls}
             onMouseLeave={this._hideBarcode.bind(this)}></div>
      </div>
    )
  }
}

export default LoginThirdWeiXin;