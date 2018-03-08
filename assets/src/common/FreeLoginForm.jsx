/**
 * 文件说明:免密登录
 * 详细描述:
 * 创建者: 余成龍
 * 创建时间: 2016/6/16
 * 变更记录:
 */

import React, {PropTypes} from 'react';
import reactMixin from 'react-mixin';
import ReactDOM from 'react-dom';
import tfRegex from '../tools/tfRegex';
import TFvalidator from '../tools/tfValidator';
import authMixin from '../tools/authMixin';
import validMixin from '../tools/validMixin';

import './less/loginForm.less';

class FreeLoginForm extends React.Component {
  constructor(props){
    super(props);
    this.validatorTypes = {
      phonname: TFvalidator.init().required().isMobile(),
      phoncode: TFvalidator.init().required().isNumeric().isByteLength(4)
    };
    this.state = {
      isPhon:false,
      sendCode:false,
      sendErr:false,
      msgTxt:'获取验证码'
    }
  }
  componentDidMount(){
    let that = this;
    $('.sendCode').hover(()=>{
      if(that.state.sendErr){
        that.setState({
          msgTxt:'重新发送'
        })
      }
    },()=>{
      if(that.state.sendErr){
        that.setState({
          msgTxt:'发送失败'
        })
      }
    })
  }
  /**
   * 提供给验证使用: 取验证数据
   * @returns {{username: (*|string|Number), password: (*|string|Number)}}
   */
  getValidatorData() {
    return {
      phonname: ReactDOM.findDOMNode(this.refs.phonname).value,
      phoncode: ReactDOM.findDOMNode(this.refs.phoncode).value
    };
  }
  handFreePass(){
    this.props.setState({
      freeValid:!this.state.invalid
    })
  }

 /* * 根据用户名更新验证码类型
*/
  changeUserType () {
    let {phonname} = this.getValidatorData();

    //判断帐号类型
    this.setState({
      isPhon: tfRegex.mobile.test(phonname),
      phonname: this.refs.phonname.value
    });
    this.props.setState({
      freename:this.refs.phonname.value,
      freecode:this.refs.phoncode.value
    })
  }
  handFreeCode(){
    if(!/^(0|86|17951)?(13[0-9]|15[012356789]|17[03678]|18[0-9]|14[579])[0-9]{8}$/.test(this.state.phonname)){
      this.props.actions.freeLoginTip('请输入正确的手机号码！');
      return;
    }
    this.setState({
      sendCode:true
    })
    this.props.actions.getFreeCode({"mobile":this.state.phonname},{
      sucBack:(res) =>{
        this.intervalMsg()
        this.setState({
          sendErr:false
        })
      },
      errorBack:(err) =>{

      this.setState({
        msgTxt:'发送失败',
        sendErr:true,
        sendCode:false
      })
        this.props.actions.freeLoginTip(err.data.msg);
      }
    })
  }

  intervalMsg(){
    let numInt = 59;
    window.registerInterval = window.setInterval(()=>{
      --numInt;
      let msgTxt = '获取验证码';
      if(numInt>0){
        if(numInt<10){
          msgTxt = '重新发送0'+numInt;
        }else{
          msgTxt = '重新发送'+numInt;
        }

      }else{
        this.initCodeType();
      }

      this.setState({
        msgTxt
      })
    },1000);
  }

  initCodeType() {
    if(window.registerInterval) {
      window.clearInterval(window.registerInterval);
      this.setState({
        msgTxt: '获取验证码',
        sendCode:false
      })
    }
  }
  componentWillUnmount(){
    window.clearInterval(window.registerInterval);
  }
  render(){
    console.log('phonname',this.state.isPhon);
   return(
     <div className="loginFormInputBox">
       <div  style={{'position':'relative'}}>
         <input
           className="loginFormInputBoxPhon"
           ref="phonname"
           type="text"
           onBlur={this.handleValidation.bind(this, 'phonname')}
           onKeyUp={this.handFreePass.bind(this)}
           onChange={this.changeUserType.bind(this)}
           placeholder="手机号"
           autoComplete="off"
         />
         <div className="errorFormText">
           {this.renderHelpText(this.getValidationMessages('phonname'))}
         </div>
       </div>
       <div className="loginFormInputBoxCode">
         <input
           ref="phoncode"
           onBlur={this.handleValidation.bind(this, 'phoncode')}
           onKeyUp={this.handFreePass.bind(this)}
           onChange={this.changeUserType.bind(this)}
           type="text"
           placeholder="验证码"/>
         <button
           className="sendCode"
           disabled={!this.state.isPhon || this.state.sendCode}
           style={{'backgroundColor':this.state.sendCode ? '#8abbe4': ''}}
           type="button"
           onClick={this.handFreeCode.bind(this)}>{this.state.msgTxt}</button>
         <div className="errorFormText">
           {this.renderHelpText(this.getValidationMessages('phoncode'))}
         </div>
       </div>
     </div>
   )
  }
}
reactMixin.onClass(FreeLoginForm, authMixin);
reactMixin.onClass(FreeLoginForm, validMixin);

export  default FreeLoginForm;