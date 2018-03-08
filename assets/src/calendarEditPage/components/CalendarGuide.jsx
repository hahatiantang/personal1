/**
 * 文件说明:
 * 详细描述:台历编辑新手引导
 * 创建者: 韩波
 * 创建时间: 2016/10/31
 * 变更记录:
 */

import React, {Component} from 'react';
require('../style/calendarGuide.less');

class CalendarGuide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step1: true,
      step2: false,
      step3: false
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

  //第一步到第二步
  toStep2() {
    this.setState({
      step1: false,
      step2: true
    })
  }

  //第二步到第三步
  toStep3() {
    this.setState({
      step2: false,
      step3: true
    })
  }

  toEnd() {
    window.removeEventListener('mousewheel', this.bubble);
    this.props.showGuide();
  }


  render() {
    let step1 = require('../image/calendarFirst.png');
    let step2 = require('../image/calendarSecond.png');
    let step3 = require('../image/calendarThird.png');

    return (
      <div>
        {this.state.step1 ?
          <div className="calendarGuideBoxStep1">
            <img src={step1} alt=""/>
            <span className="calendarGuideBoxStep1btn" onClick={this.toStep2.bind(this)}/>
          </div> : null }
        {this.state.step2 ?
          <div className="calendarGuideBoxStep2">
            <img src={step2} alt=""/>
            <span className="calendarGuideBoxStep2btn" onClick={this.toStep3.bind(this)}/>

          </div> : null }
        {this.state.step3 ?
          <div className="calendarGuideBoxStep3">
            <img src={step3} alt=""/>
            <span className="calendarGuideBoxStep3btn" onClick={this.toEnd.bind(this)}/>
          </div> : null }
        <div className="calendarGuide"></div>
      </div>
    );
  }
}
export default CalendarGuide;