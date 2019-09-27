import React, {Component} from 'react'
import {inject, observer} from "mobx-react"
import {Button, Toast} from 'antd-mobile'
import {Link} from 'react-router-dom'
import {TOAST_DURATION} from '../../utils/constants'
import {isEmail, isMobile, isPassword} from "../../utils/reg"
import AccountHeader from "../../components/partial/AccountHeader"
import openPwdImg from '../../assets/images/open-pwd.png'
import closePwdImg from '../../assets/images/close-pwd.png'
import './Login.scss'

@inject('userStore')
@observer
class Login extends Component {
  state = {
    account: '',
    password: '',
    type: 'password',
    hideBack: false
  }

  componentDidMount() {
    const {location: {state}} = this.props
    this.setState({hideBack: state && state.hideBack})
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  onInputChange = (e, key) => {
    const {value} = e.target
    this.setState({[key]: value})
  }

  onSetType = currentType => {
    this.setState({type: currentType === 'text' ? 'password' : 'text'})
  }

  onSubmit = () => {
    const {history, userStore} = this.props
    const {account, password} = this.state

    if (!isEmail(account) && !isMobile(account)) {
      Toast.info('账号输入错误', TOAST_DURATION)
      return
    }

    if (!isPassword(password)) {
      Toast.info('密码最少8位，字母加数字', TOAST_DURATION)
      return
    }

    // 登录接口，成功后前往首页
    userStore.login({
      phonePrefix: isMobile(account) ? '86' : null,
      userName: account,
      password
    }).then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg, TOAST_DURATION)
        return
      }

      Toast.success('登录成功', TOAST_DURATION)
      this.timer = setTimeout(() => history.push('/deposit'), TOAST_DURATION * 1000)
    })
  }

  render() {
    const {account, password, type, hideBack} = this.state
    const canSubmit = account === '' || password === ''
    console.log(hideBack)
    return (
      <div id="login">
        <AccountHeader hideBack={hideBack} title="登录"/>
        <div className="content">
          <label>
            <input
              className="input-main"
              type="text"
              placeholder="邮箱/手机号"
              value={account}
              onChange={(e) => this.onInputChange(e, 'account')}
            />
          </label>
          <label>
            <input
              className="input-main"
              type={type}
              placeholder="密码"
              value={password}
              onChange={(e) => this.onInputChange(e, 'password')}
            />
            <img
              src={type === 'text' ? openPwdImg : closePwdImg}
              alt=""
              onClick={() => this.onSetType(type)}
            />
          </label>
          <p>
            <Link to="/password/find">忘记密码？</Link>
            <Link to="/register">注册</Link>
          </p>
        </div>

        <div className="btn-box">
          <Button
            activeClassName="active"
            className="primary-button"
            disabled={canSubmit}
            onClick={this.onSubmit}>
            确认
          </Button>
        </div>
      </div>
    )
  }
}

export default Login
