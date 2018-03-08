/**
 * 文件说明: 登录模块
 * 详细描述:
 * 创建者: 卢淮建
 * 创建时间: 15/11/01
 * 变更记录:
 */
import Q from 'q';
import Base64 from 'Base64';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import reactMixin from 'react-mixin';
import classNames from 'classnames';

/**
 * custom modules
 */

import tfRegex from '../tools/tfRegex';
import TFvalidator from '../tools/tfValidator';
import authMixin from '../tools/authMixin';
import validMixin from '../tools/validMixin';
//import validZhOptions from 'valid-zh';

import * as ActionsType from '../redux/utils/actionsTypes';

// login actions
import * as commonActions from '../redux/actions/commonActions.js';
// component common modules
import EmailHint from '../common/EmailHint.jsx';
import LoginThird from '../common/LoginThird.jsx';

import FreeLoginForm from '../common/FreeLoginForm.jsx';

// css module
import './less/loginForm.less';


class LoginForm extends React.Component {

  constructor(props) {
    super(props);

    this.actions = bindActionCreators(commonActions, props.dispatch);

    // 字段验证规则
    this.validatorTypes = {
      username: TFvalidator.init().required().isTimefaceAcount(),
      password: TFvalidator.init().required().isByteLength(6)
    };

    //登录提交表单初始化
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      free:false,
      freeValid:false,
      freename:null,
      freecode:null,
      timeStamp: Date.now(),
      showCode:false
    }
  }

  handLoginTab(show){
    if(!show){
      $('#username,#password,#vcode').val("")
    }
    this.setState({
      free:show,
      freename:null,
      freecode:null,
      freeValid:false,
      invalid:true
    })
  }

  //点击刷新验证码方法
  refreshCaptcha() {
    this.setState({
      timeStamp: Date.now()
    });
  }

  render() {

    let location = this.props.location;
    let registerLink = 'http://'+WEBSITE_HOST+'/register' + ( (location && location.query.f) ? '?f=' +  location.query.f : '');
    let service = 'http://'+WEBSITE_HOST+'/service';
    let forgotPassword = 'http://'+WEBSITE_HOST+'/forgot_password';
    return (
      <div className="loginRegisterWrap">


        <form className="loginForm"
              autoComplete="on">

          <h1>
            <span >登录</span>
            {
              this.state.free ? <span onClick={this.handLoginTab.bind(this,false)} className="loginFormFree">密码登录</span>
                : <span onClick={this.handLoginTab.bind(this,true)} className="loginFormFree">手机验证码登录</span>
            }
          </h1>

          {
            this.state.free ?
              <FreeLoginForm
                setState={this.setState.bind(this)}
                handlerEnterSubmit={this.handlerEnterSubmit.bind(this)}
                actions={this.actions}/>
              : null
          }


          <div style={{'display':this.state.free ? 'none':'block'}} className="loginFormInputBox">
            {/*账号输入*/}
            <div style={{'position':'relative'}}>

              <input className="loginFormInputAccount loginFormInput"
                     id="username"
                     type='text'
                     ref="username"
                     onChange={this.emailHint.bind(this)}
                     onBlur={this.handleValidation.bind(this, 'username')}
                     onKeyUp={this.handlerEnterSubmit.bind(this)}
                     placeholder="邮箱/手机号"
                     autoComplete="off" />

              <div className="errorFormText">
                {this.renderHelpText(this.getValidationMessages('username'))}
              </div>

              {/*邮箱提示*/}
              {this.state.isEmailHint &&
              <EmailHint ref="EmailHint"
                         open={this.state.isEmailHint}
                         anchorEl={this.state.anchorEl}
                         anchorNextEl={this.state.anchorNextEl}
                         emailHintValue={this.state.emailHintValue} handlerValid={this.handleValidation.bind(this, 'username')}/>
              }

            </div>




            {/*密码框输入*/}
            <div>
              <input className="loginFormInputPassword loginFormInput"
                     id="password"
                     placeholder="密码"
                     ref="password"
                     type="password"
                     onBlur={this.handleValidation.bind(this, 'password')}
                     onKeyUp={this.handlerEnterSubmit.bind(this)}/>

              <div className="errorFormText">
                {this.renderHelpText(this.getValidationMessages('password'))}
              </div>
            </div>
          </div>
          {/*验证码*/}
          {this.state.showCode ?
            <div className="codeRow">
              <div className="codeVcode">
                <input type="text"
                       placeholder="验证码"
                       className="codeText"
                       ref="vcode"
                       id="vcode"
                       onKeyUp={this.handlerEnterSubmit.bind(this)}
                />
              </div>
              <img src={this.props.URL_CAPTCHA  + this.state.timeStamp} className="codeCaptcha"
                   onClick={this.refreshCaptcha.bind(this)} title="点击刷新"/>
            </div> : null}
          <div>
            <label className="loginFormRememberCheckbox">
              <input defaultChecked style={{'verticalAlign':'bottom'}}
                     type="checkbox"
                     ref="remmber"/> 下次免登录
            </label>


            <a className="loginFormForgetLink"
               href={forgotPassword}>忘记密码</a>
          </div>

          <button className="loginFormSubmitBtn"
                  type="button"
                  onClick={this.handleSubmit}>登录
          </button>
          {
            this.state.free ? <span className="FreeAccountLink">提示： 未注册时光流影的手机号，登录时将注册，且代表您已接受《<a href={service} target="_blank">注册协议</a>》</span>:  <div className="noAccountLink">没有帐号,<a href={ registerLink }> 立即注册</a>>></div>

          }
        </form>

        <LoginThird {...this.props}/>
      </div>
    )
  }


  componentDidMount() {
    /*if(this.props.store.storeLogin) {
     console.log ('storeLogin: nickname', this.props.store.storeLogin.get('nickname'));
     }*/
  }

  componentWillReceiveProps(nextProps) {

  }

  /**
   * 提供给验证使用: 取验证数据
   * @returns {{username: (*|string|Number), password: (*|string|Number)}}
   */
  getValidatorData() {
    return {
      username: ReactDOM.findDOMNode(this.refs.username).value,
      password: ReactDOM.findDOMNode(this.refs.password).value
    };
  }


  /**
   * 登录表单提交
   * @param loginData
   */
  handleSubmitLogin(loginData) {

    let defer = Q.defer();
    let freeLogin = this.state.free ? 'quick':null;
    // api 请求
    //this.actions.actionLoginUser(loginData, defer);
    authMixin.loginIn(loginData, freeLogin)
      .then((res) => {

        // 请求,刷新头部用户信息
        this.actions.getProfile({userId: res.userInfo.uid});

        // 如果在 react 环境更新 store
        if (this.props.dispatch) {
          this.props.dispatch((dispatch) => {
            dispatch({
              type: ActionsType.LOGIN_USER,
              loginData: res
            });
          });
        }

        // 关闭窗口
        this.props.dialog._close();

        // 执行登录成功的操作 (使用者定义)
        if (this.props.handlerLoginSuccess) {
          this.props.handlerLoginSuccess(res);
        }

      },(err)=>{
        if(this.state.showCode){
          this.refreshCaptcha();
        }
        if(err.code == 'A001006' || err.code == 'invalid_operate'){
          this.setState({
            showCode:true
          })
        }
        this.props.dispatch({
          type: ActionsType.ALERT_MESSAGE,
          width: 280,
          offset: '-20%',
          duration: 3000,
          msg: err.msg,
          hasTitle: false,
          hasFooter: false
        });
      });

    return defer.promise;
  }

  handleSubmit(event) {

    let location = this.props.location;
    let userType, username, password,code, vcode;
    let loginData;
    let onValidate = (error) => {
      console.log('error',error);
      if (error.length) {

      } else {
        username = this.refs.username.value;
        password = this.refs.password.value;
        vcode = this.state.showCode ? this.refs.vcode.value : '';
        //判断帐号类型
        if (tfRegex.email.test(username)) {
          userType = 0;
        } else if (tfRegex.mobile.test(username)) {
          userType = 1;
        }

        // 收集提交数据
        /*let loginData = {
         acc: username,
         pwd: Base64.btoa(password),
         rt: userType
         };*/

        loginData = {
          type: userType,
          account: username,
          password: Base64.btoa(password),
          vcode: vcode,
          f: (location && location.query.f) || ''
        };
        // 验证通过, 提交表单
        this.handleSubmitLogin(loginData)
          .then((res) => {

              // 设置用户数据
             //this.setLoginData(res);


          }, (error) => {

            let { dispatch } = this.props;

            /*if(dispatch) {
              dispatch({
                // action
                type: ActionsType.ALERT_MESSAGE,
                // 提示内容
                msg: error.data.msg,
                width: 300,
                offset: '-20%',
                duration: 1500,

                hasTitle: false,
                title: '提示',

                hasOk: true,
                // 确定文字
                okText: '确定',
                // 确定回调
                okCall: null,
                hasCancel: true,
                // 取消文字
                cancelText: '取消',
                // 是否有页脚
                hasFooter: false
              })
            }*/

          });

      }
    };

    let onFreeValidate = (error) => {
      username = this.state.freename;
      code = this.state.freecode;

      if(!/^\d{4}$/.test(code)){
        this.actions.freeLoginTip('请输入正确的短信验证码！');
      }else if(!/^(0|86|17951)?(13[0-9]|15[012356789]|17[03678]|18[0-9]|14[579])[0-9]{8}$/.test(username)){
        this.actions.freeLoginTip('请输入正确的手机号码！')
      }else{
        loginData = {
          tid: (location && location.query.tid) || '',
          mobile: username,
          valcode: code,
          f: (location && location.query.f) || ''
        }

        // 验证通过, 提交表单
        this.handleSubmitLogin(loginData)
          .then((res) => {

            // 设置用户数据
            //this.setLoginData(res);


          }, (error) => {

            let { dispatch } = this.props;


          });
      }

    }
    // 验证表单所有字段
    if(this.state.free){
      onFreeValidate()
    }else{
      this.validate(onValidate);
    }


    // 清除验证
    //this.props.clearValidations();

  }

  /**
   * 回车登录
   */
  handlerEnterSubmit(event) {
    if (event.keyCode == 13) {
      this.handleSubmit();
    }
  }
  /**
   * 邮箱验证
   */
  /*emailValid() {
   this.props.validate(['username']);
   this.setState({
   isEmailHint: false
   });
   }*/

  /**
   * 邮箱提示功能
   */
  emailHint() {

    let usernameEl = ReactDOM.findDOMNode(this.refs.username);
    let passwordEl = ReactDOM.findDOMNode(this.refs.password);
    this.setState({
      anchorEl: usernameEl,
      anchorNextEl: passwordEl,
      isEmailHint: 'show',
      emailHintValue: usernameEl.value
    });


    /*this.props.handleValidation('username');
     let a = this.props.getValidationMessages('username');
     console.log ('emailHint', this.props.errors);
     if(a.length) {
     this.setState({
     //emailHint: true
     });
     }*/

  }


}

/*获取验证码*/
LoginForm.defaultProps = {
  URL_CAPTCHA: '/tf/auth/captchaPic?t='
};

reactMixin.onClass(LoginForm, authMixin);
reactMixin.onClass(LoginForm, validMixin);

/**
 * 赋值组件 props
 * @param store
 * @returns {{storeLogin: *}}
 */
/*function mapStoreToProps(store) {
  return {
    store: store.store.storeLogin
  };
}*/
//export default connect(mapStoreToProps)(LoginForm);
export default LoginForm;
