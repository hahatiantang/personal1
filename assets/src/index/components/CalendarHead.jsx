/**
 * 文件说明:
 * 详细描述:台历顶部
 * 创建者: 韩波
 * 创建时间: 2016/10/8
 * 变更记录:
 */

import React from 'react'
import Cookies from 'cookies-js';
class CalendarHead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid:''
    }
  }

  componentDidMount() {
    let uid = Cookies('tf-uid');
    let token = Cookies('tf-token');
    if (uid && token) {
      this.setState({
        uid: uid
      })
    }
  }

  createCalendar(flag) {
    let uid = Cookies('tf-uid');
    let token = Cookies('tf-token');
    if (uid && token) {
      //立即体验
      location.href = '/calendar/edit?type='+flag;
    } else {
      loginDialog.open({
        dispatch: this.props.dispatch,
        title: '请先登录'
      }, this._afterLoginedReport.bind(this,flag));
    }
  }

  _afterLoginedReport(flag){
    location.href = '/calendar/edit?type='+flag;
    let uid = Cookies('tf-uid');
    this.setState({
      uid:uid
    });
  }

  render () {

    return (
      <div className="calendarHead">
        <div className="calendarHeadBox">
          {!this.state.uid ?
            <div className="calendarHeadBoxS" onClick={this.createCalendar.bind(this,69)}>
              <p className="calendarHeadBoxSP">￥36.00</p>
              <img src={require('../image/calendar-sb.jpg')}/>
            </div>
            :
            <a className="calendarHeadBoxS" href="/calendar/edit?type=69">
              <p className="calendarHeadBoxSP">￥36.00</p>
              <img src={require('../image/calendar-sb.jpg')}/>
            </a>
          }
          {!this.state.uid ?
            <div className="calendarHeadBoxH" onClick={this.createCalendar.bind(this,70)}>
              <p className="calendarHeadBoxHP">￥28.00</p>
              <img src={require('../image/calendar-hb.jpg')}/>
            </div>
            :
            <a className="calendarHeadBoxH" href="/calendar/edit?type=70">
              <p className="calendarHeadBoxHP">￥28.00</p>
              <img src={require('../image/calendar-hb.jpg')}/>
            </a>
          }
          {!this.state.uid ?
            <div className="calendarHeadBoxS" onClick={this.createCalendar.bind(this,103)}>
              <p className="calendarHeadBoxSP">￥36.00</p>
              <img src={require('../image/calendar-sb.jpg')}/>
            </div>
            :
            <a className="calendarHeadBoxS" href="/calendar/edit?type=103">
              <p className="calendarHeadBoxSP">￥36.00</p>
              <img src={require('../image/calendar-sb.jpg')}/>
            </a>
          }
        </div>
      </div>
    );
  }
}

export default CalendarHead;
