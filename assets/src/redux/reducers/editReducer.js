/**
 * 文件说明:编辑台历
 * 详细描述:
 * 创建者: 余成龍
 * 创建时间: 2016/10/10
 * 变更记录:
 */
import * as ActionsType from '../utils/actionsTypes';
import assign from 'lodash.assign';
import filter from 'lodash.filter';
export function podCreateStore(state = {}, action) {
  switch (action.type) {
    case ActionsType.POD_CREATE_DATA:
      return action.store;
    //更改文字
    case ActionsType.EDIT_CALENDAR_TEXT:
      assign(state.content_list[action.currentIndex].element_list[action.index.index], action.textData);
      if(action.currentIndex == 0){
        state.book_title = action.textData.element_content
      }
      return assign({},state);
    //更改版式
    case ActionsType.EDIT_CALENDAR_TEMP:
      assign(state.content_list[action.currentIndex], action.tempData);
      return assign({},state);
    //更换风格
    case ActionsType.EDIT_CALENDAR_STYLE:
      state.content_list.map((item,index)=>{
        if(index > 0 && index < 25){
          item.element_list.map((list)=>{
            if(item.page_type){
              if(list.element_type == 2 && list.element_name.substring(0,list.element_name.length-1) == 'word10'){
                action.styleData[index - 1].map((style)=>{
                  if(style.element_name == list.element_name){
                    style.element_content = list.element_content;
                    style.element_deleted = list.element_deleted;
                    style.image_content_expand = list.image_content_expand;
                    assign(list,style)
                  }
                })
              }
              if(list.element_type == 5 && list.element_name == 'month1'){
                let styleL = _.filter(action.styleData[index - 1],(item)=>{
                  return item.element_name == 'month1'
                });
                assign(list,styleL[0])
              }
            }else{
              if(list.element_type == 5 && list.element_name == 'month1'){
                assign(list,action.styleData[index - 1][0])
              }
            }
          })
        }
      });
      state.book_style = action.params.book_style;
      return assign({},state);
    //图片裁剪
    case ActionsType.IMAGE_CROP:
      state.content_list[action.index.cenIndex].element_list[action.index.index].element_content = action.crop.image_content_expand.image_url;
      assign(state.content_list[action.index.cenIndex].element_list[action.index.index].image_content_expand, action.crop.image_content_expand);
      return assign({},state);
    //图片旋转
    case ActionsType.ROTATION_IMAGE:
      assign(state.content_list[action.currentIndex].element_list[action.index].image_content_expand, action.cropData.image_content_expand);
      return assign({},state);
    //批量上传
    case ActionsType.BULK_UPLOAD:
      let imgList = state.content_list[action.index].element_list[action.cenIndex];
      imgList.element_content = action.file.image_url;
      if(!action.file.image_url){
        assign(imgList.image_content_expand,action.file);
      }else{
        assign(imgList.image_content_expand,centerCutting(action,imgList));
      }
      return assign({},state);
    //纪念日编辑
    case ActionsType.MEMORY_EDIT:
      //flag为1表示删除
      if(action.memoryData.flag == 1){
        //反面
        if(action.memoryData.side == 1){
          state.content_list[action.currentIndex].element_list[action.memoryData.index].element_content = '';
          state.content_list[action.currentIndex].element_list[action.memoryData.index].text_content_expand.text_content = '';
          state.content_list[action.currentIndex].element_list[action.memoryData.index].text_content_expand.text_content = '';
        }else{
          state.content_list[action.currentIndex].element_list[action.memoryData.index].element_deleted = 1;
          state.content_list[action.currentIndex].element_list.map((list)=>{
            if(list.element_type == 2 && list.element_name.substring(0,list.element_name.length-1) == 'word10'){
              list.element_deleted = 1
            }
            if(list.element_type == 5 && list.element_name.substring(0,list.element_name.length) == 'pendant101'){
              list.element_deleted = 1
            }
          })
        }
      }else{
        if(action.memoryData.side == 1){
          state.content_list[action.currentIndex].element_list.map((list)=>{
            if(list.element_type == 2 && list.element_name.substring(0,4) == 'word'){
              list.image_content_expand.image_url = '';
              list.text_content_expand.text_content = '';
              list.element_content = '';
            }
          });
          action.memoryData.backData.map((list)=>{
            list.data.element_model.element_deleted = 0;
            assign(state.content_list[action.currentIndex].element_list[list.dataIndex], list.data.element_model);
          });
        }else if(action.memoryData.side == 2){
          state.content_list[action.currentIndex].element_list.map((list)=>{
            if(list.element_type == 5&&list.element_name.substring(0,5) != 'month' && list.element_name.substring(0,list.element_name.length) != 'pendant101' && list.element_name.substring(0,list.element_name.length) != 'rlsPendant'){
              list.element_deleted = 1
            }
          });
          action.memoryData.saveData.map((item)=>{
            state.content_list[action.currentIndex].element_list.map((list)=>{
              if(list.element_type == 5&&list.element_name.substring(0,5) != 'month' && list.element_name.substring(0,list.element_name.length) != 'pendant101'){
                if(handelDate(list.element_name) == item.day && item.intro.trim()){
                  list.element_deleted = 0
                }
              }
            });
          });
        }else if(action.memoryData.side == 3){
          state.content_list[action.currentIndex].element_list.map((list)=>{
            if(list.element_type == 5 && list.element_name.substring(0,list.element_name.length) == 'pendant101'){
              list.element_deleted = 1
            }
            if(list.element_type == 2 && list.element_name.substring(0,list.element_name.length-1) == 'word10'){
              list.element_deleted = 1
            }
          });
          action.memoryData.frontData.map((list)=>{
            list.data.element_model.element_deleted = 0;
            assign(state.content_list[action.currentIndex].element_list[list.dataIndex], list.data.element_model);
          });
          state.content_list[action.currentIndex].element_list.map((list)=>{
            if(list.element_type == 5 && list.element_name.substring(0,list.element_name.length) == 'pendant101' && action.memoryData.frontData.length > 0){
              list.element_deleted = 0
            }
          })
        }
      }
      return assign({},state);
    //照片替换
    case ActionsType.REPLACE_PHOTO:
      let newPhoto = state.content_list[action.newImgList.currentIndex].element_list[action.newImgList.cenIndex];
      newPhoto.element_content = action.newImgList.image_content_expand.file.image_url;
      assign(newPhoto.image_content_expand,centerCutting(action.newImgList.image_content_expand,newPhoto));
      let oldPhoto = state.content_list[action.oldImgList.photoIndex].element_list[action.oldImgList.cenIndex];
      oldPhoto.element_content = action.oldImgList.image_content_expand.file.image_url;
      assign(oldPhoto.image_content_expand,centerCutting(action.oldImgList.image_content_expand,oldPhoto));
      return assign({},state);
    default:
      return state;
  }
}


