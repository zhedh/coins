import UserStore from './user'
import PersonStore from "./person";
import WalletStore from "./wallet";
import AuthStore from "./auth";
import NoticeStore from "./notice";
import ProductStore from "./product";

class Stores {
  constructor() {
    this.userStore = new UserStore()
    this.personStore = new PersonStore()
    this.walletStore = new WalletStore()
    this.authStore = new AuthStore()
    this.noticeStore = new NoticeStore()
    this.productStore = new ProductStore()
  }
}

export default new Stores()
