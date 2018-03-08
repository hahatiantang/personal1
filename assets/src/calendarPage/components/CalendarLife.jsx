/**
 * 文件说明:
 * 详细描述:台历首页生活模块
 * 创建者: 韩波
 * 创建时间: 2017/8/15
 * 变更记录:
 */

import React from 'react'

class CalendarLife extends React.Component {
  constructor(props) {
    super(props);
  }

  //制作台历
  handelMakeOne(){
    this.props.createCalendar(1)
  }

  render () {
    let images = [
      require('../image/calendarLife1.jpg'),
      require('../image/calendarLife2.jpg'),
      require('../image/calendarLife3.jpg'),
      require('../image/calendarLife4.jpg'),
      require('../image/calendarLife5.jpg'),
      require('../image/calendarLife6.jpg'),
    ];

    return (
      <div className="calendarLife">
        <p className="calendarLifeTitle">生活每个瞬间，都值得收藏</p>
        <p className="calendarLifeIntro">用最爱的照片 设计一年美好时光，套入照片就能定制，放在床头、办公桌，抬头就能看到的好心情。</p>
        <p className="calendarLifeHeZuo">集团采购及个性化定制中心电话：400-155-1399   QQ：3250053448    邮箱：hezuo@timeface.cn</p>
        <div className="calendarLifeBox">
          <ul>{
            images.map((imgUrl,index)=>{
              return(
                <li key={index} className="calendarLifeBoxLi"><img src={imgUrl}/></li>
              )
            })
          }</ul>
        </div>
        <div className="calendarLifeBtn" onClick={this.handelMakeOne.bind(this)}>立即制作</div>
      </div>
    );
  }
}

export default CalendarLife;