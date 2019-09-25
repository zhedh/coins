import React, {Component} from 'react'
import {inject, observer} from "mobx-react"
import Header from "../../components/common/Header"
import walletZbsImg from "../../assets/images/wallet-zbs.png"
import WalletCard from "../../components/partial/WalletCard"
import {formatCoinPrice, formatTime} from "../../utils/format"
import {COMMON} from '../../assets/static'
import './WalletCoin.scss'

const COIN_CARD = {
  bgImg: walletZbsImg,
  name: COMMON.COIN_NAME,
  asset: '',
  rechargeUrl: '/wallet/recharge/',
  withdrawUrl: '/wallet/withdraw/',
  productId: ''
}

@inject('walletStore')
@observer
class WalletCoin extends Component {
  state = {
    coinCard: COIN_CARD
  }

  componentDidMount() {
    const {walletStore, match} = this.props
    const {id} = match.params
    walletStore.getCurrentWallet(Number(id)).then(res => {
      const coinCard = {
        ...COIN_CARD,
        name: res.productName,
        productId: res.productId,
        asset: res.data && res.data.amount,
        locked: res.data && res.data.locked,
        rechargeUrl: '/wallet/recharge/' + res.productName,
        withdrawUrl: '/wallet/withdraw/' + res.productName,
      }
      this.setState({coinCard})
    })
    walletStore.getCoinStream({productId: id, status: 1})
  }

  render() {
    const {walletStore} = this.props
    const {coinCard} = this.state
    const {coinStream} = walletStore

    return (
      <div id="wallet-zbx">
        <Header title={coinCard.name} isFixed isShadow/>
        <div className="card">
          <WalletCard card={coinCard}/>
        </div>
        <ul className="records">
          {coinStream.map((record, key) =>
            <li key={key}>
              <main>
                {record.remark}
                <small>{formatTime(record.addTime)}</small>
              </main>
              <aside>
                {formatCoinPrice(record.amount)}
                {record.toMmt && <small>折合 {formatCoinPrice(record.toMmt)} MMT</small>}
              </aside>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default WalletCoin
