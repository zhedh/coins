import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {getQueryParam} from '../../utils/common'
import Header from '../../components/common/Header'
import AuthBanner from '../../assets/images/xc/auth-advantage.png'
import AuthArrow from '../../assets/images/xc/auth-arrow.png'
import './Auth.scss'

@inject('userStore')
@observer
class Index extends Component {
  componentDidMount() {
    this.sendUserAuth()
  }

  // 获取rsa和签名,
  sendUserAuth = () => {
    const {userStore, history} = this.props
    const info = getQueryParam('rsa')
    const signature = getQueryParam('signature')
    userStore.userAuth({info, signature}).then(res => {
      if (res.status === 200) {
        history.push('/home')
        return
      }
      if (res.status === 201) {
        const {infoKey} = res.data
        userStore.setInfoKey(infoKey)
        return
      }
      history.push('/zbx-login')
    })
  }

  newUserAuth = () => {
    const {history} = this.props
    history.push('/invite-code')
  }

  hadAuth = () => {
    const {history} = this.props
    history.push('/bind')
  }

  render() {
    return (
      <div id="auth">
        <Header bgWhite isFixed isShadow title="选择授权方式"/>
        <div className="main-content">
          <img className="banner" src={AuthBanner} alt=""/>

          <div className="line" onClick={this.newUserAuth}>
            <div>
              <span>我是新用户</span>
              <span>使用当前zbx账号直接授权登录</span>
            </div>
            <img src={AuthArrow} alt=""/>
          </div>

          <div className="line" onClick={this.hadAuth}>
            <div>
              <span>已有账号绑定</span>
              <span>登录已有账号,与当前ZBX账号绑定</span>
            </div>
            <img src={AuthArrow} alt=""/>
          </div>
        </div>
      </div>
    )
  }
}

export default Index
