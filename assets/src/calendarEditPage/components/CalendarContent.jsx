/**
 * 文件说明:
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/10/11
 * 变更记录:
 */

import React from 'react';
import dialogMixin from '../../tools/dialogMixin';
import {ALERT_MESSAGE} from '../../redux/utils/actionsTypes';
import filter from 'lodash.filter';
import isEmpty from 'lodash.isempty'
import sortBy from 'lodash.sortby';
import URL from 'url';
import Cookies from 'cookies-js';
import EditCalendar from './EditCalendar.jsx';
import CalendarPic from './CalendarPic.jsx';
import CalendarIntroDialog from './CalendarIntroDialog.jsx';
import TempleListDialog from './TempleListDialog.jsx';
import StyleListDialog from './StyleListDialog.jsx';
import UploadDialog from './UploadDialog.jsx';
import MemoryDialog from './MemoryDialog.jsx';
import CalendarGuide from './CalendarGuide.jsx';
import CalendarDiyGuide from './CalendarDiyGuide.jsx';
import PhotoDialog from './PhotoDialog.jsx';
import LoadingBox from '../../common/LoadingBox.jsx';
class CalendarContent extends React.Component{
  constructor(props){
    super(props);
    this.state={
      side:true,
      textConfig:'',
      loadShow:false,
      loadInfo:'',
      tempListData:[],
      styleListData:[],
      memoryList:[],
      date:'',
      showCal:false,
      showDiy:false,
      ratioWidth:screen.width < 1920 ? screen.height / 1080  *1.2: 1920 / 1920 *1.2,
    };
    //上传成功的图片
    this.sucLen = 0;
    //上传失败的图片
    this.errLen = 0;
    //格式错误的图片
    this.typeLen = 0;
    //大小错误的图片
    this.sizeLen = 0;
    //上传的数量
    this.uploadLen = 0;
    //图片的索引
    this.imgIndex = 0;
    //可以上传图片的总数
    this.allNum = 0;
    //超过的图片数量
    this.upLen = 0;
    //上传文件数组
    this.fileData = [];
    //用户上传的图片数组
    this.photoList = [];
    //可被上传的图片区域
    this.elemList = [];
    this.elemIndex = 0;
  }

  componentDidMount(){
    let podCreateStore = this.props.podCreateStore || {};
    this.props.editStore.map((list)=>{
      if(list.page_type == 1){
        list.element_list.map((item)=>{
          if(item.element_type == 1){
            this.allNum ++;
          }
        })
      }
    });
    if(this.props.typeList.indexOf(podCreateStore.book_type) > -1){
      this.allNum --
    }
    //判断是否显示新手引导
    if (!Cookies("showCal") && (podCreateStore.book_type == 69 || podCreateStore.book_type == 70)) {
      this.setState({
        showCal: true
      })
    }
    if(!Cookies("showDiy") && podCreateStore.book_type == 103){
      this.setState({
        showDiy:true
      })
    }

    //风格列表请求
    let data = {
      book_type:podCreateStore.book_type
    };
    this.props.actions.styleListAction(data,{
      handelSuc:(res)=>{
        this.setState({
          styleListData:res.data
        })
      },
      handelError:(err)=>{
        this.setState({
          loadInfo:'',
          loadShow:false
        })
      }
    });

  }

  //更改版式列表
  handTempDialog(){
    this.setState({
      loadInfo:'数据请求中...',
      loadShow:true
    });
    let currentData = this.props.editStore[this.props.currentIndex];
    let contentId = [];
    contentId.push(currentData.content_id);
    let data = {
      podId:this.props.podCreateStore.book_id,
      content_ids:contentId,
      bookType:this.props.podCreateStore.book_type,
      type:this.props.currentIndex ? 1 : 0
    };
    this.props.actions.tempListAction(data,{
      handelSuc:(res)=>{
        this.setState({
          tempListData:res.data,
          loadInfo:'',
          loadShow:false
        },()=>{
          this.openDialog('TempleListDialog')
        })
      },
      handelError:(err)=>{
        this.openAlertMsg('版式数据请求失败');
        this.setState({
          loadInfo:'',
          loadShow:false
        })
      }
    });
  }