//图片居中裁剪
function centerCutting(action,imageList) {
  let imgWidth = action.file.image_width;
  let imgHeight = action.file.image_height;
  if(parseInt(action.file.image_orientation) == 8 || parseInt(action.file.image_orientation) == 6){
     imgWidth = action.file.image_height;
     imgHeight = action.file.image_width;
  }
  var scale;
  var feste = imgWidth / imgHeight;
  var cenWidth = imageList.element_width - (imageList.element_content_left + imageList.element_content_right);
  var cenHeight = imageList.element_height - (imageList.element_content_top + imageList.element_content_bottom);
  var hinten = cenWidth/cenHeight;
  if(feste < hinten){
    scale = cenWidth/imgWidth;
    var imgTop = (imgHeight * scale - cenHeight) /2;
    action.file.image_start_point_y = Math.floor(-imgTop);
  }else{
    scale = cenHeight/imgHeight;
    var imgLeft = (imgWidth * scale - cenWidth) /2;
    action.file.image_start_point_x = Math.floor(-imgLeft);
  }
  action.file.image_scale = scale.toFixed(4);
  return action.file;
}

//判断日期
function handelDate(date){
  let num = date.substring(date.length-2,date.length);
  if(parseInt(num) > 9){

  }else{
    num = num.substring(num.length-1,num.length)
  }
  return parseInt(num);
}