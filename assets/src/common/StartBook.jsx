/**
 * 文件说明: 选择模板组件
 * 详细描述:
 * 创建者:   卢淮建
 * 创建时间: 15/11/24
 * 变更记录:
 */

import React from 'react';
import config from '../../../config.js';
import dialogMixin from '../tools/dialogMixin';
import './less/StartBookStyle.less';
import closePng from './images/startBook/icon_close.png';
import timePng from './images/startBook/icon_time_book.jpg';
import webchatPng from './images/startBook/icon_webchat_book.jpg';
import photoPng from './images/startBook/icon_photo_book.jpg';
import qqPng from './images/startBook/icon_qq_book.jpg';
import blogPng from './images/startBook/icon_blog_book.jpg';
import weiboPng from './images/startBook/icon_wb_book.png';
import calendarPng from './images/startBook/icon_time_calendar.jpg';
import noteBookPng from './images/startBook/icon_note_book.jpg';
import photographyPng from './images/startBook/icon_graphy_book.png';
import CalendarChoose from '../index/components/CalendarChoose.jsx';

class StartBookDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      showStart: true,
      starFlag: false
    }
  }

  handelOpen(){
    this.openDialog('CalendarChoose');
  }

  starDialog(flag){
    this.setState({
      starFlag: flag
    })
  }

  render() {

    return (
      <div className="startBookWarp" style={{display: this.state.starFlag?'block':'none'}}>
        {this.state.showStart?<div className="startContent">
          <span className="closeBtn" src={closePng} onClick={()=>this.starDialog(false)}/>
          <span className="startTitle">请选择制作的类型：</span>
          <div className="startSelected">
            <h3>制作时光书：</h3>
            <ul>
              <li onClick={()=>window.location.href='/timebook/jd'} style={{width:'146px',margin:'0 10px 0 5px'}}>
                <img src={timePng} />
                <span>记录时光一键成书</span>
              </li>
              <li onClick={()=>window.location.href='/photobook'} style={{width:'152px'}}>
                <img src={photoPng} />
                <span>照片汇集成书</span>
              </li>
              <li onClick={()=>window.location.href='/photography'} style={{width:'152px',marginTop:'20px'}}>
                <img src={photographyPng} style={{height:'107px'}}/>
                <span style={{display:'block',paddingTop:'14px'}}>摄影集大片成册</span>
              </li>
              <li onClick={()=>window.location.href='/weixin'} style={{width:'196px'}}>
                <img src={webchatPng} />
                <span>微信相册导入成书</span>
              </li>
              <li onClick={()=>window.location.href='/qzone'} style={{width:'137px'}}>
                <img src={qqPng} />
                <span>QQ相册印制成书</span>
              </li>
              <li onClick={()=>window.location.href='/blog'} style={{width:'132px'}}>
                <img src={blogPng} />
                <span>博客导入成书</span>
              </li>
            </ul>
            <div style={{clear:'both'}}></div>
            <h3>制作个性印品：</h3>
            <ul>
              <li onClick={()=>window.location.href='/notebook/edit'} style={{width:'94px',margin:'0 20px 0 45px'}}>
                <img src={noteBookPng} />
                <span>时光记事本</span>
              </li>
              <li onClick={()=>this.handelOpen()} style={{width:'159px'}}>
                <img src={calendarPng} style={{height:'134px'}}/>
                <span style={{display:'block',paddingTop:'7px'}}>时光台历</span>
              </li>
              <div style={{clear:'both'}}></div>
            </ul>
          </div>
          <div className="record"><img src={require("./images/startBook/recordPic.png")}/>暂时还没想好做什么书，<a href='/recordTime' target="_self">先去记录内容>></a> </div>
        </div>:null}
        <CalendarChoose
          open={this.state['CalendarChoose']}
          close={this.closeDialog.bind(this,'CalendarChoose')}/>
      </div>
    )
  }

}
dialogMixin(StartBookDialog);
export default StartBookDialog;