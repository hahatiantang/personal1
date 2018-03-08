/**
 * 文件说明:
 * 详细描述:时光台历编辑页面
 * 创建者: 韩波
 * 创建时间: 2016/9/30
 * 变更记录:
 */

import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import URL from 'url';
import filter from 'lodash.filter';
import dialogMixin from '../../tools/dialogMixin';
import {ALERT_MESSAGE} from '../../redux/utils/actionsTypes';
import loadSource from '../../tools/loadedSource';
import * as editActions from '../../redux/actions/editActions.js';
import {uploadImage,uploadImageDao,uploadVideo,getSignature} from '../../redux/actions/commonActions.js';
import AlertMsgDialog from '../../common/AlertMsgDialog.jsx';
import Header from '../../common/Header.jsx';
import CalendarContent from './CalendarContent.jsx';
import CalendarEditFoot from './CalendarEditFoot.jsx';
import ErrUploadDialog from './ErrUploadDialog.jsx';
import BlurImgTipDialog from './BlurImgTipDialog.jsx';
import CropDialog from './CropDialog.jsx';
import MagicPage from './MagicPage.jsx';
import MagicVideoArea from './MagicVideoArea.jsx';
import LoadingBox from '../../common/LoadingBox.jsx';
import '../style/calendarEdit.less';

const cdnSources = [
  '//cdn.bootcss.com/spark-md5/2.0.2/spark-md5.min.js',
  '//cdn.bootcss.com/cropper/2.3.4/cropper.min.css',
  '//cdn.bootcss.com/cropper/2.3.4/cropper.js'
];

class CalendarEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.queryObj = URL.parse(window.location.href, true).query || {};
    this.actions = bindActionCreators(Object.assign({}, editActions,{uploadImage,uploadImageDao,uploadVideo,getSignature}), props.dispatch);
    let btnAct = '';
    if(this.queryObj.bookId){
      btnAct = true
    }else{
      btnAct = false
    }
    this.state = {
      loadShow:false,
      loadInfo:'',
      btnActive:btnAct,
      currentIndex:0,
      //图片失败的数组
      indexList:[],
      cropConfig:{},
      tempStep:1,
      magicTemp:0,
      videoUrl:props.videoStore || '',
      isfinish:false,
      hasError:false,
      showProgress:false,
      playPause:false,
      firstImg:true,
      //图片模糊的数组
      blurList:[]
    };
    //魔法台历类型
    this.typeList = [234,235];
  }

  componentDidMount(){
    loadSource(cdnSources);
    let podCreateStore = this.props.podCreateStore || {};
    if(this.typeList.indexOf(podCreateStore.book_type) > -1){
      podCreateStore.content_list[0].element_list.map((list)=>{
        if(list.element_type == 1){
          if(/resource/.test(list.element_content)){
            this.setState({
              firstImg:false
            })
          }
        }
      });
    }
    if(this.queryObj.blur == 1) {
      for (let i = 0; i < podCreateStore.content_list.length; i++) {
        let blurData = filter(podCreateStore.content_list[i].element_list, (item) => {
          return ((parseInt(item.image_content_expand.image_width) < 800 || parseInt(item.image_content_expand.image_height) < 800))&&item.element_type == 1
        });
        if (blurData.length) {
          this.setState({
            currentIndex: i
          });
          break
        }
      }
    }
  }

  //操作数据保存
  handStore(type,data,index,currentIndex){
    switch (type){
      //更换文本内容
      case 'editText':
        this.actions.editCalendarText(data,index,currentIndex);
        break;
      //更换版式
      case 'editTemp':
        this.actions.editCalendarTemp(data,index);
        break;
      //更换风格
      case 'changeStyle':
        this.actions.editCalendarStyle(data,index);
        break;
      //图片裁剪
      case 'crop':
        this.actions.imageCrop(data,index);
        break;
      //图片旋转
      case 'imgRotate':
        this.actions.rotationImage(data,index,currentIndex);
        break;
      //批量传图
      case 'bulkUpload':
        this.actions.bulkUpload(data,index,currentIndex);
        break;
      //保存
      case 'save':
        this.saveOption(type);
        break;
      //完成
      case 'finish':
        this.saveOption(type);
        break;
      //编辑纪念日
      case 'memory':
        this.actions.memoryHand(data,index);
        break;
      //替换照片
      case 'replace':
        this.actions.replacePhoto(data,index);
        break;
    }
  }

  //图片模糊 去看看
  handelImgErr(){
    this.setState({
      currentIndex:this.state.blurList[0].index
    })
  }

  //保存完成方法
  saveOption(flag){
    let indexList = [],secondList = [];
    this.props.podCreateStore.content_list.map((list,index)=>{
      if(list.page_type == 1){
        list.element_list.map((item,index1)=>{
          if(item.element_type == 1){
            if(!item.image_content_expand.image_url){
              let errList = {
                index:index,
                cenIndex:index1
              };
              indexList.push(errList);
            }
            if((parseInt(item.image_content_expand.image_width) < 800 || parseInt(item.image_content_expand.image_height) < 800)){
              let blurList = {
                index:index,
                cenIndex:index1,
                flag:flag
              };
              secondList.push(blurList);
            }
          }
        })
      }
    });
    if(indexList.length){
      this.setState({
        indexList:indexList
      },()=>{
        this.openDialog('ErrUploadDialog');
      });
      return;
    }
    if(!this.state.firstImg){
      this.commonAlertMsg('请上传台历封面图片');
      return
    }
    if(secondList.length){
      this.setState({
        blurList:secondList
      },()=>{
        this.openDialog('BlurImgTipDialog');
      });
      return
    }else{
      this.setState({
        blurList:[]
      })
    }
    this.handelStillSave(flag);
  }

  //继续保存
  handelStillSave(flag){
    let queryObj = URL.parse(window.location.href, true).query || {};
    let data = {
      calendarId:queryObj.bookId || '',
      json:this.props.podCreateStore,
      year:2018,
      mediaUrl:this.state.videoUrl,
      vagueCount:this.state.blurList.length || 0
    };
    this.setState({
      loadShow:true,
      loadInfo:'保存中……'
    });
    this.actions.saveBook(data,{
      handSuccess:(res)=>{
        this.setState({
          loadShow:false,
          loadInfo:''
        });
        this.handelBtnClick(true);
        if(!queryObj.bookId){
          let newUrl = location.origin+location.pathname+'?bookId='+res.data;
          if(queryObj.type){
            newUrl = newUrl + '&type='+queryObj.type
          }
          window.history.pushState({},'',newUrl);
        }
        if(flag == 'finish'){
          window.location.href = '/calendar/'+res.data+'/pod';
        }else{
          this.commonAlertMsg('保存成功')
        }
      },
      handError:(err)=>{
        this.setState({
          loadShow:false,
          loadInfo:''
        });
        this.commonAlertMsg('保存失败');
      }
    })
  }

  //上传失败，重新上传
  handelErrUpload(files){
    this.setState({
      loadShow:true,
      loadInfo:'图片上传中...'
    });
    this.index = this.state.indexList[0].index;
    this.fileData = files;
    this.uploadLen = files.length;
    this.imgIndex = 0;
    this.sucLen = 0;
    this.errLen = 0;
    this.typeLen = 0;
    this.sizeLen = 0;
    this.upLen = 0;
    this.errIndex=0;
    // 获取sts授权
    this.actions.getSignature({
      handleSuccess: (res) => {
        this.handelRound();
      }
    }, {
      handelError: (err) => {
        this.handelRound();
      }
    });
  }

  //递归判断
  handelRound(){
    if(this.fileData[this.imgIndex].type != 'image/jpeg' && this.fileData[this.imgIndex].type != 'image/jpg' && this.fileData[this.imgIndex].type != 'image/png') {
      this.imgIndex++;
      this.typeLen++;
      if (this.typeLen == this.uploadLen) {
        this.openAlertMsg("您所选图片格式不对，上传图片只支持jpg或png格式！");
        this.setState({
          loadShow: false,
          loadInfo: ''
        });
        return;
      }
      if (this.sucLen + this.sizeLen + this.errLen + this.typeLen < this.state.indexList.length) {
        if (this.imgIndex <= this.uploadLen - 1) {
          this.handelRound();
          return;
        }else{
          this.handelPicForm();
          return;
        }
      } else {
        this.upLen =this.uploadLen - this.state.indexList.length;
        this.handelPicForm();
        return;
      }
    }
    if (parseInt(this.fileData[this.imgIndex].size) > 20971520) {
      this.sizeLen ++;
      this.imgIndex ++;
      if(this.sizeLen == this.uploadLen){
        this.openAlertMsg("图片大小超过范围！");
        this.setState({
          loadShow:false,
          loadInfo:''
        });
        return;
      }
      if(this.sucLen + this.sizeLen + this.errLen + this.typeLen < this.state.indexList.length){
        if(this.imgIndex <= this.uploadLen - 1){
          this.handelRound();
          return;
        }else{
          this.handelPicForm();
          return;
        }
      }else{
        this.upLen =this.uploadLen - this.state.indexList.length;
        this.handelPicForm();
        return;
      }
    }
    this.handelUploadErr(this.fileData[this.imgIndex])
  }

  handelUploadErr(file){
    this.actions.uploadImageDao({
      name: 'image',
      file: file,
      fields: [{name: 'type', value: 'times'}]
    },{
      handleSuccess:(res)=>{
        let image_content_expand = {
          image_width:res.data.image_width,
          image_height:res.data.image_height,
          image_url:res.data.image_url,
          image_start_point_x:res.data.image_start_point_x,
          image_start_point_y:res.data.image_start_point_y,
          image_orientation:res.data.image_orientation,
          image_scale:res.data.image_scale,
          image_rotation:res.data.image_rotation
        };
        this.handStore('bulkUpload',image_content_expand,this.index,this.state.indexList[this.errIndex].cenIndex);
        this.sucLen ++;
        this.imgIndex ++;
        if(this.sucLen + this.sizeLen + this.errLen + this.typeLen < this.state.indexList.length){
          if(this.imgIndex <= this.uploadLen - 1){
            this.errIndex++;
            this.index = this.state.indexList[this.errIndex].index;
            this.handelRound();
          }else{
            this.handelPicForm()
          }
        }else{
          this.upLen =this.uploadLen - this.state.indexList.length;
          this.handelPicForm()
        }

      },handleError:(err)=>{
        this.errLen ++;
        this.imgIndex ++;
        let image_content_expand = {
          image_url:''
        };
        this.handStore('bulkUpload',image_content_expand,this.index,this.state.indexList[this.errIndex].cenIndex);
        if(this.sucLen + this.sizeLen + this.errLen + this.typeLen < this.state.indexList.length){
          if(this.imgIndex < this.uploadLen){
            this.errIndex++;
            this.index = this.state.indexList[this.errIndex].index;
            this.handelRound();
          }else{
            this.setState({
              loadShow:false,
              loadInfo:''
            });
            if(this.sucLen + this.sizeLen + this.errLen + this.typeLen == this.uploadLen){
              this.handelPicForm()
            }
          }
        }else{
          this.upLen =this.uploadLen - this.state.indexList.length;
          this.handelPicForm()
        }
      }});
  }

  handelPicForm(){
    this.setState({
      loadShow:false,
      loadInfo:''
    });
    if(this.typeLen + this.sizeLen + this.errLen + this.upLen > 0){
      this.uploadErrorTip(
        <div style={{fontSize:'14px',padding:'0 20px'}}>
          <p>您有{(this.typeLen + this.sizeLen + this.errLen + this.upLen)}张图片上传失败,失败原因可能是：</p>
          <p>
            1.图片数量超出限制<br/>
            2.单张图片大小超出20M<br/>
            3.图片格式不符合要求<br/>
            4.图片名称过长
          </p>
        </div>
      )
    }
  }

  //公共提示
  commonAlertMsg(msg){
    this.props.dispatch({
      type:ALERT_MESSAGE,
      hasTitle: false,
      duration: 3000,
      width:260,
      msg:msg
    })
  }

  //上传结束提示
  uploadErrorTip(msg){
    this.props.dispatch({
      type:ALERT_MESSAGE,
      width: 330,
      offset:'-20%',
      msg: msg,
      hasTitle:true,
      hasOk:true,
      hasFooter:true,
      modal:true,
      hasCancel:false,
      textAlign:'left'
    })
  }

  //保存、完成按钮的点击事件
  handelBtnClick(flag){
    this.setState({
      btnActive:flag
    });
  }


  //上一页  下一页
  handelUpDown(index){
    this.setState({
      currentIndex:index
    })
  }

  //制作魔法台历
  handleShowMagic(flag){
    let index = 1;
    if(this.state.magicTemp == 2 || !this.state.firstImg || flag == 2){
      index = 0
    }
    console.log(flag,'flag');
    this.setState({
      magicTemp:flag,
      tempStep:1,
      currentIndex:index
    })
  }

  //魔法封面下一步，上一步
  handelNextPrev(flag){
    this.setState({
      tempStep:flag,
      showProgress:false
    })
  }

  //预览视频
  handelVideo(flag){
    this.setState({
      playPause:flag
    })
  }
  
  render () {
    let podCreateStore =  this.props.podCreateStore || {};
    console.log('editStore',podCreateStore);
    let bookStyle = {
      book_width:podCreateStore.book_width,
      book_height:podCreateStore.book_height,
      content_width:podCreateStore.content_width,
      content_height:podCreateStore.content_height,
      content_padding_left:podCreateStore.content_padding_left,
      content_padding_top:podCreateStore.content_padding_top
    };
    let magic = false;
    if(this.typeList.indexOf(podCreateStore.book_type) > -1){
      magic = true;
    }
    return (
      <div className="calendarEditPage">
        <Header magicTemp={this.state.magicTemp} handleShowMagic={this.handleShowMagic.bind(this)}/>
        <CalendarContent
          editStore={podCreateStore.content_list}
          podCreateStore={podCreateStore}
          bookStyle={bookStyle}
          btnActive={this.state.btnActive}
          magicTemp={this.state.magicTemp}
          videoUrl={this.state.videoUrl}
          firstImg={this.state.firstImg}
          actions={this.actions}
          typeList={this.typeList}
          magic={magic}
          currentIndex={this.state.currentIndex}
          handStore={this.handStore.bind(this)}
          handelUpDown={this.handelUpDown.bind(this)}
          handelBtnClick={this.handelBtnClick.bind(this)}
          uploadErrorTip={this.uploadErrorTip.bind(this)}
          handleShowMagic={this.handleShowMagic.bind(this)}
          handImageCrop={this.handImageCrop.bind(this)}
          handelImgRotate={this.handelImgRotate.bind(this)}
          dispatch={this.props.dispatch}/>
        <CalendarEditFoot
          handStore={this.handStore.bind(this)}
          handelNextPrev={this.handelNextPrev.bind(this)}
          handleShowMagic={this.handleShowMagic.bind(this)}
          handelUploadVideo={this.handelUploadVideo.bind(this)}
          handleMagicDrop={this.handleMagicDrop.bind(this)}
          handelVideo={this.handelVideo.bind(this)}
          magicTemp={this.state.magicTemp}
          podCreateStore={podCreateStore}
          videoUrl={this.state.videoUrl}
          firstImg={this.state.firstImg}
          tempStep={this.state.tempStep}/>
        <ErrUploadDialog
          open={this.state['ErrUploadDialog']}
          close={this.closeDialog.bind(this,'ErrUploadDialog')}
          indexList={this.state.indexList}
          handelErrUpload={this.handelErrUpload.bind(this)}/>
        <BlurImgTipDialog
          open={this.state['BlurImgTipDialog']}
          close={this.closeDialog.bind(this,'BlurImgTipDialog')}
          blurList={this.state.blurList}
          handelImgErr={this.handelImgErr.bind(this)}
          handelStillSave={this.handelStillSave.bind(this)}/>
        <CropDialog
          open={this.state['CropDialog']}
          close={this.closeDialog.bind(this,'CropDialog')}
          handStore={this.handStore.bind(this)}
          cropConfig={this.state.cropConfig}
          openAlertMsg={this.commonAlertMsg.bind(this)}
        />
        <LoadingBox loadShow={this.state.loadShow} loadInfo={this.state.loadInfo}/>

        {this.state.magicTemp == 1 ?
          <MagicPage
            videoUrl={this.state.videoUrl}
            tempStep={this.state.tempStep}
            isfinish={this.state.isfinish}
            hasError={this.state.hasError}
            showProgress={this.state.showProgress}
            bookStyle={bookStyle}
            tempStore={podCreateStore.content_list[0]}
            handelVideo={this.handelVideo.bind(this)}
            handImageCrop={this.handImageCrop.bind(this)}
            handelImgRotate={this.handelImgRotate.bind(this)}
            handleMagicDrop={this.handleMagicDrop.bind(this)}
            handelUploadVideo={this.handelUploadVideo.bind(this)}
          />
        : null}
        {this.state.magicTemp == 2 ?
          <div className="magicPage">
            <div className="magicPageBodyBox">
              <MagicVideoArea
                videoUrl={this.state.videoUrl}
                tempStep={this.state.tempStep}
                magicTemp={this.state.magicTemp}
                isfinish={this.state.isfinish}
                hasError={this.state.hasError}
                showProgress={this.state.showProgress}
                bookStyle={bookStyle}
                tempStore={podCreateStore.content_list[0]}
                handelVideo={this.handelVideo.bind(this)}
                handImageCrop={this.handImageCrop.bind(this)}
                handelImgRotate={this.handelImgRotate.bind(this)}
                handleMagicDrop={this.handleMagicDrop.bind(this)}
                handelUploadVideo={this.handelUploadVideo.bind(this)}/>
            </div>
          </div>
        : null}
        {this.state.playPause ?
          <div className="videoPage" onClick={(e)=>this.handelCloseVideo(e)}>
            <div className="videoPageBox">
              <video className="showFlag" preload="auto" width="100%" height="100%" loop="loop" autoPlay="autoPlay">
                <source src={this.state.videoUrl} type="video/mp4"/>
                Your browser does not support the video tag.
              </video>
              <div className="closeVideo"></div>
            </div>
          </div>
        : null}
        {/* 提示弹窗组件 */}
        <AlertMsgDialog />
      </div>
    );
  }

  //关闭视频窗
  handelCloseVideo(e){
    if (e.target.className.indexOf('showFlag') == -1) {
      this.handelVideo(false)
    }
  }


  //图片裁剪
  handImageCrop(img,imageCfig,index){
    let cenIndex = this.state.currentIndex;
    let cropConfit;
    if(_.isEmpty(img)){
      let showWidth = imageCfig.element_width - Math.abs(imageCfig.element_content_left) - Math.abs(imageCfig.element_content_right);
      let showHeight = imageCfig.element_height - Math.abs(imageCfig.element_content_top) - Math.abs(imageCfig.element_content_bottom);
      let imgSeting = imageCfig.image_content_expand;
      cropConfit = {
        x:Math.abs(imgSeting.image_start_point_x/imgSeting.image_scale),
        y: Math.abs(imgSeting.image_start_point_y/imgSeting.image_scale),
        x2:imageCfig.element_width /imgSeting.image_scale + Math.abs(imgSeting.image_start_point_x/imgSeting.image_scale) || imageCfig.element_width,
        y2:imageCfig.element_height /imgSeting.image_scale + Math.abs(imgSeting.image_start_point_y/imgSeting.image_scale) || imageCfig.element_height,
        aspectRatio:imgSeting.image_scale ? (showWidth /imgSeting.image_scale ) / (showHeight /imgSeting.image_scale) : showWidth/showHeight ,
        url:img.image_url || imageCfig.image_content_expand.image_url,
        index:index,
        cenIndex:cenIndex,
        yWidth:img.width || imageCfig.image_content_expand.image_width,
        yHeight:img.height || imageCfig.image_content_expand.image_height,
        sWidth:imageCfig.element_width - imageCfig.element_content_left - imageCfig.element_content_right,
        sHeight:imageCfig.element_height - imageCfig.element_content_top - imageCfig.element_content_bottom,
        image_orientation:imgSeting.image_orientation,
        imageCfig:imgSeting
      };
    }else{
      let zdyImg = this.centerCutting(img,imageCfig);
      var cenWidth = imageCfig.element_width - (imageCfig.element_content_left + imageCfig.element_content_right);
      var cenHeight = imageCfig.element_height - (imageCfig.element_content_top + imageCfig.element_content_bottom);
      imageCfig.image_content_expand.image_rotation = img.image_rotation;
      cropConfit = {
        x:Math.abs(zdyImg.image_start_point_x/zdyImg.image_scale),
        y:Math.abs(zdyImg.image_start_point_y/zdyImg.image_scale),
        x2:(cenWidth /zdyImg.image_scale)+ Math.abs(zdyImg.image_start_point_x/zdyImg.image_scale) || imageCfig.element_width,
        y2:(cenHeight/zdyImg.image_scale) + Math.abs(zdyImg.image_start_point_y/zdyImg.image_scale) || imageCfig.element_height,
        aspectRatio:zdyImg.image_scale ? (cenWidth /zdyImg.image_scale ) / (cenHeight /zdyImg.image_scale) : cenWidth/cenHeight ,
        url:img.image_url || imageCfig.image_content_expand.image_url,
        index:index,
        cenIndex:cenIndex,
        yWidth:img.image_width || imageCfig.image_content_expand.image_width,
        yHeight:img.image_height || imageCfig.image_content_expand.image_height,
        sWidth:imageCfig.element_width - imageCfig.element_content_left - imageCfig.element_content_right,
        sHeight:imageCfig.element_height - imageCfig.element_content_top - imageCfig.element_content_bottom,
        image_orientation:img.image_orientation,
        imageCfig:imageCfig.image_content_expand
      };
    }
    this.setState({
      cropConfig:cropConfit
    },()=>{
      this.openDialog('CropDialog')
    })
  }

  //换图居中裁剪
  centerCutting (action,imageList) {
    let imgWidth = action.image_width;
    let imgHeight = action.image_height;
    if(parseInt(action.image_orientation) == 8 || parseInt(action.image_orientation) == 6){
      imgWidth = action.image_height;
      imgHeight = action.image_width;
    }
    var scale;
    var feste = imgWidth / imgHeight;
    var cenWidth = imageList.element_width - (imageList.element_content_left + imageList.element_content_right);
    var cenHeight = imageList.element_height - (imageList.element_content_top + imageList.element_content_bottom);
    var hinten = cenWidth/cenHeight;
    if(feste < hinten){
      scale = cenWidth/imgWidth;
      var imgTop = (imgHeight * scale - cenHeight) /2;
      action.image_start_point_y = Math.floor(-imgTop);
      action.image_start_point_x = 0;
    }else{
      scale = cenHeight/imgHeight;
      var imgLeft = (imgWidth * scale - cenWidth) /2;
      action.image_start_point_x = Math.floor(-imgLeft);
      action.image_start_point_y = 0;
    }
    action.image_scale = scale.toFixed(4);
    return action;
  }

  //得到图片自身的旋转
  getOrientationRotation(orientation) {
    switch (orientation - 0) {
      case 3:
        return 180;
      case 6:
        return 90;
      case 8:
        return 270;
      default:
        return 0;
    }
  }

  //图片旋转
  handelImgRotate(res,index){
    let rotation = parseInt(res.image_content_expand.image_rotation) + 90;
    let selfRotation = this.getOrientationRotation(res.image_content_expand.image_orientation);
    rotation = rotation === 360 ? 0 : rotation;
    //显示区域的大小
    let width = res.element_width - res.element_content_left - res.element_content_right;
    let height = res.element_height - res.element_content_top - res.element_content_bottom;
    //图片的宽高
    let oWidth = res.image_content_expand.image_width;
    let oHeight = res.image_content_expand.image_height;
    //要显示图片的大小
    let scale, x, y;

    //旋转就调换宽高
    let subRation = rotation + selfRotation;
    if(subRation > 360){
      subRation = subRation - 360;
    }
    if (subRation === 90 || subRation === 270) {
      oWidth = res.image_content_expand.image_height;
      oHeight = res.image_content_expand.image_width;
    }
    // 居中裁剪方式
    if ((oWidth / oHeight) > (width / height)) {// 宽度超过，以高度为准
      scale = (height / oHeight).toFixed(4);
      y = 0;
      x = -(oWidth * scale - width) / 2;
    } else {// 高度超过，以宽度为准
      scale = (width / oWidth).toFixed(4);
      x = 0;
      y = -(oHeight * scale - height) / 2;
    }
    let imageData = {
      image_content_expand: {
        image_rotation: rotation,
        image_scale: scale,
        image_start_point_x: x,
        image_start_point_y: y
      }
    };
    this.handStore('imgRotate',imageData,index,this.state.currentIndex);
  }

  //封面图片上传
  handleMagicDrop(files,flag) {
    if (files[0].type != 'image/jpeg' && files[0].type != 'image/jpg' && files[0].type != 'image/png') {
      this.commonAlertMsg("上传图片只支持jpg或png格式！");
      return;
    }
    if (parseInt(files[0].size) > 20971520) {
      this.commonAlertMsg("请选择小于20M图片！");
      return;
    }
    if (this.state.magicTemp == 2) {
      this.setState({
        loadShow: true,
        loadInfo: '图片上传中...'
      });
    } else {
      this.setState({
        hasError: false,
        isfinish: false,
        showProgress: true
      });
    }

    // 获取sts授权
    this.actions.getSignature({
      handleSuccess: (res) => {
        this.handelTempUpload(files,flag);
      }
    }, {
      handelError: (err) => {
        this.handelTempUpload(files,flag);
      }
    });
  }

  //封面图片上传
  handelTempUpload(files,flag){
    this.actions.uploadImageDao({
      name: 'image',
      file: files[0],
      fields: [{name: 'type', value: 'times'}]
    },{
      handleSuccess:(res)=>{
        let image_content_expand = {
          image_width:res.data.image_width,
          image_height:res.data.image_height,
          image_url:res.data.image_url,
          image_start_point_x:res.data.image_start_point_x,
          image_start_point_y:res.data.image_start_point_y,
          image_orientation:res.data.image_orientation,
          image_scale:res.data.image_scale,
          image_rotation:res.data.image_rotation
        };
        if(this.state.magicTemp == 2){
          this.setState({
            loadShow:false,
            loadInfo:'',
            tempStep:1
          });
        }else{
          this.setState({
            isfinish:true,
            firstImg:true,
            showProgress:false,
            tempStep:3
          });
        }
        this.props.podCreateStore.content_list[0].element_list.map((list,index) => {
          if(list.element_type == 1){
            if(flag == 1){
              this.handStore('bulkUpload', image_content_expand, 0,index)
            }else{
              this.handImageCrop(res.data,list,index)
            }
          }
        });
      },handleError:(err)=>{
        this.setState({
          hasError:true
        });
        if(err.data.code == '自定义错误'){
          this.openAlertMsg("图片格式错误，请用图片处理软件另存一下再上传~");
        }else if(err.data.code == 'timeout'){
          this.openAlertMsg("您的网络有点不太稳定哦~");
        }else{
          this.openAlertMsg("图片上传失败，请重新上传！");
        }
      }})
  }

  //上传视频
  handelUploadVideo(files){
    if(this.state.magicTemp == 2){
      this.setState({
        loadShow:true,
        loadInfo:'视频上传中...'
      });
    }else{
      this.setState({
        hasError:false,
        isfinish:false,
        showProgress:true
      });
    }

    this.actions.uploadVideo({
      file: files[0],
      fields: []
    },{
      handleSuccess:(res)=>{
        if(this.state.magicTemp == 2){
          this.setState({
            videoUrl:res.data,
            loadShow:false,
            loadInfo:''
          });
          this.commonAlertMsg('视频上传成功')
        }else{
          this.setState({
            videoUrl:res.data,
            showProgress:false,
            isfinish:true
          });
        }

      },
      handleError:(err)=>{
        if(this.state.magicTemp == 2){
          this.setState({
            loadShow:false,
            loadInfo:''
          });
          this.commonAlertMsg('视频上传失败')
        }else {
          this.setState({
            hasError: true
          });
        }
      }
    })
  }
}

function mapStateToProps(state) {
  return {
    podCreateStore:state.podCreateStore,
    videoStore:state.videoStore
  }
}
dialogMixin(CalendarEditPage);
export default connect(mapStateToProps)(CalendarEditPage);
