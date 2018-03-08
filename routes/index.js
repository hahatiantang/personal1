var express = require('express');
var router = express.Router();
var path = require('path');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var assetsPath = path.resolve(__dirname, '../assets/src');
var serverRender = require('../utils/serverRender');
var indexController = require('../controllers/indexController');

var errorRouter = require('./error');
var oldIndexRouter = require('./oldIndex');
var calendarEditRouter = require('./calendarEdit');
var podBookRouter = require('./podBook');
router.use(indexController.needLoginPathCtrl);
router.get('/calendar', (req, res, next) => {
  if (!__DEVELOPMENT__) {
    var App = require(path.join(assetsPath, 'calendarPage/calendarPage.entry.js'));
    var state = Object.assign({}, res.app.locals.initialState, res.locals.initialState);
    res.locals.body =  serverRender(App, state);
  }
  res.render('calendarPage',{
    title: '2018年个性台历_宝宝台历定制_2018新年台历制作_时光流影TIMEFACE',
    keywords:'2018年台历,2018狗年台历定制,个性台历设计,宝宝台历diy,台历印刷,台历模板',
    description:'时光流影2018狗年台历定制为您打造属于自己的专属定制台历diy，为家人朋友或者宝宝在线制作一本独一无二的个性台历，仅需上传13张照片，多套台历设计模版可供选择，即刻自动排版印刷。更有神奇的炫动台历等您体验！'
  });
});

//台历2017首页
router.use(oldIndexRouter);
//台历编辑页面
router.use(calendarEditRouter);
//台历预览页面
router.use(podBookRouter);
//错误页面
router.use(errorRouter);

module.exports = router;
