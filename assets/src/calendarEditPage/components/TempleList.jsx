/**
 * 文件说明:台历模板列表组件
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/10/12
 * 变更记录:
 */
import React, {Component} from 'react';
import Cookies from 'cookies-js';
import '../style/templeList.less';
class TempleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempId: props.pageStore.template_id
    }
  }

  /**
   *关闭模板列表弹出层
   */
  handClose() {
    this.props.close()
  }

  /**
   *确定
   */
  handConfirm() {
    this.props.handelReplaceTemp(this.state.tempId);
    this.props.close()
  }

  /**
   * 选择模板
   */
  handSelectTemp(tempId) {
    this.setState({
      tempId: tempId
    });
  }

  render() {
    let tempListHtml = this.props.tempListData.map((item, index)=> {
      return (<li key={index}
                  className={this.state.tempId == item.template_id ? 'over' : ''}
                  onClick={this.handSelectTemp.bind(this,item.template_id)}>
        <img src={(item.template_cover || item.thumbnail) +'@142h_142w_1c'} alt=""/>
      </li>)
    });
    return (
      <div className="temple_box">
        <div className="temple_list">
          <ul>
            {tempListHtml}
          </ul>
          <p className="temple_tip" style={{color:'#ff4949'}}>注：请勿将重要内容置于图片边缘</p>
          <div className="temp_footer">
            <button type="button" className="btn" onClick={this.handConfirm.bind(this)}>确定</button>
            <button type="button" className="btn cleBtn" onClick={this.handClose.bind(this)}>取消</button>
          </div>
        </div>
      </div>
    )
  }
}
export default TempleList;