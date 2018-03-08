/**
 * 文件说明:
 * 详细描述:台历风格列表
 * 创建者: 韩波
 * 创建时间: 2017/8/23
 * 变更记录:
 */

import React, {Component} from 'react';
import DialogBox from '../../common/DialogBox.jsx';
import StyleList from './StyleList.jsx';
class StyleListDialog extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DialogBox {...this.props}
                 open={this.props.open}
                 close={this.props.close}
                 width={[227,234].indexOf(this.props.book_type) > -1 ? 570:750}
                 modal={true}
                 hasFooter={false}
                 title={'请选择风格'}
      >
        <StyleList  {...this.props}/>
      </DialogBox>
    )
  }
}

export default StyleListDialog;