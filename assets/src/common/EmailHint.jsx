/**
 * 文件说明: 邮箱提示组件
 * 详细描述:
 * 创建者:   卢淮建
 * 创建时间: 15/11/26
 * 变更记录:
 */

import React from 'react'
import ReactDOM from 'react-dom';
import classNames from 'classnames';
//import _ from 'lodash';
let $ = require('jquery');
import reactMixin from 'react-mixin';
let classNamesBind = require('classnames/bind');

// custom module
import Events from '../tools/events.js';
import KeyCode from '../tools/keyCodes.js'
import bindEvent from '../tools/bindEvents.js'

// css module
import emailHintCss from './less/emailHint.less';


/**
 * 组件类
 */
class EmailHint extends React.Component {

  constructor(props) {
    super(props);

    // 显示隐藏状态属性
    this.state = {
      // 是否显示
      open: props.open,
      // 列表计算样式
      hintListStyle: {},
      // 当前选择项的索引
      selectedIndex: 0
    };


    // 选择的 email
    //this.selectedEmail = null;

    this.windowListeners = {
      //click: '_dismiss'
      //keyup: '_positionHint',
      //resize: '_positionHint',
      //scroll: '_positionHint'
    };

    this._dismiss = this._dismiss.bind(this);
    this._positionHint = this._positionHint.bind(this);
    this.handleInputKeyUp = this.handleInputKeyUp.bind(this);

  }

  render() {

    //console.log('emailHint render', this.state.open);
    // use css modules
    let cxStyle = classNamesBind.bind({
      normal: 'tfEmailHint',
      show: 'tfEmailHintShow'
    });
    let hintListCls = cxStyle({
      normal: true,
      show: this.state.open
    });

    let selectItemCX = classNamesBind.bind({
      selected: 'Selected'
    });


    let hasAtString = this.props.emailHintValue.indexOf('@');
    let emailHintValue = this.props.emailHintValue.split('@')[0];
    let domainName = this.props.emailHintValue.split('@')[1];

    return (
      <ul className={hintListCls}
          style={this.state.hintListStyle}>
        {this.state.filterEmail.map((data, index)=> {

          let selectItemCls = selectItemCX({
            selected: index == this.state.selectedIndex
            });


          return <li className={selectItemCls}
                     onMouseEnter={ (event) => this.handleInputKeyUp(event, index) }
                     onClick={ (event) => this.handleSelectedEmail(event, index) }
                     key={index}>{data.fullName}</li>
          }, this.props.emailName
          )}
      </ul>
    )
  }

  /**
   * 组件挂载完成事件
   */
  componentDidMount() {

    // todo 计算一次提示框位置 (初始挂载不执行 componentWillReceiveProps)
    this._positionHint();

    // 绑定输入框: 选择提示项键盘事件
    $(this.props.anchorEl).on('keyup', this['handleInputKeyUp']);
    $(this.props.anchorNextEl).on('focus', this['_dismiss']);
  }

  /**
   * 组件卸载
   */
  componentWillUnmount() {

    // 移出事件
    $(this.props.anchorEl).off('keyup', this['handleInputKeyUp']);
  }

  componentWillMount() {
    //console.log ('componentWillMount', this.props);
    this.filterEmail();

  }

  /**
   * 组件接收新的props事件
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    //console.log ('componentWillReceiveProps', nextProps.emailHintValue);
    //console.log ('componentWillReceiveProps', this.props.emailHintValue);

    if (this.props.emailHintValue !== nextProps.emailHintValue) {
      this.filterEmail(nextProps.emailHintValue);
    }

    this._positionHint(nextProps);

  }

  /**
   * 显示提示框
   * @private
   */
  _show() {

    this.setState({
      open: true
    }, this._onShow);
  }

  /**
   * 显示后的回调
   * @private
   */
  _onShow() {
    if (this.props.onShow) {
      this.props.onShow();
    }
  }

  /**
   * 关闭提示框
   * @private
   */
  _dismiss() {

    //console.log ('_dismiss');
    this.setState({
      open: false
    }, this._onDismiss);
  }

  /**
   * 关闭提示框后的回调
   * @private
   */
  _onDismiss() {
    if (this.props.onDismiss) {
      this.props.onDismiss();
    }
  }

