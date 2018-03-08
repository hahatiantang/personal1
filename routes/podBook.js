var express = require('express');
var router = express.Router();
var URL = require('url');
import merge from 'lodash.merge';
var config = require('../config');
var podCtrl = require('../controllers/podCtrl');

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

function brows(ua) { //移动终端浏览器版本信息
  var os = {}, browser = {},
    webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
    android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
    osx = !!ua.match(/\(Macintosh\; Intel /),
    ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
    ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
    iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
    webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
  // win = /Win\d{2}|Windows/.test(platform),
    wp = ua.match(/Windows Phone ([\d.]+)/),
    touchpad = webos && ua.match(/TouchPad/),
    kindle = ua.match(/Kindle\/([\d.]+)/),
    silk = ua.match(/Silk\/([\d._]+)/),
    blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
    bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
    rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
    playbook = ua.match(/PlayBook/),
    chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
    firefox = ua.match(/Firefox\/([\d.]+)/),
    firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
    ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
    webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
    safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);

  // Todo: clean this up with a better OS/browser seperation:
  // - discern (more) between multiple browsers on android
  // - decide if kindle fire in silk mode is android or not
  // - Firefox on Android doesn't specify the Android version
  // - possibly devide in os, device and browser hashes

  if (browser.webkit = !!webkit) browser.version = webkit[1]

  if (android) os.android = true, os.version = android[2]
  if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
  if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
  if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
  if (wp) os.wp = true, os.version = wp[1]
  if (webos) os.webos = true, os.version = webos[2]
  if (touchpad) os.touchpad = true
  if (blackberry) os.blackberry = true, os.version = blackberry[2]
  if (bb10) os.bb10 = true, os.version = bb10[2]
  if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
  if (playbook) browser.playbook = true
  if (kindle) os.kindle = true, os.version = kindle[1]
  if (silk) browser.silk = true, browser.version = silk[1]
  if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
  if (chrome) browser.chrome = true, browser.version = chrome[1]
  if (firefox) browser.firefox = true, browser.version = firefox[1]
  if (firefoxos) os.firefoxos = true, os.version = firefoxos[1]
  if (ie) browser.ie = true, browser.version = ie[1]
  if (safari && (osx || os.ios )) {
    browser.safari = true
    if (!os.ios) browser.version = safari[1]
  }
  if (webview) browser.webview = true

  os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
  (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
  os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
  (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
  (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))
  return os;
}

router.get('/calendar/:bid/pod', function (req,res,next) {

  // 判断是否是移动端
  const $a = brows(req.headers['user-agent']);
  let localUrl = '';
  if (/www\.timeface/.test(req.hostname)) {
    localUrl = "wechat.timeface.cn";
  } else{
    localUrl = "wechat.v5time.net";
  }
  const redirectUrl = URL.format({
    protocol: 'http',
    hostname: localUrl,
    pathname: '/calendar/preview',
    query: {
      bid:parseInt(req.params.bid),
      share:1
    }
  });
  if ($a.phone) {
    res.redirect(redirectUrl);
    return;
  }
  var podData = {
    id:parseInt(req.params.bid),
    type:6
  };
  var podOld = {
    orderflag:0,
    cuid:parseInt(req.params.bid)
  };
  if(req.query.orderId){
    podData.orderId = req.query.orderId;
    podOld.oid = req.query.orderId;
  }
  if(req.query.old){
    podCtrl.getOldPodData(podOld,getToken(req))
      .then(function (result) {
        res.locals.initialState = merge({}, res.locals.initialState,{podStore: result.data});
        res.render('oldPodBook', {
          title: result.data.author+'的个性台历_时光流影TIMEFACE',
          description: result.data.author+'定制的个性台历预览效果',
          keywords: result.data.author+'的个性台历,个性台历定制'
        })
        },function (err) {
          var errorCode = err.data&&err.data.code;
          var newUrl= '/500';
          switch (errorCode) {
            case 'B003001':
              newUrl= URL.format({
                pathname:'/calendar/errorPage',
                query:{
                  msg:"此书已被作者删除，去看看其他的吧！"
                }
              });
              res.redirect(newUrl);
              break;
            default:
              newUrl= URL.format({
                pathname:'/calendar/500'
              });
              res.redirect(newUrl);
          }
        });
  }else{
    podCtrl.getPodData(podData,getToken(req))
      .then(function (result) {
        res.locals.initialState = merge({}, res.locals.initialState,{podStore: result});
        let desIntro,keyIntro;
        if([234,235].indexOf(result.book_type) > -1){
          keyIntro = result.book_title + '，' + result.author_info.name + '的炫动魔法台历,炫动魔法台历定制';
          desIntro = result.book_title + '是' + result.author_info.name + '在线制作的炫动魔法台历，这里有大量精彩内容和大家一起分享。'
        }else{
          keyIntro = result.book_title + '，' + result.author_info.name + '的个性时光台历,个性台历定制';
          desIntro = result.book_title + '是' + result.author_info.name + '在线制作的个性时光台历，这里有大量精彩内容和大家一起分享。'
        }
        res.render('podBook', {
          title: result.book_title + '_时光流影TIMEFACE',
          description: desIntro,
          keywords: keyIntro
        })
        },function (err) {
          var errorCode = err.data&&err.data.code;
          var newUrl= '/500';
          switch (errorCode) {
            case 'B003001':
              newUrl= URL.format({
                pathname:'/calendar/errorPage',
                query:{
                  msg:"此书已被作者删除，去看看其他的吧！"
                }
              });
              res.redirect(newUrl);
              break;
            default:
              newUrl= URL.format({
                pathname:'/calendar/500'
              });
              res.redirect(newUrl);
          }
        });
  }

});
module.exports = router;