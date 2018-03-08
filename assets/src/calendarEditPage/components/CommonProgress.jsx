/**
 * 文件说明:
 * 详细描述:第三方导入进度条
 * 创建者: 韩波
 * 创建时间: 2017/8/31
 * 变更记录:
 */


import React from 'react';
import DropZone from 'react-dropzone';
require('../style/commonProgress.less');

class CommonProgress extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      progressNum:0
    };
    this.timer = null;
  }

  componentWillReceiveProps(nextProps){
    // 当导入完成时，取消定时器，并设置进度为100
    if(nextProps.isfinish){
      if(this.timer){
        window.clearInterval(this.timer);
      }
      this.setState({
        progressNum:100
      });
    }
  }

  componentWillMount(){
    this.setState({
      progressNum:this.props.startNum&&parseInt(this.props.startNum)||0
    });
  }

  componentDidMount(){
    this.timer = setInterval(()=>{

      //当达到70%或出错时 取消定时器
      if(this.state.progressNum >= 70||this.props.hasError){
        window.clearInterval(this.timer);
        this.setState({
          progressNum:this.state.progressNum+3
        });
        return
      }

      // 每一秒增加3%
      let progressNum = this.state.progressNum+3;
      this.setState({
        progressNum
      })

    },1000)
  }

  componentWillUnmount(){
    if(this.timer){
      window.clearInterval(this.timer);
    }
  }

  render(){
    let progressStyle = {};
    let marginStyle = {};
    if(this.props.imgStyle){
      progressStyle = {
        width : this.props.imgStyle.width+'px',
        height : this.props.imgStyle.height+'px',
        background:'rgba(0,0,0,.4)'
      };
      if(this.props.hasError){
        marginStyle.margin = (this.props.imgStyle.height/2-48) + 'px auto 0'
      }else{
        marginStyle.margin = this.props.imgStyle.height/2 + 'px auto 0'
      }
    }
    return(
      <div className="progressBarBox" style={progressStyle}>
        {/* 进度条 */}
        {!this.props.hasError ?
          <div className="progressBar" style={marginStyle}>
            <span className="progress" style={{'width': this.state.progressNum + '%'}}/>
            <p className="progressName">上传中...</p>
          </div>:
          < div className = "progressBarErr" >
            < DropZone
              ref="dropzone"
              accept={this.props.upType == 1 ? "audio/mp4, video/mp4": "image/jpeg,image/png"}
              className="onDrop"
              multiple={false}
              onDrop={ (files) => {this.onDrop(files)}}>
                <div className="progressBarErrBox">
                <div className="progressBarErrImg" style={marginStyle}></div>
                <p className="progressBarErrF">上传失败</p>
                <p className="progressBarAg">点击重新上传</p>
              </div>
            </DropZone>
          </div>
        }
      </div>
    )
  }


  onDrop(file){
    if(this.props.upType){
      this.props.handelUploadVideo(file)
    }else{
      if(this.props.showCrop){
        this.props.handleMagicDrop(file,1)
      }else{
        this.props.handleMagicDrop(file)
      }
    }
  }
}

export default CommonProgress

