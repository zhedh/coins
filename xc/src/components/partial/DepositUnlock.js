import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'
import {Button, Toast} from 'antd-mobile'
import {formatCoinPrice, formatSpecialOffer} from '../../utils/format'
import {USDT_POINT_LENGTH} from '../../utils/constants'
import {COMMON} from "../../assets/static"
import './DepositUnlock.scss'

@inject('productStore')
@inject('userStore')
@observer
class DepositUnlock extends Component {
  state = {
    showConfirm: false,
    payPassword: '',
    pwdType: 'password',
    isSubmit: false // 禁止多次提交
  }

  onInputChange = (e, key) => {
    const {value} = e.target
    this.setState({[key]: value})
  }

  onSetType = currentType => {
    this.setState({pwdType: currentType === 'text' ? 'password' : 'text'})
  }

  onDeposit = () => {
    this.setState({showConfirm: true})
  }

  onSubmit = () => {
    const {userStore, productStore} = this.props
    const {payPassword} = this.state
    this.setState({isSubmit: true})
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
        if (!payToken) {
          this.setState({isSubmit: false})
          return
        }
        productStore.createSpecialOrder(payToken).then(res => {
          this.setState({isSubmit: false})
          if (res.status !== 1) {
            Toast.info(res.msg)
            return
          }
          Toast.success('恭喜您，认购成功', 2)
          this.setState({showConfirm: false})
          window.location.reload()
          // history.push({pathname: '/deposit/result', state: 'unLock'})
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({isSubmit: false, showConfirm: false})
      })
  }

  render() {
    const {showConfirm, payPassword, pwdType, isSubmit} = this.state
    const {show, productStore} = this.props
    const {
      productDetail,
    } = productStore
    const {
      productName,
      serviceCharge,
      specialOffer,
      userSpecial,
      userBalance
    } = productDetail

    return (
      <div className={`deposit-unlock ${show ? 'show' : ''}`}>
        <section className="content-detail">
          <p>
            当前可认购特价额度&nbsp;
            <Link to="/home/bargain/record">查看详情</Link>
          </p>

          <h1>{userSpecial}</h1>
        </section>
        <section className="content-charge">
          {/*<p>*/}
          {/*{productName || '--'}/USDT特价:*/}
          {/*{formatSpecialOffer(specialOffer)}*/}
          {/*</p>*/}
          <p>
            <span>赠送特价额度</span>
            <b>{userSpecial}</b>
          </p>
          <aside>
            <small>
              {productName}当前特价：{formatSpecialOffer(specialOffer)} USDT
            </small>
            <small>
              手续费费率：
              {serviceCharge * 100}%
            </small>
            <small>
              USDT 余额：
              {formatCoinPrice(userBalance, USDT_POINT_LENGTH)}
            </small>
          </aside>
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
          onClick={this.onDeposit}
        >
          认购
        </Button>

        {/*解锁弹窗*/}
        <div className={`confirm-wrapper ${showConfirm ? 'show' : ''}`}>
          <div className="content-box">
            <h2>
              确认支付
              <img
                src={COMMON.CLOSE_ICON}
                alt=""
                onClick={() => this.setState({showConfirm: false})}
              />
            </h2>
            <div className="content">
              <ul className="groups">
                <li className="group">
                  <p className="title">
                    <span>支付总额（USDT）</span>
                    <span>{formatCoinPrice(specialOffer * userSpecial, USDT_POINT_LENGTH)}</span>
                  </p>
                  <p>
                    <span>手续费{serviceCharge * 100}%</span>
                    <span>{formatCoinPrice(specialOffer * userSpecial * serviceCharge)}</span>
                  </p>
                </li>
                <li className="group">
                  <p className="title">
                    <span>可用</span>
                    <span>{formatCoinPrice(userBalance, USDT_POINT_LENGTH)}</span>
                  </p>
                  <p>*扣款时依照最新的兑价为准</p>
                </li>
              </ul>

              <div className="input-box">
                <input
                  type={pwdType}
                  placeholder="支付密码"
                  value={payPassword}
                  onChange={e => this.onInputChange(e, 'payPassword')}
                />
                <img
                  src={pwdType === 'text' ? COMMON.OPEN_PWD_ICON : COMMON.CLOSE_PWD_ICON}
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
              确认
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(DepositUnlock)
