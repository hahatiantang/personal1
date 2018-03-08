/**
 * 台历首页
 * */

import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import dialogMixin from '../../tools/dialogMixin';
import {ALERT_MESSAGE} from '../../redux/utils/actionsTypes';
import AlertMsgDialog from '../../common/AlertMsgDialog.jsx';
//import CalendarHead from './CalendarHead.jsx';
import CalendarStart from './CalendarStart.jsx';
import CalendarType from './CalendarType.jsx';
import CalendarStyle from './CalendarStyle.jsx';
import CalendarPhone from './CalendarPhone.jsx';
import CalendarFoot from './CalendarFoot.jsx';
import CalendarChoose from './CalendarChoose.jsx';
import Footer from '../../common/Footer.jsx';
import Header from '../../common/Header.jsx';
import './../style/index.less';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  handelOpen(){
    this.openDialog('CalendarChoose');
  }

  render () {

    return (
      <div className="calendarPage">
        {/*公共头部*/}
        <Header/>
        {/*首页顶部*/}
        {/*<CalendarHead {...this.props}/>*/}
        {/*产品展示*/}
        <CalendarStart {...this.props} handelOpen={this.handelOpen.bind(this)}/>
        {/*产品类型*/}
        <CalendarType {...this.props}/>
        {/*产品特点*/}
        <CalendarStyle/>
        {/*台历手机制作*/}
        <CalendarPhone/>
        {/*首页底部*/}
        <CalendarFoot {...this.props} handelOpen={this.handelOpen.bind(this)}/>
        {/*公共底部*/}
        <Footer/>
        {/*选择弹窗*/}
        <CalendarChoose
          open={this.state['CalendarChoose']}
          close={this.closeDialog.bind(this,'CalendarChoose')}/>
        {/* 提示弹窗组件 */}
        <AlertMsgDialog />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state
}
dialogMixin(App);
export default connect(mapStateToProps)(App);
