/**
 * 文件说明:
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/11/29
 * 变更记录:
 */

import React from 'react';
import DialogBox from '../../common/DialogBox.jsx';
import PhotoList from './PhotoList.jsx';

class PhotoDialog extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <DialogBox {...this.props}
        open={this.props.open}
        close={this.props.close}
        width={750}
        modal={true}
        hasFooter={false}
        title={'图片调序'}
      >
        <PhotoList {...this.props}/>
      </DialogBox>
    )
  }
}
export default PhotoDialog;