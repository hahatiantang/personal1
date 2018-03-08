/**
 * 文件说明:
 * 详细描述:图片裁剪区域
 * 创建者: 韩波
 * 创建时间: 2016/10/13
 * 变更记录:
 */
import React from 'react';
import '../style/crop.less';


class ImgCrop extends React.Component {
  constructor(props) {
    super(props);
    let imageRotation = props.cropConfig.imageCfig.image_rotation;
    let x = props.cropConfig.x || 0;
    let y = props.cropConfig.y || 0;
    let x2 = props.cropConfig.x2;
    let y2 = props.cropConfig.y2;

    // if (imageRotation == 90 || imageRotation == 270) {
    //   x = props.cropConfig.y || 0;
    //   y = props.cropConfig.x || 0;
    //   y2 = props.cropConfig.x2;
    //   x2 = props.cropConfig.y2
    // }
    this.state = {
      cropData:{
        x:x,
        y:y,
        x2:x2,
        y2:y2
      },
      cropImg:props.cropConfig.url,
      imageRotation:imageRotation,
      imgShow:false,
      cllCropData:{},
      orientation:  this.getOrientationRotation(props.cropConfig.image_orientation)
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


  componentDidMount(){

    this.cropImage = $('#crop_image');
    this.handleImage();
  }

  cropCallBack() {
    setTimeout(() => {
      this.setState({
        imgShow: true
      });
    }, 500)
  }

  /**
   *点击取消关闭裁剪弹出层
   */
  handClose(){
    this.setState({
      cropData:''
    });
    this.props.close()
  }
  /**
   *图像裁剪保存
   */
  handCropImg(){
    let imageObj = this.cropImage.cropper('getData');
    console.log(imageObj,123);
    const scale = (this.props.cropConfig.sWidth / imageObj.width).toFixed(4);
    let cropData = {
      image_content_expand:{
        image_width:this.props.cropConfig.yWidth,
        image_height:this.props.cropConfig.yHeight,
        image_scale:scale,
        image_start_point_x: Math.floor(-imageObj.x * scale),
        image_start_point_y: Math.floor(-imageObj.y * scale),
        image_url:this.props.cropConfig.url,
        image_orientation:this.props.cropConfig.image_orientation
      }
    };
    console.log(cropData,22222);
    let index ={
      index:this.props.cropConfig.index,
      cenIndex:this.props.cropConfig.cenIndex
    };
    this.props.handStore('crop',cropData,index);
    this.handClose()
  }

  /*
   * 初始化裁剪弹窗
   * */
  handleImage() {
    let self = this;
    let options = {
      aspectRatio: self.props.cropConfig.aspectRatio,
      strict: true,
      boxWidth: 285,
      boxHeight: 285,
      trackDocument: true,
      drawBorders: false,
      allowSelect: false,
      movable: false,
      zoomable: false,
      guides: false,
      rotatable: true,
      autoCropArea: false,
      checkOrientation: true,
      checkCrossOrigin: false,
      center: false,
      viewMode: 2,
      data: {
        x: self.state.cropData.x,
        y: self.state.cropData.y,
        width: self.state.cropData.x2 - self.state.cropData.x,
        height: self.state.cropData.y2 - self.state.cropData.y
      },
      built: function () {
        console.log(self.state.cropData,99);
        self.cropCallBack();
        if (self.state.imageRotation + self.state.orientation) {
          self.cropImage.cropper('clear')
            .cropper('rotateTo',self.state.orientation)
            .cropper('clear').cropper('rotateTo',self.state.imageRotation + self.state.orientation)
            .cropper('crop').cropper('setData', {
            y: self.state.cropData.y,
            x: self.state.cropData.x,
            width: self.state.cropData.x2 - self.state.cropData.x,
            height: self.state.cropData.y2 - self.state.cropData.y
          });
        }

      }
    };
    this.cropImage.cropper(options);

  }
  render() {
    return (
      <div className="case_box">
        <div className="case_book_box" >
          <div className="case_book_center">
            <div style={{
              display: this.state.imgShow ? 'block' : 'none',
              width: 285,
              height: 285
            }}>
              <img src={this.state.cropImg+'@60q'} alt="" id="crop_image"/>
            </div>
            { this.state.imgShow ?
              null : <div className="loadingBox">
              <div className="loading">
                <img src={require("../image/loading.gif")} alt=""/>
                <p>图片加载中……</p>
              </div>
            </div>
            }
          </div>
        </div>
        <div className="btnBox">
          <button type="button" className="btn okBtn" disabled={!this.state.imgShow} onClick={this.handCropImg.bind(this)}>确定</button>
          <button type="button" className="btn cancelBtn" onClick={this.handClose.bind(this)}>取消</button>
        </div>

      </div>
    )
  }
}
export default ImgCrop;