/**
 * 文件说明:
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/10/18
 * 变更记录:
 */

import React, { PropTypes } from 'react'
import PodPrevew from './PodPrevew.jsx';
class PodBookContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex:0,
      side:true,
      ratioWidht:screen.width < 1920 ? screen.height / 1080  *1.2: 1920 / 1920 *1.2,
      ratioHeight:screen.height <1080 ? screen.height / 1080 *1.2 : 1080 / 1080 *1.2
    }
  }

  //正反面
  handSide(flag){
    if(this.state.side == flag){
      return
    }
    let index = this.state.currentIndex;
    let preStore = this.props.podStore.content_list;
    if(flag){
      if(preStore[index].content_type == 6){
        index = 0
      }else{
        index = index - 1
      }
    }else{
      if(preStore[index].content_type == 3){
        return
      }else{
        index = index + 1
      }
    }
    this.setState({
      side:flag,
      currentIndex:index
    })
  }

  handelLeftTight(flag){
    let index = this.state.currentIndex;
    let preStore = this.props.podStore.content_list;
    if(this.state.side){
      if(flag == 'right'){
        if(preStore[index].content_type == 3){
          index = index + 1
        }else{
          index = index + 2
        }
      }else{
        if(index == 1){
          index = index - 1
        }else{
          index = index - 2
        }
      }
    }else{
      if(flag == 'right'){
        if(index == 25){
          index = 2
        }else{
          index = index + 2
        }
      }else{
        if(index == 2){
          index = 25
        }else{
          index = index - 2
        }
      }
    }
    this.setState({
      currentIndex:index
    })
  }

  componentDidMount() {
    //添加键盘事件
    window.addEventListener('keyup', this.handleKeyPress.bind(this));
  }

  componentWillUnmount(){
    window.removeEventListener('keyup', this.handleKeyPress.bind(this));
  }

  handleKeyPress(e){
    const LEFT_KEYCODE = 37;
    const RIGHT_KEYCODE = 39;
    if(e.keyCode == LEFT_KEYCODE){
      if(this.state.currentIndex == 0 || this.state.currentIndex == 25){
        return
      }
    }else if(e.keyCode == RIGHT_KEYCODE){
      if(this.state.currentIndex == 23 || this.state.currentIndex == 24){
        return
      }
    }
    switch (e.keyCode) {
      case LEFT_KEYCODE:
        this.handelLeftTight('left');
        break;
      case RIGHT_KEYCODE:
        this.handelLeftTight('right');
        break;
    }
  }

  render () {
    let podStore = this.props.podStore || {};
    let prevStore = podStore.content_list || [];
    let bookStyle = {
      book_width:podStore.book_width,
      book_height:podStore.book_height,
      content_width:podStore.content_width,
      content_height:podStore.content_height,
      content_padding_left:podStore.content_padding_left,
      content_padding_top:podStore.content_padding_top
    };
    let imgHead = {
      width:bookStyle.book_width * this.state.ratioWidht - 20
    };
    //横版台历
    let bookType = false;
    if(bookStyle.book_width > bookStyle.book_height){
      bookType = true;
    }
    let magicType = [234,235];
    let magicCalendar = false;
    if(magicType.indexOf(podStore.book_type) > -1){
      magicCalendar = true
    }
    return (
      <div className="podBookContent">
        <div className="podBookContentBtnBox">
          <ul>
            <li className={this.state.side ? '' : 'firstActive'} onClick={this.handSide.bind(this,true)}>{this.state.currentIndex == 0 || this.state.currentIndex == 25 ? '封面' : '正面'}</li>
            <li className={this.state.side ? 'lastActive' : ''} style={{cursor :this.state.currentIndex == 0 ? 'no-drop' : 'pointer'}} onClick={this.handSide.bind(this,false)}>{this.state.currentIndex == 0 || this.state.currentIndex == 25 ? '封底' : '反面'}</li>
          </ul>
        </div>
        <div className="podBookContentBox">
          <div className="podBookContentPre">
            <div className="podBookContentBox0" style={{top:bookType ? '-12px' : '-8px'}}>
              <img src={require('../image/pod_head.png')} style={imgHead}/>
            </div>
            <ul>
              <PodPrevew
                pageStore={prevStore[this.state.currentIndex]}
                bookStyle={bookStyle}
                magicCalendar={magicCalendar}
                currentIndex={this.state.currentIndex}
                handelVideo={this.props.handelVideo}
              />
            </ul>
            {this.state.currentIndex == 0 || this.state.currentIndex == 2 ? null : <div className="prev_left" onClick={this.handelLeftTight.bind(this,'left')}></div>}
            {this.state.currentIndex == 23 || this.state.currentIndex == 24 ? null : <div className="prev_right" onClick={this.handelLeftTight.bind(this,'right')}></div>}
          </div>
        </div>
      </div>
    );
  }
}

export default PodBookContent;