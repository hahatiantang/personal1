/**
 * 文件说明:公共服务端请求
 * 详细描述:根据用户是否登录判断当前页面是否可以访问
 * 创建者: 韩波
 * 创建时间: 2016/9/29
 * 变更记录:
 */


var pattern = require('url-pattern');
var config = require('../config');
import merge from 'lodash.merge';
var userInfoCtrl = require('./userInfoController');
function getToken(req) {
  const tfToken = req.cookies['tf-token'];
  const tfUid = req.cookies['tf-uid'];
  if (tfToken && tfUid) {
    return {
      'tf-token': tfToken,
      'tf-uid': tfUid
    };
  } else {
    return {};
  }
}

function getRootDomain(hostname) {
  let hostnameStr = hostname.split('.');
  let rootDomain = `.${hostnameStr.slice(hostnameStr.length - 2, hostnameStr.length).join('.')}`;
  let isIP = isNaN(parseInt(hostnameStr[0]));

  if(isIP) {
    return rootDomain == '.localhost' ? '' : rootDomain;
  } else {
    return hostname;
  }

}

/**
 * 获取登录用户资料
 * @param req
 * @param res
 * @param next
 */

exports.needLoginPathCtrl = function (req, res, next) {
  const unNeedLoginReg = new RegExp('(' + config.VALID_USER_CENTER_PATH.join('|') + ')');
  if(unNeedLoginReg.test(req.path)){
    if (req.cookies['tf-token'] && req.cookies['tf-uid']) {
      userLoginInfo(req,res,next)
    }else{
      res.clearCookie('tf-token', {
        domain: getRootDomain(req.hostname)
      });
      res.clearCookie('tf-uid', {
        domain: getRootDomain(req.hostname)
      });
      next()
    }
  }else if (req.cookies['tf-token'] && req.cookies['tf-uid']) {
    userLoginInfo(req,res,next)
  }else {
    // 清除用户token及uid,防止出现只有一个数据的情况
    res.clearCookie('tf-token', {
      domain: getRootDomain(req.hostname)
    });
    res.clearCookie('tf-uid', {
      domain: getRootDomain(req.hostname)
    });
    res.redirect('/');
  }
};

function userLoginInfo(req,res,next) {
  userInfoCtrl.getUserInfo({}, getToken(req)).then(function (result) {
    res.locals.initialState = merge({}, res.locals.initialState, {
      getProfile: result.data
    });
    next();
  }, function (error) {
    res.clearCookie('tf-token', {
      domain: getRootDomain(req.hostname)
    });
    res.clearCookie('tf-uid', {
      domain: getRootDomain(req.hostname)
    });
    res.redirect('/');
  });
}