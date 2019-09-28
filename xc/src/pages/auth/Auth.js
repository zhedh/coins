import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import Header from '../../components/common/Header'
import AuthBanner from '../../assets/images/xc/auth-advantage.png'
import AuthArrow from '../../assets/images/xc/auth-arrow.png'
import './Auth.scss'
import { Toast } from 'antd-mobile'

@inject('authStore')
@inject('userStore')
@observer
class Index extends Component {
  componentDidMount() {
    this.sendUserAuth()
  }

  getQueryParam(key) {
    const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
    const r = window.location.search.substr(1).match(reg)
    if (r != null) {
      return decodeURI(r[2])
    }
    return null
  }

  // 获取rsa和签名,
  sendUserAuth = () => {
    const { authStore } = this.props
    const info = this.getQueryParam('rsa')
    const signature = this.getQueryParam('signature')
    authStore.userAuth({ info, signature }).then(res => {})
  }

  noAuth = () => {
    const { history } = this.props
    history.push('/invite-code')
  }

  hadAuth = () => {
    const { history } = this.props
    history.push('/bind')
  }
  render() {
    return (
      <div id="auth">
        <Header bgWhite isFixed isShadow title="选择授权方式" />
        <div className="main-content">
          <img className="banner" src={AuthBanner} alt="" />

          <div className="line" onClick={this.noAuth}>
            <div>
              <span>我是新用户</span>
              <span>使用当前zbx账号直接授权登录</span>
            </div>
            <img src={AuthArrow} alt="" />
          </div>

          <div className="line" onClick={this.hadAuth}>
            <div>
              <span>已有账号绑定</span>
              <span>登录已有账号,与当前ZBX账号绑定</span>
            </div>
            <img src={AuthArrow} alt="" />
          </div>
        </div>
      </div>
    )
  }
}
export default Index
