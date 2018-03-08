/**
 * 文件说明:纪念日列表
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/10/13
 * 变更记录:
 */
import React from 'react'
import reactComposition from 'react-composition'

import sortBy from 'lodash.sortby';
import '../style/memoryDialog.less';

class MemoryList extends  React.Component{
  constructor(props){
    super(props);
    this.state = {
      memoryData : props.memoryList,
      deleteKeys:[]
    };
    this.initText = '';
  }

  //根据闰年生成29或者28天
  dayTwenty(year){
    let days = [],
      y = parseInt(year),
      size = (y%4==0 && y%100!=0)||(y%100==0 && y%400==0) ? 29 : 28;
    for (let i=0;i<size;i++) {
      days.push((i+1));
    }
    return days;
  }
  //天数是30天
  dayThirty(){
    let days = [];
    for (let i=0;i<30;i++) {
      days.push((i+1));
    }
    return days;
  }
  //天数是31天
  dayThirtyOne(){
    let days = [];
    for (let i=0;i<31;i++) {
      days.push((i+1));
    }
    return days;
  }

  //通过月份 获取天数
  handelChangeMonth(){
    let m = this.props.memoryList[0].month;
    let dates=[];
    switch (m){
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        dates = this.dayThirtyOne();
        break;
      case 2 :
        dates = this.dayTwenty(2017);
        break;
      default:
        dates = this.dayThirty();
        break;
    }
    return dates;
  }

  //字符限制
  handleLimit(str,len){
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = str.replace(chineseRegex,"**").length;
    for(var i = 0;i < strLength;i++)     {
      singleChar = str.charAt(i).toString();
      if(singleChar.match(chineseRegex) != null) {
        newLength += 2;
      }else {
        newLength++;
      }
      if(newLength > len) {
        break;
      }
      newStr += singleChar;
    }

    return newStr
  }

  //保存
  memorySave(){
    let flag1 = true,flag2 = true;
    let origin = this.state.memoryData.slice(0);
    for(let i = 0;i < origin.length;i++){
      if(origin.length != 1){
        if(!origin[i].intro.trim()){
          this.props.openAlertMsg('还有未完成的纪念日哦！');
          flag1 = false;
          break;
        }
      }
    }
    if(flag1){
      let days = [];
      origin.map((list)=>{
        days.push(list.day)
      });
      days = days.sort();
      for(let j = 0;j < days.length;j++){
        if(days[j] == days[j+1]){
          this.props.openAlertMsg('一天只能记录一个事件哦！');
          flag2 = false;
          break;
        }
      }
    }
    if(flag1&&flag2){
      let newOrigin = sortBy(origin,function (item) {
        return item.day;
      });
      this.props.handelAddMemory(newOrigin,this.state.deleteKeys);
      this.state = {
        memoryData : [],
        deleteKeys:[]
      };
      this.props.handelBtnClick(false);
      this.props.close();
    }
  }

  //新增纪念日
  addMemory(){
    let data = {
      month:this.props.memoryList[0].month,
      day:1,
      intro:''
    };
    let origin = this.state.memoryData.slice(0);
    if(origin.length > 2){
      this.props.openAlertMsg('每月最多加三条纪念日')
    }else{
      data.day = this.handelJudgeDate();
      origin.push(data);
      this.setState({
        memoryData:origin
      },()=>{
        $('.memoryListBox').scrollTop(origin.length*60)
      });
    }
  }

  //新增日期判断
  handelJudgeDate(){
    let origin = this.state.memoryData.slice(0);
    let days = this.handelChangeMonth();
    origin.map((list)=>{
      days.map((day,index)=>{
        if(day == list.day){
          days.splice(index,1)
        }
      });
    });
    return days[0];
  }

