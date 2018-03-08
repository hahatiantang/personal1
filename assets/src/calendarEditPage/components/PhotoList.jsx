/**
 * 文件说明:
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/11/29
 * 变更记录:
 */

import React, {Component} from 'react';
import filter from 'lodash.filter';
import '../style/photoList.less';
class PhotoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoIndex:''
    }
  }

  //关闭弹出层
  handClose() {
    this.props.close()
  }

  //确定
  handConfirm() {
    let newPhotoStore = this.props.editStore[this.state.photoIndex.index].element_list[this.state.photoIndex.cenIndex];
    let oldPhotoStore = this.props.editStore[this.props.currentIndex].element_list[this.props.phIndex];
    let oldImgList = {
      cenIndex:this.state.photoIndex.cenIndex,
      photoIndex:this.state.photoIndex.index,
      image_content_expand:{
        file:{
          image_width:oldPhotoStore.image_content_expand.image_width,
          image_height:oldPhotoStore.image_content_expand.image_height,
          image_url:oldPhotoStore.image_content_expand.image_url,
          image_start_point_x:0,
          image_start_point_y:0,
          image_orientation:oldPhotoStore.image_content_expand.image_orientation,
          image_scale:1,
          image_rotation:0
        }
      }
    };
    let newImgList = {
      cenIndex:this.props.phIndex,
      currentIndex:this.props.currentIndex,
      image_content_expand:{
        file:{
          image_width:newPhotoStore.image_content_expand.image_width,
          image_height:newPhotoStore.image_content_expand.image_height,
          image_url:newPhotoStore.image_content_expand.image_url,
          image_start_point_x:0,
          image_start_point_y:0,
          image_orientation:newPhotoStore.image_content_expand.image_orientation,
          image_scale:1,
          image_rotation:0
        }
      }
    };
    this.props.handelReplacePhoto(oldImgList,newImgList);
    this.props.close();
  }

  //选择照片
  handSelectTemp(item){
    this.setState({
      photoIndex:item
    })
  }

  //月份判断
  handelMonthName(month){
    let num = month.substring(0,2);
    if(parseInt(num) > 9){

    }else{
      num = num.substring(0,1)
    }
    return num;
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

  render() {
    let editStore = this.props.editStore.slice(0);
    let urlList = [];
    editStore.map((list,index)=>{
      if(list.element_list.length > 0 && list.page_type == 1){
        list.element_list.map((item,cenIndex)=>{
          if(item.element_type == 1&&this.props.currentIndex != index){
            let imgList = {};
            if(/resource/.test(item.element_content)&&this.props.typeList.indexOf(this.props.bookType) > -1&&index == 0){

            }else{
              imgList = {
                index:index,
                cenIndex:cenIndex,
                imgStore:item
              };
              urlList.push(imgList)
            }
          }
        });
      }
    });

    let tempListHtml = urlList.map((item, index)=> {
      let imgSrc = '';
      if(item.imgStore.element_content){
        imgSrc = item.imgStore.element_content+'?x-oss-process=image/auto-orient,0/resize,m_pad,w_98,h_72'
      }
      return (<li key={index}>
        <div 
          className={this.state.photoIndex.index == item.index && this.state.photoIndex.cenIndex == item.cenIndex ? 'over' : ''}
          onClick={this.handSelectTemp.bind(this,item)}>
          <img src={imgSrc} alt=""/>
        </div>
        <p>{this.handelMonthName(this.props.editStore[item.index])}</p>
      </li>)
    });
    return (
      <div className="photo_box">
        <p className="photo_title">请选择调换顺序的图片</p>
        <div className="photo_list">
          <ul>
            {tempListHtml}
          </ul>
          <div className="photo_footer">
            <button type="button" className="btn" disabled={!this.state.photoIndex} onClick={this.handConfirm.bind(this)}>确定</button>
            <button type="button" className="btn cleBtn" onClick={this.handClose.bind(this)}>取消</button>
          </div>
        </div>
      </div>
    )
  }
}
export default PhotoList;