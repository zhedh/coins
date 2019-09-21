import http from './http'

class OtherApi {
  /**
   * 获取公告列表
   **/
  static getNotices(options = {}) {
    options.noLogin = true;
    return http.get('/other/noticelist', options)
  }

  /**
   * 获取公告详情
   *
   * @required id string 公告ID
   **/
  static getNoticeDetail(options = {}) {
    options.noLogin = true;
    return http.post('/other/noticeview', options)
  }

  /**
   * 轮播列表
   **/
  static getBannerList(options = {}) {
    options.noLogin = true;
    return http.get('/other/banner', options)
  }

  /**
   * 我的推广
   **/
  static getMySpread(options = {}) {
    return http.post('/other/myspread', options)
  }

  /**
   * 我的直推明细
   *
   * page string 页码
   * row string 每页条数
   * @required type string 推荐等级 （1|2）
   **/
  static getSpreadList(options = {}) {
    return http.post('/other/myspreadlist', options)
  }

  /**
   * 版本控制
   *
   * @required type 0为ios，1为安卓
   **/
  static getVersion(options = {}) {
    return http.post('/other/version', options)
  }

  /**
   * 规则说明
   *
   * @required
   **/
  static getRules() {
    return http.get('/other/rules')
  }
}

export default OtherApi
