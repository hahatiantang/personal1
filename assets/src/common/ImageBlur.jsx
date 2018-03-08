/**
 * 文件说明:
 * 详细描述: 图片上传清晰度页面
 * 创建者: 韩波
 * 创建时间: 2016/9/30
 * 变更记录:
 */

import React from 'react';
import DropZone from 'react-dropzone';
import  './less/imageBlur.less';

class ImageBlur extends React.Component {
  constructor(props) {
    super(props);
  }

  uploadBlurImg(files){
    this.props.blurUpload(files,this.props.blurRes,this.props.blurIndex)
  }

  render(){
    return (
      <div className="imageBlur" style={this.props.style}>
        <div className="imageBlur_san"></div>
        <div className = "imageBlur_index">
          <div className="imageBlur_body">
            <span>清晰度不足 建议尺寸800X800</span><br/>
            <span>当前状态下打印效果会不清晰，请更换照片</span>
            <div className="imageBlur_up">
              <DropZone
                ref="dropzone"
                accept="image/jpeg,image/png"
                className="onDrop"
                multiple={false}
                style={{width: '70px'}}
                onDrop={(files) => {this.uploadBlurImg(files)}}>
                <div className="imageBlur_image">去换图</div>
              </DropZone>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ImageBlur;