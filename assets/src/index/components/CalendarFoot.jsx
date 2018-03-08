/**
 * 文件说明:
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/10/8
 * 变更记录:
 */

import React from 'react'
import Cookies from 'cookies-js';
import LoginDialog from '../../common/LoginDialog.jsx';

class CalendarFoot extends React.Component {
  constructor(props) {
    super(props);
    this.imgList = [
      {img:require('./../image/calendar-foot-img1.jpg')},
      {img:require('./../image/calendar-foot-img2.jpg')},
      {img:require('./../image/calendar-foot-img3.jpg')},
      {img:require('./../image/calendar-foot-img4.jpg')},
      {img:require('./../image/calendar-foot-img5.jpg')},
      {img:require('./../image/calendar-foot-img6.jpg')}

    ];
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

    return (
      <div className="calendarFoot">
        <p className="calendarFootTitle">生活每个瞬间，都值得收藏</p>
        <p className="calendarFootTitle1">用最爱的照片 设计一年美好时光，套入照片就能定制，放在床头、办公桌，抬头就能看到的好心情。</p>
        <div className="calendarFootImgBox">
          <ul>
            {
              this.imgList.map((list,index)=>{
                return(
                  <li key={index}>
                    <img src={list.img}/>
                  </li>
                  )
              })
            }
          </ul>
        </div>
        <a className="calendarFooterBtn" onClick={this.createCalendar.bind(this)}>立即定制</a>
        <p className="calendarFooterIntro">集团采购及个性化定制中心电话：400-155-1399   QQ：3250053448    邮箱：hezuo@timeface.cn</p>
        <div className="fourBox">
          <div className="sixContent">
            <li>一秒排版，省心省力</li>
            <li>一键成书，不限内容数量</li>
            <li>一本起印，数量不限</li>
            <li>最快一天印成，全国配送</li>
          </div>
        </div>
      </div>
    );
  }
}

export default CalendarFoot;