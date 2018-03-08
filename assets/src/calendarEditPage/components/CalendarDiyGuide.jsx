/**
 * 文件说明:
 * 详细描述:互动台历编辑新手引导
 * 创建者: 韩波
 * 创建时间: 2016/10/31
 * 变更记录:
 */

import React, {Component} from 'react';
require('../style/calendarGuide.less');

class CalendarDiyGuide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ratioWidth:screen.width < 1920 ? screen.height / 1080  *1.2: 1920 / 1920 *1.2,
      ratioHeight:screen.height <1080 ? screen.height / 1080 *1.2 : 1080 / 1080 *1.2
    };
    this.bubble = this.bubble.bind(this);
  }

  componentDidMount() {
    window.addEventListener('mousewheel', this.bubble);
  }

  bubble(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  toEnd() {
    window.removeEventListener('mousewheel', this.bubble);
    this.props.showDiyGuide();
  }


  render() {
    let step = require('../image/calendarFour.png');
    let imgStyle = {
      width:587 * this.state.ratioWidth,
      height:316 * this.state.ratioHeight
    };
    let btnStyle = {
      top: 172 * this.state.ratioWidth,
      left: 121 * this.state.ratioHeight,
      width: 90 * this.state.ratioWidth,
      height: 30 * this.state.ratioHeight
    };
    let boxStyle = {
      left:- 328 * this.state.ratioWidth + 70 * this.state.ratioWidth
    };

    return (
      <div>
        <div className="calendarGuideBoxStep4" style={boxStyle}>
          <img src={step} alt="" style={imgStyle}/>
          <span className="calendarGuideBoxStep4btn" style={btnStyle} onClick={this.toEnd.bind(this)}/>
        </div>
        <div className="calendarGuide"></div>
      </div>
    );
  }
}
export default CalendarDiyGuide;