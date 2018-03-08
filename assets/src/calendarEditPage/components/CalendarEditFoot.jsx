/**
 * 文件说明:
 * 详细描述:台历编辑底部模块
 * 创建者: 韩波
 * 创建时间: 2016/10/9
 * 变更记录:
 */

import React from 'react'
import DropZone from 'react-dropzone';
class CalendarEditFoot extends React.Component {
  constructor(props) {
    super(props);
  }

  //保存功能
  handelSave() {
    this.props.handStore('save','');
  }

  //完成功能
  handelFinish(){
    this.props.handStore('finish','');
  }

  //上一步  下一步
  handelChangeStep(flag){
    if(flag){
      this.props.handelNextPrev(this.props.tempStep + 1)
    }else{
      this.props.handelNextPrev(this.props.tempStep - 1)
    }
  }

  //完成
  handelFinishMagic(flag){
    this.props.handleShowMagic(flag)
  }

  //上传视频
  onDrop(file){
    this.props.handelUploadVideo(file)
  }

  //上传封面
  onDropImg(file){
    this.props.handleMagicDrop(file)
  }

  //预览视频
  handelViewVideo(){
    this.props.handelVideo(true)
  }

  render () {
    return (
      <div className="calendarEditFoot">
        {this.props.magicTemp == 0 ?
          <div className="calendarEditFootBox">
            <img src={require('../image/botWarn.png')} className="calendarEditFootImg"/>
            <p className="calendarEditFootIntro">仅支持jpg/png格式，单张图片大小不超过<span className="calendarEditFootNum">20M</span></p>
            <div className="calendarEditFootBtn">
              <div className="calendarEditFootBtnLeft" onClick={this.handelSave.bind(this)}>保存</div>
              <div className="calendarEditFootBtnRight" onClick={this.handelFinish.bind(this)}>完成</div>
            </div>
          </div>
          :
          <div className="calendarEditFootBox">
            <div className="calendarEditFootBtnM">
              <div className="calendarEditFootBtnLeftM" onClick={this.handelFinishMagic.bind(this, 0)}>返回台历编辑</div>
              {this.props.tempStep > 1 ?
                <div className="calendarEditFootBtnLeftM" onClick={this.handelChangeStep.bind(this,false)}>返回上一步</div>
              : null}
              {(this.props.tempStep == 1 || this.props.magicTemp == 2) && this.props.videoUrl ?
                <div className="calendarUpVideoAgain">
                  <DropZone
                    ref="dropzone"
                    accept="audio/mp4, video/mp4"
                    className="onDrop"
                    multiple={false}
                    onDrop={ (files) => {this.onDrop(files)}}>
                    <div className="calendarUpVideoAgainBtn">重新上传视频 </div>
                  </DropZone>
                </div>
              : null}
              {this.props.tempStep  ==  3 ?
                <div className="calendarEditFootBtnRightM" onClick={this.handelViewVideo.bind(this)}>预览</div>
              : null}
              {this.props.tempStep  ==  3 ?
                <div className="calendarEditFootBtnRightM" onClick={this.handelFinishMagic.bind(this,0)}>下一步</div>
                :
                ((this.props.firstImg&&this.props.tempStep ==2) || (this.props.videoUrl&&this.props.tempStep ==1)) && this.props.magicTemp == 1 ?
                  <div className="calendarEditFootBtnRightM" onClick={this.handelChangeStep.bind(this,true)}>下一步</div>
                : null
              }

              {this.props.magicTemp == 2 && this.props.videoUrl ?
                <div className="calendarUpVideoAgain">
                  <DropZone
                    ref="dropzone"
                    accept="image/jpeg,image/png"
                    className="onDrop"
                    multiple={false}
                    onDrop={ (files) => {this.onDropImg(files)}}>
                    <div className="calendarUpVideoAgainBtn">仅修改封面 </div>
                  </DropZone>
                </div>
                : null
              }
            </div>
          </div>
        }
      </div>
    );
  }
}

export default CalendarEditFoot;