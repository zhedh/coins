import {observable, action, computed} from 'mobx'
import Cookies from "js-cookie"
import UserApi from "../api/user"
import {isMobile} from "../utils/reg"

class UserStore {
  @observable token;
  @observable openid;
  @observable payPassword;

  @computed
  get isOnline() {
    return !!(this.token && this.openid)
  }

  @computed
  get hasPayPassword() {
    return Number(this.payPassword) === 1
  }

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
    const {account} = options
    return isMobile(account) ?
      UserApi.sendSmsCode({
        imgcode: options.captcha,
        prefix: options.prefix ? options.prefix : '86',
        phone: account,
        type: options.type
      }, params) :
      UserApi.sendMailCode({
        imgcode: options.captcha,
        email: account,
        type: options.type
      }, params)
  }
}

export default UserStore
