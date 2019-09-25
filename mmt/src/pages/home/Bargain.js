import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import arrowLeft from '../../assets/images/arrow-left.png'
import { BARGAIN, HOME } from '../../assets/static'
import './Bargain.scss'
import { formatSpecialOffer } from '../../utils/format'

@inject('localeStore')
@inject('personStore')
@inject('productStore')
@observer
class Bargain extends Component {
  componentDidMount() {
    const { personStore, productStore } = this.props
    personStore.getSpecial()
    personStore.getLastClearTime()

    productStore.getProductId().then(productId => {
      personStore.getSpecialAwards({ productId })
    })
  }

  render() {
    const { history, personStore, localeStore } = this.props
    const { HOME } = localeStore.language || {}
    const { allUsableSpecial, lastClearTime, specialAwards } = personStore

    return (
      <div id="bargain">
        <header>
          <img
            src={arrowLeft}
            alt="返回"
            onClick={() => history.push('/home')}
          />
          <span>{HOME.PROMOTION_REWARDS_DETAILS}</span>
          <aside onClick={() => history.push('/home/bargain/record')}>
            {HOME.LOOK_DETAIL}
          </aside>
        </header>
        <section className="section-banner">
          <div className="banner">
            <div className="info">
              <span>
                {BARGAIN.BANNER_LABEL}
                {formatSpecialOffer(allUsableSpecial)}
              </span>
              <br />
              <small>
                {HOME.LAST_SET_DATE}：{lastClearTime}
              </small>
            </div>
            <button
              onClick={() => history.push({ pathname: '/deposit', state: 1 })}
            >
              认购
            </button>
          </div>
          {/*<p>* 解锁后的特价XC将直接充值到您的账户</p>*/}
        </section>
        <section className="section-main">
          <h2>上次结算奖励额度</h2>
          <ul>
            {specialAwards.map(award => (
              <li key={award.remark}>
                <label>{award.remark}</label>
                <span>{formatSpecialOffer(award.amount)}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="section-aside">
          当前得到的奖励额度，有效期为俩个交易日，若俩个交易日结算前未使用，则奖励额度失效，请尽快认购。
        </section>
      </div>
    )
  }
}

export default Bargain
