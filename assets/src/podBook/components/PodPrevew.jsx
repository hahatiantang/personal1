/**
 * 文件说明:
 * 详细描述:台历预览内容页
 * 创建者: 韩波
 * 创建时间: 2016/10/19
 * 变更记录:
 */

import React from 'react';
//import canvasHighQuality from '../../common/js/canvasHighQuality.js';

class PodPrevew extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ratioWidht:screen.width < 1920 ? screen.height / 1080  *1.2: 1920 / 1920 *1.2,
      ratioHeight:screen.height <1080 ? screen.height / 1080 *1.2 : 1080 / 1080 *1.2,
      zoomNumber: 2,
      narrowNumber: .5
    }
  }

  //月份判断
  handelMonthName(pageStore){
    let name = '';
    let pageStores = pageStore || {};
    if(pageStores.content_type == 6){
      name = '封底'
    }else if(pageStores.content_type == 3){
      name = '封面'
    }else{
      let template_file_name = pageStores.template_file_name || '';
      name = template_file_name.substring(0,2);
      if(parseInt(name) > 9){

      }else{
        name = name.substring(0,1)
      }
      name = name + '月';
    }

    return name;
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
    return ops.image_url + '@4096w_4096h_1l_60q_1pr_' + ops.image_rotation + 'r_2o'
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

  //播放视频
  handelPlayVideo(){
    this.props.handelVideo(true)
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
      if(imgMask.complete) {
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
    /*let ratio = pageBgHeight / imageMetaData.image_content_expand.image_height;
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
    if(img.complete) {
      context.drawImage(img, top * zoomNumber, left * zoomNumber, w * zoomNumber, h * zoomNumber);
      context.restore();
    }
  }

  //绘制台历外层box
  handPgeHtml(){
    const bookStyle = this.props.bookStyle;
    const pageStore = this.props.pageStore || {};
    //书尺寸
    const pageBox = {
      'width':Math.floor(bookStyle.book_width * this.state.ratioWidht).toFixed(2),
      'height':Math.floor(bookStyle.book_height * this.state.ratioHeight).toFixed(2),
      'position': 'relative'
    };
    //设置内页
    const pageCenterBox = {
      'position': 'absolute',
      'width':Math.floor(bookStyle.content_width * this.state.ratioWidht).toFixed(2),
      'height':Math.floor(bookStyle.content_height * this.state.ratioHeight).toFixed(2),
      'left':Math.floor(bookStyle.content_padding_left * this.state.ratioWidht).toFixed(2),
      'top':Math.floor(bookStyle.content_padding_top * this.state.ratioHeight).toFixed(2)
    };
    const pageStyle = {
      'width':Math.floor(bookStyle.content_width * this.state.ratioWidht).toFixed(2),
      'height':(bookStyle.content_height * this.state.ratioHeight).toFixed(2),
      'backgroundColor':pageStore.page_color || '#fff',
      'backgroundImage':pageStore.page_image ? 'url('+pageStore.page_image+'@70Q)' : 'none',
      'backgroundSize':'100% 100%',
      'backgroundRepeat':pageStore.page_image ? 'no-repeat' : ''
    };

    const centerHtml = this.handPageCenter();
    let pageHtml = <div style={pageBox} className="podPrevew">
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

      let imageCfig = res.image_content_expand || {};
      let textCfig = res.text_content_expand || {};
      let pageBgWidth = (pageStyle.width - (res.element_content_left+res.element_content_right+imageCfig.image_padding_left)* this.state.ratioWidht).toFixed(2);
      let pageBgHeight = (pageStyle.height-(res.element_content_top+res.element_content_bottom+imageCfig.image_padding_top)* this.state.ratioHeight).toFixed(2);
      let imageRotation = imageCfig.image_rotation + this.getOrientationRotation(imageCfig.image_orientation);
      let imageWidth = imageCfig.image_width * imageCfig.image_scale * this.state.ratioWidht;
      let imageHeight = imageCfig.image_height * imageCfig.image_scale * this.state.ratioHeight;
      //图片样式
      let imageStyle = {
        width:imageWidth.toFixed(2),
        height:imageHeight > 1 ? imageHeight.toFixed(2) : '1px',
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
      let imgBox2 = {
        'position': 'absolute',
        'left':(res.element_content_left * this.state.ratioWidht).toFixed(2),
        'right':(res.element_content_right* this.state.ratioWidht).toFixed(2),
        'top':(res.element_content_top * this.state.ratioHeight).toFixed(2),
        'bottom':(res.element_content_bottom * this.state.ratioHeight).toFixed(2),
        'overflow':'hidden',
        'background':'rgba(0,0,0,.4)'
      };
      let narrowNumber = this.state.narrowNumber;
      let svgIndex = index + res.element_mask_image + imageCfig.image_url;
      let svgHtml = '';
      let imageAli = imageCfig.image_url + '@1l_60q_1pr_' + imageCfig.image_rotation + 'r_2o';
      if(imageCfig.image_url&&res.element_mask_image){
        svgHtml = "<svg id='svg_mask_wrap" + svgIndex + "' width='" + pageBgWidth + "' height='" + pageBgHeight + "' baseProfile='full' version='1.2'>" +
          "<defs><mask id='svg_mask_" + svgIndex + "' maskUnits='userSpaceOnUse' maskContentUnits='userSpaceOnUse'" +
          "transform='scale(1)'><image fill='black' width='" +pageBgWidth + "' height='" + pageBgHeight + "' xlink:href='" +
          res.element_mask_image + "' /></mask></defs><image mask='url(#svg_mask_" + svgIndex + ")'  y='" + imageStyle.top + "' x='" + imageStyle.left + "' " +
          "width='" + imageStyle.width+ "' height='" + imageStyle.height + "' xlink:href='" +
          imageAli+ "' /><rect mask='url(#svg_mask_" + svgIndex + ")' x='0' y='0' width='100%' height='100%'  fill='#000000' opacity='0'/></svg>";
      }

      //图片
      if(res.element_type == 1 || res.element_type == 8){
        //imageStyle.display = 'none';
        if(pageStyle.height + pageStyle.top > (bookStyle.book_height * this.state.ratioHeight).toFixed(2)){
          pageStyle.top = pageStyle.top - (pageStyle.height + pageStyle.top - (bookStyle.book_height * this.state.ratioHeight).toFixed(2))
        }
        return (

          <div key={svgIndex} style={pageStyle}>
            {res.element_mask_image ? <div style={imgBox1} dangerouslySetInnerHTML={{__html: svgHtml}}></div> :
              <div style={imgBox1}>
                <img style={imageStyle} src={this.handImgCrop1(imageCfig)} alt=""/>
                {this.props.magicCalendar && this.props.currentIndex == 0 ?
                  <div style={imgBox2}>
                    <div className="imgBoxVideoBg" onClick={this.handelPlayVideo.bind(this)}></div>
                  </div>
                : null}
              </div>
            }
          </div>
      
        )
      }
      //挂件
      if(res.element_type == 5){
        return (<div  key={index} style={pageStyle}>
          {res.element_deleted == 1 ? null :
            <div style={imgBox}>
              <img style={imageStyle} src={this.handImgCrop(imageCfig.image_url)} alt=""/>
            </div>
          }
        </div>)
      }
      //文字
      if(res.element_type == 2){
        if(imageCfig.image_url) {
          return (
            res.element_content == '请输入文字' ? null :
              <div key={index} style={pageStyle}>
                {res.element_deleted == 1 ? null :
                  <div style={imgBox} className="textStyle">
                    <img className="settingText"
                         style={imageStyle}
                         src={imageCfig.image_url}
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
    let pageStore = this.props.pageStore || {};
    let monthName = this.handelMonthName(pageStore);
    return (
      <li>
        {pageHtml}
        <p className="podPrevewFont">{monthName}</p>
      </li>
    )
  }
}
export default PodPrevew;