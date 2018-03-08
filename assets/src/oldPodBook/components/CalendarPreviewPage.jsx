import React from 'react';
import {connect} from 'react-redux';
import Preview from './Preview.jsx';
import '../style/CalendarPreviewStyle.less';
import LeftArrowButton from './LeftArrowButton.jsx';
import RightArrowButton from './RightArrowButton.jsx';
import Header from '../../common/Header.jsx';

/**
 * 台历预览页面组件
 */
class CalendarPreviewPage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			/*选择正面/反面*/
			selectedSide: 'front',
			index: 0
		};
		// 日历标题数组
		this.CALENDAR_TITLE_ARRAY = ['封面', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
		//最小页码
		this.MIN_INDEX = 0;
		//最大页码
		this.MAX_INDEX = 12;
	}

	/*组件加载完毕*/

	handleKeyPress(e){
		const LEFT_KEYCODE = 37;
		const RIGHT_KEYCODE = 39;
		console.log('event', e);
		switch (e.keyCode) {
			case LEFT_KEYCODE:
				this.handleClickForwardButton();
				break;
			case RIGHT_KEYCODE:
				this.handleClickBackwardButton();
				break;
		}
	}

	/* 切换正反面按钮 */
	handleClickSideButton(selectedSide) {
		this.setState({selectedSide});
	}

	/*向前翻页按钮*/
	handleClickForwardButton() {
		let index = this.state.index;
		if (index > this.MIN_INDEX) {
			this.setState({
				index: index - 1
			});
		}
	}

	/*向后翻页按钮*/
	handleClickBackwardButton() {
		let index = this.state.index;
		if (index < this.MAX_INDEX) {
			this.setState({
				index: index + 1
			});
		}
	}

	render() {
		const calendar = this.props.podStore || {};
		let imageList = [];
		let currentPage = {};
		switch (this.state.selectedSide) {
			case 'front':
				imageList = calendar.imageList;
				break;
			case 'back':
				imageList = calendar.oppositeList;
				break;
		}
		if (imageList && imageList.length > 0){
			//改用ES5写法
			for(let i = 0, len = imageList.length; i < len; i++){
				if(imageList[i].id === this.state.index) {
					currentPage = imageList[i];
				}
			}
		}

		return (
			<div className="calendarPreviewPage">
				<Header/>
				<div className="calendarPreviewContent">
					<div className="calendarPreviewBar">
						<ul>
							<li className={this.state.selectedSide == 'front'?'':'frontSideButton'} onClick={()=>this.handleClickSideButton('front')}>正面</li>
							<li className={this.state.selectedSide == 'back'?'':'backSideButton'} onClick={()=>this.handleClickSideButton('back')}>反面</li>
						</ul>
					</div>
					<div className="calendarPreviewMain">
						<div className='calendarPreviewLeftArrow' style={{display: this.state.index === this.MIN_INDEX ? 'none':'block'}}>
							<LeftArrowButton onClick={this.handleClickForwardButton.bind(this)}/>
						</div>
						<Preview data={currentPage} index={this.state.index}/>
						<p className='calendarPreviewTitle'>{this.CALENDAR_TITLE_ARRAY[this.state.index]}</p>
						<div className='calendarPreviewRightArrow' style={{display: this.state.index === this.MAX_INDEX ? 'none':'block'}}>
							<RightArrowButton onClick={this.handleClickBackwardButton.bind(this)}/>
						</div>
					</div>
				</div>
			</div>
		);
	}

	componentDidMount() {
		//添加键盘事件
		window.addEventListener('keyup', this.handleKeyPress.bind(this));
	}

	componentWillUnmount(){
		window.removeEventListener('keyup', this.handleKeyPress.bind(this));
	}
}

CalendarPreviewPage.propTypes = {};
CalendarPreviewPage.defaultProps = {};
function mapStateToProps(state) {
	return {
		podStore:state.podStore
	}
}
export default connect(mapStateToProps)(CalendarPreviewPage);
