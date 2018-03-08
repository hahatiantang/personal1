/**
 * 文件说明:
 * 详细描述: 台历手机制作
 * 创建者: 韩波
 * 创建时间: 2016/10/8
 * 变更记录:
 */

import React from 'react'

class CalendarPhone extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {

    return (
      <div className="calendarPhone">
        <div className="calendarPhoneLeft"></div>
        <div className="calendarPhoneRight">
          <div className="calendarPhoneBox">
            <p className="calendarPhoneTitle">手机制作更方便</p>
            <p className="calendarPhoneIntro">
              <span>扫描以下二维码，关注“<span style={{color:'#039ae3'}}>时光流影</span>”微信公众号</span><br/>
              <span>或者下载时光流影客户端，手机也可制作，快捷方便</span>
            </p>
            <div className="calendarPhoneQR">
              <div className="calendarPhoneQRP">
                <img src={require('../image/calendar-phone-p.png')}/>
                <p>下载手机客户端</p>
              </div>
              <div className="calendarPhoneQRW">
                <img src={require('../image/calendar-phone-w.png')}/>
                <p>关注官方公众号</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CalendarPhone;
