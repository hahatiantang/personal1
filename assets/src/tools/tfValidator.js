/**
 * 文件说明: 验证规划模块
 * 详细描述:
 * 创建者:   卢淮建
 * 创建时间: 15/12/12
 * 变更记录:
 */

import Q from 'q';
let validator = require('validator');
let tfRegex = require('./tfRegex');

import {apiCheckUnique} from '../../../api/loginApis.js';

let TFvalidator = function () {
  this.rules = [];
  this.asyncRules = [];
};

TFvalidator.prototype = {

  /**
   * 必填
   * @returns {TFvalidator}
   */
  required: function () {
    this.rules.push(function (str) {
      return validator.isNull(str) ? {msg: '该选项不能为空'} : false;
    });

    return this;
  },

  /**
   * 是否是timeface帐号
   * @returns {TFvalidator}
   */
  isTimefaceAcount: function () {
    this.rules.push(function (str) {
      return tfRegex.userName.test(str) ? false : {msg: '必须为邮箱或手机号'};
    });

    return this;
  },

  /**
   * 是否是数字
   * @returns {TFvalidator}
   */
  isNumeric: function () {
    this.rules.push(function (str) {
      return validator.isNumeric(str) || str === '' ? false : {msg: '必须为数字'};
    });

    return this;
  },

  /**
   * 是否是邮箱
   * @param options
   * @returns {TFvalidator}
   */
  isEmail: function (options = {}) {
    this.rules.push(function (str) {
      return validator.isEmail(str, options) || str === '' ? false : {msg: '格式不正确'};
    });

    return this;
  },

  /**
   * 是否是手机号
   * @returns {TFvalidator}
   */
  isMobile: function () {
    this.rules.push(function (str) {
      return tfRegex.mobile.test(str) || str === '' ? false : {msg: '格式不正确'};
    });

    return this;
  },

  /**
   * 是否是固定电话
   * @returns {TFvalidator}
   */
  isPhone: function () {
    this.rules.push(function (str) {
      return tfRegex.phone.test(str) || str === '' ? false : {msg: '格式不正确'};
    });

    return this;
  },

  /**
   * byte 长度限制
   * @param min
   * @param max
   * @returns {TFvalidator}
   */
  isByteLength: function (min, max) {
    this.rules.push(function (str) {
      let maxStr = max ? ',最多' + max +'个' : '';
      return validator.isByteLength(str, min, max) ? false : {msg: '至少' + min + '个'  + maxStr + '字符'};
    });

    return this;
  },

  /**
   * 是否与某个值相等
   * @param comparison
   * @returns {TFvalidator}
   */
  equals: function (comparison) {
    this.rules.push({
      rule: function (str, validData) {
        return validator.equals(str, validData[comparison]) ? false : {msg: '两次的输入必须一致'};
      }
    });

    return this;
  },

  /**
   * 验证帐户是否已经存在
   * @param type 类型 (0, 1, 2)
   * @returns {TFvalidator}
   */
  checkUnique: function (type) {

    this.asyncRules.push({
      rule: function (str) {

        let defer = Q.defer();

        let validResult = {
          msg: '正在验证中',
          async: defer.promise
        };

        let data = {
          word: str
        };

        //判断帐号类型
        if (tfRegex.email.test(str)) {
          data.type = 0;
        } else if (tfRegex.mobile.test(str)) {
          data.type = 1;
        }

        if(type) {
          data.type = type;
        }

        apiCheckUnique(data).then(function (res) {
          defer.resolve(null);
        }, function (err) {
          validResult.msg = '用户不可用';
          validResult.status = 1;
          defer.resolve(validResult);
        });

        return validResult;
      }
    });

    return this;

  }

};

/**
 * 初始化创建 TFvalidator 实例方法
 * @returns {TFvalidator}
 */
TFvalidator.init = function () {
  return new TFvalidator();
};


module.exports = TFvalidator;