import React, {Component} from 'react'
import {inject, observer} from "mobx-react"
import {Button, Toast} from 'antd-mobile'
import Cookies from "js-cookie"
import {Link} from 'react-router-dom'
import {TOAST_DURATION} from '../../utils/constants'
import {FiChevronDown} from "react-icons/fi"
import TEL_PREFIX_DATA from '../../utils/tel-prefix'
import {isEmail, isMobile, isPassword} from "../../utils/reg"
import AccountHeader from "../../components/partial/AccountHeader"
import openPwdImg from '../../assets/images/open-pwd.png'
import closePwdImg from '../../assets/images/close-pwd.png'
import TelPrefix from "../../components/partial/TelPrefix"
import './Login.scss'

@inject('localeStore')
@inject('userStore')
@observer
class Login extends Component {
  state = {
    account: '',
    password: '',
    type: 'password',
    prefix: TEL_PREFIX_DATA[0],
    showPrefix: false
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  onOpenPrefix = (e) => {
    e.preventDefault()
    this.setState({showPrefix: true})
  }

  onConfirmPrefix = (prefix) => {
    this.setState({showPrefix: false, prefix})
  }

  onCancelPrefix = () => {
    this.setState({showPrefix: false})
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
    const {account, password, prefix} = this.state

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
      phonePrefix: isMobile(account) ? prefix.tel : null,
      userName: account,
      password
    }).then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg, TOAST_DURATION)
        return
      }
      Cookies.remove('PRODUCT_ID')
      Toast.success('登录成功', TOAST_DURATION)
      this.timer = setTimeout(() => history.push('/deposit'), TOAST_DURATION * 1000)
    })
  }

  render() {
    const {localeStore} = this.props
    const {LOGIN,COMMON} = localeStore.language || {}
    const {account, password, type, prefix, showPrefix} = this.state
    const canSubmit = account === '' || password === ''

    return (
      <div id="login">
        <AccountHeader title={COMMON.LOGIN}/>
        <div className="content">
          <label className="account">
            <span onClick={this.onOpenPrefix}>
              +{prefix.tel}
              <FiChevronDown/>
            </span>
            <input
              className="input-main"
              type="text"
              placeholder={COMMON.ACCOUNT_PLACEHOLDER}
              value={account}
              onChange={(e) => this.onInputChange(e, 'account')}
            />
          </label>
          <label>
            <input
              className="input-main"
              type={type}
              placeholder={COMMON.PASSWORD_PLACEHOLDER}
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
            <Link to="/password/find">{LOGIN.FORGOT_PASSWORD}</Link>
            <Link to="/register">{COMMON.REGISTER}</Link>
          </p>
        </div>

        <div className="btn-box">
          <Button
            activeClassName="active"
            className="primary-button"
            disabled={canSubmit}
            onClick={this.onSubmit}>
            {COMMON.CONFIRM}
          </Button>
        </div>

        <TelPrefix
          show={showPrefix}
          prefix={prefix}
          confirm={this.onConfirmPrefix}
          cancel={this.onCancelPrefix}
        />
      </div>
    )
  }
}

export default Login
