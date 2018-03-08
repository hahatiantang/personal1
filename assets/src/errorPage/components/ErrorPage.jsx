/**
 * 文件说明: 错误页面
 * 详细描述:
 * 创建者:   韩波
 * 创建时间: 2016/8/26
 * 变更记录:
 */
import React, {Component} from 'react';
import '../style/error.less';
import URL from 'url';

class ErrorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countdown: 5,
      errorMsg:''
    }
  }
  componentDidMount(){
    let that = this;
    let timer = setInterval(function () {
      if (that.state.countdown > 1) {
        that.setState({
          countdown:that.state.countdown-1
        })
      } else {
        console.log('window.history',window.history);
        window.clearInterval(timer);
          window.location.href='/';
      }
    }, 1000);
    const queryObj = URL.parse(window.location.href, true).query || {};
    const errorMsg = queryObj['msg'] || '发生未知错误';
    this.setState({
      errorMsg
    })
  }
  render() {

    let errMsg = this.state.errorMsg;
    return (
      <div className="errorBox">
        <div className="errorCenter">
          <div className="error">
            <img src={require("../images/errorface.png")} alt="时光流影 时光流影_时光记事本"/>
          </div>
          <div className="error">
            <p>{errMsg}</p>
            <p><span className="error-words-4">{this.state.countdown}秒钟跳转到上一页，您也可以</span><a className="btnReturn" href="/">返回首页</a></p>
          </div>
        </div>
      </div>
    )
  }
}

export default ErrorPage