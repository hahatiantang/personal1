/**
 * 文件说明:纪念日弹框
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/10/13
 * 变更记录:
 */

import React from 'react';
import DialogBox from '../../common/DialogBox.jsx';
import MemoryList from './MemoryList.jsx';
import '../style/uploadDialog.less';

class MemoryDialog extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <DialogBox {...this.props}
        open={this.props.open}
        close={this.props.close}
        width={600}
        modal={true}
        hasFooter={false}
        title={'添加纪念日'}
      >
        <MemoryList {...this.props}/>
      </DialogBox>
    )
  }
}
export default MemoryDialog;