/**
 * 文件说明:
 * 详细描述:视频显示区域
 * 创建者: 韩波
 * 创建时间: 2017/8/31
 * 变更记录:
 */

import React from 'react';
import DropZone from 'react-dropzone';
import ImageBlur from '../../common/ImageBlur.jsx';
import CommonProgress from './CommonProgress.jsx';
class MagicVideoArea extends React.Component{
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
      return ops
    }
  }

  handImgCrop1(ops){
    return ops.image_url + '@1l_60q_1pr_' + ops.image_rotation + 'r_2o'
  }

  //换图
  onDrop(files){
    this.props.handleMagicDrop(files,false);
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

  //换图按钮显示隐藏
  showHide(flag,index){
    if(flag == 1){
      $('#cover_btns'+index).show();
    }else{
      $('#cover_btns'+index).hide();
    }
  }

  //播放视频
  handelPlayVideo(){
    this.props.handelVideo(true);
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

  //绘制台历外层box
  handPgeHtml(){
    const bookStyle = this.props.bookStyle;
    const pageStore = this.props.tempStore;
    //书尺寸
    const pageBox = {
      'width':Math.floor(bookStyle.book_width * this.state.ratioWidht),
      'height':Math.floor(bookStyle.book_height * this.state.ratioHeight),
      'position': 'relative'
    };
    //设置内页
    const pageCenterBox = {
      'position': 'absolute',
      'width':Math.floor(bookStyle.content_width * this.state.ratioWidht),
      'height':Math.floor(bookStyle.content_height * this.state.ratioHeight),
      'left':Math.floor(bookStyle.content_padding_left * this.state.ratioWidht),
      'top':Math.floor(bookStyle.content_padding_top * this.state.ratioHeight)
    };
    const pageStyle = {
      'width':Math.floor(bookStyle.content_width * this.state.ratioWidht),
      'height':Math.floor(bookStyle.content_height * this.state.ratioHeight),
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
    const pageStore = this.props.tempStore || {};
    const centerStore = pageStore.element_list || [];
    const bookStyle = this.props.bookStyle;
    const centerHtml = centerStore.map((res,index)=>{
      //内容区域样式
      let pageStyle ={
        width:Math.floor(res.element_width * this.state.ratioWidht),
        height:Math.floor(res.element_height * this.state.ratioHeight),
        'position': 'absolute',
        'top':Math.floor(res.element_top * this.state.ratioHeight),
        'left':Math.floor(res.element_left * this.state.ratioWidht),
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
        width:Math.floor(res.element_width * this.state.ratioWidht),
        height:Math.floor(res.element_height * this.state.ratioHeight),
        'position': 'absolute',
        'top':Math.floor(res.element_top * this.state.ratioHeight),
        'left':Math.floor(res.element_left * this.state.ratioWidht)
      };

      let pageStyle2 = {
        width:Math.floor(res.element_width * this.state.ratioWidht),
        height:Math.floor(res.element_height * this.state.ratioHeight),
      };

      let imageCfig = res.image_content_expand || {};
      let textCfig = res.text_content_expand || {};
      let pageBgWidth = Math.floor(pageStyle.width - (res.element_content_left+res.element_content_right +imageCfig.image_padding_left)* this.state.ratioWidht);
      let pageBgHeight = Math.floor(pageStyle.height-(res.element_content_top+res.element_content_bottom +imageCfig.image_padding_top)* this.state.ratioHeight);
      let imageRotation = imageCfig.image_rotation + this.getOrientationRotation(imageCfig.image_orientation);

      let imageWidth = imageCfig.image_width * imageCfig.image_scale * this.state.ratioWidht;
      let imageHeight = imageCfig.image_height * imageCfig.image_scale * this.state.ratioHeight;

      //图片样式
      let imageStyle = {
        'width':Math.floor(imageWidth),
        'height':imageHeight > 1 ? Math.floor(imageHeight) : '1px',
        'top':Math.floor((imageCfig.image_padding_top + imageCfig.image_start_point_y)  * this.state.ratioHeight),
        'left':Math.floor((imageCfig.image_padding_left + imageCfig.image_start_point_x )  * this.state.ratioWidht),
        'position': 'absolute'
      };
      if(imageRotation > 360){
        imageRotation = imageRotation - 360;
      }
      if(imageRotation == 90 || imageRotation == 270){
        imageStyle.width = Math.floor(imageHeight);
        imageStyle.height = Math.floor(imageWidth);
      }
      //挂件或文字背景
      let imgBox = {
        'position': 'absolute',
        'left':Math.floor(res.element_content_left * this.state.ratioWidht),
        'right':Math.floor(res.element_content_right* this.state.ratioWidht),
        'top':Math.floor(res.element_content_top * this.state.ratioHeight),
        'bottom':Math.floor(res.element_content_bottom * this.state.ratioHeight),
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
        'left':Math.floor(res.element_content_left * this.state.ratioWidht),
        'right':Math.floor(res.element_content_right* this.state.ratioWidht),
        'top':Math.floor(res.element_content_top * this.state.ratioHeight),
        'bottom':Math.floor(res.element_content_bottom * this.state.ratioHeight),
        'overflow':'hidden'
      };

      let settingStyle = {
        'position': 'absolute',
        'left':Math.floor((res.element_content_left -2 ) * this.state.ratioWidht),
        'right':Math.floor((res.element_content_right-2)  * this.state.ratioWidht),
        'top':Math.floor((res.element_content_top-2)* this.state.ratioHeight),
        'bottom':Math.floor((res.element_content_bottom-2)* this.state.ratioHeight)
      };

      let clientW = res.element_width -res.element_content_top -res.element_content_bottom;
      let clientH = res.element_height -res.element_content_left -res.element_content_right;

      //清晰度不够样式
      let imgBlurStyle={
        'top':0,
        'right':0,
        'zIndex':res.element_depth + 5
      };

      let imgBox2 = {
        'position': 'absolute',
        'left':Math.floor(res.element_content_left * this.state.ratioWidht),
        'right':Math.floor(res.element_content_right* this.state.ratioWidht),
        'top':Math.floor(res.element_content_top * this.state.ratioHeight),
        'bottom':Math.floor(res.element_content_bottom * this.state.ratioHeight),
        'overflow':'hidden'
      };

      let imgBox3 = {
        'position': 'absolute',
        'left':Math.floor(res.element_content_left * this.state.ratioWidht),
        'right':Math.floor(res.element_content_right* this.state.ratioWidht),
        'top':Math.floor(res.element_content_top * this.state.ratioHeight),
        'bottom':Math.floor(res.element_content_bottom * this.state.ratioHeight),
        'overflow':'hidden',
        'background':'rgba(0,0,0,.4)'
      };

      let imgErr = {
        width:Math.floor(264 * this.state.ratioWidht),
        height:Math.floor(165 * this.state.ratioHeight),
        position:'absolute',
        top:Math.floor((pageStyle.height - 165 * this.state.ratioHeight)/2),
        left:Math.floor((pageStyle.width - 264 * this.state.ratioWidht)/2)
      };
      let svgIndex = index + res.element_mask_image + imageCfig.image_url + 'def' + this.props.currentIndex;
      let svgIndex1 = index + res.element_mask_image + imageCfig.image_url + 'ddd' + this.props.currentIndex;
      let imageAli = imageCfig.image_url + '@1l_60q_1pr_' + imageCfig.image_rotation + 'r_2o';
      let svgHtml = '';
      let svgHtml1 = '';
      let errImg = require('../image/upload-error.png');
      if(this.props.bookType == 103){
        imgErr.width = Math.floor(89 * this.state.ratioWidht);
        imgErr.height = Math.floor(93 * this.state.ratioHeight);
        imgErr.top = Math.floor((pageStyle.height - 89 * this.state.ratioHeight)/2);
        imgErr.left = Math.floor((pageStyle.width - 93 * this.state.ratioWidht)/2);
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
        if(pageStyle.height + pageStyle.top > Math.floor(bookStyle.book_height * this.state.ratioHeight)){
          pageStyle.top = pageStyle.top - (pageStyle.height + pageStyle.top - Math.floor(bookStyle.book_height * this.state.ratioHeight))
        }
        return (<div className="imgSetting" key={svgIndex} onMouseOver={this.showHide.bind(this,1,index)} onMouseLeave={this.showHide.bind(this,2,index)}>
          {imageCfig.image_url ?
            <div style={pageStyle} className="imgBox">
              {res.element_mask_image ? <div style={imgBox1} dangerouslySetInnerHTML={{__html: svgHtml1}}></div> :
                <div style={imgBox1}>
                  <img style={imageStyle} src={this.handImgCrop1(imageCfig)} alt=""/>
                  <div style={imgBox3}>
                    <div className="imgBoxVideoBg" onClick={this.handelPlayVideo.bind(this)}></div>
                  </div>
                </div>
              }
            </div>
            :
            <div style={pageStyle}>
              <div style={imgBox2}>
                {res.element_mask_image ?
                  <span dangerouslySetInnerHTML={{__html: svgHtml}}/>
                  :
                  <CommonProgress startNum={0} hasError={true} isfinish={true} imgStyle={pageStyle2} handleMagicDrop={this.props.handleMagicDrop}/>
                }
              </div>
            </div>
          }
          <div style={pageStyle1}>
            <div style={settingStyle} className="cover_btn" id={'cover_btns'+index}>
              <div className="btn_Box_magic">
                <div className="btnStyleMagic">
                  <DropZone
                    ref="dropzone"
                    accept="image/jpeg,image/png"
                    className="onDrop"
                    multiple={false}
                    style={{width: '70px'}}
                    onDrop={ (files) => {this.onDrop(files)}}>
                    <div className="forImageMagic">换图</div>
                  </DropZone>
                  <div className="forImageMagic" onClick={this.handClickCrop.bind(this,res,index)}>裁剪</div>
                  <div className="forImageMagic" onClick={this.handelRotate.bind(this,res,index)}>旋转</div>
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
              || (res.element_name.substring(0,res.element_name.length) == 'pendant2')? null :
                <div style={imgBox}>
                  <img style={imageStyle} src={this.handImgCrop(imageCfig.image_url)} alt=""/>
                </div>
              }
            </div>
           </div>
        )
      }
      //文字
      if(res.element_type == 2){
        if(imageCfig.image_url) {
          return (<div key={index} style={pageStyle}>
            {res.element_deleted == 1 ? null :
              <div style={imgBox}>
                <img className="settingText"
                     style={imageStyle}
                     src={imageCfig.image_url}
                     alt=""/>
              </div>
            }
          </div>)
        }else{
          return(<div key={index} style={pageStyle}>
              <div style={imgBox}>
                <div style={textStyle}>{textCfig.text_content}</div>
              </div>
            </div>
          )
        }
      }
    });

    return centerHtml;
  }

  render() {
    let pageHtml = this.handPgeHtml();
    let widthStyle = {
      width:this.props.bookStyle.book_width * this.state.ratioWidht,
      margin:'34px auto 0'
    };
    return (
      <div style={widthStyle}>
        {pageHtml}
        {this.props.magicTemp == 2 ?
          <div className="videoPageUpFont">
            <p className="videoPageUpFontP">上传格式&nbsp;&nbsp;&nbsp;&nbsp;视频的格式为MP4</p>
            <p className="videoPageUpFontP">最佳时限&nbsp;&nbsp;&nbsp;&nbsp;建议视频的时长三十秒以内的短视频</p>
            <p className="videoPageUpFontP">视频要求&nbsp;&nbsp;&nbsp;&nbsp;视频清晰度为720p及其以上，且拍摄光线好</p>
            <p className="videoPageUpFontP">内容信息&nbsp;&nbsp;&nbsp;&nbsp;内容中不含恐怖色情以及反动信息</p>
          </div>
          : null
        }
      </div>
    )
  }
}
export default MagicVideoArea;