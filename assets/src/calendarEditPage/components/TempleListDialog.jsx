/**
 * 文件说明:台历版式列表
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/10/12
 * 变更记录:
 */
import React, {Component} from 'react';
import DialogBox from '../../common/DialogBox.jsx';
import TempleList from './TempleList.jsx';
class TempleListDialog extends Component {
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
        title={'请选择模板样式'}
      >
        <TempleList  {...this.props}/>
      </DialogBox>
    )
  }
}

export default TempleListDialog;
