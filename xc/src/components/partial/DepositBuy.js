import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {withRouter} from "react-router"
import {inject, observer} from 'mobx-react'
import {Button, Toast} from 'antd-mobile'
import Header from '../common/Header'
import openPwdImg from '../../assets/images/open-pwd.png'
import closePwdImg from '../../assets/images/close-pwd.png'
import {formatCoinPrice} from "../../utils/format"
import {COIN_POINT_LENGTH} from "../../utils/constants"
import {DEPOSIT} from '../../assets/static'
import './DepositBuy.scss'

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
    const {value} = e.target
    this.setState({[key]: value})
  }

  onSetType = currentType => {
    this.setState({pwdType: currentType === 'text' ? 'password' : 'text'})
  }

  onDeposit = gearNum => {
    const {personStore, userStore} = this.props
    if (!personStore.isAuth) {
      Toast.info('请进行身份认证')
      return
    }
    if (!userStore.hasPayPassword) {
      Toast.info('请设置交易密码')
      return
    }
    if (gearNum) this.setState({showConfirm: true})
  }

  onSubmit = () => {
    const {history, userStore, productStore} = this.props
    const {payPassword} = this.state
    userStore
      .getPayToken({payPassword})
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
    const {show, productStore, userStore, personStore} = this.props
    const {showConfirm, payPassword, pwdType} = this.state
    const {productDetail, gears, gearNum} = productStore
    const hasGears = gears && gears.length > 0
    console.log(DEPOSIT)

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
          {gearNum && <p>
            <span>参与送{productDetail.productName}特价额度</span>
            <span>{gearNum ? (gearNum / 10).toFixed(0) : 0}</span>
          </p>}
          <small>手续费费率：{(productDetail.serviceCharge || 0) * 100}%</small>
        </div>
        <aside>
          {!personStore.isAuth && (
            <p>
              *您暂未通过实名认证，无法参与计划
              <Link to="/verified-country">去认证</Link>
            </p>
          )}
          {!userStore.hasPayPassword && (
            <p>
              *您暂未设置交易密码，无法参与
              <Link to="/password/pay">去设置</Link>
            </p>
          )}
        </aside>
        <Button
          className={`btn ${!gearNum ? 'btn-disabled' : ''}`}
          activeClassName="btn-common__active"
          onClick={() => this.onDeposit(gearNum)}>
          参与计划
        </Button>

        {/*参与计划弹窗*/}
        <div className={`confirm-wrapper ${showConfirm ? 'show' : ''}`}>
          <div className="content-box">
            <Header
              isShadow
              title="确认支付"
              icon={require('../../assets/images/close.png')}
              onHandle={() => this.setState({showConfirm: false})}
            />
            <div className="content">
              <p className="deposit-price">
                <span>{DEPOSIT.COIN_NAME}</span>
                <span>{gearNum}</span>
              </p>
              <p className="service-charge">
                <span>手续费{productDetail.serviceCharge * 100}%</span>
                <span>
                  {formatCoinPrice(gearNum * productDetail.serviceCharge)}
                </span>
              </p>
              <p>
                <span>可用</span>
                <span>{formatCoinPrice(productDetail.userWarehouse, COIN_POINT_LENGTH)}</span>
              </p>
              <div className="input-box">
                <input
                  type={pwdType}
                  placeholder="支付密码"
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
              确认
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(DepositBuy)
