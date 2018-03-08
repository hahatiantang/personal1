/**
 * 文件说明:
 * 详细描述:时光台历预览
 * 创建者: 韩波
 * 创建时间: 2016/10/18
 * 变更记录:
 */

import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import URL from 'url';
import pattern from 'url-pattern';
import Cookies from 'cookies-js';
import dialogMixin from '../../tools/dialogMixin';
import {addCart,cartNumber,printChoice} from '../../redux/actions/commonActions';
import AlertMsgDialog from '../../common/AlertMsgDialog.jsx';
import Header from '../../common/Header.jsx';
import PodBookContent from './PodBookContent.jsx';
import PodBookFoot from './PodBookFoot.jsx';
import PodNewCreate from './PodNewCreate.jsx';
import BlurImgTipDialog from '../../calendarEditPage/components/BlurImgTipDialog.jsx';
import {ALERT_MESSAGE} from '../../redux/utils/actionsTypes';
import '../style/podBook.less';

class PodBookPage extends React.Component {
  constructor(props) {
    super(props);
    this.bookId = new pattern('/calendar/:id*').match(location.pathname).id;
    this.queryObj = URL.parse(window.location.href, true).query || {};
    this.actions = bindActionCreators(Object.assign({},{addCart,cartNumber,printChoice}), props.dispatch);
    this.state = {
      playPause:false,
      blurList:[]
    }
  }

  componentDidMount(){
    this.actions.printChoice({
      type:6,
      bookId:this.bookId
    });
    let secondList = [];
    let podStore = this.props.podStore || {};
    podStore.content_list.map((list,index)=>{
      if(list.page_type == 1){
        list.element_list.map((item,index1)=>{
          if(item.element_type == 1){
            if((parseInt(item.image_content_expand.image_width) < 800 || parseInt(item.image_content_expand.image_height) < 800)){
              let blurList = {
                index:index,
                cenIndex:index1,
                flag:'edit'
              };
              secondList.push(blurList);
            }
          }
        })
      }
    });
    this.setState({
      blurList:secondList
    })
  }

  hideNewCreate(type){
    if(type){
      this.openDialog('PodNewCreate')
    }
    Cookies.set('showPod', true, {
      expires: Infinity
    });
  }

  //预览视频
  handelVideo(flag){
    this.setState({
      playPause:flag
    })
  }

  //关闭视频
  handelCloseVideo(e){
    if (e.target.className.indexOf('showFlag') == -1) {
      this.handelVideo(false)
    }
  }

  //加入印刷车
  handelBeAddCrt(){
    if(this.state.blurList.length){
      this.openDialog('BlurImgTipDialog');
    }else {
      this.handelAddCrt();
    }
  }

  //加入印刷车
  handelAddCrt(){
    let printChoiceStore = this.props.printChoiceStore || {};
    let bind = printChoiceStore.bind || [];
    let paper = printChoiceStore.paper || [];
    let size = printChoiceStore.size || [];
    let bindId = bind.length > 0 ? bind[0].id : '';
    let paperId = paper.length > 0 ? paper[0].id : '';
    let sizeId = size.length > 0 ? size[0].id : '';
    let data = {
      bookId: this.bookId,
      type: 6,
      bind: bindId, //打圆孔
      color: 1,
      paper:paperId,
      size: sizeId  //233竖版，232横版
    };
    this.actions.addCart(data,{
      handelSuccess: ()=> {
        this.actions.cartNumber();
        //暂时取消与记事本的关联
        /*if(!Cookies('showPod')){
         this.props.hideNewCreate(true);
         return;
         }*/
        this.props.dispatch({
          type: ALERT_MESSAGE,
          width: 400,
          offset: '-15%',
          msg: '成功加入印刷车',
          hasFooter: true,
          okText: '去结算',
          cancelText: '继续浏览',
          okCall: () => {
            window.location.href = '/cart';
          },
          cancelCall: () => {

          }
        })
      }
    },{
      handelError: ()=> {
        this.props.dispatch({
          type: ALERT_MESSAGE,
          width: 400,
          offset: '-15%',
          msg: '您的印刷车已满,请去清理一下',
          hasFooter: true,
          okText: '去清理',
          cancelText: '继续浏览',
          okCall: () => {
            window.location.href = '/cart';
          },
          cancelCall: () => {

          }
        })
      }
    })
  }

  //去跳转
  handelToLink(){
    let podStore = this.props.podStore || {};
    location.href = '/calendar/edit?bookId='+this.bookId+'&type='+podStore.book_type+'&blur=1';
  }

  render () {
    let podStore = this.props.podStore || {};
    let printChoiceStore = this.props.printChoiceStore || {};
    let authorInfo = podStore.author_info || {};
    let authorId = authorInfo.id;
    let getProfile = this.props.getProfile || {};
    let userInfo = getProfile.userInfo || {};
    let uid = userInfo.uid;
    let showBtn = true;
    if(uid == authorId){
      if(this.queryObj.orderId){
        showBtn = true
      }else{
        showBtn = false
      }
    }else{
      showBtn = true
    }
    let bookType = [69,70,103];
    return (
      <div className="podBookPage">
        {/*公共头部*/}
        <Header/>
        <PodBookContent podStore={podStore} handelVideo={this.handelVideo.bind(this)}/>
        {showBtn || bookType.indexOf(podStore.book_type) > -1 ? null :
        <PodBookFoot
          podStore={podStore}
          dispatch={this.props.dispatch}
          bookId={this.bookId}
          handelBeAddCrt={this.handelBeAddCrt.bind(this)}/>
        }
        <AlertMsgDialog />
        <PodNewCreate
          open={this.state['PodNewCreate']}
          dispatch={this.props.dispatch}
          close={this.closeDialog.bind(this,'PodNewCreate')}
          hideNewCreate={this.hideNewCreate.bind(this)}
        />
        <BlurImgTipDialog
          open={this.state['BlurImgTipDialog']}
          close={this.closeDialog.bind(this,'BlurImgTipDialog')}
          blurList={this.state.blurList}
          handelImgErr={this.handelToLink.bind(this)}
          handelStillSave={this.handelAddCrt.bind(this)}/>
        {this.state.playPause ?
          <div className="videoPrePage" onClick={(e)=>this.handelCloseVideo(e)}>
            <div className="videoPrePageBox">
              <video className="showFlag" preload="auto" width="100%" height="100%" loop="loop" autoPlay="autoPlay">
                <source src={podStore.video_url} type="video/mp4"/>
                Your browser does not support the video tag.
              </video>
              <div className="closePreVideo"></div>
            </div>
          </div>
          : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    podStore:state.podStore,
    getProfile:state.getProfile,
    printChoiceStore:state.printChoiceStore
  }
}
dialogMixin(PodBookPage);
export default connect(mapStateToProps)(PodBookPage);
