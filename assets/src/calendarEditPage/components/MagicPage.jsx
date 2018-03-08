
/**
 * 文件说明:
 * 详细描述:制作魔法台历封面
 * 创建者: 韩波
 * 创建时间: 2017/8/30
 * 变更记录:
 */

import React, {Component} from 'react';
import MagicHead from './MagicHead.jsx';
import MagicVideo from './MagicVideo.jsx';
import MagicImg from './MagicImg.jsx';
import MagicVideoArea from './MagicVideoArea.jsx';
import '../style/magicPage.less';
class MagicPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="magicPage">
        <MagicHead tempStep={this.props.tempStep}/>
        <div className="magicPageBodyBox">
          {this.props.tempStep == 1 ? <MagicVideo {...this.props}/> : null}
          {this.props.tempStep == 2 ? <MagicImg {...this.props}/> : null}
          {this.props.tempStep == 3 ? <MagicVideoArea {...this.props}/> : null}
        </div>
      </div>
    )
  }
}
export default MagicPage;