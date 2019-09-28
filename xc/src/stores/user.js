import { observable, action, computed } from 'mobx'
import Cookies from 'js-cookie'
import UserApi from '../api/user'
import AuthApi from '../api/auth'
import { isMobile } from '../utils/reg'

class UserStore {
  @observable token
  @observable openid
  @observable payPassword

  @computed
  get isOnline() {
    return !!(this.token && this.openid)
  }

  @computed
  get hasPayPassword() {
    return Number(this.payPassword) === 1
  }

  // ---auth -----
  @action
  newUserLogin(options) {
    return AuthApi.newUserLogin(options).then(res => {
      if (res.status === 200) {
        this.openid = res.data.open_id
        this.token = res.data.token
        this.payPassword = res.data.pay_password
      }
      return res
    })
  }

  @action
  oldUserLogin(options) {
    return AuthApi.oldUserLogin(options).then(res => {
      if (res.status === -1) {
        window.location.href = '/authorization?tab=1'
        return
      }

      if (res.status === 200) {
        window.location.href = '/home'

        this.openid = res.data.open_id
        this.token = res.data.token
        this.payPassword = res.data.pay_password
      }
      return res
    })
  }
  // ---auth -----

  @action
  setUserStatus() {
    this.token = Cookies.get('TOKEN')
    this.openid = Cookies.get('OPENID')
    this.payPassword = Cookies.get('PAY_PASSWORD')
  }

  @action
  setUserCookie(data) {
    Cookies.set('OPENID', data.openId)
    Cookies.set('TOKEN', data.token)
    Cookies.set('PAY_PASSWORD', data.payPassword)
    this.setUserStatus()
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
    const { account } = options
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
}

export default UserStore
