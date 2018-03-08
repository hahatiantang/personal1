import React from 'react';
import '../style/PreviewStyle.less';

/**
 * 日历预览组件
 */
class Preview extends React.Component {
	render() {

		return (
			<div className='calendarPreviewPre'>
				{/*日历拉环*/}
				<div className='spiral'></div>
				{/*日历渲染*/}
				<img className='previewImage'
						 onerror={require('../image/'+ this.props.index + '.jpg')}
						 src={this.props.data.url ? (this.props.data.url+'@500w_638h_1c') : require('../image/'+ this.props.index + '.jpg')}/>
			</div>
		);
	}
}

Preview.propTypes = {};
Preview.defaultProps = {
	data: {}
};

export default Preview;
