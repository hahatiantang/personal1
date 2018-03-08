/**
 * 文件说明:
 * 详细描述:批量传图弹窗
 * 创建者: 韩波
 * 创建时间: 2016/10/12
 * 变更记录:
 */

import React from 'react';
import DropZone from 'react-dropzone'
import DialogBox from '../../common/DialogBox.jsx';
import '../style/uploadDialog.less';

class UploadDialog extends React.Component{
  constructor(props){
    super(props)
  }
  
  //上传图片
  handelUpload(files){
    this.props.handelMutiPic(files);
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
        title={'批量传图'}
      >
        <div className="uploadDialog">
          <div className="uploadDialogBtn">
            <DropZone ref="dropzone" accept="image/jpeg, image/png"
                      onDrop={(files) => {this.handelUpload(files)}}
                      className="uIADropZone dz1">
              <div className="uploadPicMore">
                <img src={require('../image/upload-btn-img.png')} className="uploadDialogBtnImg"/>
                上传照片
              </div>
            </DropZone>
          </div>
          {this.props.bookType == 103 ? <p className="uploadDialogPTip">此操作图片顺序会被打散！！</p> : null}
          <p className="uploadDialogP">
            <span>您需要上传</span>
            <span className="uploadDialogNum">{this.props.allNum+'张'}</span>
            <span>照片完成本作品。</span>
          </p>
          <p className="uploadDialogP1">单张照片不能超过20M。</p>
        </div>
      </DialogBox>
    )
  }
}
export default UploadDialog;