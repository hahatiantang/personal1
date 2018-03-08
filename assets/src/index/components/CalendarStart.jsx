/**
 * 文件说明:
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/10/9
 * 变更记录:
 */
import React from 'react'
import Cookies from 'cookies-js';
import LoginDialog from '../../common/LoginDialog.jsx';

class CalendarStart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ratioWidht:''
    }
  }

  componentDidMount(){
    this.setState({
      ratioWidht:screen.width < 1920 ? screen.width / 1920 : 1920 / 1920
    })
  }

  createCalendar() {
    let uid = Cookies('tf-uid');
    let token = Cookies('tf-token');
    if (uid && token) {
      this.props.handelOpen();
    } else {
      loginDialog.open({
        dispatch: this.props.dispatch,
        title: '请先登录'
      }, this._afterLoginedReport.bind(this));
    }
  }

  //登陆后的操作
  _afterLoginedReport() {
    this.props.handelOpen();
  }

  render () {
    let styleTop = {
      marginTop:80*this.state.ratioWidht
    };
    return (
      <div className="calendarStart">
        <div className="calendarStartBox">
          <img src={require('../image/calendar-start.jpg')} className="calendarStartImg"/>
          <div className="calendarStartBox1">
            <div className="calendarStartInBox">
              <img src={require('../image/calendar-logo.png')} style={styleTop}/>
              <p className="calendarStartP">你的案头镌刻流年</p>
              <div className="calendarStartIntro">
                <span>精选12张高清照片入册，自由选择版式</span><br/>
                <span>个性化定制纪念日，让陪伴更有意义</span><br/>
                <span>采用250g哑粉纸，美感极致</span>
              </div>
              <div className="calendarStartBtn" onClick={this.createCalendar.bind(this)}>
                立即体验
                <span style={{marginLeft:'5px'}}>></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CalendarStart;