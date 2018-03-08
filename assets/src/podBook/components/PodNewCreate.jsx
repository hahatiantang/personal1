/**
 * 文件说明:
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/10/24
 * 变更记录:
 */

import React,{Component} from 'react';
import {ALERT_MESSAGE} from '../../redux/utils/actionsTypes'
import DialogBox from '../../common/DialogBox.jsx';
import '../style/podNew.less';
class PodNewCreate extends Component{
  constructor(props) {
    super(props);
  }

  handelCloseNew(){
    this.props.hideNewCreate(false);
    this.props.close();
    this.props.dispatch({
      type: ALERT_MESSAGE,
      width: 400,
      offset: '-15%',
      msg: '成功加入印刷车',
      hasFooter: true,
      okText: '去结算',
      cancelText: '继续浏览',
      okCall: () => {
        window.location.href = '/cart';
      },
      cancelCall: () => {

      }
    })
  }
  
  render(){
    return(
      <DialogBox {...this.props}
        open={this.props.open}
        close={this.props.close}
        width={550}
        modal={true}
        hasFooter={false}
        title={'好消息'}
      >
        <div className="podNewCreate">
          <div className="podNewBox">
            <img src={require('../image/pod_create.png')}/>
            <span>上传</span>
            <span style={{color:'#da433c'}}>12张照片</span>
            <span>可以自动生成一本记事本哦~</span>
          </div>
          <div className="podNewBtnBox">
            <a href="/notebook" target="_blank" className="podNewBtnLeft">马上试试</a>
            <div className="podNewBtnRight" onClick={this.handelCloseNew.bind(this)}>下次再说</div>
          </div>
        </div>
      </DialogBox>
    )
  }
}
export default PodNewCreate;