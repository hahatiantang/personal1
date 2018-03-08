/**
 * 文件说明:
 * 详细描述:添加文字form
 * 创建者: 韩波
 * 创建时间: 2016/10/12
 * 变更记录:
 */

import React from 'react';
import cloneDeep from 'lodash.clonedeep';
import reactComposition from 'react-composition'
import LimitWord from '../../common/LimitWord.jsx'
import '../style/calendarIntroFrom.less';
class CalendarIntroFrom extends React.Component {
  constructor(props) {
    super(props);
    let textInfo = props.textConfig.element_list.element_content == '请输入文字' ? '' : props.textConfig.element_list.element_content.replace(/<br\s*\/?>/gi,"");
    this.state = {
      editText:textInfo
    }
  }

  /**
   *修改书名确定
   */
  handSave() {
    var textConfig = cloneDeep(this.props.textConfig);
    textConfig.element_list.element_content =   this.state.editText;
    let index = {
      index: this.props.textConfig.index,
      element_flag:textConfig.element_list.element_flag

    };
    this.props.handelTextEdit(textConfig, index);
    this.props.close();
  }

  /**
   * 书名
   */
  handleNameChange(event) {
    let text = event.target.value;
    let maxLength = this.props.textConfig.element_list.text_content_expand.max_text_count;

    /*if (this.composition === true) {
      this.composition = 'other';
      text = (this.initText+event.data).trim().substring(0,maxLength);
      this.initText = ''
    }*/
    if (event.reactComposition.composition === false) {
      text = text.trim().substring(0,maxLength)
    }
    this.setState({
      editText: text
    });
  }
  render() {
    let limitWord = this.props.textConfig.element_list.text_content_expand;
    var limitWordConfig = {
      size: limitWord.max_text_count,
      show: true,
      isInput: true,
      isByte: false,
      watermarkStyle:'aaaa',
      placeholder: '请输入文字'
    };
    let self = this;
    return (
      <div className="calendarIntroFrom">
        <div className="calendarIntroFromInput">
          <input
            type="text"
            value={this.state.editText}
            placeholder="请输入文字"
            {...reactComposition({
              onChange: (event)=>{
                self.handleNameChange(event)
              },
              onCompositionEnd: (event)=>{
                event.reactComposition = {composition: false};
                self.handleNameChange(event)
              }
            })}
          />
          <span className="numStyle">
            <b className={this.state.editText.length > 0 ? 'entered' : null}>{this.state.editText.length}</b>/{limitWord.max_text_count}
          </span>
            {/*<LimitWord
            defaultValue={this.state.editText}
            config={limitWordConfig}
            blank={false}
            onProtectData={this.handleNameChange.bind(this)}/>*/}
          <p>排版样式以预览效果为准，特殊符号无法印刷</p>
        </div>
        <button type="button" className="calendarIntroFromBtn" onClick={this.handSave.bind(this)}>确认</button>
      </div>
     )
  }
}

export default CalendarIntroFrom;