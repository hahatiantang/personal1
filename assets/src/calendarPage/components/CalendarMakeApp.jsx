/**
 * 文件说明:
 * 详细描述:手机制作
 * 创建者: 韩波
 * 创建时间: 2017/8/15
 * 变更记录:
 */

import React from 'react'

class CalendarMakeApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {

    return (
      <div className="calendarMakeApp">
        <p className="calendarMakeAppTitle">手机制作更方便</p>
        <p className="calendarMakeAppIntro">
          扫描以下二维码，关注“时光流影”微信公众号或者下载时光流影客户端，手机也可制作，快捷方便
        </p>
        <div className="calendarMakeAppBox">
          <div className="calendarMakeAppQR">
            <div className="calendarMakeAppQRP">
              <img src={require('../image/pic_qrcord_phone.jpg')} className="calendarMakeAppQRImg"/>
              <p className="calendarMakeAppQRFont">时光流影客户端</p>
            </div>
            <div className="calendarMakeAppQRP">
              <img src={require('../image/pic_qrcode.jpg')} className="calendarMakeAppQRImg"/>
              <p className="calendarMakeAppQRFont">时光流影公众号</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CalendarMakeApp;
