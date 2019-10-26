import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import SimpleHeader from '../../components/common/SimpleHeader'
import Slider from '../../components/common/Slider'
import rechargeImg from '../../assets/images/new/recharge.svg'
import withdrawImg from '../../assets/images/new/withdraw.svg'
import { formatCoinPrice, formatTime } from '../../utils/format'
import walletUsdt from '../../assets/images/new/wallet-usdt.png'
import walletXc from '../../assets/images/new/wallet-xc.png'

import WalletCard from '../../components/partial/WalletCard'
import walletToLoginImg from '../../assets/images/wallet-to-login.png'
import walletZbsImg from '../../assets/images/wallet-zbs.png'
import walletUsdtImg from '../../assets/images/wallet-usdt.png'
import { COMMON } from '../../assets/static'
import './Home.scss'

const USDT_CARD = {
  bgImg: walletUsdtImg,
  name: 'USDT',
  asset: '',
  rechargeUrl: '/wallet/recharge/USDT',
  withdrawUrl: '/wallet/withdraw/USDT',
  link: '/wallet/usdt'
}

const WALLET_CARD = {
  bgImg: walletZbsImg,
  name: COMMON.COIN_NAME,
  asset: '',
  locked: '',
  rechargeUrl: '/wallet/recharge/',
  withdrawUrl: '/wallet/withdraw/',
  link: '/wallet/coin/',
  productId: ''
}

@inject('userStore')
@inject('personStore')
@inject('walletStore')
@observer
class Index extends Component {
  state = {
    cards: [],
    currentCardIndex: 0
  }

  componentDidMount() {
    this.getProductCards()
  }

  getProductCards = async () => {
    const { personStore, walletStore } = this.props
    const { currentCardIndex } = this.state
    await personStore.getUserInfo()
    await walletStore.getWallets()
    const { userInfo } = personStore
    const { wallets } = walletStore
    const cards = []
    const cardList = [
      {
        name: 'USDT',
        value: walletUsdt
      },
      {
        name: 'XC',
        value: walletXc
      }
    ]

    cards.push({
      ...USDT_CARD,
      asset: userInfo.balance,
      cardImg: cardList.find(item => USDT_CARD.name === item.name).value
    })

    const walletCards = wallets.map(wallet => {
      return {
        ...WALLET_CARD,
        name: wallet.productName,
        rechargeUrl: '/wallet/recharge/' + wallet.productName,
        withdrawUrl: '/wallet/withdraw/' + wallet.productName,
        asset: wallet.data.amount,
        locked: wallet.data.locked,
        productId: wallet.productId,
        cardImg: cardList.find(item => wallet.productName === item.name).value
      }
    })
    cards.push(...walletCards)
    this.setState({ cards }, () => {
      if (currentCardIndex === 0) {
        this.getUsdtStream()
      } else {
        this.getCoinStream(walletCards[0].productId)
      }
    })
  }

  getUsdtStream = () => {
    const { walletStore } = this.props
    walletStore.getUsdtStream()
  }

  getCoinStream = id => {
    const { walletStore } = this.props
    walletStore.getCoinStream({ productId: id, status: 1 })
  }

  onCheckWallet = index => {
    this.setState({ currentCardIndex: index }, () => {
      this.getProductCards()
    })
  }

  render() {
    const { history, userStore, walletStore } = this.props
    const { coinStream = [] } = walletStore
    const { cards, currentCardIndex } = this.state
    const currentCard =
      cards.find((_, index) => currentCardIndex === index) || {}
    return (
      <div id="wallet-home">
        <SimpleHeader title="钱包" isFixed />

        <section className="banner">
          <Slider cards={cards} onCheck={index => this.onCheckWallet(index)} />
          <div className="account">
            <span>账户总资产</span>
            <span>
              {currentCard.asset} <small>{currentCard.name}</small>
            </span>
          </div>

          <ul className="btn-handle">
            <li onClick={() => history.push(currentCard.rechargeUrl)}>
              <img src={rechargeImg} alt="充值" />
              充值
            </li>
            <li onClick={() => history.push(currentCard.withdrawUrl)}>
              <img src={withdrawImg} alt="提现" />
              提现
            </li>
          </ul>
        </section>

        <section className="record-list">
          <h2>记录</h2>
          <ul className="records" key={coinStream}>
            {coinStream.map((record, key) => (
              <li key={key}>
                <main>
                  {record.remark}
                  <small>{formatTime(record.addTime)}</small>
                </main>
                <aside>{formatCoinPrice(record.amount)}</aside>
              </li>
            ))}
          </ul>
        </section>
      </div>
    )
  }
}

export default Index
