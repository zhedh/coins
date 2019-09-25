import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Toast} from 'antd-mobile'
import {isEmail, isMobile} from "../../utils/reg"
import {REG, TOAST_DURATION} from '../../utils/constants'
import {UserApi} from '../../api'
import VerifiedCode from '../../components/partial/VerifiedCode'
import VerifiedPwd from '../../components/partial/VeritifiedPwd'
import './Password.scss'

@inject('localeStore')
@inject('userStore')
@inject('personStore')
@observer
class Password extends Component {
  state = {

    typeOption: {},
    step: 1,
    userName: '',
    code: '',
    password: '',
    passwordConfirm: '',
    verifyToken: null,
    prefix: '86'
  }

  componentDidMount() {
    this.getTypeOption()
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  getTypeOption = () => {
    const {match, history, userStore, personStore, localeStore} = this.props
    const {type} = match.params
    const {PASSWORD} = localeStore.language || {}

    const passwordTypes = [
      {
        type: 'find',
        title: PASSWORD.FIND_PASSWORD,
        codeType: 'findpassword',
        canChangeUser: true
      },
      {
        type: 'reset',
        title: PASSWORD.RESET_LOGIN_PASSWORD,
        codeType: 'findpassword',
        canChangeUser: false
      },
      {
        type: 'pay',
        title: PASSWORD.SET_PAY_PASSWORD,
        codeType: 'setpaypassword',
        canChangeUser: false
      },
      {
        type: 'repay',
        title: PASSWORD.RESET_PAY_PASSWORD,
        codeType: 'setpaypassword',
        canChangeUser: false
      }
    ]

    const typeOption = passwordTypes.find(item => item.type === type)
    if (!typeOption) {
      history.push('/404')
    }
    if (userStore.isOnline) {
      personStore.getUserInfo().then(() => {
        const userName = personStore.userName
        this.setState({typeOption, userName})
      })
      return
    }
    this.setState({typeOption})
  }

  onBack = () => {
    const {history} = this.props
    const {typeOption} = this.state
    history.push(typeOption.type !== 'find' ? '/account' : '/login')
  }

  onInputChange = (e, key) => {
    const {value} = e.target
    this.setState({[key]: value})
  }

  onStepChange = step => this.setState({step})

  onNext = (prefix) => {
    const {localeStore} = this.props
    const {userName, code, typeOption} = this.state
    const {TOAST} = localeStore.language || {}

    this.setState({prefix})
    if (!isEmail(userName) && !isMobile(userName)) {
      Toast.info(TOAST.ACCOUNT_ERR, TOAST_DURATION)
      return
    }

    if (!REG.SMSCODE.test(code)) {
      Toast.info(TOAST.CODE_ERR, TOAST_DURATION)
      return
    }

    // 调校验验证码 接口，成功回调以下
    // 找回密码不校验
    if (typeOption.type === 'find') {
      this.onStepChange(2)
      return
    }
    UserApi.checkCode({
      phonePrefix: isMobile(userName) ? prefix : null,
      userName,
      code,
      type: typeOption.codeType
    }).then(res => {
      if (res.status === 1) {
        this.setState({verifyToken: res.data.verifyToken})
        this.onStepChange(2)
        return
      }
      Toast.info(res && res.msg, TOAST_DURATION)
    })
  }

  onSubmit = () => {
    const {localeStore} = this.props
    const {TOAST} = localeStore.language || {}
    const {
      typeOption,
      userName,
      code,
      password,
      passwordConfirm,
      verifyToken,
      prefix
    } = this.state

    if (!REG.PASSWORD.test(password)) {
      Toast.info(TOAST.PASSWORD_ERR, TOAST_DURATION)
      return
    }
    if (password !== passwordConfirm) {
      Toast.info(TOAST.PASSWORD_CONFIRM_ERR, TOAST_DURATION)
      return
    }

    const isPhone = REG.MOBILE.test(userName)

    // 找回登录密码
    if (typeOption.type === 'find') {
      return UserApi.findPassword({
        phonePrefix: isPhone ? prefix : null,
        userName,
        code,
        password,
        passwordConfirm
      }).then(res =>
        this.updateLoginPasswordSuccess(res, TOAST.PASSWORD_RESET_TO_LOGIN)
      )
    }

    // 重置登录密码
    if (typeOption.type === 'reset') {
      return UserApi.editPassword({
        password,
        passwordConfirm,
        verifyToken
      }).then(res =>
        this.updateLoginPasswordSuccess(res, TOAST.PASSWORD_RESET_TO_LOGIN)
      )
    }

    if (typeOption.type === 'pay' || typeOption.type === 'repay') {
      return UserApi.setPayPasswordForEmail({
        payPassword: password,
        payPasswordConfirm: passwordConfirm,
        verifyToken
      }).then(res => {
        if (res.status !== 1) {
          Toast.info(res && res.msg, TOAST_DURATION)
          return
        }

        const {history, userStore} = this.props
        const msg = typeOption.type === 'pay' ? TOAST.SET_SUCCESS : TOAST.RESET_SUCCESS
        userStore.changePayPasswordStatus(1)
        Toast.info(msg, TOAST_DURATION, () => history.goBack())
      })
    }
  }

  updateLoginPasswordSuccess(res, msg) {
    if (res.status !== 1) {
      Toast.info(res && res.msg, TOAST_DURATION)
      return
    }
    const {userStore, history} = this.props
    userStore.logout()
    Toast.info(msg, TOAST_DURATION, () => history.push(`/login`))
  }

  render() {
    const {
      step,
      typeOption,
      userName,
      code,
      password,
      passwordConfirm,
    } = this.state

    return (
      <div id="password">
        <VerifiedCode
          show={step === 1}
          typeOption={typeOption}
          userName={userName}
          code={code}
          onInputChange={this.onInputChange}
          onNext={this.onNext}
          onBack={this.onBack}
          clearState={this.clearState}
        />
        <VerifiedPwd
          show={step === 2}
          typeOption={typeOption}
          password={password}
          passwordConfirm={passwordConfirm}
          onInputChange={this.onInputChange}
          onSubmit={this.onSubmit}
          onStepChange={this.onStepChange}
        />
      </div>
    )
  }
}

export default Password
