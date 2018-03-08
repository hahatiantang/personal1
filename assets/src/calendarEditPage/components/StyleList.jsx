/**
 * 文件说明:
 * 详细描述:台历风格列表组件
 * 创建者: 韩波
 * 创建时间: 2017/8/23
 * 变更记录:
 */

import React, {Component} from 'react';
import '../style/templeList.less';
class StyleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookStyle: props.bookStyle
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
    this.props.handelChangeStyle(this.state.bookStyle);
    this.props.close()
  }

  /**
   * 选择模板
   */
  handSelectTemp(id) {
    this.setState({
      bookStyle: id
    });
  }

  render() {
    let tempListHtml = this.props.styleListData.map((item, index)=> {
      return (<div key={index}
                  className="temple_line"
                  onClick={this.handSelectTemp.bind(this,item.moban_id)}>
        <div className={parseInt(this.state.bookStyle) == item.moban_id ? 'temple_img over' : 'temple_img'}>
          <img onClick={this.handSelectTemp.bind(this,item.name)}
               src={item.frame_pic +'@142h_142w_1c'} alt=""/>
        </div>
        <div className="stylePendant"><img src={item.image_url+'@60Q.png'}/></div>
        <p className="temple_font">《{item.name.substring(7,item.name.length)}风格》</p>
      </div>)
    });
    return (
      <div className="temple_box">
        <div className="temple_list">
          {tempListHtml}
          <p className="temple_tip">注：风格修改将影响所有月份页面</p>
          <div className="temp_footer">
            <button type="button" className="btn" onClick={this.handConfirm.bind(this)}>确定</button>
            <button type="button" className="btn cleBtn" onClick={this.handClose.bind(this)}>取消</button>
          </div>
        </div>
      </div>
    )
  }
}
export default StyleList;