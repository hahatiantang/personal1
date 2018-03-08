/**
 * 文件说明:
 * 详细描述:页面绘制
 * 创建者: 韩波
 * 创建时间: 2016/10/11
 * 变更记录:
 */
import React from 'react';
import DropZone from 'react-dropzone';
import ImageBlur from '../../common/ImageBlur.jsx';
//import canvasHighQuality from '../../common/js/canvasHighQuality.js';
class EditCalendar extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ratioWidht:screen.width < 1920 ? screen.height / 1080  *1.2: 1920 / 1920 *1.2,
      ratioHeight:screen.height <1080 ? screen.height / 1080 *1.2 : 1080 / 1080 *1.2,
      zoomNumber: 2,
      narrowNumber: .5
    }
  }

  //判断图片是jpg格式添加压缩参数
  handImgCrop(ops){
    if((/\.jpg$|\.jpeg$/i).test(ops)){
      return ops + '@80q_1pr'
    }else{
      return ops + '@80q_1pr.png'
    }
  }

  handImgCrop1(ops){
    return ops.image_url + '@4096w_4096h_1l_80q_1pr_' + ops.image_rotation + 'r_2o'
  }

  //编辑文字
  handEditText(res,index){
    let textConfig = {
      element_list:res,
      index:index
    };
    this.props.handEditTextDialog(textConfig);
  }

  //换图
  onDrop(files,imageCfig,index){
    this.props.handleDrop(files,imageCfig,index);
  }

  onOpenClick() {
    this.dropzone.open();
  }

  //裁剪
  handClickCrop(res,index){
    if(!res.image_content_expand.image_url){
      this.props.openAlertMsg('请先上传正确图片！');
      return
    }
    this.props.handImageCrop({},res,index);
  }

  //旋转
  handelRotate(res,index){
    if(!res.image_content_expand.image_url){
      this.props.openAlertMsg('请先上传正确图片！');
      return;
    }
    this.props.handelImgRotate(res,index);
  }

  //显示照片池
  showPhotoList(index){
    this.props.handelOpenPhoto(index)
  }

  //打开纪念日弹窗
  handelOpenMemory(res,index){
    if(this.props.currentIndex == 0){
      return
    }
    this.props.handelMemory(res,index);
  }

  //换图按钮显示隐藏
  showHide(flag,index){
    if(this.props.currentIndex == 0 && (!this.props.videoUrl || !this.props.firstImg) && this.props.magic){
      return
    }
    if(flag == 1){
      $('#cover_btn'+index).show();
    }else{
      $('#cover_btn'+index).hide();
    }
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

  canvasImages(svgIndex,imageMetaData,imageStyle,pageBgWidth,pageBgHeight) {
    const canvas = document.getElementById('imageCanvas'+svgIndex);
    const img = document.getElementById('image'+svgIndex);
    const imgMask = document.getElementById('imageMask'+svgIndex);
    //获取图片的高宽
    let w = imageStyle.width;
    let h = imageStyle.height;
    //获取遮罩图片的高宽
    let mw = pageBgWidth;
    let mh = pageBgHeight;
    let rot = imageMetaData.image_content_expand.image_rotation + this.getOrientationRotation(imageMetaData.image_content_expand.image_orientation);
    if(rot > 360){
      rot = rot - 360;
    }
    if(rot == 90 || rot == 270){
      h = imageStyle.width;
      w = imageStyle.height;
    }
    //角度转为弧度
    let rotation = Math.PI * rot / 180;
    let c = Math.round(Math.cos(rotation) * 1000) / 1000;
    let s = Math.round(Math.sin(rotation) * 1000) / 1000;
    //绘图开始
    let context = canvas.getContext("2d");
    context.save();
    //旋转后canvas标签的大小
    const oldWidth = Math.abs(c * h) + Math.abs(s * w);
    const oldHeight = Math.abs(c * w) + Math.abs(s * h);
    const zoomNumber = this.state.zoomNumber;
    canvas.height = oldWidth * zoomNumber;
    canvas.width = oldHeight * zoomNumber;

    // 放在改变旋转中心点之前绘制遮罩
    if(imgMask){
      if(imgMask.complete){
        context.drawImage(imgMask, 0, 0, mw * zoomNumber, mh * zoomNumber);
        context.globalCompositeOperation = 'source-atop';
      }
    }
    //改变中心点
    if (rotation <= Math.PI / 2) {
      context.translate(s * h * zoomNumber, 0);
    } else if (rotation <= Math.PI) {
      context.translate(canvas.width, -c * h * zoomNumber);
    } else if (rotation <= 1.5 * Math.PI) {
      context.translate(-c * w * zoomNumber, canvas.height);
    } else {
      context.translate(0, -s * w * zoomNumber);
    }
    //旋转
    context.rotate(rotation);
    let top,left;
    //绘制cover
    switch (rot){
      case 90:
        top = imageStyle.top;
        left = -imageStyle.left;
        break;
      case 180:
        top = -imageStyle.left;
        left = -imageStyle.top;
        break;
      case 270:
        top = -imageStyle.top;
        left = imageStyle.left;
        break;
      default:
        top = imageStyle.left;
        left = imageStyle.top;
        break;
    }
    /*//如果原图够大 进行 svg 优化
    //高宽度 比 计算出最小值
    let ratio = pageBgHeight / imageMetaData.image_content_expand.image_height;
    let wR = pageBgWidth / imageMetaData.image_content_expand.image_width;
    if(ratio > wR){
      ratio = wR;
    }
    if(ratio < 0.2 && !imgMask){
      const scaledImage = canvasHighQuality.downScaleImage(img, ratio, canvas, context,imageMetaData.image_content_expand);
      context.drawImage(scaledImage, top, left, w, h);
    }else{
      context.drawImage(img, top, left, w, h);
    }*/
    if(img.complete){
      context.drawImage(img, top * zoomNumber, left * zoomNumber, w * zoomNumber, h * zoomNumber);
      context.restore();
    }else{

    }

  }

  //绘制台历外层box
  handPgeHtml(){
    const bookStyle = this.props.bookStyle;
    const pageStore = this.props.pageStore;
    //书尺寸
    const pageBox = {
      'width':(bookStyle.book_width * this.state.ratioWidht).toFixed(2),
      'height':(bookStyle.book_height * this.state.ratioHeight).toFixed(2),
      'position': 'relative'
    };
    //设置内页
    const pageCenterBox = {
      'position': 'absolute',
      'width':(bookStyle.content_width * this.state.ratioWidht).toFixed(2),
      'height':(bookStyle.content_height * this.state.ratioHeight).toFixed(2),
      'left':(bookStyle.content_padding_left * this.state.ratioWidht).toFixed(2),
      'top':(bookStyle.content_padding_top * this.state.ratioHeight).toFixed(2)
    };
    const pageStyle = {
      'width':(bookStyle.content_width * this.state.ratioWidht).toFixed(2),
      'height':(bookStyle.content_height * this.state.ratioHeight).toFixed(2),
      'backgroundColor':pageStore.page_color || '#fff',
      'backgroundImage':pageStore.page_image ? 'url('+pageStore.page_image+'@70Q)' : 'none',
      'backgroundSize':'100% 100%',
      'backgroundRepeat':pageStore.page_image ? 'no-repeat' : ''
    };
    const centerHtml = this.handPageCenter();
    let pageHtml = <div style={pageBox}>
      <div style={pageCenterBox}>
        <div style={pageStyle}>
          {centerHtml}
        </div>
      </div>
    </div>;
    return pageHtml;
  }

  //绘制台历内页
  handPageCenter(){
    const pageStore = this.props.pageStore || {};
    const centerStore = pageStore.element_list || [];
    const bookStyle = this.props.bookStyle;
    let showUpload = false;
    let showClick = false;
    if(this.props.currentIndex == 0 && (!this.props.videoUrl || !this.props.firstImg) && this.props.magic){
      showClick = true
    }
    const centerHtml = centerStore.map((res,index)=>{
      //内容区域样式
      let pageStyle ={
        width:(res.element_width * this.state.ratioWidht).toFixed(2),
        height:(res.element_height * this.state.ratioHeight).toFixed(2),
        'position': 'absolute',
        'top':(res.element_top * this.state.ratioHeight).toFixed(2),
        'left':(res.element_left * this.state.ratioWidht).toFixed(2),
        'backgroundImage':res.element_background ? 'url('+res.element_background+')' : 'none',
        'backgroundSize':'100% 100%',
        'backgroundRepeat':res.element_background ? 'no-repeat' : '',
        'transform': 'rotate(' + res.element_rotation + 'deg)',
        'MsTransform': 'rotate(' + res.element_rotation + 'deg)', /* IE 9 */
        'MozTransform': 'rotate(' + res.element_rotation + 'deg)', /* Firefox */
        'WebkitTransform': 'rotate(' + res.element_rotation + 'deg)', /* Safari 和 Chrome */
        'OTransform': 'rotate(' + res.element_rotation + 'deg)', /* Opera */
        'zIndex':res.element_depth
      };

      //浮层样式
      let pageStyle1 ={
        width:(res.element_width * this.state.ratioWidht).toFixed(2),
        height:(res.element_height * this.state.ratioHeight).toFixed(2),
        'position': 'absolute',
        'top':(res.element_top * this.state.ratioHeight).toFixed(2),
        'left':(res.element_left * this.state.ratioWidht).toFixed(2)
      };

      let pageStyle2 = {
        width:(res.element_width * this.state.ratioWidht).toFixed(2),
        height:(res.element_height * this.state.ratioHeight).toFixed(2),
        'position': 'absolute',
        'top':(res.element_top * this.state.ratioHeight).toFixed(2),
        'left':(res.element_left * this.state.ratioWidht).toFixed(2),
        'zIndex':res.element_depth,
        background:'rgba(0,0,0,0)'
      };

      let imageCfig = res.image_content_expand || {};
      let textCfig = res.text_content_expand || {};
      let pageBgWidth = (pageStyle.width - (res.element_content_left+res.element_content_right +imageCfig.image_padding_left)* this.state.ratioWidht).toFixed(2);
      let pageBgHeight = (pageStyle.height-(res.element_content_top+res.element_content_bottom +imageCfig.image_padding_top)* this.state.ratioHeight).toFixed(2);
      let imageRotation = imageCfig.image_rotation + this.getOrientationRotation(imageCfig.image_orientation);

      let imageWidth = imageCfig.image_width * imageCfig.image_scale * this.state.ratioWidht;
      let imageHeight = imageCfig.image_height * imageCfig.image_scale * this.state.ratioHeight;

      //图片样式
      let imageStyle = {
        'width':imageWidth.toFixed(2),
        'height':imageHeight > 1 ? imageHeight.toFixed(2) : '1px',
        'top':((imageCfig.image_padding_top + imageCfig.image_start_point_y)  * this.state.ratioHeight).toFixed(2),
        'left':((imageCfig.image_padding_left + imageCfig.image_start_point_x )  * this.state.ratioWidht).toFixed(2),
        'position': 'absolute'
        /*'svgTransform': 'rotate(' + imageRotation + ' ' + (pageBgWidth/2) + ' ' + (pageBgHeight/2) +')',
        'transform': 'rotate(' + imageRotation + 'deg)',
        'MsTransform': 'rotate(' + imageRotation + 'deg)', /!* IE 9 *!/
        'MozTransform': 'rotate(' + imageRotation + 'deg)', /!* Firefox *!/
        'WebkitTransform': 'rotate(' + imageRotation + 'deg)', /!* Safari 和 Chrome *!/
        'OTransform': 'rotate(' + imageRotation + 'deg)'  /!* Opera *!/*/
      };
      if(imageRotation > 360){
        imageRotation = imageRotation - 360;
      }
      if(imageRotation == 90 || imageRotation == 270){
        imageStyle.width = imageHeight.toFixed(2);
        imageStyle.height = imageWidth.toFixed(2);
        // imageStyle.top = ((imageCfig.image_padding_top + imageCfig.image_start_point_x) * this.state.ratioHeight);
        // imageStyle.left = ((imageCfig.image_padding_left + imageCfig.image_start_point_y) * this.state.ratioWidht);
      }
      //挂件或文字背景
      let imgBox = {
        'position': 'absolute',
        'left':(res.element_content_left * this.state.ratioWidht).toFixed(2),
        'right':(res.element_content_right* this.state.ratioWidht).toFixed(2),
        'top':(res.element_content_top * this.state.ratioHeight).toFixed(2),
        'bottom':(res.element_content_bottom * this.state.ratioHeight).toFixed(2),
        'overflow':'hidden'
      };
      let verticalAlign,textAlign;
      if(res.element_type == 2 && !imageCfig.image_url){
        switch (textCfig.text_vertical_align){
          case 1:
            verticalAlign = 'middle';
            break;
          case 2:
            verticalAlign = 'bottom';
            break;
          case 3:
            verticalAlign = 'top';
            break;
          default:
            verticalAlign = 'middle';
            break;
        }
        switch (textCfig.text_align){
          case 1:
            textAlign = 'left';
            break;
          case 2:
            textAlign = 'right';
            break;
          case 3:
            textAlign = 'center';
            break;
          default:
            textAlign = 'left';
            break;
        }
      }
      //文字样式
      let textStyle = {
        'fontFamily':textCfig.font_family,
        'color':textCfig.text_color,
        'fontSize':textCfig.font_size * this.state.ratioWidht,
        'lineHeight':textCfig.text_line_height * this.state.ratioHeight + 'px',
        'verticalAlign':verticalAlign,
        'letterSpacing':textCfig.letter_spacing * this.state.ratioWidht,
        'textAlign':textAlign,
        'fontWeight':textCfig.isB == "0"?'normal':'bold',
        'fontStyle':textCfig.isI == "0"?'normal':'italic ',
        'textDecoration':textCfig.isU == "0"?'none':'underline'
      };
      //图片背景
      let imgBox1 = {
        'position': 'absolute',
        'left':(res.element_content_left * this.state.ratioWidht).toFixed(2),
        'right':(res.element_content_right* this.state.ratioWidht).toFixed(2),
        'top':(res.element_content_top * this.state.ratioHeight).toFixed(2),
        'bottom':(res.element_content_bottom * this.state.ratioHeight).toFixed(2),
        'overflow':'hidden'
      };

      let settingStyle = {
        'position': 'absolute',
        'left':((res.element_content_left -2 ) * this.state.ratioWidht).toFixed(2),
        'right':((res.element_content_right-2)  * this.state.ratioWidht).toFixed(2),
        'top':((res.element_content_top-2)* this.state.ratioHeight).toFixed(2),
        'bottom':((res.element_content_bottom-2)* this.state.ratioHeight).toFixed(2)
      };

      let clientW = res.element_width -res.element_content_top -res.element_content_bottom;
      let clientH = res.element_height -res.element_content_left -res.element_content_right;

      //清晰度不够样式
      let imgBlurStyle={
        'top':0,
        'right':0,
        'zIndex':res.element_depth + 100
      };

      let imgBox2 = {
        'position': 'absolute',
        'left':(res.element_content_left * this.state.ratioWidht).toFixed(2),
        'right':(res.element_content_right* this.state.ratioWidht).toFixed(2),
        'top':(res.element_content_top * this.state.ratioHeight).toFixed(2),
        'bottom':(res.element_content_bottom * this.state.ratioHeight).toFixed(2),
        'overflow':'hidden'
      };
      let imgErr = {
        width:(264 * this.state.ratioWidht).toFixed(2),
        height:(165 * this.state.ratioHeight).toFixed(2),
        position:'absolute',
        top:((pageStyle.height - 165 * this.state.ratioHeight)/2).toFixed(2),
        left:((pageStyle.width - 264 * this.state.ratioWidht)/2).toFixed(2)
      };

      let narrowNumber = this.state.narrowNumber;
      let svgIndex = '99999' + centerStore.content_id + 'def' + this.props.currentIndex;
      let svgIndex1 = '99999' + centerStore.content_id + 'ddd' + this.props.currentIndex;
      let imageAli = imageCfig.image_url + '@1l_60q_1pr_' + imageCfig.image_rotation + 'r_2o';
      let svgHtml = '';
      let svgHtml1 = '';
      let errImg = require('../image/upload-error.png');
      if(this.props.bookType == 103){
        imgErr.width = (89 * this.state.ratioWidht).toFixed(2);
        imgErr.height = (93 * this.state.ratioHeight).toFixed(2);
        imgErr.top = ((pageStyle.height - 89 * this.state.ratioHeight)/2).toFixed(2);
        imgErr.left = ((pageStyle.width - 93 * this.state.ratioWidht)/2).toFixed(2);
        errImg = require('../image/upload-error1.png');
      }
      if(res.element_mask_image){
        imgBox2.backgroundColor = 'transparent';
        svgHtml = "<svg id='svg_mask_wrap"+svgIndex+"' width='"+pageBgWidth+"' height='"+pageBgHeight+"' baseProfile='full' version='1.2'>" +
          "<defs><mask id='svg_mask_"+svgIndex+"' maskUnits='userSpaceOnUse' maskContentUnits='userSpaceOnUse'" +
          "transform='scale(1)'><image fill='black' width='"+pageBgWidth+"' height='"+pageBgHeight+"' xlink:href='" +
          res.element_mask_image+"' /></mask></defs><rect height='100%' width='100%' fill='#969696' opacity='1' mask='url(#svg_mask_" + svgIndex + ")'>" +
          "</rect><image mask='url(#svg_mask_"+svgIndex+")'  y='"+imgErr.top +"' x='"+imgErr.left +"' " +
          "width='"+imgErr.width+"' height='"+imgErr.height+"' xlink:href='" +
          errImg+"' /><rect mask='url(#svg_mask_"+svgIndex+")' x='0' y='0' width='100%' height='100%'  class='svg_hover_style'  fill='#000000' opacity='0'/></svg>"
      }else{
        imgBox2.backgroundColor = '#969696';
      }
      if(imageCfig.image_url&&res.element_mask_image){
        svgHtml1 = "<svg id='svg_mask_wrap" + svgIndex1 + "' width='" + pageBgWidth + "' height='" + pageBgHeight + "' baseProfile='full' version='1.2'>" +
          "<defs><mask id='svg_mask_" + svgIndex1 + "' maskUnits='userSpaceOnUse' maskContentUnits='userSpaceOnUse'" +
          "transform='scale(1)'><image fill='black' width='" +pageBgWidth + "' height='" + pageBgHeight + "' xlink:href='" +
          res.element_mask_image + "' /></mask></defs><image mask='url(#svg_mask_" + svgIndex1 + ")'  y='" + imageStyle.top + "' x='" + imageStyle.left + "' " +
          "width='" + imageStyle.width+ "' height='" + imageStyle.height + "' xlink:href='" +
          imageAli+ "' /><rect mask='url(#svg_mask_" + svgIndex1 + ")' x='0' y='0' width='100%' height='100%'  fill='#000000' opacity='0'/></svg>";
      }
      //图片
      if(res.element_type == 1 || res.element_type == 8){
        //imageStyle.display = 'none';
        if(pageStyle.height + pageStyle.top > (bookStyle.book_height * this.state.ratioHeight)){
          pageStyle.top = pageStyle.top - (pageStyle.height + pageStyle.top - (bookStyle.book_height * this.state.ratioHeight).toFixed(2))
        }
        if(showClick){
          imgBox1.cursor = 'pointer'
        }
        return (<div className="imgSetting" key={svgIndex} onMouseOver={this.showHide.bind(this,1,index)} onMouseLeave={this.showHide.bind(this,2,index)}>
          {imageCfig.image_url ?
            <div style={pageStyle} className="imgBox">
              {res.element_mask_image ? <div style={imgBox1} dangerouslySetInnerHTML={{__html: svgHtml1}}></div> :
                <div style={imgBox1} onClick={showClick ? this.props.handleShowMagic.bind(this,1) : null}>
                  <img style={imageStyle} src={this.handImgCrop1(imageCfig)} alt=""/>
                </div>
              }
            </div>
            :
            <div style={pageStyle}>
              <div style={imgBox2}>
                {res.element_mask_image ?
                  <span dangerouslySetInnerHTML={{__html: svgHtml}}/>
                  :
                  <img style={imgErr} src={errImg}/>
                }
              </div>
            </div>
          }
          <div style={pageStyle1}>
            <div style={settingStyle} className="cover_btn" id={'cover_btn'+index}>
              <div className="btn_Box">
                <div className="btnStyle">
                  <DropZone
                    ref="dropzone"
                    accept="image/jpeg,image/png"
                    className="onDrop"
                    multiple={false}
                    style={{width: '70px'}}
                    onDrop={ (files) => {this.onDrop(files,res,index)}}>
                    <div className="forImage">换图</div>
                  </DropZone>
                  <div className="forImage" onClick={this.handClickCrop.bind(this,res,index)}>裁剪</div>
                  <div className="forImage" onClick={this.handelRotate.bind(this,res,index)}>旋转</div>
                  <div className="forImage" onClick={this.showPhotoList.bind(this,index)}>调序</div>
                </div>
              </div>
            </div>
            {(parseInt(imageCfig.image_width) < 800 || parseInt(imageCfig.image_height) < 800) && imageCfig.image_url ?
              <ImageBlur
                style={imgBlurStyle}
                blurRes={res}
                blurIndex={index}
                blurUpload={this.onDrop.bind(this)}/> : null
            }
          </div>
        </div>)
      }
      //挂件
      if(res.element_type == 5){
        return (
          <div key={index} >
            <div style={pageStyle}>
              {res.element_deleted == 1 || res.element_name.substring(0,res.element_name.length) == 'qrcode'
                || (this.props.currentIndex == 0 && this.props.magic && res.element_name.substring(0,res.element_name.length) == 'pendant2') ? null :
                <div style={imgBox}>
                  <img style={imageStyle} src={this.handImgCrop(imageCfig.image_url)} alt=""/>
                </div>
              }
            </div>
            {res.element_name.substring(0,5) == 'month' || res.element_name.substring(0,res.element_name.length) == 'rlsPendant' || res.element_name.substring(0,res.element_name.length) == 'pendant101' ?
              null : <div style={pageStyle2} className="cursorStyle" onClick={this.handelOpenMemory.bind(this,res,index)}></div>}
          </div>
          )
      }
      //文字
      if(res.element_type == 2){
        if(imageCfig.image_url) {
          return (<div key={index} style={pageStyle}>
            {res.element_deleted == 1 ? null :
              <div style={imgBox} className={res.element_readonly == 1 ? 'cursorStyle' : 'textStyle'}
                   onClick={res.element_readonly == 1 ? this.handelOpenMemory.bind(this,res,index) : this.handEditText.bind(this, res, index)}>
                <img className="settingText"
                     style={imageStyle}
                     src={this.handImgCrop(imageCfig.image_url)}
                     alt=""/>
              </div>
            }
          </div>)
        }
      }
    });

    return centerHtml;
  }

  render() {
    let pageHtml = this.handPgeHtml();
    return (
      <li>
        {pageHtml}
      </li>
    )
  }
}
export default EditCalendar;