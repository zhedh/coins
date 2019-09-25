import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import rechargeImg from '../../assets/images/recharge.svg'
import withdrawImg from '../../assets/images/withdraw.svg'
import arrowRightImg from '../../assets/images/arrow-right-white.png'
import {formatCoinPrice, formatWalletPrice} from "../../utils/format"
import {COIN_POINT_LENGTH, USDT_POINT_LENGTH} from "../../utils/constants";
import './WalletCard.scss'
import {inject, observer} from "mobx-react";

@inject('localeStore')
@observer
class WalletCard extends Component {
  toPage = (link, e) => {
    e && e.stopPropagation()
    if (link) {
      const {history} = this.props
      history.push(link)
    }
  }

  render() {
    const {card,localeStore} = this.props
    const {WALLET} = localeStore.language || {}
    const pointLength = card.name === 'USDT' ? USDT_POINT_LENGTH : COIN_POINT_LENGTH

    return (
      <div
        className="wallet-card"
        style={{backgroundImage: `url(${card.bgImg})`}}
        onClick={() => this.toPage(card.link)}
      >
        <h1>
          <small>{WALLET.TOTAL_ASSETS}（{card.name}）</small>
          <span>{formatWalletPrice(card.asset, pointLength)}</span>
          {!!card.locked && <aside>
            {WALLET.FREEZE}：{formatCoinPrice(card.locked, pointLength)}
          </aside>}
        </h1>
        <ul>
          {card.withdrawUrl && (
            <li
              onClick={(e) => this.toPage(card.withdrawUrl, e)}>
              <img src={withdrawImg} alt=""/>
              {WALLET.WITHDRAW}
            </li>
          )}
          {card.rechargeUrl && (
            <li
              onClick={(e) => this.toPage(card.rechargeUrl, e)}>
              <img src={rechargeImg} alt=""/>
              {WALLET.DEPOSIT}
            </li>
          )}
        </ul>
        {card.link && (
          <img className="arrow-right" src={arrowRightImg} alt=""/>
        )}
      </div>
    )
  }
}

export default withRouter(WalletCard)
