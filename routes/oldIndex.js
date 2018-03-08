var express = require('express');
var router = express.Router();
var URL = require('url');

router.get('/calendar/2017', function (req, res, next) {
  res.render('index',{
    title: '2017鸡年台历_2017年台历定制_2017年台历印刷_时光流影TIMEFACE',
    keywords:'2017鸡年台历,2017年台历印刷,2017年台历定制,2017宝宝台历制作',
    description:'2017鸡年时光台历分为竖版双面台历和横版双面台历，丰富的台历设计模板，满足不同需求。只需挑选12张照片入册，即可定制印刷属于自己的个性照片台历。'
  });
});
module.exports = router;