import {observable, action, computed} from 'mobx'
import Cookies from 'js-cookie'
import UserApi from '../api/user'
import AuthApi from '../api/auth'
import {isMobile} from '../utils/reg'

class UserStore {
  @observable token
  @observable openid
  @observable payPassword
  @observable lastTime

  @computed
  get hasPayPassword() {
    return Number(this.payPassword) === 1
  }

  @action
  isOnline() {
    return !!(Cookies.get('TOKEN') && Cookies.get('OPENID'))
  }

  @action
  getUserStatus() {
    this.token = Cookies.get('TOKEN')
    this.openid = Cookies.get('OPENID')
    this.payPassword = Cookies.get('PAY_PASSWORD')
    this.lastTime = Cookies.get('LAST_TIME')
  }

  @action
  setUserCookie(data) {
    Cookies.set('OPENID', data.openId)
    Cookies.set('TOKEN', data.token)
    Cookies.set('PAY_PASSWORD', data.payPassword)
    Cookies.set('LAST_TIME', data.lastTime)
    this.getUserStatus()
  }

  @action
  register(options) {
    return UserApi.register(options).then(res => {
      if (res.status === 1) {
        this.setUserCookie(res.data)
      }
      return res
    })
  }

  @action
  login(options) {
    return UserApi.login(options).then(res => {
      if (res.status === 1) {
        this.setUserCookie(res.data)
      }
      return res
    })
  }

  @action
  logout() {
    Cookies.remove('TOKEN')
    Cookies.remove('OPENID')
    Cookies.remove('PAY_PASSWORD')
    this.token = null
    this.openid = null
    this.payPassword = null
  }

  @action
  changePayPasswordStatus(status) {
    Cookies.set('PAY_PASSWORD', status)
    this.payPassword = Cookies.get('PAY_PASSWORD')
  }

  @action
  getPayToken(options) {
    return UserApi.getPayToken(options)
  }

  // 获取验证码
  // 用 account 替代 phone 或者 email
  @action
  getCode(options, params) {
    const {account} = options
    return isMobile(account)
      ? UserApi.sendSmsCode(
        {
          imgcode: options.captcha,
          prefix: options.prefix ? options.prefix : '86',
          phone: account,
          type: options.type
        },
        params
      )
      : UserApi.sendMailCode(
        {
          imgcode: options.captcha,
          email: account,
          type: options.type
        },
        params
      )
  }

  // ---auth start-----
  @action
  setInfoKey(infoKey) {
    Cookies.set('INFO_KEY', infoKey)
  }

  @action
  getInfoKey() {
    return Cookies.get('INFO_KEY')
  }

  @action
  userAuth(options) {
    return AuthApi.userAuth(options).then(res => {
      if (res.status === 200) {
        this.setUserCookie(res.data)
      }
      return res
    })
  }

  @action
  newUserLogin(options) {
    return AuthApi.newUserLogin(options).then(res => {
      if (res.status === 200) {
        this.setUserCookie(res.data)
      }
      return res
    })
  }

  @action
  oldUserLogin(options) {
    return AuthApi.oldUserLogin(options).then(res => {
      if (res.status === 200) {
        this.setUserCookie(res.data)
      }
      return res
    })
  }

  // ---auth end-----
}

export default UserStore
