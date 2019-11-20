import http from './http'
// import Mock from 'mockjs'

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
   *
   * page string 页码
   * row string 每页条数
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
    // return Promise.resolve(Mock.mock({
    //   "status": 1,
    //   "msg": "Success",
    //   // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    //   [`data|${options.row}`]: [{
    //     // 属性 id 是一个自增数，起始值为 1，每次增 1
    //     'email': Mock.Random.email(),
    //     'regTime': +new Date() / 1000
    //   }]
    // }))

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
