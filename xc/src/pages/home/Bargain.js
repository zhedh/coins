import React, {Component} from 'react'
import {inject, observer} from "mobx-react"
import arrowLeft from '../../assets/images/arrow-left.png'
import './Bargain.scss'
import {formatSpecialOffer} from "../../utils/format";

@inject('personStore')
@inject('productStore')
@inject('localeStore')
@observer
class Bargain extends Component {
  componentDidMount() {
    const {personStore, productStore} = this.props;
    personStore.getSpecial();
    personStore.getLastClearTime();

    productStore.getProductId().then(productId => {
      personStore.getSpecialAwards({productId})
    })
  }

  render() {
    const {history, personStore} = this.props;
    const {localeStore: {locale: {BARGAIN}}} = this.props;
    const {allUsableSpecial, lastClearTime, specialAwards} = personStore

    return (
      <div id="bargain">
        <header>
          <img
            src={arrowLeft}
            alt="返回"
            onClick={() => history.goBack()}
          />
          <span>{BARGAIN.PROMOTION_REWARDS_DETAILS}</span>
          <aside onClick={() => history.push('/home/bargain/record')}>
            {BARGAIN.LOOK_DETAIL}
          </aside>
        </header>
        <section className="section-banner">
          <div className="banner">
            <div className="info">
              <span>{BARGAIN.XC_PROMOTION}：{formatSpecialOffer(allUsableSpecial)}</span>
              <br/>
              <small>{BARGAIN.LAST_SETTLEMENT_TIME}：{lastClearTime}</small>
            </div>
            <button onClick={() => history.push({pathname: '/deposit', state: 1})}>
              {BARGAIN.SUBSCRIB}
            </button>
          </div>
        </section>
        <section className="section-main">
          <h2>{BARGAIN.LAST_REWARDING}</h2>
          <ul>
            {specialAwards.map(award =>
              <li key={award.remark}>
                <label>{award.remark}</label>
                <span>{formatSpecialOffer(award.amount)}</span>
              </li>)
            }
          </ul>
        </section>
        <section className="section-aside">
          {BARGAIN.REWARDING_NOTICE}
        </section>
      </div>
    )
  }
}

export default Bargain
