
/**
 * 文件说明: authMixin
 * 详细描述:
 * 创建者:   卢怀建
 * 创建时间: 15/12/29
 * 变更记录:
 */



import Q from 'q';
let $ = require('jquery');
let httpClient = require('superagent');
let Cookies = require('cookies-js');
let ls = require('local-storage');
var ParseURL = require('url-parse');

let auth = {

  userCookiesEexpires: 60 * 60 * 24 * 30,

  loginIn (req,freeLogin) {

    let defer = Q.defer();
    let parseUrl = ParseURL(location.href, true);
    let data = {};
    let apiUrl;
    let loginType =ParseURL(parseUrl.query.rurl || '/', true).query.logintype;
    let fcode =ParseURL(parseUrl.query.rurl || '/', true).query.f;
    // todo 删除测试地址
    let preUrl = parseUrl.host.indexOf('timeface') >= 0 ? '' : '';

    // 表单提交数据添加: 活动码
    data.f = fcode || '';
    // 表单提交数据添加: 微博授权码
    data.code = parseUrl.query.code ? parseUrl.query.code : '';

    // 表单提交数据添加: 如果QQ授权成功
    if (parseUrl.hash) {
      // 匹配QQ  code
      let QQat = parseUrl.hash.match('(#|)access_token=([^&?]*)');
      let QQei = parseUrl.hash.match('(#|)expires_in=([^&?]*)');
      data.at = QQat ? QQat[2] : '';
      data.ei = QQei ? QQei[2] : '';
    }

    // 判断是登录类型为(注册用户, QQ 微博, 微信)
    if(loginType) {
      switch (loginType) {
        case 'weibo':
          apiUrl = preUrl + '/tf/auth/thirdlogin';
          data.type = 2;
          break;
        case 'weixin':
          apiUrl = preUrl + '/tf/auth/thirdlogin';
          data.type = 3;
          break;
        case 'qq':
          apiUrl = preUrl + '/tf/auth/thirdlogin';
          data.type = 1;
          break;
        case 'qqImport':
          apiUrl = '';
          break;
        default:
          apiUrl = preUrl + '/tf/auth/login';
      }
    }else if(freeLogin){
      apiUrl = preUrl + '/tf/auth/quicklogin'
    } else {
      apiUrl = preUrl + '/tf/auth/login';
    }

    //替换为superagent
    if(apiUrl){
      httpClient.post(apiUrl)
        .send(req ? req : data)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          if(err) {
            //TODO 错误处理

          defer.reject(res.body);
        }else {

          const resData = res.body.data;

          this.setUid(resData.userInfo.uid);
          this.setToken(resData.token);
          this.setUserInfo(resData.userInfo);

            defer.resolve(resData);
            this.redirectUrl(data.at ? {
              access_token:data.at,
              expires_in: data.ei
            } : {});
          }
        }.bind(this));
    }else{
      console.log('data',data);
      this.redirectUrl(data.at ? {
        access_token:data.at,
        expires_in: data.ei
      } : {});
    }


    return defer.promise;
  },

  /**
   * 退出登录
   */
  loginOut () {
    this.clearToken();
    this.clearUid();
    this.removeUserInfo();
  },

  /**
   * 登录成功后设置数据
   * @param loginData
   */
  setLoginData (loginData) {
    this.setToken(loginData.token);
    this.setUid(loginData.userInfo.uid);
    this.setUserInfo(loginData.userInfo);
  },

  /**
   * 跳转浏览器地址
   * @param query
   */
  redirectUrl (query) {

    // 解析 url 字符串为对象
    let redirectUrlParse = ParseURL(location.href, true);

    // 设置登录页登录时的跳转地址(如果地址中没有回跳, 则默认跳转到个人中心)
    let rurl = redirectUrlParse.query.rurl  || (this.getUserInfo() ? `/user/${this.getUserInfo().uid}` : `/`);

    let parseRurl = ParseURL(rurl, true);

    let rtUrlQuery;

    let parseTokenRurl;

    // 如果是第三方登录
    if(parseRurl.query.logintype) {
      if(parseRurl.query.logintype == 'qqImport'){
        rtUrlQuery = Object.assign(parseRurl.query, {
          'access_token': query.access_token,
          'expires_in': query.expires_in
        });
      }else{
        rtUrlQuery = Object.assign(parseRurl.query, {
          'tf-uid': this.getUid(),
          'tf-token': this.getToken(),
          'loginfrom': parseRurl.query.logintype
        });
      }


      parseTokenRurl = parseRurl.set('query', rtUrlQuery);
    }

    // todo cookie 中获取 token, 如果有则登录状态有效 (3.0将会服务器设置 cookie以及过期时间)

    // 解析跳转(默认登录页, 第三方授权成功回调页)
    if(this.getToken() && (redirectUrlParse.pathname ==  "/login" || redirectUrlParse.pathname ==  "/thirdlogin")) {
      if(!this.getUserInfo().mobile){
        location.href = '/bindMobile';
        return
      }
      location.href = (parseTokenRurl ? parseTokenRurl.href : parseRurl.href);
    }
  },


  /**
   * 设置本地存储用户信息
   * @param info
   */
  setUserInfo (info) {
    ls.set('userInfo', info);
  },

  /**
   * 获取本地存储的用户信息
   * @returns {*}
   */
  getUserInfo () {
   return ls.get('userInfo');
  },

  /**
   * 删除本地存储的用户信息
   * @returns {*}
   */
  removeUserInfo () {
    return ls.remove('userInfo');
  },

  /**
   * 获取顶级域名字符串
   * @returns {string}
   */
  getRootDomain() {
    let hostnameStr = location.hostname.split('.');
    let rootDomain = `.${hostnameStr.slice(hostnameStr.length-2,hostnameStr.length).join('.')}`;
    let isIP = isNaN(parseInt(hostnameStr[0]));

    if(isIP) {
      return rootDomain == '.localhost' ? '' : rootDomain;
    } else {
      return location.hostname;
    }

  },
  /**
   * 设置 token
   * @param token
   */
  setToken (token) {
    Cookies.set('tf-token', token, {
      path: '/',
      domain: this.getRootDomain(),
      expires: this.userCookiesEexpires
      //secure: true
    });
  },

  /**
   * 获取 token
   * @returns {*}
   */
  getToken () {
    return Cookies.get('tf-token');
  },

  /**
   * 清除 token
   * @returns {*}
   */
  clearToken () {
    //return Cookies.expire('tf-token');
    Cookies.set('tf-token', '', {
      path: '/',
      domain: this.getRootDomain(),
      expires: 0
    });
  },

  /**
   * 设置 uid
   * @param uid
   */
  setUid (uid) {
    Cookies.set('tf-uid', uid, {
      path: '/',
      domain: this.getRootDomain(),
      expires: this.userCookiesEexpires
    });
  },

  /**
   * 获取 uid
   * @returns {*}
   */
  getUid () {
    return Cookies.get('tf-uid');
  },

  /**
   * 清除 uid
   * @returns {*}
   */
  clearUid () {
    //return Cookies.expire('tf-uid');
    Cookies.set('tf-uid', '', {
      path: '/',
      domain: this.getRootDomain(),
      expires: 0
    });
  }

};



// 为非纯react页面临时调用
if (typeof window != 'undefined') {
  window.tfAuth = auth;
}

module.exports = auth;
