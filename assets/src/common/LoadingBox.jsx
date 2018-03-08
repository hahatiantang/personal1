/**loding加载动画
 * 文件说明:
 * 详细描述:
 * 创建者: 余成龍
 * 创建时间: 2016/1/8
 * 变更记录:
 */

import React, {PropTypes} from 'react';
import './less/loadingBox.less'
class LoadingBox extends React.Component {
	constructor (props) {
		super(props);
	}

	render() {
		return (
			<div>
		{
			this.props.loadShow ?
			<div className="loadingBox">
				<div className="loading">
					<img src={require("./images/loading/loading.gif")} alt=""/>
					<p>{this.props.loadInfo || '加载中……'}</p>
				</div>
			</div>
		 : null
		}
			</div>
		)
	}

}

export default LoadingBox;
