/**
 * 文件说明:
 * 详细描述:台历添加文字
 * 创建者: 韩波
 * 创建时间: 2016/10/12
 * 变更记录:
 */
import React from 'react';
import DialogBox from '../../common/DialogBox.jsx';
import CalendarIntroFrom from './CalendarIntroFrom.jsx'

class CalendarIntroDialog extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <DialogBox {...this.props}
        open={this.props.open}
        close={this.props.close}
        width={580}
        modal={true}
        hasFooter={false}
        title={'添加文字'}
      >
        <CalendarIntroFrom {...this.props}/>
      </DialogBox>
    )
  }
}
export default CalendarIntroDialog;