/**
 * 文件说明:
 * 详细描述:台历首页banner
 * 创建者: 韩波
 * 创建时间: 2017/8/15
 * 变更记录:
 */

import React from 'react'

class CalendarBanner extends React.Component {
  constructor(props) {
    super(props);
  }

  //制作台历
  handelMakeOne(){
    this.props.createCalendar(1)
  }

  render () {

    return (
      <div className="calendarBanner">
        <div className="calendarBannerBtn" onClick={this.handelMakeOne.bind(this)}>立即制作</div>
      </div>
    );
  }
}

export default CalendarBanner;