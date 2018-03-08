/**
 * 文件说明:
 * 详细描述:时光台历2018年首页
 * 创建者: 韩波
 * 创建时间: 2016/9/30
 * 变更记录:
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import ConfigureStore from '../redux/utils/configureStore';
import CalendarPage from './components/CalendarPage.jsx';

if (__CLIENT__) {
  const store = ConfigureStore(undefined, window.__INITIALSTATE__);
  const reactClass = (<Provider store={store}><CalendarPage/></Provider>);
  const rootElement = document.getElementById('app');
  ReactDOM.render(reactClass, rootElement);
}

if (__SERVER__) {
  module.exports = CalendarPage;
}