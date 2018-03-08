/**
 * 文件说明:
 * 详细描述:魔法台历上传视频
 * 创建者: 韩波
 * 创建时间: 2017/8/31
 * 变更记录:
 */

import React, {Component} from 'react';
import DropZone from 'react-dropzone';
import CommonProgress from './CommonProgress.jsx'
class MagicVideo extends Component {
  constructor(props) {
    super(props);
  }

  //上传视频
  onDrop(file){
    this.props.handelUploadVideo(file)
  }

  handelPlay(){
    let video = $('#magic_video');
    video.get(0).play();
    video.paused = false;
    $('.videoStart').hide();
  }

  render() {
    return (
      <div className="magicNoVideoBox">
        <div className="magicNoBox">
          {this.props.videoUrl && !this.props.showProgress ?
          <div className="magicHasBox">
            <video id="magic_video" preload="auto" width="100%" height="100%" loop="loop">
              <source src={this.props.videoUrl} type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
            <div className="videoStart" onClick={this.handelPlay.bind(this)}></div>
          </div> :
            !this.props.showProgress ?
          <div>
            <div className="magicImgNo"></div>
            <div className="magicFontBig">
              <span>若视频超过30秒您可以</span>
              <span className="magicFontTip">下载时光流影APP</span>
              <span>来制作台历。</span>
            </div>
            <div className="magicFontSmile">
              <span>或使用专用剪裁工具来进行视频剪裁和格式转换  下载地址：</span>
              <a href="http://img1.timeface.cn/video/videocroper.exe" className="magicFontSmileA">http://img1.timeface.cn</a>
            </div>
            <div className="videoUpBox">
              <DropZone
                ref="dropzone"
                accept="audio/mp4, video/mp4"
                className="onDrop"
                multiple={false}
                onDrop={ (files) => {this.onDrop(files)}}>
                <div className="videoUpBtn">
                  <span className="videoUpBtnSpan">+</span>
                  <span className="videoUpBtnPan">上传视频</span>
                </div>
              </DropZone>
            </div>
          </div> :
          <CommonProgress upType={1} startNum={0} hasError={this.props.hasError} isfinish={this.props.isfinish} handelUploadVideo={this.props.handelUploadVideo}/>
          }
          <div className="videoUpFont">
            <p className="videoUpFontP">上传格式&nbsp;&nbsp;&nbsp;&nbsp;视频的格式为MP4</p>
            <p className="videoUpFontP">最佳时限&nbsp;&nbsp;&nbsp;&nbsp;建议视频的时长三十秒以内的短视频</p>
            <p className="videoUpFontP">视频要求&nbsp;&nbsp;&nbsp;&nbsp;视频清晰度为720p及其以上，且拍摄光线好</p>
            <p className="videoUpFontP">内容信息&nbsp;&nbsp;&nbsp;&nbsp;内容中不含恐怖色情以及反动信息</p>
          </div>
        </div>

      </div>
    )
  }
}
export default MagicVideo;