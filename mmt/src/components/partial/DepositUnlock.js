import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {withRouter} from "react-router"
import {Link} from 'react-router-dom'
import {Button, Toast} from 'antd-mobile'
import Header from '../common/Header'
import {formatCoinPrice, formatSpecialOffer} from "../../utils/format";
import openPwdImg from '../../assets/images/open-pwd.png'
import closePwdImg from '../../assets/images/close-pwd.png'
import {USDT_POINT_LENGTH} from "../../utils/constants"
import './DepositUnlock.scss'

@inject('productStore')
@inject('userStore')
@observer
class DepositUnlock extends Component {
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

  onDeposit = amount => {
    this.setState({showConfirm: true})
    // const reg = /^[0-9]*[1-9][0-9]*$/
    // if (!reg.test(amount)) {
    //   Toast.info('认购数量需为正整数')
    //   return
    // }
    // if (amount) this.setState({showConfirm: true})
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
        productStore.createSpecialOrder(payToken).then(res => {
          if (res.status !== 1) {
            Toast.info(res.msg)
            return
          }
          history.push({pathname: '/deposit/result', state: 'unLock'})
        })
      })
  }

  render() {
    const {showConfirm, payPassword, pwdType} = this.state
    const {show, productStore} = this.props
    const {
      productDetail,
      unLockAmount,
      // totalAmount,
    } = productStore
    const {
      productName,
      serviceCharge,
      specialOffer,
      userSpecial,
      userBalance,
    } = productDetail

    return (
      <div className={`deposit-unlock ${show ? 'show' : ''}`}>
        <section className="content-detail">
          <h1>{userSpecial}</h1>
          <span>可解锁{productName}特价额度</span>
          <br/>
          <Link to="/home/bargain">查看详情</Link>
        </section>
        <section className="content-charge">
          <p>
            {productName || '--'}/USDT特价:
            {formatSpecialOffer(specialOffer)}
          </p>
          <label>
            {/*<input*/}
            {/*type="text"*/}
            {/*placeholder="输入解锁数量"*/}
            {/*value={unLockAmount}*/}
            {/*onChange={e => onAmountChange(e)}*/}
            {/*/>*/}
            {/*<span*/}
            {/*className="all"*/}
            {/*onClick={() => productStore.addAllUnLockAmount()}>*/}
            {/*全部*/}
            {/*</span>*/}
            <input
              type="text"
              placeholder="输入解锁数量"
              value={userSpecial}
              readOnly
              onChange={e => productStore.onAmountChange(e.target.value)}
            />
          </label>
          <label>
            <small>
              USDT 余额：
              {formatCoinPrice(userBalance, USDT_POINT_LENGTH)}
            </small>
            <small>手续费费率：{serviceCharge * 100}%</small>
          </label>
          <h3>
            <span>交易额（USDT）</span>
            <span>
              {formatCoinPrice(specialOffer * userSpecial, USDT_POINT_LENGTH)}
            </span>
          </h3>
        </section>
        <Button
          className="primary-button"
          activeClassName="active"
          disabled={!userSpecial}
          onClick={() => this.onDeposit(unLockAmount)}
        >
          认购
        </Button>

        {/*解锁弹窗*/}
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
                <span>支付总额（USDT）</span>
                <span>{formatCoinPrice(specialOffer * userSpecial, USDT_POINT_LENGTH)}</span>
              </p>
              <p className="service-charge">
                <span>手续费{serviceCharge * 100}%</span>
                <span>
                  {formatCoinPrice(specialOffer * userSpecial * serviceCharge)}
                </span>
              </p>
              <p>
                <span>可用</span>
                <span>{formatCoinPrice(userBalance, USDT_POINT_LENGTH)}</span>
              </p>
              <p className="service-charge">
                *扣款时依照最新的兑价为准
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
              activeClassName="btn-common__active"
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

export default withRouter(DepositUnlock)
