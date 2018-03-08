/**
 * 文件说明:
 * 详细描述:台历选择横板或竖版弹窗
 * 创建者: 韩波
 * 创建时间: 2016/10/10
 * 变更记录:
 */

import React from 'react';
import DialogBox from '../../common/DialogBox.jsx';
import '../style/calendarChoose.less';
class CalendarChoose extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type:232
    }
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
      type:232
    });
    this.props.close();
  }
  
  render() {
    return (
      <DialogBox {...this.props}
        open={this.props.open}
        close={this.handelClose.bind(this)}
        width={880}
        modal={true}
        hasFooter={false}
        title={'选择版式'}
      >
        <div className="calendarChoose">
          <div className="calendarChooseImg">
            <div className="calendarChooseBox">
              <div className="calendarChooseBoxFont">
                <span className="calendarChooseBoxFontLine"/>
                <span className="calendarChooseBoxFontS">个性时光台历</span>
              </div>
              <div className="calendarChooseImgRBox">
                <div className="calendarChooseImgR" onClick={this.handelChoose.bind(this,227)}></div>
                <p className="calendarChooseIntroR">竖版时光台历</p>
                <p className="calendarChoosePriceR">￥28.00</p>
                <div className="calendarChooseRBox">
                  <div className={this.state.type == 227 ? 'chooseRightRadio chooseRadio' : 'chooseRightRadio'}
                       onClick={this.handelChoose.bind(this,227)}>
                  </div>
                  <span className={this.state.type == 227 ? 'calendarChooseNameR calendarChooseName' : 'calendarChooseNameR'}>竖板</span>
                </div>
              </div>
              <div className="calendarChooseImgLBox">
                <div className="calendarChooseImgL" onClick={this.handelChoose.bind(this,232)}></div>
                <p className="calendarChooseIntroL">横版时光台历</p>
                <p className="calendarChoosePriceL">￥28.00</p>
                <div className="calendarChooseLBox">
                  <div className={this.state.type == 232 ? 'chooseLeftRadio chooseRadio' : 'chooseLeftRadio'}
                       onClick={this.handelChoose.bind(this,232)}>
                  </div>
                  <span className={this.state.type == 232 ? 'calendarChooseNameL calendarChooseName' : 'calendarChooseNameL'}>横板</span>
                </div>
              </div>
            </div>
            <div className="calendarChooseBoxLine"></div>
            <div className="calendarChooseBox">
              <div className="calendarChooseBoxFont">
                <span className="calendarChooseBoxFontLine"/>
                <span className="calendarChooseBoxFontS">炫动魔法台历</span>
              </div>
              <div className="calendarChooseImgRBox">
                <div className="calendarChooseImgMR" onClick={this.handelChoose.bind(this,234)}></div>
                <p className="calendarChooseIntroR">竖版魔法台历</p>
                <p className="calendarChoosePriceR">￥32.00</p>
                <div className="calendarChooseRBox">
                  <div className={this.state.type == 234 ? 'chooseRightRadio chooseRadio' : 'chooseRightRadio'}
                       onClick={this.handelChoose.bind(this,234)}>
                  </div>
                  <span className={this.state.type == 234 ? 'calendarChooseNameR calendarChooseName' : 'calendarChooseNameR'}>竖板</span>
                </div>
              </div>
              <div className="calendarChooseImgLBox">
                <div className="calendarChooseImgML" onClick={this.handelChoose.bind(this,235)}></div>
                <p className="calendarChooseIntroL">横版魔法台历</p>
                <p className="calendarChoosePriceL">￥32.00</p>
                <div className="calendarChooseLBox">
                  <div className={this.state.type == 235 ? 'chooseLeftRadio chooseRadio' : 'chooseLeftRadio'}
                       onClick={this.handelChoose.bind(this,235)}>
                  </div>
                  <span className={this.state.type == 235 ? 'calendarChooseNameL calendarChooseName' : 'calendarChooseNameL'}>横板</span>
                </div>
              </div>
            </div>
          </div>
          <button type="button" className="calendarChooseBtn" disabled={!this.state.type} onClick={this.handConfirm.bind(this)}>立即定制</button>
        </div>
      </DialogBox>

    )
  }
}
export default CalendarChoose;