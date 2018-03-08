/**
 * 文件说明: 表单验证模块
 * 详细描述:
 * 创建者:   卢淮建
 * 创建时间: 15/12/12
 * 变更记录:
 */
import React from 'react';
let _ = require('lodash');

export default  {

  getInitialState: function () {
    return {
      invalid: true,
      errors: {}
    };
  },

  componentDidMount(){

    this._updateInvalid = this._updateInvalid.bind(this);
    // 验证的字段名称列表
    this.validField = _.keys(this.validatorTypes);
    // 绑定静默验证
    this._quietValid();

    let errors = this._validAllRuleInit();
    // todo 这里代码冗余
    let trueErrors = _.flatten(_.map(_.values(errors), 'errMsg'));
    if(!trueErrors.length) {
      this.setState({
        invalid: false
      });
    }
  },

  componentDidUpdate (prevProps, prevState) {

  },

  _updateInvalid () {

    let isInvalid;
    let err = this._validAllRules();
    let errObjArray = _.flatten(_.map(_.values(err), 'errMsg'));

    // 如果有错误,表单验证不通过
    isInvalid = errObjArray.length !== 0;
    this.setState({
      invalid: isInvalid
    });
  },


  /**
   * 绑定, 解绑静默验证
   */
  _quietValid() {

    // 验证字段列表
    let validField = this.validField;
    // 验证字段列表长度
    let validFieldLength = validField.length;

    // 遍历对象键, 验证相应键值
    for (let k = 0; k < validFieldLength; k++) {
     $(this.refs[validField[k]]).on('keyup', this._updateInvalid);
    }

  },

  /**
   * 验证所有字段并返回错误信息
   * @returns {{}}
   * @private
   */
  _validAllRuleInit () {

    // 验证字段列表
    let validField = this.validField;
    // 长度
    let validFieldLength = validField.length;
    // 错误对象
    let errors = {};

    // 添加验证的字段值对象
    //let fieldsValueObj = this.validatorTypes;

    // 遍历对象键, 验证相应键值
    for (let k = 0; k < validFieldLength; k++) {
        // 字段返回的错误信息合并到错误信息对象
        Object.assign(errors, this._validRule(validField[k], 'init'));
    }

    // 设置组件错误消息
    this.setState({
      errors: errors
    }, () => {
      //console.log (111111, this.state.errors);
    });

    return errors;
  },

  /**
   * 验证字段并返回错误信息
   * @param {string} field 表单字段名称
   * @param {string} validType (init, ) 验证方式
   * @returns {{}}
   * @private
   */
  _validRule (field, validType) {
    let isInit = validType === 'init';
    let isUser = validType === 'user';

    // 新的错误列表
    let newErrorList = [];
    // 如果是初始化验证(isAll为true), 则不保留原有验证结果,创建新对象
    let errorState = isInit ? {} : Object.assign({}, this.state.errors);
    // 获取字段的同步验证规则函数列表
    let fieldRules = this.validatorTypes[field].rules;
    // 获取字段的异步验证规则函数列表
    let fieldAsyncRules = this.validatorTypes[field].asyncRules;

    // 所有字段值对象
    let fieldValueObj = this.getValidatorData();
    // 当前字段值
    let fieldValue = fieldValueObj[field];


    // 遍历验证同步规则
    _.each(fieldRules, function (ruleFn, index) {

      let validResult;
      let fieldErrorObj = errorState[field];

      // 标识为用户触发验证
      if(isUser) {
        fieldErrorObj.isInit = false;
      }

      // 执行验证规则
      if (ruleFn.rule) {
        validResult = ruleFn.rule(fieldValue, fieldValueObj);
      } else {
        validResult = ruleFn(fieldValue);
      }
      // 执行验证规则 end

      // 如果有错误, 将错误push到错误列表
      if (validResult) {
        newErrorList.push(validResult)
      }

    });

    // 如果同步验证通过, 并且不是初始化验证, 并且字段字不和上次同样, 则遍历验证异步规则
    if (newErrorList.length === 0 && !isInit && errorState[field].val !== fieldValue) {

      errorState[field].val = fieldValue;

      _.each(fieldAsyncRules, (asyncRuleFn, index) => {

        let validResult;
        let fieldErrorObj = errorState[field];

        if (asyncRuleFn.rule) {
          // 设置正在验证
          fieldErrorObj.asyncStatus = 0;
          // {async: Promise, msg: "用户不可用", status: 1}
          validResult = asyncRuleFn.rule(fieldValue, fieldValueObj);
          validResult.async
            .then((res) => {
              // 提交成功后, 更新错误信息
              this.asyncUpdateErrors(field, res);
            });
        }

        // 添加验证结果
        if (validResult) {
          newErrorList.push(validResult)
        }

      });

    }

    // 初始化验证则将错误信息写入相应字段
    if(isInit) {
      errorState[field] = {};
      errorState[field].isInit = true;
    }

    //
    if(errorState[field].asyncStatus !== -1) {
      errorState[field].errMsg = newErrorList;
    }

    //errorState[field].errMsg = newErrorList;

    return errorState;

  },




  /**
   * 异步更新错误信息
   * @param field
   * @param validResult
   */
  asyncUpdateErrors (field, validResult) {

    let currentErrors = this.state.errors;

    // 更新相应字段错误信息
    if(validResult) {
      // 设置异步验证结束
      currentErrors[field].asyncStatus = -1;
      currentErrors[field].errMsg = [validResult];
    } else {
      // 设置异步验证结束
      currentErrors[field].asyncStatus = 1;
      currentErrors[field].errMsg = [];
    }

    // 更新错误 state
    this.setState({
      errors: currentErrors
    });

  },

  /**
   * 验证字段
   * @param field
   */
  handleValidation(field) {

    // 更新验证错误状态
    this.setState({
      errors: this._validRule(field, 'user')
    }, () => {
      //console.log (777, this.state.errors);
    });


  },

  /**
   * 获取字段错误信息
   * @param field
   * @returns {object}
   */
  getValidationMessages(field) {
    let fieldResult = this.state.errors[field];
    // 如果有验证结果并不是初始化结果
    return fieldResult && !fieldResult.isInit ? this.state.errors[field].errMsg : [];
  },

  /**
   * 提供给验证使用: 渲染错误帮助
   * @param message
   * @returns {XML}
   */
  renderHelpText(message) {
    if (message && message[0]) {
      return (<span>{message[0].msg}</span>)
    } else {
      return null;
    }
  },


  /**
   * 验证所有字段并返回错误信息
   * @returns {{}}
   * @private
   */
  _validAllRules (isSubmit) {

    let _validRuleType = isSubmit ? 'user' : 'init';
    let errors = {};
    // 字段值对象
    let fieldsValueObj = this.validatorTypes;

    // 遍历对象键, 验证相应键值
    for (let key in fieldsValueObj) {

      if (fieldsValueObj.hasOwnProperty(key)) {
        // 字段返回的错误信息合并到错误信息对象
        Object.assign(errors, this._validRule(key, _validRuleType));
      }

    }

    return errors;
  },

  /**
   * 验证表单全部字段
   * @param submitCallback 表单提交回调
   */
  validate (submitCallback) {

    // 错误信息对象
    let errors = {};
    let errObjArray = [];

    errors = this._validAllRules(true);
    errObjArray = _.flatten(_.map(_.values(errors), 'errMsg'));

    // 更新验证错误状态
    this.setState({
      errors: errors
    });

    // 提交时执行的回调
    submitCallback(errObjArray);
  },

  /**
   * 清除验证结果
   */
  clearValidations () {
    this.setState({
      errors: {}
    });
  },

  /**
   * 设置子字段
   * @param sname
   * @returns {function(this:setChildField)}
   */

  setChildField (sname) {

    return function (val) {
      let stateObj = {};
      stateObj[sname] = val;
      this.setState(stateObj);

    }.bind(this);
  }

};