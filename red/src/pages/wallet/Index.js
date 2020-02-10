import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Toast} from 'antd-mobile'
import SimpleHeader from '../../components/common/SimpleHeader'
import Slider from '../../components/common/Slider'
import {
  formatCoinPrice,
  formatWalletPrice,
  formatTime
} from '../../utils/format'
import {ASSET_COMMON, WALLET} from '../../assets/static'
import GroupLabel from '../../components/common/GroupLabel'
import WalletApi from '../../api/wallet'
import InfiniteScroll from 'react-infinite-scroll-component'
import './Index.scss'

const USDT_CARD = {
  bgImg: WALLET.WALLET_USDT_IMG,
  name: 'USDT',
  asset: '',
  rechargeUrl: '/wallet/recharge/USDT',
  withdrawUrl: '/wallet/withdraw/USDT'
};

const WALLET_CARD = {
  bgImg: WALLET.WALLET_XC_IMG,
  name: ASSET_COMMON.COIN_NAME,
  asset: '',
  rechargeUrl: '/wallet/recharge/',
  withdrawUrl: '/wallet/withdraw/'
};

@inject('userStore')
@inject('personStore')
@inject('walletStore')
@inject('localeStore')
@observer
class Index extends Component {
  state = {
    cards: [],
    currentCardIndex: 0,
    hasMore: true,
    page: 1,
    pageSize: 10,
    records: []
  };

  componentDidMount() {
    const {
      userStore,
      history,
      localeStore: {
        locale: {MY_WALLET}
      }
    } = this.props;
    if (!userStore.isOnline()) {
      Toast.info(MY_WALLET.PLEASE_LOGIN_FIRST, 2, () => history.push('/login'))
      return
    }

    this.getProductCards().then()
  }

  getProductCards = async () => {
    const {personStore, walletStore} = this.props;
    await personStore.getUserInfo();
    await walletStore.getWallets();
    const {userInfo} = personStore;
    const {wallets} = walletStore;
    const cards = [];

    cards.push({
      ...USDT_CARD,
      asset: userInfo.balance
    });

    const walletCards = wallets.map(wallet => ({
      ...WALLET_CARD,
      name: wallet.productName,
      rechargeUrl: '/wallet/recharge/' + wallet.productName,
      withdrawUrl: '/wallet/withdraw/' + wallet.productName,
      asset: wallet.data.amount,
      locked: wallet.data.locked,
      sto: wallet.data.sto,
      productId: wallet.productId
    }));
    cards.push(...walletCards);
    this.setState({cards}, () => this.getRecords());
  };

  getUsdtStream = () => {
    const {page, pageSize, records} = this.state;
    WalletApi.getUsdtStream({page, row: pageSize}).then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg);
        return
      }
      const arr = res.data.sort((a, b) => b.addTime - a.addTime);
      const hasMore = arr.length === pageSize;
      records.push(...arr);
      this.setState({records, hasMore, page: hasMore ? page + 1 : 1})
    })
  }

  getCoinStream = id => {
    WalletApi.getCoinStream({productId: id, status: 1}).then(res => {
      if (res.status === 1) {
        const records = res.data.sort((a, b) => b.addTime - a.addTime);
        this.setState({records, hasMore: false});
        return
      }
      Toast.info(res.msg)
    })
  };

  onCheckWallet = index => {
    const {cards} = this.state
    this.setState({currentCardIndex: index, records: [], page: 1}, () => {
      index === 0
        ? this.getUsdtStream()
        : this.getCoinStream(cards[index].productId)
    })
  };

  getRecords = () => {
    const {currentCardIndex, cards} = this.state;
    currentCardIndex === 0
      ? this.getUsdtStream()
      : this.getCoinStream(cards[currentCardIndex].productId)
  };

  render() {
    const {
      history,
      localeStore: {
        locale: {MY_WALLET}
      }
    } = this.props
    const {cards, currentCardIndex, hasMore, records} = this.state;
    const currentCard =
      cards.find((_, index) => currentCardIndex === index) || {}

    return (
      <div id="wallet-home">
        <SimpleHeader title={MY_WALLET.WALLET} isFixed/>
        <section className="banner">
          <Slider cards={cards} onCheck={index => this.onCheckWallet(index)}/>
          <div className="account">
            <label>{MY_WALLET.TOTAL_ASSETS}</label>
            <p>
              {formatWalletPrice(currentCard.asset)}
              &nbsp;
              <small>{currentCard.name}</small>
            </p>
            {currentCard.name === 'RED' && (
              <aside>
                <b>
                  {MY_WALLET.FREEZING}：{currentCard.locked || 0}
                </b>
                <b onClick={() => history.push(`/wallet/sto-flow/${currentCard.name}`)}>
                  {MY_WALLET.STO_ACCOUNT}：{currentCard.sto} >>
                </b>
              </aside>
            )}
          </div>

          <ul className="btn-handle">
            <li onClick={() => history.push(currentCard.rechargeUrl)}>
              <img src={WALLET.RECHARGE_ICON} alt={MY_WALLET.RECHARGE}/>
              {MY_WALLET.RECHARGE}
            </li>
            <li onClick={() => history.push(currentCard.withdrawUrl)}>
              <img src={WALLET.WITHDRAW_ICON} alt={MY_WALLET.WITHDRAW}/>
              {MY_WALLET.WITHDRAW}
            </li>
          </ul>
        </section>

        <section className="record-list">
          <GroupLabel title={MY_WALLET.RECORD}/>

          <InfiniteScroll
            dataLength={records.length}
            next={this.getRecords}
            hasMore={hasMore}
            loader={<p className="loading">{MY_WALLET.LOADING}</p>}
            endMessage={
              <p style={{textAlign: 'center', color: '#ccc'}}>
                {records.length <= 0
                  ? MY_WALLET.NO_RECORD
                  : MY_WALLET.TO_LOWER_THE}
              </p>
            }
          >
            <ul className="records">
              {records.map((record, key) => (
                <li key={key}>
                  <label>
                    {record.remark}
                    <time>{formatTime(record.addTime)}</time>
                  </label>
                  <span
                    className={`count ${record.amount > 0 ? 'add' : 'minus'}`}
                  >
                    {formatCoinPrice(record.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </InfiniteScroll>
        </section>
      </div>
    )
  }
}

export default Index
