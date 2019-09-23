import React, {Component} from 'react'
import {Toast, Button} from 'antd-mobile'
import {FiChevronDown} from "react-icons/fi"
import {COUNT_DOWN, REG, TOAST_DURATION} from '../../utils/constants'
import Captcha from '../common/Captcha'
import AccountHeader from './AccountHeader'
import UserApi from '../../api/user'
import TelPrefix from "./TelPrefix"
import TEL_PREFIX_DATA from "../../utils/tel-prefix"
import './VerifiedCode.scss'
import {inject, observer} from "mobx-react";

@inject('userStore')
@observer
class VerifiedCode extends Component {
  state = {
    isGetSms: true,
    count: COUNT_DOWN,
    imgSrc: 'http://47.75.138.157/api/captchapng/png',
    captcha: '',
    captchaKey: +new Date(),
    preAccount: '',
    prefix: TEL_PREFIX_DATA[0],
    showPrefix: false
  }

  componentDidMount() {
    this.getPrefix()
    this.getCaptchaPng()
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  getPrefix = () => {
    const {userStore} = this.props
    this.setState({prefix: userStore.getPrefix()})
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

  onAccountBlur = e => {
    const {value} = e.target
    const {preAccount} = this.state
    if (value !== preAccount) {
      this.setState({preAccount: value})
      this.getCaptchaPng()
    }
  }

  onInputChange = (e, key) => {
    const {value} = e.target
    this.setState({[key]: value})
  }

  codeCountDown = () => {
    let count = this.state.count

    this.timer = setInterval(() => {
      if (count <= 0) {
        this.setState({isGetSms: true, count: COUNT_DOWN})
        clearInterval(this.timer)
        return
      }
      this.setState({isGetSms: false, count: count--})
    }, 1000)
  }

  emailExist = () => {
    const {userName} = this.props
    UserApi.emailExist({email: userName}).then(res => {
      if (res.status === -2) {
        Toast.info('该邮箱未注册')
        return
      }
    })
  }

  phoneExist = () => {
    const {userName} = this.props
    const {prefix} = this.state
    UserApi.emailExist({phoneNo: userName, phonePrefix: prefix && prefix.tel}).then(res => {
      if (res.status === -2) {
        Toast.info('该手机号未注册')
        return
      }
    })
  }

  sendSmsCode = async () => {
    const {userName, typeOption} = this.props
    const {captcha, captchaKey, prefix} = this.state
    await this.phoneExist()
    UserApi.sendSmsCode(
      {
        imgcode: captcha,
        prefix: prefix && prefix.tel,
        phone: userName,
        type: typeOption.codeType
      },
      {
        key: captchaKey
      }
    ).then(res => {
      if (res.status === -1) {
        Toast.info(res.msg)
        this.getCaptchaPng()
        return
      }
      this.codeCountDown()
    })
  }

  sendMailCode = async () => {
    const {userName, typeOption} = this.props
    const {captcha, captchaKey} = this.state
    await this.emailExist()
    UserApi.sendMailCode(
      {
        imgcode: captcha,
        email: userName,
        type: typeOption.codeType
      },
      {
        key: captchaKey
      }
    ).then(res => {
      if (res.status === -1) {
        Toast.info(res.msg)
        this.getCaptchaPng()
        return
      }
      this.codeCountDown()
    })
  }

  getCode = () => {
    const {userName} = this.props
    const {captcha} = this.state
    if (!REG.EMAIL.test(userName) && !REG.MOBILE.test(userName)) {
      Toast.info('请填写正确的邮箱或者手机号', TOAST_DURATION)
      return
    }

    if (!captcha || captcha.length !== 4) {
      Toast.info('请输入4位验证码', TOAST_DURATION)
      return
    }

    REG.MOBILE.test(userName) ? this.sendSmsCode() : this.sendMailCode()
  }

  render() {
    const {
      show,
      typeOption,
      userName,
      code,
      onInputChange,
      onNext,
      onBack
    } = this.props
    const {
      isGetSms,
      count,
      captcha,
      imgSrc,
      showPrefix,
      prefix
    } = this.state
    const canSubmit = userName !== '' && code !== ''

    return (
      <div className={'verified-code ' + (show ? 'show' : '')}>
        <AccountHeader title={typeOption.title} onHandle={onBack}/>
        <div className="main-content">
          <label className="account">
            <span onClick={this.onOpenPrefix}>
              +{prefix.tel}
              <FiChevronDown/>
            </span>
            <input
              className="input-main"
              type="text"
              placeholder="邮箱/手机号"
              value={userName}
              readOnly={!typeOption.canChangeUser}
              onChange={e => onInputChange(e, 'userName')}
              onBlur={this.onAccountBlur}
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
              onChange={e => onInputChange(e, 'code')}
            />
            <span
              id="btn-code"
              className={`sms-code  ${!isGetSms ? `event-none` : ''}`}
              onClick={this.getCode}
            >
              {isGetSms ? '获取验证码' : <span>{`${count}s`}</span>}
            </span>
          </label>
        </div>
        <Button
          activeClassName="btn-common__active"
          className={`btn-common ${!canSubmit ? 'btn-common__disabled' : ''}`}
          disabled={!canSubmit}
          onClick={() => onNext(prefix.tel)}
        >
          下一步
        </Button>

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

export default VerifiedCode
