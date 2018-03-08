/**
 * 文件说明:
 * 详细描述:台历产品类型
 * 创建者: 韩波
 * 创建时间: 2016/10/8
 * 变更记录:
 */

import React from 'react'
import Cookies from 'cookies-js';
class CalendarType extends React.Component {
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
      <div className="calendarType">
        <p className="calendarTypeTitle">产品类型</p>
        <div className="calendarTypeIntroBox">
          <div className="calendarTypeHb">
            <div className="calendarTypeHbBox">
              <p className="calendarTypeHbT">横款双面台历</p>
              <p className="calendarTypeHbI">
                <span>双面印刷，12个月温馨满满</span><br/>
                <span>亦是幸福、亦是爱恋、</span><br/>
                <span>亦是温暖，常伴无须多言</span><br/>
                <span>宽230mm X 高165mm</span>
              </p>
              <p className="calendarTypeHbPrice">￥36.00</p>
              {!this.state.uid ?
              <a className="calendarTypeLeftBtn" onClick={this.createCalendar.bind(this,69)}>
                立即体验
                <span style={{marginLeft:'5px'}}>></span>
              </a>:
              <a className="calendarTypeLeftBtn" href="/calendar/edit?type=69">
                立即体验
                <span style={{marginLeft:'5px'}}>></span>
              </a>}
            </div>
            <div className="calendarTypeHbImg"></div>
          </div>
          <div className="calendarTypeSb">
            <div className="calendarTypeSbBox">
              <p className="calendarTypeSbT">竖款双面台历</p>
              <p className="calendarTypeSbI">
                <span>双面印刷，12个月惊喜不断</span><br/>
                <span>如同相册、如同剪影、</span><br/>
                <span>如同生活、陪伴365天</span><br/>
                <span>宽150mm X 高205mm</span>
              </p>
              <p className="calendarTypeSbPrice">￥28.00</p>
              {!this.state.uid ?
                <a className="calendarTypeRightBtn" onClick={this.createCalendar.bind(this,70)}>
                  立即体验
                  <span style={{marginLeft:'5px'}}>></span>
                </a>:
                <a className="calendarTypeRightBtn" href="/calendar/edit?type=70">
                  立即体验
                  <span style={{marginLeft:'5px'}}>></span>
                </a>}
            </div>
            <div className="calendarTypeSbImg"></div>
          </div>
          <div className="calendarTypeDiy">
            <div className="calendarTypeDiyBox">
              <p className="calendarTypeDiyT">DIY拼图台历</p>
              <p className="calendarTypeDiyI">
                <span>有趣场景切换</span><br/>
                <span>大头贴拼图</span><br/>
                <span>每月都与喜欢的TA面对面</span><br/>
                <span>宽230mm X 高165mm</span>
              </p>
              <p className="calendarTypeDiyPrice">￥36.00</p>
              {!this.state.uid ?
                <a className="calendarTypeDiyBtn" onClick={this.createCalendar.bind(this,103)}>
                  立即体验
                  <span style={{marginLeft:'5px'}}>></span>
                </a>:
                <a className="calendarTypeDiyBtn" href="/calendar/edit?type=103">
                  立即体验
                  <span style={{marginLeft:'5px'}}>></span>
                </a>}
            </div>
            <div className="calendarTypeDiyImg"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default CalendarType;