/**
 * 文件说明:
 * 详细描述:图片上传错误的弹框
 * 创建者: 韩波
 * 创建时间: 2016/11/8
 * 变更记录:
 */

import React from 'react';
import DropZone from 'react-dropzone'
import DialogBox from '../../common/DialogBox.jsx';
import '../style/errUploadDialog.less';

class ErrUploadDialog extends React.Component{
  constructor(props){
    super(props)
  }

  //上传图片
  handelUpload(files){
    this.props.handelErrUpload(files);
    this.props.close();
  }

  render(){
    return(
      <DialogBox {...this.props}
        open={this.props.open}
        close={this.props.close}
        width={415}
        modal={true}
        hasFooter={false}
        title={'提示'}
      >
        <div className="errUploadDialog">
          <p className="errUploadDialogP">
            <span>您有</span>
            <span className="errUploadDialogNum">{this.props.indexList.length}</span>
            <span>张图片上传失败，请点击重新上传</span>
          </p>
          <div className="errUploadDialogBtn">
            <DropZone ref="dropzone" accept="image/jpeg, image/png"
                      onDrop={(files) => {this.handelUpload(files)}}
                      className="uIADropZone dz1">
              <div className="errUploadPicMore">重新上传</div>
            </DropZone>
          </div>
        </div>
      </DialogBox>
    )
  }
}
export default ErrUploadDialog;