/**
 * 文件说明:
 * 详细描述:台历产品特点
 * 创建者: 韩波
 * 创建时间: 2016/10/8
 * 变更记录:
 */

import React from 'react'

class CalendarStyle extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {

    return (
      <div className="calendarStyle">
        <p className="calendarStyleTitle">产品特点</p>
        <div className="styleImage">
          <img src={require('../image/calendar-style.jpg')} className="calendarStyleImg"/>
          <div className="styleImageIntro1">
            <p className="styleImage1P">自定义照片、个性定制纪念日</p>
            <p className="styleImage1p1">
              <span>精选12张高清照片入册</span><br/>
              <span>一键生成台历，可自由选择照片版式</span><br/>
              <span>定义每一个值得铭记的日子</span>
            </p>
          </div>
          <div className="styleImageIntro2">
            <p className="styleImage2P">优选双铜纸，色彩鲜艳亮丽</p>
            <p className="styleImage2p1">
              <span>印刷深得我心，书写无愧我意</span>
            </p>
          </div>
          <div className="styleImageIntro3">
            <p className="styleImage3P">采用经典白色双线铁圈360度装订</p>
            <p className="styleImage3p1">
              <span>这一年的记忆，怎可轻易损毁？</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default CalendarStyle;