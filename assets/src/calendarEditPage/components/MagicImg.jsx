/**
 * 文件说明:
 * 详细描述:魔法台历上传图片
 * 创建者: 韩波
 * 创建时间: 2017/8/31
 * 变更记录:
 */

import React, {Component} from 'react';
import DropZone from 'react-dropzone';
import CommonProgress from './CommonProgress.jsx';
class MagicImg extends Component {
  constructor(props) {
    super(props);
  }

  //上传图片
  onDrop(file){
    this.props.handleMagicDrop(file,1)
  }

  render() {
    return (
      <div className="magicNoVideoBox">
        <div className="magicNoBox">
          {!this.props.showProgress ?
          <div>
            <div className="magicImgNo" style={{margin:'94px auto 0'}}></div>
            <div className="videoUpBox" style={{margin:'58px auto 0'}}>
              <DropZone
                ref="dropzone"
                accept="image/jpeg,image/png"
                className="onDrop"
                multiple={false}
                onDrop={ (files) => {this.onDrop(files)}}>
                <div className="videoUpBtn">
                  <span className="videoUpBtnSpan">+</span>
                  <span className="videoUpBtnPan">上传图片</span>
                </div>
              </DropZone>
            </div>
          </div>
          : <CommonProgress handleMagicDrop={this.props.handleMagicDrop} showCrop={1} startNum={0} hasError={this.props.hasError} isfinish={this.props.isfinish}/>}
        </div>
      </div>
    )
  }
}
export default MagicImg;