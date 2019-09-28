import { observable, action, computed } from 'mobx'
import AuthApi from '../api/auth'

class AuthStore {
  @observable infoKey = ''

  @action
  userAuth(options) {
    return AuthApi.userAuth(options).then(res => {
      if (res && res.status === 200) {
        window.location.href = '/home'
        return
      }
      // if (res && res.status === -1) {
      //   window.location.href = '/zbx-login'
      //   return
      // }
      this.infoKey = res.data && res.data.info_key
      // if (res.status === 1) this.userInfo = res.data
      return res
    })
  }
}

export default AuthStore
