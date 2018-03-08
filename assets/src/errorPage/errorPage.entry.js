/**
 * 文件说明: 错误页面
 * 详细描述:
 * 创建者  : 韩波
 * 创建时间: 2016/8/26
 * 变更记录: 
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import ErrorPage from './components/ErrorPage.jsx';
import ConfigureStore from '../redux/utils/configureStore';


if (__CLIENT__) {
  const store = ConfigureStore(undefined, window.__INITIALSTATE__);
  const reactClass = (<Provider store={store}><ErrorPage/></Provider>);
  const rootElement = document.getElementById('app');
  ReactDOM.render(reactClass, rootElement);
}

if (__SERVER__) {
  module.exports = ErrorPage;
}