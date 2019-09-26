import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { inject, observer } from 'mobx-react'
import { Button, Toast } from 'antd-mobile'
import Header from '../common/Header'
import openPwdImg from '../../assets/images/open-pwd.png'
import closePwdImg from '../../assets/images/close-pwd.png'
import { formatCoinPrice } from '../../utils/format'
import { COIN_POINT_LENGTH } from '../../utils/constants'
import './DepositBuy.scss'

@inject('localeStore')
@inject('productStore')
@inject('userStore')
@inject('personStore')
@observer
class DepositBuy extends Component {
  state = {
    showConfirm: false,
    payPassword: '',
    pwdType: 'password'
  }

  onInputChange = (e, key) => {
    const { value } = e.target
    this.setState({ [key]: value })
  }

  onSetType = currentType => {
    this.setState({ pwdType: currentType === 'text' ? 'password' : 'text' })
  }

  onDeposit = gearNum => {
    const { personStore, userStore, localeStore } = this.props
    const { TOAST } = localeStore.language || {}

    if (!personStore.isAuth) {
      Toast.info(TOAST.PLEASE_VERIFY_IDENTITY)
      return
    }
    if (!userStore.hasPayPassword) {
      Toast.info(TOAST.PLEASE_SET_TRADE_PWD)
      return
    }
    if (gearNum) this.setState({ showConfirm: true })
  }

  onSubmit = () => {
    const { history, userStore, productStore } = this.props
    const { payPassword } = this.state
    userStore
      .getPayToken({ payPassword })
      .then(res => {
        if (res.status !== 1) {
          Toast.info(res.msg)
          return
        }
        return res.data.token
      })
      .then(payToken => {
        if (!payToken) return
        productStore.createDepositOrder(payToken).then(res => {
          if (res.status !== 1) {
            Toast.info(res.msg)
            return
          }
          history.push('/deposit/result')
        })
      })
  }

  render() {
    const {
      show,
      productStore,
      userStore,
      personStore,
      localeStore
    } = this.props
    const { COMMON, DEPOSIT } = localeStore.language || {}
    const { showConfirm, payPassword, pwdType } = this.state
    const { productDetail, gears, gearNum } = productStore
    const hasGears = gears && gears.length > 0

    return (
      <div className={`deposit-buy ${show ? 'show' : ''}`}>
        <ul className="gears">
          {hasGears &&
            gears.map(gear => (
              <li
                key={gear.num}
                className={gearNum === gear.num ? 'active' : ''}
                onClick={() => productStore.changeGearNum(gear.num)}
              >
                <div className="box">
                  <div className="price">
                    {gear.num}
                    <small>{productDetail.productName}</small>
                  </div>
                </div>
              </li>
            ))}
        </ul>
        <div className="fee">
          {gearNum && (
            <p>
              <span>{DEPOSIT.JOIN_AND_GET}</span>
              <span>{gearNum ? (gearNum / 10).toFixed(0) : 0}</span>
            </p>
          )}
          <small>
            {DEPOSIT.FEES}：{(productDetail.serviceCharge || 0) * 100}%
          </small>
        </div>
        <aside>
          {!personStore.isAuth && (
            <p>
              *{DEPOSIT.AUTH_MSG_ONE}
              <Link to="/verified-country">{DEPOSIT.TO_AUTH}</Link>
            </p>
          )}
          {!userStore.hasPayPassword && (
            <p>
              *{DEPOSIT.AUTH_MSG_TWO}
              <Link to="/password/pay">{DEPOSIT.TO_SET}</Link>
            </p>
          )}
        </aside>
        <Button
          className={`btn ${!gearNum ? 'btn-disabled' : ''}`}
          activeClassName="btn-common__active"
          onClick={() => this.onDeposit(gearNum)}
        >
          {DEPOSIT.JOIN_PLAN}
        </Button>

        {/*参与计划弹窗*/}
        <div className={`confirm-wrapper ${showConfirm ? 'show' : ''}`}>
          <div className="content-box">
            <Header
              isShadow
              title={DEPOSIT.CONFIRM_PAYMENT}
              icon={require('../../assets/images/close.png')}
              onHandle={() => this.setState({ showConfirm: false })}
            />
            <div className="content">
              <p className="deposit-price">
                <span>{DEPOSIT.COIN_NAME}</span>
                <span>{gearNum || '--'}</span>
              </p>
              <p className="service-charge">
                <span>
                  {DEPOSIT.FEES}
                  {productDetail.serviceCharge * 100}%
                </span>
                <span>
                  {formatCoinPrice(gearNum * productDetail.serviceCharge)}
                </span>
              </p>
              <p>
                <span>{DEPOSIT.AVAILABLE}</span>
                <span>
                  {formatCoinPrice(
                    productDetail.userWarehouse,
                    COIN_POINT_LENGTH
                  )}
                </span>
              </p>
              <div className="input-box">
                <input
                  type={pwdType}
                  placeholder={DEPOSIT.PAY_PWD}
                  value={payPassword}
                  onChange={e => this.onInputChange(e, 'payPassword')}
                />
                <img
                  src={pwdType === 'text' ? openPwdImg : closePwdImg}
                  alt="eyes"
                  onClick={() => this.onSetType(pwdType)}
                />
              </div>
            </div>
            <Button
              activeClassName="active"
              className="primary-button"
              onClick={this.onSubmit}
            >
              {COMMON.CONFIRM}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(DepositBuy)
