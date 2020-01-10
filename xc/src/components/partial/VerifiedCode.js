import React, { Component } from 'react'
import { Toast, Button } from 'antd-mobile'
import { COUNT_DOWN, REG, TOAST_DURATION } from '../../utils/constants'
import { inject, observer } from 'mobx-react'
import Captcha from '../common/Captcha'
import AccountHeader from './AccountHeader'
import UserApi from '../../api/user'
import './VerifiedCode.scss'

@inject('localeStore')
@observer
class VerifiedCode extends Component {
  state = {
    isGetSms: true,
    count: COUNT_DOWN,
    imgSrc: 'http://47.75.138.157/api/captchapng/png',
    captcha: '',
    captchaKey: +new Date(),
    preAccount: ''
  }

  componentDidMount() {
    this.getCaptchaPng()
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  getCaptchaPng = () => {
    const key = +new Date()

    UserApi.getCaptchaPng({ key }).then(res => {
      this.setState({ captchaKey: key, imgSrc: res })
    })
  }

  onAccountBlur = e => {
    const { value } = e.target
    const { preAccount } = this.state
    if (value !== preAccount) {
      this.setState({ preAccount: value })
      this.getCaptchaPng()
    }
  }

  onInputChange = (e, key) => {
    const { value } = e.target
    this.setState({ [key]: value })
  }

  codeCountDown = () => {
    let count = this.state.count

    this.timer = setInterval(() => {
      if (count <= 0) {
        this.setState({ isGetSms: true, count: COUNT_DOWN })
        clearInterval(this.timer)
        return
      }
      this.setState({ isGetSms: false, count: count-- })
    }, 1000)
  }

  emailExist = async () => {
    const { userName } = this.props
    const {
      localeStore: {
        locale: { PASSWORD }
      }
    } = this.props
    return UserApi.emailExist({ email: userName }).then(res => {
      if (res.status === -2) {
        Toast.info(PASSWORD.EMAIL_UN_REGISTER)
        return false
      }
      if (res.status !== 1) {
        Toast.info(res.msg)
        return false
      }
      return true
    })
  }

  phoneExist = () => {
    const { userName } = this.props
    const {
      localeStore: {
        locale: { PASSWORD }
      }
    } = this.props
    return UserApi.phoneExist({ phoneNo: userName, phonePrefix: '86' }).then(
      res => {
        if (res.status === -2) {
          Toast.info(PASSWORD.PHONE_UN_REGISTER)
          return false
        }
        if (res.status !== 1) {
          Toast.info(res.msg)
          return false
        }
        return true
      }
    )
  }

  sendSmsCode = async () => {
    const { userName, typeOption } = this.props
    const { captcha, captchaKey } = this.state

    const hasPhone = await this.phoneExist()
    if (!hasPhone) return
    UserApi.sendSmsCode(
      {
        imgcode: captcha,
        prefix: '86',
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
    const { userName, typeOption } = this.props
    const { captcha, captchaKey } = this.state
    const hasEmail = await this.emailExist()
    if (!hasEmail) return
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
    const { userName } = this.props
    const {
      localeStore: {
        locale: { PASSWORD }
      }
    } = this.props
    const { captcha } = this.state
    if (!REG.EMAIL.test(userName) && !REG.MOBILE.test(userName)) {
      Toast.info(PASSWORD.PHONE_OR_EMAIL_ERR, TOAST_DURATION)
      return
    }

    if (!captcha || captcha.length !== 4) {
      Toast.info(PASSWORD.INPUT_FOUR_GRAPH_CODE, TOAST_DURATION)
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
      onBack,
      localeStore: {
        locale: { PASSWORD }
      }
    } = this.props
    const { isGetSms, count, captcha, imgSrc } = this.state
    const canSubmit = userName !== '' && code !== ''

    return (
      <div className={'verified-code ' + (show ? 'show' : '')}>
        <AccountHeader title={typeOption.title} onHandle={onBack} />
        <div className="main-content">
          <label>
            <input
              className="input-main"
              type="text"
              placeholder={PASSWORD.ACCOUNT_PLACEHOLDER}
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
              placeholder={PASSWORD.GRAPH_CODE}
              onChange={e => this.onInputChange(e, 'captcha')}
              getCaptchaPng={this.getCaptchaPng}
            />
          </label>
          <label>
            <input
              className="input-main"
              type="text"
              maxLength={6}
              placeholder={PASSWORD.CODE}
              value={code}
              onChange={e => onInputChange(e, 'code')}
            />
            <span
              id="btn-code"
              className={`sms-code  ${!isGetSms ? `event-none` : ''}`}
              onClick={this.getCode}
            >
              {isGetSms ? PASSWORD.GET_VERIFY_CODE : <span>{`${count}s`}</span>}
            </span>
          </label>
        </div>
        <Button
          activeClassName="btn-common__active"
          className={`btn-common ${!canSubmit ? 'btn-common__disabled' : ''}`}
          disabled={!canSubmit}
          onClick={onNext}
        >
          {PASSWORD.NEXT_STEP}
        </Button>
      </div>
    )
  }
}

export default VerifiedCode
