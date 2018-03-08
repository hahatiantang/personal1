/**
 * 文件说明:
 * 详细描述:时光台历公共底部
 * 创建者: 韩波
 * 创建时间: 2016/9/30
 * 变更记录:
 */
import React from 'react';
import config from '../../../config.js';
import './less/footer.less';

class Footer extends React.Component {
  constructor(){
    super();
  }

  render() {
    return (
      <div className="tf-footer">
        <div className="common-footer" >
          <div className="container">

            <div className="footer-left">
              <a href={config.API_SERVER.host+'/about'} target="_blank">关于我们</a><span className="line-help">|</span>
              <a href={config.API_SERVER.host+'/help/login'} target="_blank">帮助中心</a><span className="line-help">|</span>
              <a href={config.API_SERVER.host+'/app.html'} target="_blank">APP下载</a><span className="line-help">|</span>
              <a href={config.API_SERVER.host+'/baike'} target="_blank">时光百科</a><span className="line-help">|</span>
              <a href="http://www.timeface.cn/sitemap" target="_blank">网站导航</a><span className="line-help">|</span>
              <a href={config.API_SERVER.host+'/contact'} target="_blank">联系我们</a>
            </div>

            <div className="footer-right">
              <p>&copy;&nbsp;时光流影 皖B2-20120055 皖ICP备10017145-4号</p>
              <p>时光流影旗下产品：
                <a href="/timebook" target="_blank">时光书</a>、
                <a href='/photobook' target="_blank">照片书</a>、
                <a href='/photography' target="_blank">摄影集</a>、
                <a href="/weixin" target="_blank">微信书</a>、
                <a href="/qzone" target="_blank">QQ相册书</a><br/>
                <a href="/blog" target="_blank">博客书</a>、
                <a href="/notebook" target="_blank">时光记事本</a>、
                <a href="/calendar" target="_blank">时光台历</a>、
                <a href="/artbook" target="_blank">绘画集</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

Footer.propTypes = {};
Footer.defaultProps = {};

export default Footer;
