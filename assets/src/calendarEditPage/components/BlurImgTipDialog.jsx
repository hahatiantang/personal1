/**
 * 文件说明:
 * 详细描述:图片模糊的弹框
 * 创建者: 韩波
 * 创建时间: 2017/11/16
 * 变更记录:
 */

import React from 'react';
import DialogBox from '../../common/DialogBox.jsx';
import '../style/errUploadDialog.less';

class BlurImgTipDialog extends React.Component{
  constructor(props){
    super(props)
  }

  //去看看
  handelToLook(){
    this.props.handelImgErr();
    this.props.close()
  }

  //继续提交
  handelToSub(){
    this.props.handelStillSave(this.props.blurList[0].flag);
    this.props.close()
  }

  render(){
    return(
      <DialogBox
        {...this.props}
        open={this.props.open}
        close={this.props.close}
        width={415}
        modal={true}
        hasFooter={false}
        title={'提示'}>
        <div className="errUploadDialog">
          <p className="blurImgP">
            <span>您提交的作品中有</span>
            <span className="blurImgPNum">{this.props.blurList.length}</span>
            <span>张照片像素低于800X800，清晰度较低，会影响打印效果。</span>
          </p>
          <div className="blurImgDialogBtn">
            <div className="blurImgDialogBtnLeft" onClick={this.handelToLook.bind(this)}>去看看</div>
            <div className="blurImgDialogBtnRight" onClick={this.handelToSub.bind(this)}>继续提交</div>
          </div>
        </div>
      </DialogBox>
    )
  }
}
export default BlurImgTipDialog;