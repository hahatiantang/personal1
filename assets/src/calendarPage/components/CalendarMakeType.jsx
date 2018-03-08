/**
 * 文件说明:
 * 详细描述:台历分类
 * 创建者: 韩波
 * 创建时间: 2017/8/16
 * 变更记录:
 */

import React from 'react'

class CalendarMakeType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type:1
    }
  }

  //选择类型
  handelChooseType(flag){
    if(this.state.type == flag){
      return
    }
    this.setState({
      type:flag
    })
  }

  //选择台历
  handelChoose(e,type){
    e.stopPropagation();
    this.props.createCalendar(type)
  }

  //了解详情
  handelLinkDetail(e){
    e.stopPropagation();
  }

  render () {
    let imgList = [];
    if(this.state.type == 1){
      imgList = [
        require('../image/calendar_single1.jpg'),
        require('../image/calendar_single2.jpg'),
        require('../image/calendar_single3.jpg')
      ]
    }else{
      imgList = [
        require('../image/calendar_magic1.jpg'),
        require('../image/calendar_magic2.jpg'),
        require('../image/calendar_magic3.jpg')
      ]
    }
    return (
      <div className="calendarMakeType">
        <div className="calendarMakeHead">
          <div className={this.state.type == 1 ? "headerBoxWidth calendarMakeHeadBox calendarMakeHeadAct" : "headerBoxWidth calendarMakeHeadBox"} onClick={this.handelChooseType.bind(this,1)}>
            <div className="calendarMakeHeadSingleImg">
              <img src={require('../image/calendarSingle.jpg')} />
            </div>
            <div className={this.state.type == 1 ? "calendarMakeHeadSingleFont calendarNewFont" : "calendarMakeHeadSingleFont"}>
              <p className="calendarMakeHeadSingleH">个性时光台历</p>
              <p>双面印刷，十二个月惊喜不断</p>
              <p>爱他就送他三百六十五天的陪伴吧</p>
              <p>横竖双板，随心选择</p>
              <p className={this.state.type == 1 ? '' : 'calendarPrice'}>
                原价：
                <span className="calendarPriceO">￥58.00</span>
                <span className="calendarMakeHeadSingleS">￥28.00</span>
              </p>
              <div onClick={(e)=>this.handelChoose(e,2)} className={this.state.type == 1 ? 'calendarPriceB calendarPriceBtn' : 'calendarPriceBtn'}>立即制作</div>
            </div>
          </div>
          <div className={this.state.type == 2 ? "headerBoxWidthM calendarMakeHeadBox calendarMakeHeadAct" : "headerBoxWidthM calendarMakeHeadBox"} onClick={this.handelChooseType.bind(this,2)}>
            <div className="calendarMakeHeadMagicImg">
              <img src={require('../image/calendarMagic.jpg')} />
            </div>
            <div className={this.state.type == 2 ? "calendarMakeHeadSingleFont calendarNewFont" : "calendarMakeHeadSingleFont"}>
              <p className="calendarMakeHeadSingleH">炫动魔法台历</p>
              <p>用时光流影“扫一扫”</p>
              <p>炫酷封面马上实现</p>
              <p>让您的封面“动”起来，仿佛置身魔法世界</p>
              <p className={this.state.type == 2 ? '' : 'calendarPrice'}>
                原价：
                <span className="calendarPriceO">￥62.00</span>
                <span className="calendarMakeHeadSingleS">￥32.00</span>
              </p>
              <div onClick={(e)=>this.handelChoose(e,3)} className={this.state.type == 2 ? 'calendarPriceB calendarPriceBtn' : 'calendarPriceBtn'}>立即制作</div>
              <a onClick={(e)=>this.handelLinkDetail(e)} className="calendarPriceBtn calendarPriceA" href="/calendar/magic" target="_blank">了解详情</a>
            </div>
          </div>
        </div>
        <div className="calendarMakeBody">
          <ul>{
            imgList.map((typeImg,index) => {
              let imgHtml = <li key={index} className="calendarMakeLi"><img src={typeImg}/></li>;
              if(this.state.type == 2 && index == 0){
                imgHtml = <li key={index} className="calendarMakeLi">
                  <video preload="auto" autoPlay="autoplay" width="100%" height="100%" loop="loop" poster={typeImg}>
                    <source src='http://img1.timeface.cn/video/magicVideo.mp4' type="video/mp4"/>
                    Your browser does not support the video tag.
                  </video>
                </li>
              }
              return(
                imgHtml
              )
            })
          }</ul>
        </div>
      </div>
    );
  }
}

export default CalendarMakeType;