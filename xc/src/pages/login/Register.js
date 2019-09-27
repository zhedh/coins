import React, {Component} from 'react'
import {Button, Toast} from 'antd-mobile'
import {inject, observer} from 'mobx-react'
import Cookies from "js-cookie"
import {UserApi} from '../../api'
import {REG, TOAST_DURATION, COUNT_DOWN} from '../../utils/constants'
import {isEmail, isMobile} from "../../utils/reg"
import {compatibleFixedButton, getQueryParam} from '../../utils/common'
import AccountHeader from '../../components/partial/AccountHeader'
import Captcha from '../../components/common/Captcha'
import openPwdImg from '../../assets/images/open-pwd.png'
import closePwdImg from '../../assets/images/close-pwd.png'
import registerSuccessImg from '../../assets/images/register-success.png'
import './Register.scss'

class RegisterSuccess extends Component {

  render() {
    const {history} = this.props

    return (
      <div className="register-success">
        <AccountHeader title="注册成功！"/>
        <main>
          <img src={registerSuccessImg} alt=""/>
          <p className="text">恭喜您，注册成功 !</p>
        </main>
        <Button
          className="primary-button"
          onClick={() => history.push('/deposit')}>
          立即开启
        </Button>
      </div>
    )
  }
}

@inject('userStore')
@observer
class Register extends Component {
  state = {
    preAccount: '',
    account: '',
    code: '',
    imgCode: '',
    password: '',
    passwordConfirm: '',
    recommendCode: '',
    showCaptchaPng: false,
    pwType: 'password',
    pwConfirmType: 'password',
    imgSrc: 'http://47.75.138.157/api/captchapng/png',
    captcha: '',
    captchaKey: +new Date(),
    count: COUNT_DOWN,
    isGetSms: true,
    showSuccess: false,
    showBtn: true,
    isSubmit: false
  }

  componentDidMount() {
    const recommendCode = getQueryParam('recommendCode') || ''
    this.setState({recommendCode})
    this.getCaptchaPng()
    compatibleFixedButton(isShow => {
      this.setState({showBtn: isShow})
    })
  }

  componentWillUnmount() {
    window.onresize = null
  }

  getCaptchaPng = () => {
    const key = +new Date()

    UserApi.getCaptchaPng({key}).then(res => {
      this.setState({captchaKey: key, imgSrc: res})
    })
  }

  canSubmit = () => {
    const {account, code, password, passwordConfirm} = this.state
    return !!(account && code && password && passwordConfirm)
  }

  onInputChange = (e, key) => {
    const {value} = e.target
    this.setState({[key]: value})
  }

  onAccountBlur = e => {
    const {value} = e.target
    const {preAccount} = this.state
    if (value !== preAccount) {
      this.setState({preAccount: value})
      this.getCaptchaPng()
    }
  }

  codeCountDown = () => {
    let count = this.state.count

    this.timer = setInterval(() => {
      if (count <= 0) {
        this.setState({isGetSms: true, count: COUNT_DOWN})
        clearInterval(this.timer)
      } else {
        this.setState({isGetSms: false, count: count--})
      }
    }, 1000)
  }

  getCode = async () => {
    const {userStore} = this.props
    const {account, captcha, captchaKey} = this.state
    if (!isEmail(account) && !isMobile(account)) {
      Toast.info('请填写正确的邮箱或者手机号', TOAST_DURATION)
      return
    }

    if (!captcha || captcha.length !== 4) {
      Toast.info('请输入4位验证码', TOAST_DURATION)
      return
    }

    userStore.getCode({
      captcha,
      account,
      type: 'reg'
    }, {key: captchaKey}).then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg)
        this.getCaptchaPng()
        return
      }
      this.codeCountDown()
    })
  }

  onSetType = (currentType, key) => {
    const type = currentType === 'password' ? 'text' : 'password'
    this.setState({[key]: type})
  }

  onSubmit = () => {
    const {userStore} = this.props
    const {
      account,
      code,
      password,
      passwordConfirm,
      recommendCode
    } = this.state

    if (!REG.EMAIL.test(account) && !REG.MOBILE.test(account)) {
      Toast.info('账号输入错误', TOAST_DURATION)
      return
    }
    if (!REG.PASSWORD.test(password)) {
      Toast.info('密码最少8位，字母加数字', TOAST_DURATION)
      return
    }
    if (password !== passwordConfirm) {
      Toast.info('两次密码不一致', TOAST_DURATION)
      return
    }
    this.setState({isSubmit: true})

    userStore.register({
      phonePrefix: isMobile(account) ? '86' : null,
      userName: account,
      code,
      password,
      passwordConfirm,
      recommendCode
    }).then(res => {
      this.setState({isSubmit: false})
      if (res.status !== 1) {
        Toast.info(res.msg, TOAST_DURATION)
        return
      }
      Cookies.remove('PRODUCT_ID')
      Toast.success('注册成功', TOAST_DURATION, () => this.setState({showSuccess: true}))
    })
  }

  render() {
    const {history} = this.props
    const {
      account,
      code,
      password,
      passwordConfirm,
      recommendCode,
      pwType,
      pwConfirmType,
      captcha,
      imgSrc,
      count,
      isGetSms,
      showSuccess,
      showBtn,
      isSubmit
    } = this.state

    return (
      <div id="register">
        <AccountHeader title="注册" onHandle={() => history.push('/login')}/>
        <div className="main-content">
          <label>
            <input
              className="input-main"
              type="text"
              placeholder="邮箱/手机号"
              value={account}
              onBlur={this.onAccountBlur}
              onChange={e => this.onInputChange(e, 'account')}
            />
          </label>
          <label>
            <Captcha
              imgSrc={imgSrc}
              value={captcha}
              onChange={e => this.onInputChange(e, 'captcha')}
              getCaptchaPng={this.getCaptchaPng}
            />
          </label>
          <label>
            <input
              className="input-main"
              type="text"
              maxLength={4}
              placeholder="验证码"
              value={code}
              onChange={e => this.onInputChange(e, 'code')}
            />
            <span
              className={`sms-code  ${!isGetSms ? `event-none` : ''}`}
              onClick={this.getCode}>
              {isGetSms ? '获取验证码' : <span>{`${count}s`}</span>}
            </span>
          </label>
          <label>
            <input
              className="input-main"
              type={pwType}
              placeholder="密码"
              value={password}
              onChange={e => this.onInputChange(e, 'password')}
            />
            <img
              className="eye-img"
              src={pwType === 'text' ? openPwdImg : closePwdImg}
              alt="睁眼闭眼"
              onClick={() => this.onSetType(pwType, 'pwType')}
            />
          </label>
          <label>
            <input
              className="input-main"
              type={pwConfirmType}
              placeholder="再次输入密码"
              value={passwordConfirm}
              onChange={e => this.onInputChange(e, 'passwordConfirm')}
            />
            <img
              className="eye-img"
              src={pwConfirmType === 'text' ? openPwdImg : closePwdImg}
              alt="睁眼闭眼"
              onClick={() => this.onSetType(pwConfirmType, 'pwConfirmType')}
            />
          </label>
          <label>
            <input
              className="input-main"
              type="text"
              placeholder="邀请码"
              value={recommendCode}
              onChange={e => this.onInputChange(e, 'recommendCode')}
            />
          </label>
        </div>
        {showBtn && <Button
          activeClassName="active"
          className="primary-button"
          disabled={!this.canSubmit() || isSubmit}
          onClick={this.onSubmit}>
          立即注册
        </Button>}
        {showSuccess && <RegisterSuccess history={this.props.history}/>}
      </div>
    )
  }
}

export default Register
