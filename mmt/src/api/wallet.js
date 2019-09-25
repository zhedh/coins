import http from "./http";

class WalletApi {
  /**
   * 我的钱包
   **/
  static getWallets(options = {}) {
    return http.post('/userassets/mywarehouse', options)
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
   * special string 0为普通参与计划，1为特价买入
   *
   **/
  static createOrder(options = {}) {
    return http.post('/order/createorder', options)
  }

  /**
   * 获取USDT流水
   *
   * type string balance(代表USDT) 默认值：balance
   * page string 页码
   * row string 每页条数
   *
   **/
  static getUsdtStream(options = {}) {
    return http.post('/userassets/stream', options)
  }

  /**
   * 获取基金流水
   *
   * @required productId string 商品id
   **/
  static getCoinStream(options = {}) {
    return http.post('/userassets/mywarehouselist', options)
  }

  /**
   * 提币申请初始化
   *
   * @required type string 提币类型，USDT|XC
   **/
  static withdrawInit(options = {}) {
    return http.post('/user/cashini', options)
  }

  /**
   * 提交提币申请
   *
   * @required walletTo string 钱包地址
   * @required code string 邮箱验证码或手机验证码
   * @required amount number 提币数量
   * @required type string 提币类型，USDT|XC
   **/
  static withdraw(options = {}) {
    return http.post('/user/cash', options)
  }

  /**
   * 提币申请记录
   *
   * @required type string 提币类型，USDT|XC
   **/
  static withdrawRecords(options = {}) {
    return http.post('/user/cashlist', options)
  }

  /**
   * 我的钱包地址
   *
   * @required type string 提币类型，USDT|XC
   **/
  static getWalletAddress(options = {}) {
    return http.post('/newpay/mywallet', options)
  }
}

export default WalletApi
