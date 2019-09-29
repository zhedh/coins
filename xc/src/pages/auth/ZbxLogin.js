import React, {Component} from 'react'
import {observer} from 'mobx-react'
import Header from '../../components/common/Header'
import AuthBanner from '../../assets/images/xc/auth-advantage.png'
import './ZbxLogin.scss'
import {CONFIG} from "../../config";

@observer
class Index extends Component {
  onZbxLogin = () => {
    window.location.href = CONFIG.XC_AUTH_URL
  }

  render() {
    return (
      <div id="zbx-Login">
        <Header bgWhite isFixed isShadow title="选择授权方式"/>
        <div className="main-content">
          <img className="banner" src={AuthBanner} alt=""/>

          <div className="line zbx" onClick={this.onZbxLogin}>
            <p>ZBX授权登录</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Index
