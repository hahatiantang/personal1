/**
 * 文件说明:
 * 详细描述:魔法台历封面制作label
 * 创建者: 韩波
 * 创建时间: 2017/8/31
 * 变更记录:
 */

import React, {Component} from 'react';

class MagicHead extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="magicPageHeadBox">
        <div className={this.props.tempStep == 1 ? 'head_label headerActive headerChange' : 'head_label headerAfter'}>
          <span className="head_label_num">1</span>
          上传视频
        </div>
        <div className={this.props.tempStep == 2 ? 'head_label headerActive headerChange' : 'head_label headerAfter'}>
          <span className="head_label_num">2</span>
          选择封面
        </div>
        <div className={this.props.tempStep == 3 ? 'head_label headerChange' : 'head_label'}>
          <span className="head_label_num">3</span>
          编辑封面
        </div>
        <div className="magicPageTip">
          <div className="magicPageTipBox">
            <span>魔法封面上显示的动态视频</span><br/>
            <span>就是您现在上传的视频哦</span>
          </div>
        </div>
      </div>
    )
  }
}
export default MagicHead;