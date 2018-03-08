var express = require('express');
var router = express.Router();
var URL = require('url');
import merge from 'lodash.merge';
//var pako = require('pako');
var editController = require('../controllers/editController');


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

router.get('/calendar/magic', function (req, res, next) {
  res.render('magic',{
    title: '魔法台历详情_时光流影TIMEFACE',
    keywords:'',
    description:''
  });
});

router.get('/calendar/edit', function (req, res, next) {
  let data = '';
  if (req.query.bookId) {
    data = {
      id: req.query.bookId,
      flag: req.query.type,
      year:2018
    }
  } else {
    data = {
      flag: req.query.type,
      year:2018
    }
  }
  editController.getPodCreate(data, getToken(req))
    .then(function (result) {
      /*let calData = pako.deflate(JSON.stringify(result),{to:'string'});
      let calDatas = JSON.parse(pako.inflate(calData,{to:'string'}));*/
      res.locals.initialState = merge({}, res.locals.initialState, {podCreateStore: result.data,videoStore:result.vedioUrl||''});
      res.render('calendarEditPage', {
        title: '制作台历_时光流影TIMEFACE',
        description: '',
        keywords: ''
      });
    }, function (err) {
      let loginLink = '';
      if (req.query.bookId) {
        loginLink = 'http://' + WEBSITE_HOST + '/login?rurl=http://' + WEBSITE_HOST + '/calendar/edit?bookId=' + req.query.bookId + '&type=' + req.query.type;
      } else {
        loginLink = 'http://' + WEBSITE_HOST + '/login?rurl=http://' + WEBSITE_HOST + '/calendar/edit?type=' + req.query.type;
      }
      if (err.code == 401) {
        res.redirect(loginLink)
      } else if (err.code == 408) {
        let errLink = URL.format({
          pathname: '/calendar/errorPage',
          query: {
            msg: err.data.msg
          }
        });
        res.redirect(errLink);
      } else if (!req.cookies['tf-token'] && !req.cookies['tf-uid']) {
        res.redirect(loginLink)
      } else {
        res.redirect('/calendar/500');
      }
    });
});
module.exports = router;