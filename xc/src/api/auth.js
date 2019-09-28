import http from './http'

class AuthApi {
  /**
   * 授权后请求
   * 根据返回状态判断跳转页面：
   * 200：定存首页
   * 201：选择是老用户或新用户页面
   * -1：只有点击授权登陆按钮的页面
   *
   * @required info string 授权回调后拿到的info字段
   * @required signature string 授权回调后拿到的signature字段
   **/
  static userAuth(options = {}) {
    options.noLogin = true
    return http.post('/user/userauth', options)
  }

  /**
   * 新用户绑定邀请码
   *
   * @required infoKey string 后端返回的infoKey字段的值
   * @required recommendCode string 邀请码
   **/
  static newUserLogin(options = {}) {
    return http.post('/user/newuserlogin', options)
  }

  /**
   * 老用户绑定账号
   * 根据返回状态判断跳转页面：
   * 200：定存首页
   * -1：继续返回老用户绑定账号页面
   *
   * @required infoKey string 后端返回的infoKey字段的值
   * @required userName string 手机号或邮箱地址
   * @required password string 密码
   * @required phonePrefix string 手机国际码(当输入的账号为手机号时)
   *
   **/
  static oldUserLogin(options = {}) {
    return http.post('/user/oldUserLogin', options)
  }
}

export default AuthApi
