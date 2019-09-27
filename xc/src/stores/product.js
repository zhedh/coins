import {observable, action, computed} from 'mobx'
import {ProductApi} from '../api'
import {Toast} from 'antd-mobile'
import Cookies from 'js-cookie'

class ProductStore {
  @observable productId
  @observable products = []
  @observable productDetail = {}
  @observable gearNum = null
  @observable unLockAmount = ''

  @computed
  get gears() {
    return this.productDetail.amountList || []
  }

  @computed
  get currentProduct() {
    if (!this.products.length) return {}
    return this.products.find(product => product.id === Number(this.productId)) || this.products[0]
  }

  @computed
  get totalAmount() {
    return this.unLockAmount * this.productDetail.specialOffer
  }

  @action
  setCookieProductId(id) {
    Cookies.set('PRODUCT_ID', id)
    this.productId = id
  }

  @action
  getCookieProductId() {
    this.productId = Cookies.get('PRODUCT_ID')
  }

  @action
  getProductId() {
    this.productId = Cookies.get('PRODUCT_ID')
    if (this.productId) {
      return Promise.resolve(this.productId)
    }
    return this.getProducts()
  }

  @action
  getProducts() {
    return ProductApi.getProductList().then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg)
        return null
      }
      this.products = res.data

      // 初始化默认基金产品ID
      this.getCookieProductId()
      if (!this.productId) {
        this.setCookieProductId(res.data[0] && res.data[0].id)
      }
      return this.productId
    })
  }

  @action
  getProductDetail(productId) {
    return ProductApi.getProductDetail({productId}).then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg)
        return
      }
      this.productDetail = res.data
    }).catch(err => {
      Cookies.remove('PRODUCT_ID')
      this.getProducts().then(id => this.getProductDetail(id))
      console.log(err)
    })
  }

  @action
  changeProduct(id, isChangeDetail) {
    this.setCookieProductId(id)
    if (isChangeDetail) this.getProductDetail(id)
  }

  @action
  changeGearNum(num) {
    this.gearNum = num
  }

  @action
  createDepositOrder(payToken) {
    return ProductApi.createOrder({
      payToken,
      productId: this.productDetail.productId,
      productAmount: this.gearNum,
      special: '0'
    })
  }

  @action
  createSpecialOrder(payToken) {
    const {userSpecial} = this.productDetail
    return ProductApi.createOrder({
      payToken,
      productId: this.productDetail.productId,
      productAmount: userSpecial,
      special: '1'
    })
  }

  @action
  onAmountChange(value) {
    this.unLockAmount = value
  }

  @action
  addAllUnLockAmount() {
    this.unLockAmount = this.productDetail.userSpecial
  }
}

export default ProductStore
