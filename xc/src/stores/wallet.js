import {observable, action} from 'mobx'
import {WalletApi} from "../api";

class WalletStore {
  @observable wallets = []
  @observable currentWallet = {}
  @observable usdtStream = []
  @observable coinStream = []
  @observable withdrawInfo = {type: ''}

  @action
  getWallets() {
    return WalletApi.getWallets().then(res => {
      if (res.status === 1) this.wallets = res.data
    })
  }

  @action
  getCurrentWallet(productId) {
    // if (this.wallets.length > 0) {
    //   this.currentWallet = this.wallets.find(wallet => wallet.productId === productId) || {}
    //   return Promise.resolve(this.currentWallet)
    // }
    return this.getWallets().then(() => {
      this.currentWallet = this.wallets.find(wallet => wallet.productId === productId) || {}
      return this.currentWallet
    })
  }

  // 等待删除
  @action
  getUsdtStream(options) {
    return WalletApi.getUsdtStream(options).then(res => {
      if (res.status === 1)
        this.usdtStream = res.data.sort((a, b) => b.addTime - a.addTime)
    })
  }

  // 等待删除
  @action
  getCoinStream(options) {
    return WalletApi.getCoinStream(options).then(res => {
      if (res.status === 1)
        this.coinStream = res.data.sort((a, b) => b.addTime - a.addTime)
    })
  }

  @action
  withdrawInit(options) {
    return WalletApi.withdrawInit(options).then(res => {
      if (res.status === 1) this.withdrawInfo = res.data
      return res
    })
  }

  @action
  withdraw(options) {
    return WalletApi.withdraw(options)
  }

  @action
  withdrawRecords(options) {
    return WalletApi.withdrawRecords(options)
  }

  @action
  getWalletAddress(options) {
    return WalletApi.getWalletAddress(options)
  }
}

export default WalletStore
