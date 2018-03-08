/**
 * 文件说明:  500页面
 * 详细描述:
 * 创建者:   韩波
 * 创建时间: 2016/8/26
 * 变更记录:
 */
import React from 'react';
import '../style/ErrorFivePage.less';
class ErrorFivePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countdown: 5
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
        if(window.history.length<=1){
          window.location.href='/'
        }else{
          window.history.back()
        }
      }
    }, 1000);
  }
  render() {
    return (
      <div className="error500Box">
        <div className="errorCenter">
          <div className="error">
            <img src={require("../images/500face.png")} alt="时光流影"/>
          </div>
          <div className="error">
            <span className="error-words-500">纳尼！如此强大的系统居然遇到异常！</span>
            <span className="error-words-3">错误类型：500（服务器异常）</span>
            <p><span className="error-words-4">{this.state.countdown}秒钟跳转到上一页，您也可以</span><a className="btnReturn" href="/">返回首页</a></p>
          </div>
        </div>
      </div>
    )
  }
}
export default ErrorFivePage
