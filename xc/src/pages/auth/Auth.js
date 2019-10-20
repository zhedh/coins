import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { getQueryParam } from '../../utils/common'
import Header from '../../components/common/Header'
import AuthBanner from '../../assets/images/xc/auth-advantage.png'
import './Auth.scss'

@inject('userStore')
@observer
class Index extends Component {
  state = {
    isActive: ''
  }

  componentDidMount() {
    // this.sendUserAuth()
  }

  // 获取rsa和签名,
  sendUserAuth = () => {
    const { userStore, history } = this.props
    const info = getQueryParam('info')
    const signature = getQueryParam('signature')
    userStore.userAuth({ info, signature }).then(res => {
      if (res.status === 200) {
        history.push('/home')
        return
      }
      if (res.status === 201) {
        const { infoKey } = res.data
        userStore.setInfoKey(infoKey)
        return
      }
      history.push('/zbx-login')
    })
  }

  enterAuth = status => {
    const { history } = this.props

    this.setState({ isActive: status }, () => {
      if (status === 'new') {
        history.push('/invite-code')
      } else {
        history.push('/bind')
      }
    })
  }

  render() {
    const { isActive } = this.state
    return (
      <div id="auth">
        <Header bgWhite isFixed isShadow title="选择授权方式" />
        <div className="main-content">
          <img className="banner" src={AuthBanner} alt="" />

          <div
            className={`line ${isActive === 'new' ? 'active' : ''}`}
            onClick={() => this.enterAuth('new')}
          >
            <div>
              <span>我是新用户</span>
              <span>使用当前zbx账号，直接授权登录</span>
            </div>
          </div>

          <div
            className={`line ${isActive === 'old' ? 'active' : ''}`}
            onClick={() => this.enterAuth('old')}
          >
            <div>
              <span>已有账号绑定</span>
              <span>登录已有账号,与当前ZBX账号绑定</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Index
