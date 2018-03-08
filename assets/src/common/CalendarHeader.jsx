/**
 * 文件说明:
 * 详细描述:时光台历非首页头部
 * 创建者: 韩波
 * 创建时间: 2016/10/10
 * 变更记录:
 */

import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './less/calendarHeader.less';
import authMixin from '../tools/authMixin';
import config from '../../../config.js';
import * as commonActions from '../../src/redux/actions/commonActions';
import HttpClient from '../../src/redux/utils/httpClient';
import Cookies from 'cookies-js';

class CalendarHeader extends React.Component {
  constructor(props) {
    super(props);
    this.isClient = __CLIENT__;
    this.actions = bindActionCreators(Object.assign({},commonActions), props.dispatch);
    this.state = {
      uid:this.isClient? Cookies('tf-uid') : '',
      token:this.isClient? Cookies('tf-token'):'',
      interactive: 0, //互动通知
      system: 0, //系统通知
      order: 0,  //订单密函
      chat: 0 //未读密函
    };
  }


  /**
   * 左侧菜单开关 3.0优化再开发
   */
  /*  leftMenu() {
   this.props.leftWidthChange();
   }*/

  getUnreadMsg() {
    //先请求一次,然后每隔60s执行一次
    this.fnRequestUnread();
    window.headInterval = setInterval(()=> {
      this.fnRequestUnread()
    }, 60000);
  }

  componentWillUnmount(){
    clearInterval(window.headInterval);
  }
  /**
   * 搜索keyEnter事件方法
   */
  componentDidMount() {
    this.actions.getLogo();
    if (this.state.uid && this.state.token) {
      this.getUnreadMsg();
    }

  }

  /**
   * 退出登录
   */
  fnLogout() {
    //销毁登录用户
    authMixin.loginOut();
    window.location.href = config.API_SERVER.host + '/login';
  }

  /**
   * 请求未读消息
   */
  fnRequestUnread(){
    HttpClient.get('/member/unread')
      .then((res) => {
        const result = res.data.datas;
        result.map((item)=>{
          switch (item.tag){
            case 0:
              this.setState({
                interactive: item.count
              });
              break;
            case 1:
              this.setState({
                system: item.count
              });
              break;
            case 2:
              this.setState({
                order: item.count
              });
              break;
            default:
              this.setState({
                chat: item.count
              });
          }
        })
      });
  }

  handelBookUrl(){
    location.href = '/calendar'
  }

  render() {
    const {interactive, system, order, chat} = this.state;
    //静态图片资源定义
    let logo = this.props.getLogoStore || {};
    // 用户个人信息
    let userInfo = this.props.getProfile.userInfo || {};
    //console.log('userInfo',userInfo);
    // 个人中心菜单
    let userMenusData = [
      {
        title: '个人中心',
        path: config.API_SERVER.host+'/user/' + userInfo.uid
      },
      {
        title: '我的时光',
        path: config.API_SERVER.host+'/user/' + userInfo.uid + '/times'
      },
      /*{
       title: '我的时光圈',
       path: '/user/' + userInfo.uid + '/groupLists'
       },*/
      {
        title: '我的作品',
        path: config.API_SERVER.host+'/user/' + userInfo.uid + '/allBooks?type=allBooks'
      },
      {
        title: '我的订单',
        path: config.API_SERVER.host+'/user/' + userInfo.uid + '/userorder'
      },
      {
        title: '帐号设置',
        path: config.API_SERVER.host+'/account/profile'
      }
    ];

    let path = __CLIENT__ ? location.pathname : '';

    return (
      <div className="tf-calendar-header">
        <div className="calendar-navbar">

          <a
            href={logo.link || '/'}
            className="tf-calendar-logo">
            <img src={logo.url}/>
          </a>
          {/*编辑书壳页面显示*/}
          
          <div className="calendar-makeBox"><span className="calendar-line">|</span><span style={{cursor:'pointer'}} onClick={this.handelBookUrl.bind(this)}>定制时光台历</span></div>
          
          {/*已登录的header 右边菜单*/}
          {userInfo.uid ?
            <ul className="right-calendar-menu">
              
              <li className="calendar_cover_menu">
                <a href={config.API_SERVER.host+'/help/login'}>网站帮助</a><a href={config.API_SERVER.host+'/contact'}>联系客服</a>
              </li>
              
              
              <li className="calendar-dropdown-toggle calendar-news-box">
                <a className="calendar-news">
                  {/*消息数量*/}
                  { interactive || system || order || chat ?
                    <span className="calendar-amount">{interactive + system + order + chat}</span> : null}
                </a>
                {/*消息列表菜单*/}
                <ul className="calendar-dropdown-menu">
                  <li>
                    <a href={config.API_SERVER.host+"/user/"+ userInfo.uid+"/messages?type=interactive"}>互动消息
                      {interactive ? <span className="calendar-menu-tips">{interactive}</span> : null}
                    </a>
                  </li>
                  <li>
                    <a href={config.API_SERVER.host+"/user/"+ userInfo.uid+"/messages?type=system"}>系统消息
                      {system ? <span className="calendar-menu-tips">{system}</span> : null}
                    </a>
                  </li>
                  <li>
                    <a href={config.API_SERVER.host+"/user/"+ userInfo.uid+"/messages?type=order"}>订单消息
                      {order ? <span className="calendar-menu-tips">{order}</span> : null}
                    </a>
                  </li>
                  <li>
                    <a href={config.API_SERVER.host+"/user/"+ userInfo.uid+"/chats?type=letter"}>密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;函
                      {/*没有消息tips隐藏 */}
                      {chat ? <span className="calendar-menu-tips">{chat}</span> : null}
                    </a>
                  </li>
                </ul>
              </li>

              {/*个人头像*/}
              <li className="calendar-dropdown-toggle">
                <a className="avator-box">
                  <div className="calendar-avator">
                    <img src={userInfo.avatar}/>
                  </div>
                  {/*用户名*/}
                  <span className="calendar-nickname ellipsis">{userInfo.nickname}</span>
                  {/*箭头*/}
                  <span className="calendar-caret"/>
                </a>
                {/*个人中心菜单*/}
                <ul className="calendar-dropdown-menu">
                  {(()=> {
                    return userMenusData.map((list, index)=> {
                      return <li key={index}>
                        <a href={list.path}>{list.title}</a>
                      </li>
                    });
                  })()}
                  <li><a onClick={this.fnLogout.bind(this)}>退出登录</a></li>
                </ul>
              </li>
            </ul> :
            <ul className="right-calendar-menu">
              <li>
                <a href={config.API_SERVER.host+'/login'}>登录</a>
              </li>
              <li>
                <a href={config.API_SERVER.host+'/register'}>注册</a>
              </li>
            </ul>
          }

        </div>
      </div>
    );
  }
}

function mapStoreToProps(state){
  return {
    getLogoStore:state.getLogoStore,
    unread: state.getUnread,
    getProfile: state.getProfile
  }
}

export default connect(mapStoreToProps)(CalendarHeader);