  //更改风格列表
  handelStyleDialog(){
    this.setState({
      loadInfo:'数据请求中...',
      loadShow:true
    });
    if(this.state.styleListData.length){
      this.setState({
        loadInfo:'',
        loadShow:false
      },()=>{
        this.openDialog('StyleListDialog')
      })
    }else{
      let data = {
        book_type:this.props.podCreateStore.book_type
      };
      this.props.actions.styleListAction(data,{
        handelSuc:(res)=>{
          this.setState({
            styleListData:res.data,
            loadInfo:'',
            loadShow:false
          },()=>{
            this.openDialog('StyleListDialog')
          })
        },
        handelError:(err)=>{
          this.openAlertMsg('风格数据请求失败');
          this.setState({
            loadInfo:'',
            loadShow:false
          })
        }
      });
    }
  }

  //更换风格
  handelChangeStyle(name){
    let tempArr = [];
    this.props.editStore.map((list,index)=>{
      if(index > 0 && index < 25 && list.page_type){
        tempArr.push(list.template_file_name)
      }
    });
    let data = {
      book_type:this.props.podCreateStore.book_type,
      book_style:name,
      template_file_name:tempArr.join(',')
    };
    this.setState({
      loadInfo:'风格更换中...',
      loadShow:true
    });
    this.props.actions.changeStyle(data,{
      handelSucc:(res)=>{
        this.props.handStore('changeStyle',res.data,data);
        this.setState({
          loadInfo:'',
          loadShow:false
        })
      },
      handelError:()=>{
        this.openAlertMsg('风格更换失败');
        this.setState({
          loadInfo:'',
          loadShow:false
        })
      }
    })
  }

  //批量传图
  handUploadDialog(){
    this.openDialog('UploadDialog')
  }

  //正反面
  handSide(flag){
    if(this.state.side == flag){
      return
    }
    let trueIndex = this.props.currentIndex;
    if(flag){
      this.setState({
        side:flag
      });
      if(this.props.editStore[trueIndex].content_type == 6){
        trueIndex = 0
      }else{
        trueIndex = trueIndex - 1
      }
    }else{
      this.setState({
        side:flag
      });
      if(this.props.editStore[trueIndex].content_type == 3){
        trueIndex = 25
      }else{
        trueIndex = trueIndex + 1
      }
    }
    this.props.handelUpDown(trueIndex)
  }

  //月份判断
  handelMonth(month){
    let num = month.substring(0,2);
    if(parseInt(num) > 9){

    }else{
      num = num.substring(0,1)
    }
    return num;
  }

  //日期判断
  handelDate(date){
    let num = date.substring(date.length-2,date.length);
    if(parseInt(num) > 9){

    }else{
      num = num.substring(num.length-1,num.length)
    }
    return num;
  }

  //纪念日列表
  handelMemory(res,index){
    let queryObj = URL.parse(window.location.href, true).query;
    let month = parseInt(this.handelMonth(this.props.editStore[this.props.currentIndex].template_file_name));
    let date = '';
    if(res != 1){
      if(this.state.side){
        if(res.element_name.substring(0,5) == 'month'){
          return
        }else{
          date = parseInt(this.handelDate(res.element_name))
        }
      }else{
        let bigDate = res.element_name.substring(res.element_name.length-2,res.element_name.length);
        if(parseInt(bigDate) > 31){
          return
        }else{
          date = parseInt(this.handelDate(bigDate))
        }
      }
    }
    let data = {
      month:month
    };
    if(this.props.btnActive){
      data.calendarId = queryObj.bookId
    }else{
      data.podId = this.props.podCreateStore.book_id
    }
    this.setState({
      loadInfo:'数据请求中...',
      loadShow:true
    });
    this.props.actions.memoryListAction(data,{
      handelSu:(result)=>{
        let originData = [{
          month: month,
          day: date || 1,
          intro: ''
        }];
        if(!isEmpty(result.data.datas)){
          originData = result.data.datas;
          if(!isEmpty(result.data.datas)) {
            originData = result.data.datas;
            if (res != 1) {
              let add = true;
              for (let i = 0; i < originData.length; i++) {
                if (originData[i].day == date) {
                  add = false;
                  break;
                }
              }
              if(add && originData.length < 3){
                let origin = {
                  month: month,
                  day: date || 1,
                  intro: ''
                };
                originData.push(origin)
              }
            }
          }
        }
        this.setState({
          memoryList:originData,
          date:date,
          loadInfo:'',
          loadShow:false
        },()=>{
          this.openDialog('MemoryDialog')
        })
      },
      handelError:(err)=>{
        this.setState({
          loadInfo:'',
          loadShow:false
        })
      }
    });
  }