  //更改日期
  handelChangeDay(event,index){
    let days = [];
    let origin = this.state.memoryData.slice(0);
    origin.map((list)=>{
      days.push(list.day)
    });
    if(days.indexOf(parseInt(event.target.value)) > -1){
      this.props.openAlertMsg('一天只能记录一个事件哦！')
    }else{
      origin[index].day = parseInt(event.target.value);
      this.setState({
        memoryData:origin
      });
    }
  }

  //更改内容
  handelChangeInput(event,index){
    let text = event.target.value;
    let origin = this.state.memoryData.slice(0);
    let data = event.data || text;
    if (this.composition === true) {
      this.composition = 'other';
      text = this.handleLimit(data.trim(),10);
      this.initText = ''
    }else if(this.composition === 'others'){
      this.composition = 'others';
      text = this.handleLimit(data.trim(),10);
      this.initText = ''
    }else if(this.composition === 'other'){
      this.composition = 'other';
      text = this.handleLimit(data.trim(),10);
      this.initText = ''
    }

    origin[index].intro = text;
    this.setState({
      memoryData:origin
    });
  }

  //删除单条内容
  deleteMemory(index){
    let origin = this.state.memoryData.slice(0);
    let keys = this.state.deleteKeys.slice(0);
    if(origin[index].intro){
      keys.push(origin[index])
    }
    origin.splice(index,1);
    if(origin.length < 1) {
      let data = {
        month: this.props.memoryList[0].month,
        day: 1,
        intro: ''
      };
      origin.push(data);
    }
    this.setState({
      memoryData:origin,
      deleteKeys:keys
    });
  }

  componentDidMount(){
    this.handDayScroll();
  }

  //通过具体日期弹出纪念日
  handDayScroll(){
    this.state.memoryData.map((list,index)=>{
      if(list.day == this.props.date){
        $('.memoryListBox').scrollTop((index)*60)
      }
    })
  }

  render(){
    let self = this;
    let days = this.handelChangeMonth();
    let memoryData = this.state.memoryData.slice(0);
    let memoryHtml = memoryData.map((item,index)=>{
      return (
        <li className="memoryListLi" key={index}>
          <span className="memoryListTitle">纪念日：</span>
          <select className="memoryListS" defaultValue={item.month+'月'} disabled="disabled">
            <option value={item.month+'月'}>{item.month+'月'}</option>
          </select>
          <select className="memoryList_S" value={item.day} ref="day" onChange={(event)=>this.handelChangeDay(event,index)}>
            {
              days.map((date,index)=>{
                return(
                  <option key={index} value={date}>{date}</option>
                )
              })
            }
          </select>
          <input
            type="text"
            placeholder="最多5个字"
            className="memoryListIn"
            {...reactComposition({
              onChange: (event)=>{
                if(self.composition == 'other'){
                  self.composition = 'others';
                  self.initText = '';
                  return
                }
                if(self.composition == undefined){
                  self.composition = 'others';
                  self.initText = '';
                  //return
                }
                self.handelChangeInput(event,index)
              },
              onCompositionStart:()=>{
                self.composition = false;
                self.initText = item.intro;
              },
              onCompositionEnd: (event)=>{
                self.composition = 'other';
                event.data = self.initText+event.data;

                self.handelChangeInput(event,index)
              }
            })}
            value={item.intro}
          />
          <div className="memoryListDel" onClick={this.deleteMemory.bind(this,index)}></div>
        </li>
      )
    });
    return(
      <div className="memoryList">
        <div className="memoryListBox">
          <ul className="memoryListBoxUl">
            {memoryHtml}
          </ul>
        </div>
        <div className="addMemory" onClick={this.addMemory.bind(this)}>
          <img src={require('../image/addMemory.png')} className="addMemoryImg"/>
          <span>新增纪念日</span>
          <span className="memoryListTip">每月最多加3条纪念日</span>
        </div>
        <button type="button" className="memoryListBtn" onClick={this.memorySave.bind(this)}>提交</button>
      </div>
    )
  }
}
export default MemoryList;