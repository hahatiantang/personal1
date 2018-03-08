/**
 * 文件说明: 对话框mixin
 * 详细描述:
 * 创建者:   卢淮建
 * 创建时间: 15/12/16
 * 变更记录:
 */

import React from 'react';
import ReactDOM from 'react-dom';
import reactMixin from 'react-mixin';
import _ from 'lodash';


class Component1 extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {

    return (<div>{this.props.children}</div>)
  }
}

class Component2 extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {

    return (<div>ttttttt</div>)
  }
}
export default function (component, dialogState) {
  let close = {};
  if(_.isArray(dialogState)) {
    for(let i = 0; i<dialogState.length; i++) {
      close[dialogState[i]] = false;
    }
  }


  //open[dialogState] = true;

  let dialogMixin = {
    getDefaultProps: function () {

      return {}
    },

    getInitialState: function () {
      //return Object.assign({}, close);
    },

    /**
     * 打开对话框
     * @private
     */
    openDialog(dialogState) {
      let open = {};
      open[dialogState] = true;
      this.setState(Object.assign({}, open));
    },

    /**
     * 关闭对话框
     * @param dialogState
       */
    closeDialog(dialogState) {
      let close = {};
      close[dialogState] = false;
      this.setState(Object.assign({}, close));
    }

  };

  reactMixin.onClass(component, dialogMixin);
}