  //上一页下一页
  handelLeftTight(flag){
    let index = this.props.currentIndex;
    if(flag == 'right'){
      if(this.props.editStore[index].content_type == 3 || index == 24){
        index = index + 1
      }else{
        index = index + 2
      }
    }else{
      if(this.props.editStore[index].content_type == 6 || index == 1){
        index = index - 1
      }else{
        index = index - 2
      }
    }
    this.props.handelUpDown(index);
  }

  //选择相应的月份
  handelTrueMonth(index){
    let rightIndex = 0;
    if(this.state.side){
      if(index){
        rightIndex = index * 2 - 1
      }
    }else{
      if(index == 12){
        rightIndex = index * 2 +1
      }else{
        rightIndex = (index + 1) * 2
      }
    }
    this.props.handelUpDown(rightIndex);
  }

  //编辑文字弹出层
  handEditTextDialog(txtConfig){
    this.setState({
      textConfig:txtConfig
    },()=>{
      this.openDialog('CalendarIntroDialog')
    })
  }

  //编辑文字
  handelTextEdit(textConfig,index){
    this.setState({
      loadShow:true,
      loadInfo:'文字保存中...'
    });
    let calendarData =this.props.podCreateStore;
    let textData = {
      id:calendarData.book_id,
      text:textConfig.element_list.element_content || '请输入文字',
      tempId:calendarData.template_id,
      tempInfo:textConfig.element_list
    };
    this.props.actions.editText(textData,{
      handelSuccess:(res)=>{
        this.setState({
          loadShow:false,
          loadInfo:''
        });
        this.props.handStore('editText',res.data.element_model,index,this.props.currentIndex)
      },
      handelError:(err)=>{
        this.setState({
          loadShow:false,
          loadInfo:''
        });
      }
    });
  }

  //更改版式
  handelReplaceTemp(tempId){
    this.setState({
      loadInfo:'版式替换中...',
      loadShow:true
    });
    let data = {
      id:tempId,
      podId:this.props.podCreateStore.book_id,
      content_list:[this.props.editStore[this.props.currentIndex]],
      type:this.props.currentIndex ? 1 : 0,
      bookStyle:this.props.podCreateStore.book_style
    };
    this.props.actions.editTemp(data,{
      handelSucc:(res)=>{
        let tempData = res.data.content_list[0];
        this.props.handStore('editTemp',tempData,this.props.currentIndex);
        this.setState({
          loadInfo:'',
          loadShow:false
        });
      },
      handelError:(err)=>{
        this.setState({
          loadInfo:'',
          loadShow:false
        });
      }
    });
  }

  //单图上传
  handleDrop(files,imageCfig,index){
    if(files[0].type != 'image/jpeg' && files[0].type != 'image/jpg' && files[0].type != 'image/png'){
      this.openAlertMsg("上传图片只支持jpg或png格式！");
      return;
    }
    if (parseInt(files[0].size) > 20971520) {
      this.openAlertMsg("请选择小于20M图片！");
      return;
    }
    this.setState({
      loadShow:true,
      loadInfo:'图片上传中...'
    });
    // 获取sts授权
    this.props.actions.getSignature({
      handleSuccess: (res) => {
        this.handelUploadImg(files,imageCfig,index);
      }
    }, {
      handelError: (err) => {
        this.handelUploadImg(files,imageCfig,index);
      }
    });
  }

