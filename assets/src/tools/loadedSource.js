/**
 * 文件说明:
 * 详细描述:
 * 创建者:   王云成
 * 创建时间: 2016/3/25
 * 变更记录:
 */


import Q from 'q';

/**
 * 创建元素
 * @param sourcesArr
 * @param callBack
 */
module.exports = (sourcesArr, callBack)=>{
  //定义ｐｒｏｍｉｓｅ数组
  let promiseAllArr = [];
  // 遍历要添加的cdn
  sourcesArr.map((source)=>{
    let head = document.getElementsByTagName('head')[0];
    let elem = {};
    // 判断是否是js文件
    if(/\.js$/.test(source)){
      elem = document.createElement('script');
      elem.src=source;
    }
    // 判断是否是css文件
    if(/\.css$/.test(source)) {
      elem = document.createElement('link');
      elem.setAttribute('rel', 'stylesheet');
      elem.href = source;
    }

    // 返回promise对象
    let syncFunc = syncLoadSources(elem);

    if (head) {
      head.appendChild(elem);
    } else {
      document.body.appendChild(elem)
    }
    promiseAllArr.push(syncFunc);
    Q.all(promiseAllArr).then(()=>{
      if(callBack){
        callBack();
      }
    },()=>{
      console.log("加载cdn资源失败！！！");
    });

    // 定义加载资源函数
    function syncLoadSources (elem){
      let defer = Q.defer();
      elem.onload = elem.onreadystatechange = function () {
        if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
          setTimeout(()=>{
            defer.reject();
          },5000);
          defer.resolve();
        }
      };
      return defer.promise
    }

  });


};