  /**
   * 过滤域名
   * @param emailText
   */
  filterEmail(emailText = false) {

    //console.log (9999999999);

    let inputText = this.props.emailHintValue;

    //console.log ('filterEmail emailText', emailText);
    //console.log ('filterEmail inputText', inputText);

    let text = emailText === false ? inputText : (emailText ? emailText : '您的邮箱名');
    let hasAtString = text.indexOf('@');
    let emailHintValue = text.split('@')[0];
    let domainName = text.split('@')[1];
    let filter = this.props.emailName.filter(function (data, index) {
      data.fullName = emailHintValue + data.domainName;
      if (hasAtString > -1) {
        return data.domainName.indexOf(domainName) == 1 || data.domainName.indexOf(domainName) == 0;
      } else {
        return false;
      }
      /*else {
       return true;
       }*/
    });

    // 选择的邮箱置空
    /*this.setState({
     selectedEmail: null
     });*/

    // 过滤到提示邮箱则显示下拉框
    if(filter.length > 0) {
      this._show();
    } else {
      this._dismiss();
    }
    // 更新过滤后的邮箱列表
    this.setState({
      selectedIndex: 0,
      filterEmail: filter
    });

  }

  handleSelectedEmail(event, index) {
    //console.log ('eventeventevent', index);
    //console.log ('eventeventevent', this.state.filterEmail[index]);
    event.stopPropagation();
    event.preventDefault();
    /*this.selectedEmail = {
     index: index,
     email: this.state.filterEmail[index]
     }*/
    // 赋值
    this.props.anchorEl.value = this.state.filterEmail[index].fullName;
    // 聚焦下一个输入框
    $(this.props.anchorNextEl).focus();
    // 选择后, 执行父级组件的方法
    this.props.handlerValid();
    // 关闭提示框
    this._dismiss();
  }

  /**
   * 选择邮箱提示项
   * @param event
   * @param index
   * @returns {boolean}
   */
  handleInputKeyUp(event, index) {

    let selectedIndex = this.state.selectedIndex;
    let emailTypeLength = this.state.filterEmail.length - 1;
    let indexNum = selectedIndex;

    if (index !== undefined) {

      this.setState({
        selectedIndex: index
      });
    }


    if (event) {

      event.stopPropagation();

      // 如果是上下键选择条目
      if (event.keyCode === KeyCode.DOWN) {
        if (selectedIndex < emailTypeLength) {
          indexNum = selectedIndex + 1;
          this.setState({
            selectedIndex: indexNum
          });
        } else {
          indexNum = 0;
          this.setState({
            selectedIndex: indexNum
          });
        }
      } else if (event.keyCode === KeyCode.UP) {
        if (selectedIndex > 0) {
          indexNum = selectedIndex - 1;
          this.setState({
            selectedIndex: indexNum
          });
        } else {
          indexNum = emailTypeLength;
          this.setState({
            selectedIndex: indexNum
          });
        }
      }
    }

    // 回车确认选择
    if (event.keyCode === KeyCode.ENTER) {

      this.handleSelectedEmail(event, indexNum);

    }


    return false;
  }


  /**
   * 计算,更新提示框位置
   * @param nextProps
   * @private
   */
  _positionHint(nextProps) {

    let anchorEl;

    if (nextProps && nextProps.anchorEl) {
      anchorEl = nextProps.anchorEl;
    } else {
      anchorEl = this.props.anchorEl;
    }

    if (anchorEl) {

      let windowScrollTop = $(window).scrollTop();
      let $anchorEl = $(anchorEl);
      let anchorPosition = $anchorEl.position();
      let anchorElOffset = $anchorEl.offset();
      //let domPopover = $(ReactDOM.findDOMNode(this));

      //console.log('windowScrollTop', windowScrollTop);
      //console.log('$anchorEl', $anchorEl);

      this.setState({
        hintListStyle: {
          position: 'absolute',
          top: $anchorEl.outerHeight(),
          //top: anchorElOffset.top - anchorPosition.top*2 - $anchorEl.height()*2 - windowScrollTop,
          let: 0,
          width: $anchorEl.outerWidth() - 2
        }
      });
    }

  }

}

// 设置组件默认属性
EmailHint.defaultProps = {
  emailName: [
    {
      domainName: '@163.com'
    },
    {
      domainName: '@126.com'
    },
    {
      domainName: '@sina.com'
    },
    {
      domainName: '@qq.com'
    },
    {
      domainName: '@gmail.com'
    }
  ]
};


// 组件混入窗口事件绑定方法
reactMixin.onClass(EmailHint, bindEvent);

// 导出模块
export default EmailHint;