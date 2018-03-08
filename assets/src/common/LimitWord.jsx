/**
 * 文件说明: 字数限制组件
 * 详细描述:  size:  要限制的字数
 show: 是否显示限制的字数
 isByte: 按照字节计数
 isInput: 是textarea 还是 input
 placeholder: 水印文字
 watermarkStyle: 水印样式
 vocStyle: 输入框样式
 numStyle: 字符限制样式
 * 创建者: 陳明峰
 * 创建时间: 15/10/21
 * 变更记录:
 */
import React from 'react';
import classNames from 'classnames';
import  './less/LimitWordStyle.less';

class LimitWord extends React.Component {
  constructor(props) {
    super(props);
    this.calculateLength = this.calculateLength.bind(this);
    this.handleByteChange = this.handleByteChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.focusText = this.focusText.bind(this);
    this.state = {
      text: '',
      curLen: 0
    }
  }

  componentWillReceiveProps(nextProps){
    this.initCountStr(nextProps);
  }

  componentWillMount () {
    this.initCountStr(this.props);
  }

  initCountStr(props) {
    let calLen = 0;
    let defaultValue = props.defaultValue;
    //是否需要字节计数
    if(props.config.isByte){
      //更新curLen的value
      calLen = defaultValue ? this.calculateLength(defaultValue).currentLength : 0 ;
    }else{
      calLen = defaultValue ? defaultValue.length : 0 ;
    }
    this.setState({
      text: defaultValue || '',
      curLen: calLen
    });
  }
  /**
   * 更新txt的state
   * @param event dom event
   */
  handleChange(event) {
    let _value = event.target.value;
    this.setState({
      text: _value,
      curLen: _value.length
    });
    this.props.onProtectData({_name: _value});
  }


  /**
   * 计算内容字节长度
   * 中文算2个字节,英文算1个字节
   **/
  handleByteChange(event) {
    let maxLength = this.props.config.size;
    let val = event.target.value;
    let calLenObj = this.calculateLength(val);
    this.setState({
      curLen: calLenObj.currentLength
    });
    if (calLenObj.currentLength < maxLength) {
      //更新输入框的maxLength
      event.target.maxLength = maxLength * 2;
      this.setState({text: val});
      this.props.onProtectData({_name: val});
    } else {
      //判断条件: 字节长度不为偶数 && 字节长度小于最大字节长度
      if (Math.ceil(calLenObj.byteLen / 2) > Math.floor(calLenObj.byteLen / 2) && calLenObj.byteLen < maxLength * 2) {
        //允许输入最后1个字节
        event.target.maxLength = val.length + 1;
        this.setState({text: val});
        this.props.onProtectData({_name: val});
      } else {
        //截取超出长度的部分
        this.setState({text: val.substr(0, calLenObj.endIndex + 1)});
        this.props.onProtectData({_name: val.substr(0, calLenObj.endIndex + 1)});
      }
    }
  }

  /**
  * @param val 要计算中文还是英文
  * */
  calculateLength(val){
    let maxLength = this.props.config.size;
    //字节长度
    let byteLen = 0;
    let currentLength;
    //输入文本字符长度
    let len = val.length;
    //字节长度达到上限后的最后索引值(作文本截取用)
    let endIndex;
    for (let i = 0; i < len; i++) {

      //编辑书壳页面去掉开头空格
      if(this.props.blank){
        if(!/^[^\s].*$/.test(val)){
          return false;
        }
      }

      if (val.charAt(i).match(/[\u0391-\uFFE5]/)) {
        byteLen += 2;
      } else {
        byteLen += 1;
      }
      if (byteLen <= maxLength * 2) {
        //字节长度已超过最大限制,保留当前索引值
        endIndex = i;
      }
    }



    //计算当前文本长度(字节长度为奇数时+1)
    currentLength = Math.ceil(byteLen / 2);
    //返回值
    return {
      currentLength: currentLength,
      byteLen: byteLen,
      endIndex: endIndex,
      curLen: currentLength
    };
  }

  /**
   * 点击水印聚焦文本
   * @param event
   */
  focusText(event) {
    event.target.nextElementSibling.focus();
  }


  render() {
    var limit = [],
        { config } = this.props;
    /**
     * input(true)
     * textarea(false)
     */
    if (config.isInput) {
      limit.push(<input  className="voc-style" key={1}
                        type="text"
                        name={this.props.name}
                        value={this.state.text}
                        onChange={config.isByte ? this.handleByteChange : this.handleChange}/>
      )
    } else {
      limit.push(<textarea maxLength={config.size} className="voc-style" key={2}
                           value={this.state.text}
                           name={this.props.name}
                           onChange={config.isByte ? this.handleByteChange : this.handleChange}>
                        </textarea>);
    }
    //要显示字符限制区域
    if (config.show) {
      limit.push(
          <span className="numStyle" key={3}>
                <b className={this.state.curLen > 0 ? 'entered' : null}>{this.state.curLen}</b>/{config.size}
            </span>
      )
    }
    return (
        <div style={{position:'relative',cursor: 'text'}}>
          <div className={this.state.curLen ? 'hide' : config.watermarkStyle}
               onClick={this.focusText}
              >{this.state.curLen > 0 ? this.state.text : config.placeholder}</div>
          {limit}
        </div>
    );
  }
}

export default LimitWord;
