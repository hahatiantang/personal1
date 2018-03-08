/**
 * 文件说明:
 * 详细描述:台历选择横板或竖版弹窗
 * 创建者: 韩波
 * 创建时间: 2017/9/27
 * 变更记录:
 */

import React from 'react';
import DialogBox from '../../common/DialogBox.jsx';
import '../style/calendarDifferent.less';
class CalendarDifferent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type:''
    }
  }

  componentWillReceiveProps(nextProps) {
    let flag = '';
    if(nextProps.flag == 3){
      flag = 235
    }else if(nextProps.flag == 2){
      flag = 232
    }
    this.setState({
      type:flag
    })
  }

  //选择台历类型
  handelChoose(flag){
    this.setState({
      type:flag
    })
  }

  //确认定制
  handConfirm(){
    location.href = '/calendar/edit?type='+this.state.type
  }

  handelClose(){
    this.setState({
      type:''
    });
    this.props.close();
  }

  render() {
    let hb,sb;
    if(this.props.flag == 2){
      hb = 227;
      sb = 232
    }else{
      hb = 234;
      sb = 235
    }
    return (
      <DialogBox
        {...this.props}
        open={this.props.open}
        close={this.handelClose.bind(this)}
        width={660}
        modal={true}
        hasFooter={false}
        title={this.props.flag == 2 ? '个性时光台历' : '炫动魔法台历'}
      >
        <div className="calendarDifferent">
          <div className="calendarDifferentImg">
            <div className="calendarDifferentImgRBox">
              <div className={this.props.flag == 2 ? 'calendarDifferentImgR' : 'calendarDifferentImgMR'} onClick={this.handelChoose.bind(this,hb)}></div>
              <p className="calendarDifferentIntroR">竖版{this.props.flag == 2 ? '时光' : '魔法'}台历</p>
              <p className="calendarDifferentPriceR">{this.props.flag == 2 ? '￥28.00' : '￥32.00'}</p>
              <div className="calendarDifferentRBox">
                <div className={this.state.type == hb ? 'differentRightRadio differentRadio' : 'differentRightRadio'}
                     onClick={this.handelChoose.bind(this,hb)}>
                </div>
                <span className={this.state.type == hb ? 'calendarDifferentNameR calendarDifferentName' : 'calendarDifferentNameR'}>竖板</span>
              </div>
            </div>
            <div className="calendarDifferentImgLBox">
              <div className={this.props.flag == 2 ? 'calendarDifferentImgL' : 'calendarDifferentImgML'} onClick={this.handelChoose.bind(this,sb)}></div>
              <p className="calendarDifferentIntroL">横版{this.props.flag == 2 ? '时光' : '魔法'}台历</p>
              <p className="calendarDifferentPriceL">{this.props.flag == 2 ? '￥28.00' : '￥32.00'}</p>
              <div className="calendarDifferentLBox">
                <div className={this.state.type == sb ? 'differentRadio differentLeftRadio' : 'differentLeftRadio'}
                     onClick={this.handelChoose.bind(this,sb)}>
                </div>
                <span className={this.state.type == sb ? 'calendarDifferentNameL calendarDifferentName' : 'calendarDifferentNameL'}>横板</span>
              </div>
            </div>
          </div>
          <button type="button" className="calendarDifferentBtn" disabled={!this.state.type} onClick={this.handConfirm.bind(this)}>立即定制</button>
        </div>
      </DialogBox>

    )
  }
}
export default CalendarDifferent;