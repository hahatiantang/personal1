/**
 * 文件说明:
 * 详细描述:魔法台历了解详情
 * 创建者: 韩波
 * 创建时间: 2017/9/27
 * 变更记录:
 */

import React, { PropTypes } from 'react'
import {connect} from 'react-redux';
import dialogMixin from '../../tools/dialogMixin';
import Cookies from 'cookies-js';
import AlertMsgDialog from '../../common/AlertMsgDialog.jsx';
import CalendarDifferent from '../../calendarPage/components/CalendarDifferent.jsx';
import Header from '../../common/Header.jsx';
import LoginDialog from '../../common/LoginDialog.jsx';
import '../style/magicDetailPage.less';

class MagicDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag:''
    }
  }

  createCalendar() {
    let uid = Cookies('tf-uid');
    let token = Cookies('tf-token');
    if (uid && token) {
      this._afterLoginedReport();
    } else {
      loginDialog.open({
        dispatch: this.props.dispatch,
        title: '请先登录'
      }, this._afterLoginedReport.bind(this));
    }
  }

  //登陆后的操作
  _afterLoginedReport() {
    this.setState({
      flag:3
    },()=>{
      this.openDialog('CalendarDifferent');
    })
  }

  render () {

    return (
      <div className="magicDetailPage">
        {/*公共头部*/}
        <Header/>

        <p className="magicDetailPageHead">魔法台历，会“动”的台历</p>

        <div className="magicDetailBox">
          <div className="magicDetailPageImgBox">
            <video preload="auto" autoPlay="autoplay" width="100%" height="100%" loop="loop" poster={require('../image/magic_show.jpg')}>
              <source src='http://img1.timeface.cn/video/magicVideo.mp4' type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="magicDetailBoxFont1">魔法台历的与众不同之处就是当你拿出手机打开时光流影，对准台历的封面，点击首页上的扫一扫之后——照片变成了能动的视频！</p>
          <p className="magicDetailBoxFont2">要制作这样的魔法台历也非常的简单</p>
          <p className="magicDetailBoxFont1">step1.上传一个您喜欢的视频，为了保证您的显示效果最好是高清视频。</p>
          <div className="magicDetailPageImgOne"></div>
          <p className="magicDetailBoxFont3">step2.根据提示完成制作，直接下单就可以啦。</p>
          <div className="magicDetailPageImgTwo"></div>
          <p className="magicDetailBoxFont4">收到台历后，使用时光流影APP扫一扫功能对准封面二维码扫描，再将取景框对准整个封面就可以看到动起来的封面啦。</p>
          <div className="magicDetailQrBox">
            <img src={require('../image/magic_show_three.jpg')}/>
            <p className="magicDetailBoxFont5">扫一扫&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下载时光流影APP</p>
          </div>
          <div className="magicDetailMake" onClick={this.createCalendar.bind(this)}>立即制作</div>
        </div>
        {/*选择弹窗*/}
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
dialogMixin(MagicDetailPage);
export default connect(mapStateToProps)(MagicDetailPage);
