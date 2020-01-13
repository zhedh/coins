import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'
import {Button, Toast} from 'antd-mobile'
import {formatCoinPrice, formatSpecialOffer} from '../../utils/format'
import {COIN_POINT_LENGTH} from '../../utils/constants'
import {ASSET_COMMON} from "../../assets/static"
import './DepositUnlock.scss'

@inject('productStore')
@inject('userStore')
@inject('localeStore')
@observer
class DepositUnlock extends Component {
  state = {
    showConfirm: false,
    payPassword: '',
    pwdType: 'password',
    isSubmit: false // 禁止多次提交
  };

  onInputChange = (e, key) => {
    const {value} = e.target;
    this.setState({[key]: value})
  };

  onSetType = currentType => {
    this.setState({pwdType: currentType === 'text' ? 'password' : 'text'})
  };

  onDeposit = () => {
    this.setState({showConfirm: true})
  };

  onSubmit = () => {
    const {localeStore: {locale: {DEPOSIT}}} = this.props;
    const {userStore, productStore} = this.props;
    const {payPassword} = this.state;
    this.setState({isSubmit: true});
    userStore
      .getPayToken({payPassword})
      .then(res => {
        if (res.status !== 1) {
          Toast.info(res.msg);
          return
        }
        return res.data.token
      })
      .then(payToken => {
        if (!payToken) {
          this.setState({isSubmit: false});
          return
        }
        productStore.createSpecialOrder(payToken).then(res => {
          this.setState({isSubmit: false});
          if (res.status !== 1) {
            Toast.info(res.msg);
            return
          }
          Toast.success(DEPOSIT.CONGRATULATION_SUBSCRIBE_SUCCESS, 2, () => window.location.reload());
          this.setState({showConfirm: false})
        })
      })
      .catch(err => {
        console.log(err);
        this.setState({isSubmit: false, showConfirm: false})
      })
  }

  render() {
    const {show, productStore} = this.props;
    const {localeStore: {locale: {DEPOSIT}}} = this.props;
    const {showConfirm, payPassword, pwdType, isSubmit} = this.state;
    const {productDetail,} = productStore;
    const {
      productName,
      serviceCharge,
      specialOffer,
      userSpecial,
      userWarehouse,
    } = productDetail;

    return (
      <div className={`deposit-unlock ${show ? 'show' : ''}`}>
        <section className="content-detail">
          <p>
            {DEPOSIT.AVAILABLE_SUBSCRIB_PROMOTION}&nbsp;
            <Link to="/home/bargain/record">{DEPOSIT.LOOK_DETAIL}</Link>
          </p>

          <h1>{userSpecial}</h1>
        </section>
        <section className="content-charge">
          <p>
            <span>{DEPOSIT.GIVE_PROMOTION}</span>
            <b>{userSpecial}</b>
          </p>
          <aside>
            <small>
              {productName}{DEPOSIT.CURRENT_PROMOTION}：{formatSpecialOffer(specialOffer)}
            </small>
            <small>
              {DEPOSIT.FEES}：
              {serviceCharge * 100}%
            </small>
            <small>
              {productName} {DEPOSIT.BALANCE}：
              {formatCoinPrice(userWarehouse, COIN_POINT_LENGTH)}
            </small>
          </aside>
          <h3>
            <span>{DEPOSIT.TRADING_AMOUNT}（RED）</span>
            <span>
              {formatCoinPrice(specialOffer * userSpecial, COIN_POINT_LENGTH)}
            </span>
          </h3>
        </section>
        <Button
          className="primary-button"
          activeClassName="active"
          disabled={!userSpecial}
          onClick={this.onDeposit}
        >
          {DEPOSIT.SUBSCRIBE}
        </Button>

        {/*解锁弹窗*/}
        <div className={`confirm-wrapper ${showConfirm ? 'show' : ''}`}>
          <div className="content-box">
            <h2>
              {DEPOSIT.CONFIRM_PAY}
              <img
                src={ASSET_COMMON.CLOSE_ICON}
                alt=""
                onClick={() => this.setState({showConfirm: false})}
              />
            </h2>
            <div className="content">
              <ul className="groups">
                <li className="group">
                  <p className="title">
                    <span>{DEPOSIT.TOTAL_PAYMENT}（{productName}）</span>
                    <span>{formatCoinPrice(specialOffer * userSpecial, COIN_POINT_LENGTH)}</span>
                  </p>
                  <p>
                    <span>{DEPOSIT.FEE}{serviceCharge * 100}%</span>
                    <span>{formatCoinPrice(specialOffer * userSpecial * serviceCharge)}</span>
                  </p>
                </li>
                <li className="group">
                  <p className="title">
                    <span>{DEPOSIT.AVAILABLE}</span>
                    <span>{formatCoinPrice(userWarehouse, COIN_POINT_LENGTH)}</span>
                  </p>
                  <p>*{DEPOSIT.AMOUNT_TO_DEDUCT}</p>
                </li>
              </ul>

              <div className="input-box">
                <input
                  type={pwdType}
                  placeholder={DEPOSIT.PAY_PWD}
                  value={payPassword}
                  onChange={e => this.onInputChange(e, 'payPassword')}
                />
                <img
                  src={pwdType === 'text' ? ASSET_COMMON.OPEN_PWD_ICON : ASSET_COMMON.CLOSE_PWD_ICON}
                  alt="eyes"
                  onClick={() => this.onSetType(pwdType)}
                />
              </div>
            </div>
            <Button
              activeClassName="btn-common__active"
              className="primary-button"
              disabled={isSubmit}
              onClick={this.onSubmit}
            >
              {DEPOSIT.CONFIRM}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(DepositUnlock)
