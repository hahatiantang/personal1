/**
 * 文件说明:
 * 详细描述:
 * 创建者:   韩波
 * 创建时间: 2016/8/26
 * 变更记录:
 */
var express = require('express');
var router = express.Router();

router.get('/calendar/500', function (req, res, next) {
  res.status(500).render('error500Page',{
    title:"500页面_时光台历_时光流影TIMEFACE"
  });
});
router.get('/calendar/404', function (req, res, next) {
  res.status(404).render('error404Page',{
    title:"404页面_时光台历_时光流影TIMEFACE"
  });
});

router.get('/calendar/errorPage', function (req, res, next) {
  res.render('errorPage',{
    title:"错误页面_时光台历_时光流影TIMEFACE"
  });
});
module.exports = router;