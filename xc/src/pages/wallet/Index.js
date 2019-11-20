import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Toast} from "antd-mobile"
import SimpleHeader from '../../components/common/SimpleHeader'
import Slider from '../../components/common/Slider'
import {formatCoinPrice, formatWalletPrice, formatTime} from '../../utils/format'
import {COMMON, WALLET} from '../../assets/static'
import GroupLabel from "../../components/common/GroupLabel"
import WalletApi from "../../api/wallet"
// import NoData from "../../components/common/NoData"
import InfiniteScroll from 'react-infinite-scroll-component'
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
    hasMore: true,
    page: 1,
    pageSize: 10,
    records: []
  }

  componentDidMount() {
    const {userStore, history} = this.props
    if (!userStore.isOnline()) {
      Toast.info('请先登录', 2, () => history.push('/login'))
      return
    }

    this.getProductCards().then()
  }

  getProductCards = async () => {
    const {personStore, walletStore} = this.props
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
    this.setState({cards},()=>this.getRecords())
  }

  getUsdtStream = () => {
    const {page, pageSize, records} = this.state
    WalletApi.getUsdtStream({page, row: pageSize}).then(res => {
      if (res.status === 1) {
        const arr = res.data.sort((a, b) => b.addTime - a.addTime)
        const hasMore = arr.length === pageSize
        records.push(...arr)
        this.setState({records, hasMore, page: hasMore ? page + 1 : 1})
        return
      }
      Toast.info(res.msg)
    })
  }

  getCoinStream = id => {
    WalletApi.getCoinStream({productId: id, status: 1}).then(res => {
      if (res.status === 1) {
        const records = res.data.sort((a, b) => b.addTime - a.addTime)
        this.setState({records, hasMore: false})
        return
      }
      Toast.info(res.msg)
    })
  }

  onCheckWallet = index => {
    const {cards} = this.state
    this.setState({currentCardIndex: index, records: [], page: 1}, () => {
      index === 0 ?
        this.getUsdtStream() :
        this.getCoinStream(cards[index].productId)
    })
  }

  getRecords = () => {
    const {currentCardIndex, cards} = this.state
    // if (cards.length <= 0) return
    currentCardIndex === 0 ?
      this.getUsdtStream() :
      this.getCoinStream(cards[currentCardIndex].productId)
  }

  render() {
    const {history} = this.props
    const {cards, currentCardIndex, hasMore, records} = this.state
    const currentCard =
      cards.find((_, index) => currentCardIndex === index) || {}

    return (
      <div id="wallet-home">
        <SimpleHeader title="钱包" isFixed/>
        <section className="banner">
          <Slider cards={cards} onCheck={index => this.onCheckWallet(index)}/>
          <div className="account">
            <label>账户总资产</label>
            <p>
              {formatWalletPrice(currentCard.asset)}
              &nbsp;
              <small>{currentCard.name}</small>
            </p>
            {currentCard.name !== 'USDT' && <b>
              冻结中：{currentCard.locked || 0}
            </b>}
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


          <InfiniteScroll
            dataLength={records.length} //This is important field to render the next data
            next={this.getRecords}
            hasMore={hasMore}
            loader={<p className="loading">加载中...</p>}
            endMessage={
              <p style={{textAlign: 'center', color: '#ccc'}}>
                {records.length <= 0 ? '暂无数据' : '已经到底了！'}
              </p>
            }
            // below props only if you need pull down functionality
            // refreshFunction={this.refresh}
            // pullDownToRefresh
            // pullDownToRefreshContent={
            //   <h3 style={{textAlign: 'center'}}>&#8595; Pull down to refresh</h3>
            // }
            // releaseToRefreshContent={
            //   <h3 style={{textAlign: 'center'}}>&#8593; Release to refresh</h3>
            // }
          >
            <ul className="records">
              {
                records.map((record, key) =>
                  <li key={key}>
                    <label>
                      {record.remark}
                      <time>{formatTime(record.addTime)}</time>
                    </label>
                    <span className={`count ${record.amount > 0 ? 'add' : 'minus'}`}>
                    {formatCoinPrice(record.amount)}
                  </span>
                  </li>
                )}
            </ul>
          </InfiniteScroll>
          {/*{records.length <= 0 && <NoData msg="暂无数据"/>}*/}
        </section>
      </div>
    )
  }
}

export default Index
