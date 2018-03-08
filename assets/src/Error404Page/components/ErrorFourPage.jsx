/**
 * 文件说明: 404页面
 * 详细描述:
 * 创建者:   韩波
 * 创建时间: 2016/8/26
 * 变更记录:
 */
import React from 'react';
import '../style/ErrorFourPage.less';


class ErrorFourPage extends React.Component {
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
      <div className="error404Box">
        <div className="text404">
          <span className="text">咦！这一页被谁偷走啦！</span>
          <p className="error-words-404"><span className="error-words-4">{this.state.countdown}秒钟跳转到上一页，您也可以</span><a className="btnReturn" href="/">返回首页</a></p>
        </div>

      </div>
    )
  }
}
export default ErrorFourPage
