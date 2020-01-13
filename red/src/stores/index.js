import UserStore from './user'
import PersonStore from './person'
import WalletStore from './wallet'
import CertificationStore from './certification'
import NoticeStore from './notice'
import ProductStore from './product'
import LocaleStore from './locale'

class Stores {
  constructor() {
    this.userStore = new UserStore()
    this.personStore = new PersonStore()
    this.walletStore = new WalletStore()
    this.CertificationStore = new CertificationStore()
    this.noticeStore = new NoticeStore()
    this.productStore = new ProductStore()
    this.localeStore = new LocaleStore()
  }
}

export default new Stores()
