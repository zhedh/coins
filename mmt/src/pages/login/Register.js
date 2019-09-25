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
import {FiChevronDown} from "react-icons/fi"
import TEL_PREFIX_DATA from "../../utils/tel-prefix"
import TelPrefix from "../../components/partial/TelPrefix"
import './Register.scss'

@inject('localeStore')
@observer
class RegisterSuccess extends Component {

  render() {
    const {history, localeStore} = this.props
    const {REGISTER} = localeStore.language || {}
    return (
      <div className="register-success">
        <AccountHeader title={REGISTER.REGISTER_SUCCESS}/>
        <main>
          <img src={registerSuccessImg} alt=""/>
          <p className="text">{REGISTER.HAPPY_REGISTER_SUCCESS}</p>
        </main>
        <Button className="primary-button" onClick={() => history.push('/deposit')}>
          {REGISTER.OPEN_FIRST}
        </Button>
      </div>
    )
  }
}

@inject('localeStore')
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
    prefix: TEL_PREFIX_DATA[0],
    showPrefix: false
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
    const {userStore, localeStore} = this.props
    const {account, captcha, captchaKey, prefix} = this.state
    const {TOAST} = localeStore.language || {}

    if (!isEmail(account) && !isMobile(account)) {
      Toast.info(TOAST.PLEASE_INPUT_CONFIRM_ACCOUNT, TOAST_DURATION)
      return
    }

    if (!captcha || captcha.length !== 4) {
      Toast.info(TOAST.PLEASE_INPUT_4_CODE, TOAST_DURATION)
      return
    }

    userStore.getCode({
      captcha,
      account,
      prefix: prefix.tel,
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
    const {userStore, localeStore} = this.props
    const {TOAST} = localeStore.language || {}
    const {
      account,
      code,
      password,
      passwordConfirm,
      recommendCode,
      prefix
    } = this.state

    if (!REG.EMAIL.test(account) && !REG.MOBILE.test(account)) {
      Toast.info(TOAST.ACCOUNT_ERR, TOAST_DURATION)
      return
    }
    if (!REG.PASSWORD.test(password)) {
      Toast.info(TOAST.PASSWORD_ERR, TOAST_DURATION)
      return
    }
    if (password !== passwordConfirm) {
      Toast.info(TOAST.PASSWORD_CONFIRM_ERR, TOAST_DURATION)
      return
    }

    userStore.register({
      phonePrefix: isMobile(account) ? prefix.tel : null,
      userName: account,
      code,
      password,
      passwordConfirm,
      recommendCode
    }).then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg, TOAST_DURATION)
        return
      }
      Cookies.remove('PRODUCT_ID')
      Toast.success(TOAST.REGISTER_SUCCESS, TOAST_DURATION, () => this.setState({showSuccess: true}))
    })
  }

  render() {
    const {history, localeStore} = this.props
    const {REGISTER, COMMON} = localeStore.language || {}
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
      showPrefix,
      prefix
    } = this.state

    return (
      <div id="register">
        <AccountHeader title={COMMON.REGISTER} onHandle={() => history.push('/login')}/>
        <div className="main-content">
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
              placeholder={COMMON.VERIFY_CODE}
              value={code}
              onChange={e => this.onInputChange(e, 'code')}
            />
            <span
              className={`sms-code  ${!isGetSms ? `event-none` : ''}`}
              onClick={this.getCode}>
              {isGetSms ? COMMON.GET_VERIFY_CODE : <span>{`${count}s`}</span>}
            </span>
          </label>
          <label>
            <input
              className="input-main"
              type={pwType}
              placeholder={COMMON.PASSWORD_PLACEHOLDER}
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
              placeholder={COMMON.PASSWORD_CONFIRM_PLACEHOLDER}
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
              placeholder={COMMON.INVITER_CODE}
              value={recommendCode}
              onChange={e => this.onInputChange(e, 'recommendCode')}
            />
          </label>
        </div>
        {showBtn && <Button
          activeClassName="active"
          className="primary-button"
          disabled={!this.canSubmit()}
          onClick={this.onSubmit}>
          {REGISTER.SUBMIT_LABEL}
        </Button>}
        {showSuccess && <RegisterSuccess history={this.props.history}/>}

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

export default Register
