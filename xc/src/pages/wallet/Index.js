import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Toast} from "antd-mobile"
import SimpleHeader from '../../components/common/SimpleHeader'
import Slider from '../../components/common/Slider'
import {formatCoinPrice, formatWalletPrice, formatTime} from '../../utils/format'
import {COMMON, WALLET} from '../../assets/static'
import GroupLabel from "../../components/common/GroupLabel"
import WalletApi from "../../api/wallet"
import NoData from "../../components/common/NoData"
import './Index.scss'

const USDT_CARD = {
  bgImg: WALLET.WALLET_USDT_IMG,
  name: 'USDT',
  asset: '',
  rechargeUrl: '/wallet/recharge/USDT',
  withdrawUrl: '/wallet/withdraw/USDT',
}

const WALLET_CARD = {
  bgImg: WALLET.WALLET_XC_IMG,
  name: COMMON.COIN_NAME,
  asset: '',
  rechargeUrl: '/wallet/recharge/',
  withdrawUrl: '/wallet/withdraw/',
}

@inject('userStore')
@inject('personStore')
@inject('walletStore')
@observer
class Index extends Component {
  state = {
    cards: [],
    currentCardIndex: 0,
    records: []
  }

  componentDidMount() {
    this.getProductCards().then()
  }

  getProductCards = async () => {
    const {personStore, walletStore} = this.props
    const {currentCardIndex} = this.state
    await personStore.getUserInfo()
    await walletStore.getWallets()
    const {userInfo} = personStore
    const {wallets} = walletStore
    const cards = []

    cards.push({
      ...USDT_CARD,
      asset: userInfo.balance,
    })

    const walletCards = wallets.map(wallet => ({
      ...WALLET_CARD,
      name: wallet.productName,
      rechargeUrl: '/wallet/recharge/' + wallet.productName,
      withdrawUrl: '/wallet/withdraw/' + wallet.productName,
      asset: wallet.data.amount,
      locked: wallet.data.locked,
      productId: wallet.productId,
    }))
    cards.push(...walletCards)
    this.setState({cards}, () => {
      currentCardIndex === 0 ?
        this.getUsdtStream() :
        this.getCoinStream(cards[currentCardIndex].productId)
    })
  }

  getUsdtStream = () => {
    WalletApi.getUsdtStream().then(res => {
      if (res.status === 1) {
        const records = res.data.sort((a, b) => b.addTime - a.addTime)
        this.setState({records})
        return
      }
      Toast.info(res.msg)
    })
  }

  getCoinStream = id => {
    WalletApi.getCoinStream({productId: id, status: 1}).then(res => {
      if (res.status === 1) {
        const records = res.data.sort((a, b) => b.addTime - a.addTime)
        this.setState({records})
        return
      }
      Toast.info(res.msg)
    })
  }

  onCheckWallet = index => {
    const {cards} = this.state
    this.setState({currentCardIndex: index}, () => {
      index === 0 ?
        this.getUsdtStream() :
        this.getCoinStream(cards[index].productId)
    })
  }

  render() {
    const {history} = this.props
    const {cards, currentCardIndex, records} = this.state
    const currentCard =
      cards.find((_, index) => currentCardIndex === index) || {}

    return (
      <div id="wallet-home">
        <SimpleHeader title="钱包" isFixed/>
        <section className="banner">
          <Slider cards={cards} onCheck={index => this.onCheckWallet(index)}/>
          <div className="account">
            <span>账户总资产</span>
            <span>
              {formatWalletPrice(currentCard.asset)}
              &nbsp;
              <small>{currentCard.name}</small>
            </span>
          </div>

          <ul className="btn-handle">
            <li onClick={() => history.push(currentCard.rechargeUrl)}>
              <img src={WALLET.RECHARGE_ICON} alt="充值"/>
              充值
            </li>
            <li onClick={() => history.push(currentCard.withdrawUrl)}>
              <img src={WALLET.WITHDRAW_ICON} alt="提现"/>
              提现
            </li>
          </ul>
        </section>

        <section className="record-list">
          <GroupLabel title="记录"/>
          <ul className="records">
            {
              records.map(record =>
                <li key={record.id}>
                  <label>
                    {record.remark}
                    <time>{formatTime(record.addTime)}</time>
                  </label>
                  <span className={`count ${record.amount > 0 ? 'add' : 'minus'}`}>
                  {formatCoinPrice(record.amount)}
                </span>
                </li>
              )}
            {records.length <= 0 && <NoData msg="暂无数据"/>}
          </ul>
        </section>
      </div>
    )
  }
}

export default Index
