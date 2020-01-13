import http from './http'

class ProductApi {
  /**
   * 基金列表
   *
   * page string 页码默认1
   * row string 每页条数
   **/
  static getProductList(options = {}) {
    options.noLogin = true
    return http.post('/product/list', options)
  }

  /**
   * 基金详情（下单页面初始化）
   *
   * productId number 商品id（不传默认自动获取）
   **/
  static getProductDetail(options = {}) {
    return http.post('/order/createini', options)
  }

  /**
   * 创建订单
   *
   * @required payToken string 支付TOKEN
   * @required productId string 商品id
   * @required productAmount string 商品数量
   * special string 0为普通参与，1为特价买入
   *
   **/
  static createOrder(options = {}) {
    return http.post('/order/createorder', options)
  }
}

export default ProductApi
