import React, {Component} from 'react'
import {inject, observer} from "mobx-react"
import {Button, Toast} from 'antd-mobile'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {TOAST_DURATION} from '../../utils/constants'
import {isEmail, isMobile, isPassword} from "../../utils/reg"
import AccountLangHeader from "../../components/partial/AccountLangHeader";
import openPwdImg from '../../assets/images/open-pwd.png'
import closePwdImg from '../../assets/images/close-pwd.png'
import './Login.scss'

@inject('userStore')
@inject('localeStore')
@observer
class Login extends Component {
  state = {
    account: '',
    password: '',
    type: 'password',
    isSubmit: true
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  onInputChange = (e, key) => {
    const {value} = e.target;
    this.setState({[key]: value});
  };

  onSetType = currentType => {
    this.setState({type: currentType === 'text' ? 'password' : 'text'})
  };

  onSubmit = () => {
    const {history, userStore, localeStore: {locale: {LOGIN}}} = this.props;
    const {account, password} = this.state;

    if (!isEmail(account) && !isMobile(account)) {
      Toast.info(LOGIN.ACCOUNT_ERR, TOAST_DURATION)
      return
    }

    if (!isPassword(password)) {
      Toast.info(LOGIN.PASSWORD_ERR, TOAST_DURATION)
      return
    }

    this.setState({isSubmit: false})

    // 登录接口，成功后前往首页
    userStore.login({
      phonePrefix: isMobile(account) ? '86' : null,
      userName: account,
      password
    }).then(res => {
      this.setState({isSubmit: true})
      if (res.status !== 1) {
        Toast.info(res.msg, TOAST_DURATION)
        return
      }
      Cookies.remove('PRODUCT_ID')
      Toast.success(LOGIN.LOGIN_SUCCESS, TOAST_DURATION)
      this.timer = setTimeout(() => history.push('/deposit'), TOAST_DURATION * 1000)
    }).catch(() => this.setState({isSubmit: true}))
  }

  render() {
    const {localeStore: {locale: {LOGIN}}} = this.props;
    const {account, password, type, isSubmit} = this.state;
    const unSubmit = account === '' || password === '' || !isSubmit;

    return (
      <div id="login">
        <AccountLangHeader/>
        <h1>{LOGIN.LOGIN}</h1>
        <div className="content">
          <label>
            <input
              className="input-main"
              type="text"
              placeholder={LOGIN.ACCOUNT_PLACEHOLDER}
              value={account}
              onChange={(e) => this.onInputChange(e, 'account')}
            />
          </label>
          <label>
            <input
              className="input-main"
              type={type}
              placeholder={LOGIN.PASSWORD_PLACEHOLDER}
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
            <Link to="/password/find">{LOGIN.FORGET_PASSWORD}</Link>
            <Link to="/register">{LOGIN.REGISTER}</Link>
          </p>
        </div>

        <div className="btn-box">
          <Button
            activeClassName="active"
            className="primary-button"
            disabled={unSubmit}
            onClick={this.onSubmit}>
            {LOGIN.CONFIRM}
          </Button>
        </div>
      </div>
    )
  }
}

export default Login
