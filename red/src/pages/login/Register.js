import React, {Component} from 'react'
import {Button, Toast} from 'antd-mobile'
import {inject, observer} from 'mobx-react'
import Cookies from "js-cookie"
import {UserApi} from '../../api'
import {REG, TOAST_DURATION, COUNT_DOWN} from '../../utils/constants'
import {isEmail, isMobile} from "../../utils/reg"
import {compatibleFixedButton, getQueryParam} from '../../utils/common'
import Captcha from '../../components/common/Captcha'
import openPwdImg from '../../assets/images/open-pwd.png'
import closePwdImg from '../../assets/images/close-pwd.png'
import './Register.scss'
import AccountLangHeader from "../../components/partial/AccountLangHeader";

@inject('userStore')
@inject('localeStore')
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
    imgSrc: '',
    captcha: '',
    captchaKey: +new Date(),
    count: COUNT_DOWN,
    isGetSms: true,
    showBtn: true,
    isSubmit: true
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
    const {userStore} = this.props;
    const {localeStore: {locale: {REGISTER}}} = this.props;
    const {account, captcha, captchaKey} = this.state
    if (!isEmail(account) && !isMobile(account)) {
      Toast.info(REGISTER.PHONE_OR_EMAIL_ERR, TOAST_DURATION)
      return
    }

    if (!captcha || captcha.length !== 4) {
      Toast.info(REGISTER.INPUT_FOUR_GRAPH_CODE, TOAST_DURATION)
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
    const {userStore, history} = this.props;
    const {localeStore: {locale: {REGISTER}}} = this.props;
    const {
      account,
      code,
      password,
      passwordConfirm,
      recommendCode
    } = this.state;

    if (!REG.EMAIL.test(account) && !REG.MOBILE.test(account)) {
      Toast.info(REGISTER.ACCOUNT_ERR, TOAST_DURATION)
      return
    }
    if (!REG.PASSWORD.test(password)) {
      Toast.info(REGISTER.PASSWORD_ERR, TOAST_DURATION)
      return
    }
    if (password !== passwordConfirm) {
      Toast.info(REGISTER.PASSWORD_CONFIRM_ERR, TOAST_DURATION)
      return
    }
    this.setState({isSubmit: false})

    userStore.register({
      phonePrefix: isMobile(account) ? '86' : null,
      userName: account,
      code,
      password,
      passwordConfirm,
      recommendCode
    }).then(res => {
      this.setState({isSubmit: true})
      if (res.status !== 1) {
        Toast.info(res.msg, TOAST_DURATION)
        return
      }
      Cookies.remove('PRODUCT_ID')
      // Toast.success('注册成功', TOAST_DURATION, () => this.setState({showSuccess: true}))
      Toast.success(REGISTER.REGISTER_SUCCESS, TOAST_DURATION, () => history.push('/deposit'))
    }).catch(() => this.setState({isSubmit: true}))
  }

  render() {
    const {history} = this.props;
    const {localeStore: {locale: {REGISTER}}} = this.props;
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
      // showSuccess,
      showBtn,
      isSubmit
    } = this.state

    return (
      <div id="register">
        <AccountLangHeader onBack={() => history.push('/login')}/>
        <h1>{REGISTER.REGISTER}</h1>
        <div className="main-content">
          <label>
            <input
              className="input-main"
              type="text"
              placeholder={REGISTER.ACCOUNT_PLACEHOLDER}
              value={account}
              onBlur={this.onAccountBlur}
              onChange={e => this.onInputChange(e, 'account')}
            />
          </label>
          <label>
            <Captcha
              placeholder={REGISTER.GRAPH_CODE}
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
              maxLength={6}
              placeholder={REGISTER.CODE}
              value={code}
              onChange={e => this.onInputChange(e, 'code')}
            />
            <span
              className={`sms-code  ${!isGetSms ? `event-none` : ''}`}
              onClick={this.getCode}>
              {isGetSms ? REGISTER.GET_VERIFY_CODE : <span>{`${count}s`}</span>}
            </span>
          </label>
          <label>
            <input
              className="input-main"
              type={pwType}
              placeholder={REGISTER.PASSWORD}
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
              placeholder={REGISTER.INPUT_PASSWORD_AGAIN}
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
              placeholder={REGISTER.INVITER_CODE}
              value={recommendCode}
              onChange={e => this.onInputChange(e, 'recommendCode')}
            />
          </label>
        </div>
        {showBtn && <Button
          activeClassName="active"
          className="primary-button"
          disabled={!this.canSubmit() || !isSubmit}
          onClick={this.onSubmit}>
          {REGISTER.SUBMIT_LABEL}
        </Button>}
      </div>
    )
  }
}

export default Register