  //单图上传
  handelUploadImg(files,imageCfig,index){
    this.props.actions.uploadImageDao({
      name: 'image',
      file: files[0],
      fields: [{name: 'type', value: 'times'}]
    },{
      handleSuccess:(res)=>{
        this.props.handImageCrop(res.data,imageCfig,index);
        this.setState({
          loadShow:false,
          loadInfo:''
        });
      },handleError:(err)=>{
        this.setState({
          loadShow:false,
          loadInfo:''
        });
        let image_content_expand = {
          image_url: ''
        };
        this.props.handStore('bulkUpload', image_content_expand, this.props.currentIndex,index);
        if(err.data.code == '自定义错误'){
          this.openAlertMsg("图片格式错误，请用图片处理软件另存一下再上传~");
        }else if(err.data.code == 'timeout'){
          this.openAlertMsg("您的网络有点不太稳定哦~");
        }else{
          this.openAlertMsg("图片上传失败，请重新上传！");
        }
      }})
  }
  
  //批量上传
  handelMutiPic(files){
    this.setState({
      loadShow:true,
      loadInfo:'图片上传中...'
    });
    this.index = this.props.currentIndex;
    if(this.props.typeList.indexOf(this.props.podCreateStore.book_type) > -1 && this.props.currentIndex == 0){
      this.index = 1
    }
    this.fileData = files;
    this.uploadLen = files.length;
    this.imgIndex = 0;
    this.sucLen = 0;
    this.errLen = 0;
    this.typeLen = 0;
    this.sizeLen = 0;
    this.upLen = 0;
    this.elemList = [];
    this.elemIndex = 0;
    // 获取sts授权
    this.props.actions.getSignature({
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
    let typeNum = this.props.magic ? (this.props.currentIndex+1)/2 : Math.floor((this.props.currentIndex+1)/2)+1;
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
      if (this.sucLen + this.sizeLen + this.errLen + this.typeLen < (this.allNum + 1 - typeNum)) {
        if (this.imgIndex <= this.uploadLen - 1) {
          this.handelRound();
          return;
        }else{
          this.handelPicForm();
          return;
        }
      } else {
        this.upLen =this.uploadLen - (this.allNum + 1 - typeNum);
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
      if(this.sucLen + this.sizeLen + this.errLen + this.typeLen < (this.allNum + 1 - typeNum)){
        if(this.imgIndex <= this.uploadLen - 1){
          this.handelRound();
          return;
        }else{
          this.handelPicForm();
          return;
        }
      }else{
        this.upLen =this.uploadLen - (this.allNum + 1 - typeNum);
        this.handelPicForm();
        return;
      }
    }
    this.handelUpload(this.fileData[this.imgIndex])
  }

  //批量传图请求
  handelUpload(files){
    let typeNum = this.props.magic ? (this.props.currentIndex+1)/2 : Math.floor((this.props.currentIndex+1)/2)+1;
    if(this.elemIndex == 0){
      this.props.editStore[this.index].element_list.map((list,index)=>{
        if(list.element_type == 1){
          let picList = {
            index:index
          };
          this.elemList.push(picList);
        }
      });
    }
    this.props.actions.uploadImageDao({
      name: 'image',
      file: files,
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
        this.props.handStore('bulkUpload',image_content_expand,this.index,this.elemList[this.elemIndex].index);
        this.sucLen ++;
        this.imgIndex ++;
        this.elemIndex ++;
        if(this.sucLen + this.sizeLen + this.errLen + this.typeLen < (this.allNum + 1 - typeNum)){
          console.log(this.sucLen,this.sizeLen,this.errLen,this.typeLen,typeNum,'aaaa');
          if(this.imgIndex <= this.uploadLen - 1){
            if(this.elemIndex > this.elemList.length - 1){
              this.elemIndex = 0;
              this.elemList = [];
              if(this.index == 0){
                this.index = this.index + 1
              }else{
                this.index = this.index + 2
              }
            }
            this.handelRound();
          }else{
            this.handelPicForm();
          }
        }else{
          this.upLen =this.uploadLen - (this.allNum + 1 - typeNum);
          this.handelPicForm({});
        }

      },handleError:(err)=>{
        this.errLen ++;
        this.imgIndex ++;
        let image_content_expand = {
          image_url:''
        };
        this.props.handStore('bulkUpload',image_content_expand,this.index,this.elemList[this.elemIndex].index);
        this.elemIndex ++;
        if(this.sucLen + this.sizeLen + this.errLen + this.typeLen < (this.allNum + 1 - typeNum)){
          if(this.imgIndex < this.uploadLen){
            if(this.elemIndex > this.elemList.length - 1){
              this.elemIndex = 0;
              this.elemList = [];
              if(this.index == 0){
                this.index = this.index + 1
              }else{
                this.index = this.index + 2
              }
            }
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
          this.upLen =this.uploadLen - (this.allNum + 1 - typeNum);
          this.handelPicForm()
        }
      }});
  }
  
  //加纪念日
  handelAddMemory(saveData,deleteKey){
   this.setState({
      loadInfo:'数据请求中',
      loadShow:true
    });
    let ids = [];
    deleteKey.map((list)=>{
      ids.push(list.id)
    });
    let queryObj = URL.parse(window.location.href, true).query;
    let originData = this.handelOriginData(saveData);
    let frontData = this.handelOriginData1(saveData);
    let data = {
      podId:this.props.podCreateStore.book_id,
      calendarId:queryObj.bookId || '',
      deleteKeys:ids,
      memoryDays:originData,
      front_elements:frontData
    };
    this.props.actions.addMemoryAction(data,{
      handSuc:(res)=>{
        this.handelMemRound1(deleteKey);
        this.handelMemRound2(deleteKey);
        this.handelMemoryData1(res.data.back);
        this.handelMemoryData2(saveData);
        this.handelMemoryData3(res.data.front);
        this.setState({
          loadInfo:'',
          loadShow:false
        });
      },
      handErr:()=>{
        this.setState({
          loadInfo:'',
          loadShow:false
        });
        this.openAlertMsg('纪念日添加失败')
      }
    });
  }

  //反面数据整理
  handelOriginData(saveData){
    let currentIndex = this.props.currentIndex;
    if(this.state.side){
      currentIndex = currentIndex + 1
    }else{

    }
    let originData = [];
    let calendarData =this.props.podCreateStore;
    for(let i=0;i<saveData.length;i++){
      calendarData.content_list[currentIndex].element_list.map((list,index)=>{
        if(list.element_type == 2 && list.element_name.substring(0,4) == 'word'){
          let num = parseInt(this.handelDate(list.element_name));
          if(num == saveData[i].day){
            let data = {
              id:saveData[i].id || '',
              month:saveData[i].month,
              day:saveData[i].day,
              intro:saveData[i].intro,
              dataIndex:index,
              element:list
            };
            originData.push(data)
          }
        }
      });
    }
    return originData;
  }

  //正面数据整理
  handelOriginData1(saveData){
    let originData = [];
    let i = 0;
    let calendarData =this.props.podCreateStore;
    let currentIndex = this.props.currentIndex;
    if(this.state.side){

    }else{
      currentIndex = currentIndex - 1
    }
    let calData = filter(calendarData.content_list[currentIndex].element_list,(list)=>{
      return list.element_name.substring(0,list.element_name.length-1) == 'word10'
    });
    let newCalData = sortBy(calData,function (item) {
      return parseInt(item.element_name.substring(item.element_name.length-1,item.element_name.length));
    });
    newCalData.map((item)=>{
      calendarData.content_list[currentIndex].element_list.map((list,index)=>{
        if(list.element_name == item.element_name){
          if(originData.length < saveData.length){
            let data = {
              intro:saveData[i].intro,
              day:saveData[i].day,
              dataIndex:index,
              element:item
            };
            i++;
            originData.push(data);
          }
        }
      })
    });
    return originData;
  }

  //纪念日删除反面数据处理
  handelMemRound1(deleteKey){
    let calendarData =this.props.podCreateStore;
    let currentIndex = this.props.currentIndex;
    if(this.state.side){
      currentIndex = currentIndex + 1
    }else{

    }
    for(let i=0;i<deleteKey.length;i++){
      calendarData.content_list[currentIndex].element_list.map((list,index)=>{
        if(list.element_type == 2 && list.element_name.substring(0,4) == 'word'){
          let num = parseInt(this.handelDate(list.element_name));
          if(num == deleteKey[i].day){
            let dataObject = {
              index:index,
              flag:1,
              side:1
            };
            this.props.handStore('memory',dataObject,currentIndex);
          }
        }
      });
    }
  }
  
  //纪念日删除正面数据处理
  handelMemRound2(deleteKey){
    let calendarData =this.props.podCreateStore;
    let currentIndex = this.props.currentIndex;
    if(this.state.side){

    }else{
      currentIndex = currentIndex - 1
    }
    for(let i=0;i<deleteKey.length;i++){
      calendarData.content_list[currentIndex].element_list.map((list,index)=>{
        if(list.element_type == 5){
          let num = '';
          if(list.element_name.substring(0,5) == 'month' || list.element_name.substring(0,list.element_name.length) == 'pendant101'){

          }else{
            num = parseInt(this.handelDate(list.element_name));
          }
          if(num == deleteKey[i].day){
            let dataObject = {
              index:index,
              flag:1,
              side:2
            };
            this.props.handStore('memory',dataObject,currentIndex);
          }
        }
      });
    }
  }

  //纪念日保存数据处理
  handelMemoryData1(back){
    let currentIndex = this.props.currentIndex;
    if(this.state.side){
      currentIndex = currentIndex + 1
    }else{

    }
    let dataObject = {
      backData:back,
      flag:2,
      side:1
    };
    this.props.handStore('memory',dataObject,currentIndex);
  }
  handelMemoryData2(saveData){
    let currentIndex = this.props.currentIndex;
    if(this.state.side){

    }else{
      currentIndex = currentIndex - 1
    }
    let dataObject = {
      saveData:saveData,
      flag:2,
      side:2
    };
    this.props.handStore('memory',dataObject,currentIndex);
  }
  handelMemoryData3(front){
    let currentIndex = this.props.currentIndex;
    if(this.state.side){

    }else{
      currentIndex = currentIndex - 1
    }
    let dataObject = {
      frontData:front,
      flag:2,
      side:3
    };
    this.props.handStore('memory',dataObject,currentIndex);
  }

  handelTextData(){
    let calendarData =this.props.podCreateStore;
    let textData = {
      id:calendarData.book_id,
      text:this.addData[this.textIndex].intro,
      tempId:calendarData.template_id,
      tempInfo:this.textData[this.textIndex].textInfo
    };
    this.props.actions.editText(textData,{
      handelSuccess:(res)=>{
        let dataObject = {
          index:this.textData[this.textIndex].index,
          flag:2,
          side:3,
          element_list:res.data.element_model
        };
        this.props.handStore('memory',dataObject,'',this.props.currentIndex);
        this.textIndex ++;
        if(this.textIndex < this.textData.length){
          this.handelTextData()
        }else{
          this.setState({
            loadInfo:'',
            loadShow:false
          });
        }
      },
      handelError:(err)=>{
        this.setState({
          loadInfo:'',
          loadShow:false
        });
        this.openAlertMsg('纪念日添加失败');
        this.textIndex = [];
        this.textIndex = 0;
        this.memory = false;
      }
    });
  }

  //错误提示
  handelPicForm(){
    this.setState({
      loadShow:false,
      loadInfo:''
    });
    if(this.typeLen + this.sizeLen + this.errLen + this.upLen > 0){
      this.props.uploadErrorTip(
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
  openAlertMsg(msg){
    this.props.dispatch({
      type:ALERT_MESSAGE,
      hasTitle: false,
      duration: 3000,
      width:260,
      msg:msg
    })
  }
  
  //关闭新手引导
  showGuide(){
    Cookies.set('showCal', true, {
      expires: Infinity
    });
    this.setState({
      showCal:false
    })
  }
  showDiyGuide(){
    Cookies.set('showDiy', true, {
      expires: Infinity
    });
    this.setState({
      showDiy:false
    })
  }

  //制作或编辑魔法封面
  handelEditMagic(firstImg){
    let flag = 1;
    if(this.props.videoUrl && firstImg){
      flag = 2
    }
    this.props.handleShowMagic(flag)
  }

  //打开照片池
  handelOpenPhoto(index){
    this.openDialog('PhotoDialog');
    this.phIndex = index;
  }

  //照片池图片替换
  handelReplacePhoto(oldImgList,newImgList){
    this.props.handStore('replace',oldImgList,newImgList);
  }

  render() {
    let podCreateStore = this.props.podCreateStore || {};
    let editStore = this.props.editStore || [];
    let sideStore = [];
    if(editStore.length > 0){
      //正面
      if(this.state.side){
        sideStore = filter(editStore,(list)=>{
          return list.page_type == 1
        });
      }else{
        sideStore = filter(editStore,(list)=>{
          return list.page_type == 0 && list.content_type == 1
        });
      }
    }

    let editList = sideStore.map((result,index)=>{
      return(
        <CalendarPic
          key={index}
          index={index}
          currentIndex={this.props.currentIndex}
          side={this.state.side}
          pageStore={result}
          handelTrueMonth={this.handelTrueMonth.bind(this)}
          bookStyle={this.props.bookStyle}/>
      )
    });

    let imgHead = {
      width:this.props.bookStyle.book_width * this.state.ratioWidth - 20
    };
    //横版台历
    let bookType = false;
    if(this.props.bookStyle.book_width > this.props.bookStyle.book_height){
      bookType = true;
    }
    //上传数量
    let typeNum = this.props.magic ? (this.props.currentIndex+1)/2 : Math.floor((this.props.currentIndex+1)/2)+1;
    return (
      <div className="calendarContent" style={{display:this.props.magicTemp == 0 ? 'block' : 'none'}}>
        <div className="calendarContentBox">
          <div className="calendarEditList">
            <ul>
              {editList}
            </ul>
          </div>
        </div>
        <div className="calendarContentBox1">
          <div className="calendarEdit">
            <div className="calendarEditH" style={{top:bookType ? '-12px' : '-8px'}}>
              <img src={require('../../podBook/image/pod_head.png')} style={imgHead}/>
            </div>
            <ul>
              <EditCalendar
                pageStore={editStore[this.props.currentIndex]}
                bookStyle={this.props.bookStyle}
                photoList={this.photoList}
                typeList={this.props.typeList}
                bookType={podCreateStore.book_type}
                currentIndex={this.props.currentIndex}
                videoUrl={this.props.videoUrl}
                magic={this.props.magic}
                firstImg={this.props.firstImg}
                handEditTextDialog={this.handEditTextDialog.bind(this)}
                handImageCrop={this.props.handImageCrop}
                handelImgRotate={this.props.handelImgRotate}
                handleShowMagic={this.props.handleShowMagic}
                handleDrop={this.handleDrop.bind(this)}
                openAlertMsg={this.openAlertMsg.bind(this)}
                handelMemory={this.handelMemory.bind(this)}
                handelOpenPhoto={this.handelOpenPhoto.bind(this)}/>
            </ul>
            {this.state.side && this.props.magic && this.props.currentIndex == 0 ? <div className="setting_magic" onClick={this.handelEditMagic.bind(this,this.props.firstImg)}>{this.props.videoUrl && this.props.firstImg ? '编辑' : '制作'}魔法封面</div> : null}
            {this.state.side && (!this.props.magic || this.props.currentIndex != 0) ? <div className="setting_temp" onClick={this.handTempDialog.bind(this)}>更改版式</div> : null}
            {this.props.currentIndex != 0 ? <div className="setting_style" onClick={this.handelStyleDialog.bind(this)}>更改风格</div> : null}
            {this.state.side && (this.props.magic ? this.props.currentIndex >= 1&&this.props.currentIndex < 23 : this.props.currentIndex < 23) ? <div style={{top : this.props.currentIndex ? '214px' : '107px'}} className="bulk_upload" onClick={this.handUploadDialog.bind(this)}>批量传图</div> : null}
            {this.props.currentIndex == 0 || this.props.currentIndex == 25 ? null : this.state.side ?
              <div className="reverse_side" style={{top:this.props.currentIndex < 23 ? '321px' : '214px'}} onClick={this.handSide.bind(this,false)}>反<br/>&nbsp;<br/>&nbsp;<br/>面</div> :
              <div className="obverse_side" onClick={this.handSide.bind(this,true)}>正<br/>&nbsp;<br/>&nbsp;<br/>面</div>}
            {this.props.currentIndex != 0 && this.props.currentIndex != 25 ? <div style={{top : this.state.side ? (this.props.currentIndex < 23) ? '428px' : '321px' : '214px'}} className="add_memory" onClick={this.handelMemory.bind(this,1)}>加纪念日</div> : null}
            {this.props.currentIndex == 0 || this.props.currentIndex == 2 ? null : <div className="edit_left" onClick={this.handelLeftTight.bind(this,'left')}></div>}
            {this.props.currentIndex == 23 || this.props.currentIndex == 24 ? null : <div className="edit_right" onClick={this.handelLeftTight.bind(this,'right')}></div>}
            {this.state.showCal ? <CalendarGuide showGuide={this.showGuide.bind(this)}/> : null}
            {this.state.showDiy ? <CalendarDiyGuide showDiyGuide={this.showDiyGuide.bind(this)}/> : null}
          </div>
        </div>
        <CalendarIntroDialog
          open={this.state['CalendarIntroDialog']}
          textConfig={this.state.textConfig}
          close={this.closeDialog.bind(this,'CalendarIntroDialog')}
          handelTextEdit={this.handelTextEdit.bind(this)}
        />
        <TempleListDialog
          open={this.state['TempleListDialog']}
          close={this.closeDialog.bind(this,'TempleListDialog')}
          tempListData={this.state.tempListData}
          book_type={podCreateStore.book_type}
          openAlertMsg={this.openAlertMsg.bind(this)}
          handelReplaceTemp={this.handelReplaceTemp.bind(this)}
          pageStore={editStore[this.props.currentIndex]}
        />
        <StyleListDialog
          open={this.state['StyleListDialog']}
          close={this.closeDialog.bind(this,'StyleListDialog')}
          styleListData={this.state.styleListData}
          bookStyle={podCreateStore.book_style}
          book_type={podCreateStore.book_type}
          handelChangeStyle={this.handelChangeStyle.bind(this)}
        />
        <UploadDialog
          open={this.state['UploadDialog']}
          close={this.closeDialog.bind(this,'UploadDialog')}
          handelMutiPic={this.handelMutiPic.bind(this)}
          allNum={this.allNum-typeNum+1}
          bookType={podCreateStore.book_type}
        />
        <MemoryDialog
          open={this.state['MemoryDialog']}
          close={this.closeDialog.bind(this,'MemoryDialog')}
          handelAddMemory={this.handelAddMemory.bind(this)}
          handelBtnClick={this.props.handelBtnClick}
          openAlertMsg={this.openAlertMsg.bind(this)}
          date={this.state.date}
          memoryList={this.state.memoryList}
        />
        <PhotoDialog
          open={this.state['PhotoDialog']}
          close={this.closeDialog.bind(this,'PhotoDialog')}
          handelReplacePhoto={this.handelReplacePhoto.bind(this)}
          editStore={editStore}
          bookType={podCreateStore.book_type}
          currentIndex={this.props.currentIndex}
          phIndex={this.phIndex}
          typeList={this.props.typeList}
        />
        <LoadingBox loadShow={this.state.loadShow} loadInfo={this.state.loadInfo}/>
      </div>
    )
  }
}
dialogMixin(CalendarContent);
export default CalendarContent;