import React from 'react';
import classNames from 'classnames';
import reactMixin from 'react-mixin';
import { connect } from 'react-redux';
import bindEvent from '../tools/bindEvents'
import { bindActionCreators } from 'redux';
import './less/header.less';
import ReactDOM from 'react-dom';
import authMixin from '../tools/authMixin';
import dialogMixin from '../tools/dialogMixin';
import config from '../../../config.js';
import StartBook from './StartBook.jsx';
import * as commonActions from '../../src/redux/actions/commonActions';
import HttpClient from '../../src/redux/utils/httpClient';
import Cookies from 'cookies-js';

class Header extends React.Component {
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
      chat: 0,  //未读密函
      changeHeader: false,
      squareHide:''
    };
    //滚动事件定义
    this.windowListeners = {
      scroll: 'changeHeader'
    };

    //改变头部颜色事件
    this.changeHeader = this.changeHeader.bind(this);
  }

  /*滚动事件*/
  changeHeader(event) {
    let winScrollTop = $(window).scrollTop();
    if (winScrollTop > 50) {
      this.setState({
        changeHeader: true
      });
    } else if (winScrollTop < 50) {
      this.setState({
        changeHeader: false
      });
    }
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
    /*设置失效时间*/
    Cookies.set('squareHide', 'true', { expires: '12/31/2017' });
    this.setState({
      squareHide : Cookies('squareHide'),
    });
    //菜单选中效果添加移除
    $(".down_menu li,.childBox li").hover(function() {
      $(this).addClass("current").siblings().removeClass("current");
    });

    //鼠标滑过添加样式
    $('#downMenu').hover(function(){
      $(".twoMenu:first-child,.childMenu:first-child").addClass("current").siblings().removeClass("current");
    });
    $('.search-text').on('keydown', (event)=> {
      if (event.keyCode == 13 && this.refs.searchText.value) {
        //搜索方法
        this.fnSearch();
      }
    });
    if (this.state.uid && this.state.token) {
      this.actions.cartNumber();
      this.getUnreadMsg();
    }

  }


  /**
   * 点击搜索方法
   */
  fnSearch() {
    // location.reload();
    let searchText = this.refs.searchText.value.trim();
    if (searchText) {
      window.location.href = config.API_SERVER.host+'/search?type=book&key='+encodeURIComponent(searchText);
    }
    else {
      return;
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
    //购物车数量
    let cartNumber = this.props.cartNumberStore;
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
      {
       title: '我的时光圈',
       path: '/user/' + userInfo.uid + '/groupLists'
       },
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

    // 一键导入菜单
    let importMenusData = [
      {
        title: '时光书',
        twoMenu:[
          { name:'',
            link:'/timebook',
            img:require('./images/header/timeBook.jpg')
          }
        ]
      }, {
        title: '照片书',
        id:1,
        twoMenu:[
          {
            name:'经典照片书',
            id:1,
            link:'/photobook',
            three:[{
              img:require('./images/header/photobook.jpg')
            }]
          }, {
            name:'高端摄影集',
            link:'/photography',
            three:[{
              img:require('./images/header/photographyBook.jpg')
            }]
          }, {
            name:'宝宝绘画集',
            link:'/artbook',
            three:[{
              img:require('./images/header/artBook.jpg')
            }]
           }
        ]
      }, {
        title: '第三方导入',
        id:2,
        twoMenu:[
          {
            name:'微信书',
            id:2,
            link:'/weixin',
            three:[{
              img:require('./images/header/weixinBook.jpg')
            }]
          },/* {
           name:'微博书',
           link:'/weibo',
           three:[{
           img:require('./images/header/weiboBook.jpg')
           }]
           }, */{
            name:'博客书',
            link:'/blog',
            three:[{
              img:require('./images/header/blogBook.jpg')
            }]
          }, {
            name:'QQ相册书',
            link:'/qzone',
            three:[{
              img:require('./images/header/qqBook.jpg')
            }]
          }, {
            name:'WORD/TXT导入',
            link:'/fileimport',
            three:[{
              img:require('./images/header/txtWordB.jpg')
            }]
          }, {
             name:'PPT内容书',
             link:'/pptimport',
             three:[{
             img:require('./images/header/pptBook.jpg')
            }]
           }/*, {
           name:'公众号内容书',
           link:'',
           three:[{
           img:require('./images/header/menuBook1.jpg')
           }]
           }*/
        ]
      },{
        title: '个性印品',
        id:3,
        twoMenu:[
          {
            name:'时光台历',
            link:'/calendar',
            three:[{
              img:require('./images/header/calendarBook.jpg')
            }]
          }, {
            name:'时光记事本',
            id:3,
            link:'/notebook',
            three:[{
              img:require('./images/header/noteBook.jpg')
            }]
          }
        ]
      }
    ];

    //客户端
    let customer = [
      {
        title:'时光流影',
        path:'/app.html'
      },
      {
        title:'成长印记',
        path:'/baby/downloadApp.html'
      },
      {
        title:'出书神器',
        path:'/actives/2016/bookArtifact'
      },
      {
        title:'Card U',
        path:'/actives/appstar'
      }
    ];

    // 时光印品子菜单数据循环
    let importMenusList = importMenusData.map((item,index)=>{
      let childLists = item.twoMenu.map((list,childIndex)=>{
        let imgs = list.three&&list.three.map((img,imgIndex)=>{
            return(
              <div className="img" key={imgIndex}><a href={list.link}><img src={img.img}/></a></div>
            )
          });
        return(
          <li key={childIndex} className={index!=0?'childMenu':'pImgBox'}>
            {list.name ? <a href={list.link} className="aLink">{list.name}</a>:null}
            {list.name=="时光台历" && this.state.squareHide?<img  className="noteNew" src={require('./images/header/new_notebook.png')}/>:null}
            {list.name=="PPT内容书" && this.state.squareHide?<img  className="noteNew" name="baby" src={require('./images/header/new_notebook.png')}/>:null}
            <i className="childArrow" style={{display:list.name ? 'inline-block':'none'}}>></i>
            {
              list.name ? imgs: <a href={list.link}><img src={list.img}/></a>
            }
          </li>
        )
      });
      return(
        <li key={index} className='twoMenu'>
          <span className="twoTitle">{item.title}</span>
          {item.title=="个性印品" && this.state.squareHide?<img  className="noteNew" src={require('./images/header/new_notebook.png')}/>:null}
          {item.title=="第三方导入" && this.state.squareHide?<img  className="noteNew" name="photo" src={require('./images/header/new_notebook.png')}/>:null}
          <i className="arrow">></i>
          <div className="childBox">
            <ul>
              {childLists}
            </ul>
          </div>
        </li>
      )
    });

    //大首页及各频道首页，页面置于顶部时，导航栏都是透明遮罩样式的，当页面下拉时，才会变成蓝色导航
    let indexHeaderCls;
    let path = __CLIENT__ ? location.pathname : '';
    if ( path == '/calendar' || path == '/calendar/2017') {
      indexHeaderCls = classNames('tf-header', 'tf-header-changeBox',{
        'tf-header-change':!this.state.changeHeader
      });
    } else {
      indexHeaderCls = 'tf-header'
    }

    return (
      <div className={indexHeaderCls}>
        <div className="headerNavBar clearFix">

          <a
            href={logo.link || '/'}
            className="tf_logo">
            <img src={logo.url}/>
          </a>
          {/*编辑书壳页面显示*/}
          {/(edit)|(pod)/.test(path)?
            <div className="makeBoxLine"><span className="line_style">|</span><span style={{cursor:'pointer'}} onClick={this.handelBookUrl.bind(this)}>定制时光台历</span></div> :null
          }
          {this.props.magicTemp ? <div className="makeBoxEdit" onClick={this.props.handleShowMagic.bind(this,0)}>>台历编辑</div> : null}
          {/*header 左边菜单*/}
          {/*编辑书壳页面顶部菜单左侧隐藏*/}
          {/(edit)|(pod)/.test(path)? null:
            <div className="left_menu_box">
            <ul className="left-menu">
              <li className="left_menu_li">
                <a href={config.API_SERVER.host}>首页</a>
                <div className="header_menu_active" style={{display:'/' == path?'block':'none'}}></div>
              </li>
              <li className="left_menu_li">
                <a href={config.API_SERVER.host+'/books'}>作品</a>
                <div className="header_menu_active" style={{display:/(books)/.test(path)?'block':'none'}}></div>
              </li>
              <li className="left_menu_li">
                <a href={config.API_SERVER.host+'/event'}>活动</a>
                <div className="header_menu_active" style={{display:/(event)/.test(path)?'block':'none'}}></div>
              </li>
              <li className="left_menu_li">
                <a href="/group">时光圈</a>
                <div className="header_menu_active" style={{display:'/group'==path?'block':'none'}}></div>
              </li>
              <li className="left_menu_li child_li" id="downMenu">
                <a className="header_caret">
                  <span>时光印品</span>
                </a>
                {/*时光印品子菜单*/}
                <div className="drop_down_menu">
                  <ul className="down_menu">{importMenusList}</ul>
                </div>
              </li>
              <li className="left_menu_li">
                <a className="header_caret"><span>客户端</span></a>
                {/*客户端*/}
                <div className="drop_down_menu1">
                  <ul className="drop_down_book1">
                    {(()=> {
                      return customer.map((list, index)=> {
                        return <li key={index} className="drop_down_book_li1">
                          <a href={list.path} target="_blank">{list.title}</a>
                        </li>
                      });
                    })()}
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          }

          <StartBook  ref="StarDialog" {...this.props} />

          {/*已登录的header 右边菜单*/}
          {userInfo.uid ?
            <div className="right-menu-box">
              <ul className="right-menu">
                {/(edit)|(pod)/.test(path) ? null :
                  <li className="right_menu_li">
                    <a href="javascript:void(0)">
                      <span className="book_need">我要做书</span>
                    </a>
                    {/*记录时光菜单*/}
                    <div className="right_menu_drop">
                      <ul className="right_menu_book">
                        <li className="right_menu_book_li"><a onClick={()=>this.refs.StarDialog.starDialog(true)}>新做一本</a></li>
                        <li className="right_menu_book_li"><a href={config.API_SERVER.host+'/recordTime'}>记录时光</a></li>
                      </ul>
                    </div>
                  </li>}
                <li className="right_menu_li">
                  <a className="right_menu_news">
                    {/*消息数量*/}
                    { interactive || system || order || chat ?
                      <span className="right_menu_amount">{interactive + system + order + chat}</span> : null}
                  </a>
                  {/*消息列表菜单*/}
                  <div className="right_menu_news_drop">
                    <ul className="right_menu_news_dropUl">
                      <li className="right_menu_news_li">
                        <a href={config.API_SERVER.host+"/user/"+ userInfo.uid+"/messages?type=interactive"}>互动消息
                          {interactive ? <span className="right_menu_tips">{interactive}</span> : null}
                        </a>
                      </li>
                      <li className="right_menu_news_li">
                        <a href={config.API_SERVER.host+"/user/"+ userInfo.uid+"/messages?type=system"}>系统消息
                          {system ? <span className="right_menu_tips">{system}</span> : null}
                        </a>
                      </li>
                      <li className="right_menu_news_li">
                        <a href={config.API_SERVER.host+"/user/"+ userInfo.uid+"/messages?type=order"}>订单消息
                          {order ? <span className="right_menu_tips">{order}</span> : null}
                        </a>
                      </li>
                      <li className="right_menu_news_li">
                        <a href={config.API_SERVER.host+"/user/"+ userInfo.uid+"/chats?type=letter"}>密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;函
                          {/*没有消息tips隐藏 */}
                          {chat ? <span className="right_menu_tips">{chat}</span> : null}
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
                {/(edit)|(pod)/.test(path) ? null :
                  <li className="right_menu_li">
                    <a className="right_menu_carts" href={config.API_SERVER.host+'/cart'}>
                      {/*购物车数量*/}
                      {cartNumber?<span className="right_menu_amount">{cartNumber}</span>:null}
                    </a>
                  </li>}

                {/*个人头像*/}
                <li className="right_menu_li">
                <a className="right_menu_avatar_box">
                  <div className="right_menu_avatar">
                      <img src={userInfo.avatar}/>
                    </div>
                    {/*用户名*/}
                    <span className="right_menu_nickname">{userInfo.nickname}</span>
                  </a>
                  {/*个人中心菜单*/}
                  <div className="right_menu_drop">
                    <ul className="right_menu_book">
                      {(()=> {
                        return userMenusData.map((list, index)=> {
                          return <li key={index} className="right_menu_book_li">
                            <a href={list.path}>{list.title}</a>
                          </li>
                        });
                      })()}
                      <li className="right_menu_book_li"><a onClick={this.fnLogout.bind(this)}>退出登录</a></li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div> :
          <div className="right-menu-box1">
            <ul className="right-menu1">
              <li className="right_menu_li_1"><a href={config.API_SERVER.host+'/login'}>登录</a></li>
              <li className="right_menu_li_1"><a href={config.API_SERVER.host+'/register'}>注册</a></li>
            </ul>
          </div>
          }

          {/*搜索框*/}
          {/(edit)|(pod)/.test(path)? null:
            <div className="focus-menu" role="search">
              <div className="search-box">
                <input placeholder="搜索" className="search-text" ref="searchText"/>
                <span className="search-btn" onClick={this.fnSearch.bind(this)}/>
              </div>
            </div>
          }
          {/*编辑书壳页面显示这二个菜单*/}
          {userInfo.uid && /(edit)|(pod)/.test(path) ?
            <div className="center_menu_box">
              <ul className="center_menu">
                <li className="center_menu_li"><a href="/help/login">网站帮助</a></li>
                <li className="center_menu_li"><a href="/contact">联系客服</a></li>
              </ul>
            </div>
            :null}
        </div>
        <div className="header_nav_bg"></div>
      </div>
    );
  }
}

function mapStoreToProps(state){
  return {
    getLogoStore:state.getLogoStore,
    cartNumberStore:state.cartNumberStore,
    unread: state.getUnread,
    getProfile: state.getProfile
  }
}
// 组件混入窗口事件绑定方法
reactMixin.onClass(Header, bindEvent);
dialogMixin(Header);
export default connect(mapStoreToProps)(Header);
