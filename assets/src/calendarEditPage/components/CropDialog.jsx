/**
 * 文件说明:
 * 详细描述:图片裁剪弹窗
 * 创建者: 韩波
 * 创建时间: 2016/10/13
 * 变更记录:
 */

import React from 'react';
import DialogBox from '../../common/DialogBox.jsx';
import ImgCrop from './ImgCrop.jsx'
class CropDialog extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <DialogBox {...this.props}
        open={this.props.open}
        close={this.props.close}
        width={380}
        modal={true}
        hasFooter={false}
        title={'图片裁剪'}
      >
        <ImgCrop {...this.props}/>
      </DialogBox>

    )
  }
}
export default CropDialog;