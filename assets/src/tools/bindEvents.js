/**
 * 文件说明: 组件渲染完成绑定事件模块
 * 详细描述:
 * 创建者:   卢淮建
 * 创建时间: 15/11/28
 * 变更记录:
 */
import Events from 'events';
let $ = require('jquery');

export default  {
    componentDidMount() {

      //  console.log ('Events.on');

        let listeners = this.windowListeners;

        for (let eventName in listeners) {
            let callbackName = listeners[eventName];
            $(window).on(eventName, this[callbackName]);
        }
    },

    componentWillUnmount() {

        console.log ('Events.off');

        let listeners = this.windowListeners;

        for (let eventName in listeners) {
            let callbackName = listeners[eventName];
            $(window).off(eventName, this[callbackName]);
        }
    }
};