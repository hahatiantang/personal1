/**
 * 文件说明:
 * 详细描述:台历预览底部
 * 创建者: 韩波
 * 创建时间: 2016/10/18
 * 变更记录:
 */

import React,{Component} from 'react';
class PodBookFoot extends Component{
  constructor(props) {
    super(props);
    this.state = {
      editSt:true
    };
  }
  
  //编辑台历
  podEditCalendar(){
    this.setState({
      editSt:false
    });
    let podStore = this.props.podStore || {};
    location.href = '/calendar/edit?bookId='+this.props.bookId+'&type='+podStore.book_type;
    setTimeout(()=>{
      this.setState({
        editSt:true
      });
    },2500);
  }

  //加入印刷车
  handelBefAddCrt(){
   this.props.handelBeAddCrt()
  }

  render() {
    
    return (
      <div className="podBookFoot">
        <div className="podBookFootBox">
          <div className="podBookFootBtn">
            <button type="button" className="podBookFootBtnLeft" onClick={this.podEditCalendar.bind(this)}>编辑台历</button>
            <button type="button" className="podBookFootBtnRight" disabled={!this.state.editSt} onClick={this.handelBefAddCrt.bind(this)}>提交印刷</button>
          </div>
        </div>
      </div>
    )
  }
}
export default PodBookFoot;