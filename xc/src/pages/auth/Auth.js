import React, { Component, Fragment } from 'react'
import Header from '../../components/common/Header'
import AuthBanner from '../../assets/images/xc/auth-advantage.png'
import AuthArrow from '../../assets/images/xc/auth-arrow.png'
import './Auth.scss'
import { Toast } from 'antd-mobile'

class Index extends Component {
  state = {
    tab: 2
  }

  toAuth = () => {
    Toast.success('授权成功')
  }

  render() {
    const { tab } = this.state
    return (
      <div id="auth">
        <Header bgWhite isFixed isShadow title="选择授权方式" />
        <div className="main-content">
          <img className="banner" src={AuthBanner} alt="" />

          {tab === 2 && (
            <Fragment>
              <div className="line">
                <div>
                  <span>我是新用户</span>
                  <span>使用当前zbx账号直接授权登录</span>
                </div>
                <img src={AuthArrow} alt="" />
              </div>

              <div className="line" onClick={this.toAuth}>
                <div>
                  <span>我是新用户</span>
                  <span>使用当前zbx账号直接授权登录</span>
                </div>
                <img src={AuthArrow} alt="" />
              </div>
            </Fragment>
          )}

          {tab === 1 && (
            <div className="line zbx">
              <p>ZBX授权登录</p>
            </div>
          )}
        </div>
      </div>
    )
  }
}
export default Index
