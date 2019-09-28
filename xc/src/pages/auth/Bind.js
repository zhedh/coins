import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Toast } from 'antd-mobile'
import { TOAST_DURATION } from '../../utils/constants'
import { isEmail, isMobile, isPassword } from '../../utils/reg'
import AccountHeader from '../../components/partial/AccountHeader'
import openPwdImg from '../../assets/images/open-pwd.png'
import closePwdImg from '../../assets/images/close-pwd.png'
import './Bind.scss'

class Bind extends Component {
  state = {
    account: '',
    password: '',
    phonePrefix: '86',
    type: 'password'
  }

  onInputChange = (e, key) => {
    const { value } = e.target
    this.setState({ [key]: value })
  }

  onSetType = currentType => {
    this.setState({ type: currentType === 'text' ? 'password' : 'text' })
  }

  onSubmit = () => {
    const { history, userStore } = this.props
    const { infoKey } = userStore
    const { account, password, phonePrefix } = this.state
    userStore
      .newUserLogin({
        info_key: infoKey,
        user_name: account,
        password,
        phone_prefix: phonePrefix
      })
      .then(() => {
        Toast.success('绑定成功', 0.9, () => {
          history.push('/home')
        })
      })
  }

  render() {
    const { account, password, type } = this.state
    const canSubmit = account === '' || password === ''

    return (
      <div id="bind">
        <AccountHeader title="账号绑定" />
        <div className="content">
          <label>
            <input
              className="input-main"
              type="text"
              placeholder="请输入X-PLAN 邮箱/手机号"
              value={account}
              onChange={e => this.onInputChange(e, 'account')}
            />
          </label>
          <label>
            <input
              className="input-main"
              type={type}
              placeholder="密码"
              value={password}
              onChange={e => this.onInputChange(e, 'password')}
            />
            <img
              src={type === 'text' ? openPwdImg : closePwdImg}
              alt=""
              onClick={() => this.onSetType(type)}
            />
          </label>
        </div>

        <div className="btn-box">
          <Button
            activeClassName="active"
            className="primary-button"
            disabled={canSubmit}
            onClick={this.onSubmit}
          >
            确认
          </Button>
        </div>
      </div>
    )
  }
}

export default Bind
