/**
 * 文件说明:
 * 详细描述:时光台历2018首页面
 * 创建者: 韩波
 * 创建时间: 2017/8/15
 * 变更记录:
 */

import React, { PropTypes } from 'react'
import {connect} from 'react-redux';
import dialogMixin from '../../tools/dialogMixin';
import Cookies from 'cookies-js';
import AlertMsgDialog from '../../common/AlertMsgDialog.jsx';
import CalendarChoose from './../../index/components/CalendarChoose.jsx';
import CalendarDifferent from './CalendarDifferent.jsx';
import CalendarBanner from './CalendarBanner.jsx';
import CalendarMakeType from './CalendarMakeType.jsx';
import CalendarMakeApp from './CalendarMakeApp.jsx';
import CalendarLife from './CalendarLife.jsx';
import Footer from '../../common/Footer.jsx';
import Header from '../../common/Header.jsx';
import LoginDialog from '../../common/LoginDialog.jsx';
import '../style/calendarPage.less';

class CalendarPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag:''
    }
  }

  createCalendar(type) {
    let uid = Cookies('tf-uid');
    let token = Cookies('tf-token');
    if (uid && token) {
      this._afterLoginedReport(type);
    } else {
      loginDialog.open({
        dispatch: this.props.dispatch,
        title: '请先登录'
      }, this._afterLoginedReport.bind(this,type));
    }
  }

  //登陆后的操作
  _afterLoginedReport(type) {
    if(type == 1){
      this.openDialog('CalendarChoose');
    }else{
      this.setState({
        flag:type
      },()=>{
        this.openDialog('CalendarDifferent');
      })
    }
  }

  render () {

    return (
      <div className="calendarNewPage">
        {/*公共头部*/}
        <Header/>
        {/*首页顶部*/}
        <CalendarBanner createCalendar={this.createCalendar.bind(this)}/>
        {/*产品类型*/}
        <CalendarMakeType createCalendar={this.createCalendar.bind(this)}/>
        {/*台历手机制作*/}
        <CalendarMakeApp/>
        {/*首页底部*/}
        <CalendarLife createCalendar={this.createCalendar.bind(this)}/>
        {/*公共底部*/}
        <Footer/>
        {/*选择弹窗*/}
        <CalendarChoose
          open={this.state['CalendarChoose']}
          close={this.closeDialog.bind(this,'CalendarChoose')}/>
        <CalendarDifferent
          open={this.state['CalendarDifferent']}
          flag={this.state.flag}
          close={this.closeDialog.bind(this,'CalendarDifferent')}/>
        <AlertMsgDialog/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state
}
dialogMixin(CalendarPage);
export default connect(mapStateToProps)(CalendarPage);
