import React from 'react';

/**
 * 台历预览左侧翻页按钮
 */
class LeftArrowButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cursor: 'pointer',
			fillOpacity: 0,
			stroke: 'rgba(0,0,0,.2)',
			strokeWidth: 3
		};
	}

	handleMouseEnter() {
		this.setState({
			stroke: 'rgba(0,0,0,.4)'
		});
	}

	handleMouseLeave() {
		this.setState({
			stroke: 'rgba(0,0,0,.2)'
		});
	}


	render() {

		return (
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" onClick={this.props.onClick}
					 width="27px" height="56px" viewBox="0 0 27 56" onMouseEnter={this.handleMouseEnter.bind(this)}
					 onMouseLeave={this.handleMouseLeave.bind(this)}>
				<polyline points="27,0 3,28, 27,56" style={this.state}/>
			</svg>
		);
	}
}

export default LeftArrowButton;
