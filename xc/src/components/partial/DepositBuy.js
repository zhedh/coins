import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {withRouter} from 'react-router'
import {inject, observer} from 'mobx-react'
import {Button, Toast} from 'antd-mobile'
import {COMMON} from '../../assets/static'
import './DepositBuy.scss'

@inject('productStore')
@inject('userStore')
@inject('personStore')
@observer
class DepositBuy extends Component {
  state = {
    showConfirm: false,
    payPassword: '',
    pwdType: 'password',
    isSubmit: false
  }

  onInputChange = (e, key) => {
    const {value} = e.target
    this.setState({[key]: value})
  }

  onSetType = currentType => {
    this.setState({pwdType: currentType === 'text' ? 'password' : 'text'})
  }

  onDeposit = gearNum => {
    const {userStore} = this.props
    // if (!personStore.isAuth) {
    //   Toast.info('请进行实名认证')
    //   return
    // }
    if (!userStore.hasPayPassword) {
      Toast.info('请设置交易密码')
      return
    }
    if (gearNum) this.setState({showConfirm: true})
  }

  onSubmit = () => {
    const {history, userStore, productStore} = this.props
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
        productStore.createDepositOrder(payToken).then(res => {
          this.setState({isSubmit: false})
          if (res.status !== 1) {
            Toast.info(res.msg)
            return
          }
          history.push('/deposit/result')
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({isSubmit: false})
      })
  }

  render() {
    const {show, productStore, userStore} = this.props
    const {showConfirm, payPassword, pwdType, isSubmit} = this.state
    const {productDetail, gears, gearNum} = productStore
    const hasGears = gears && gears.length > 0

    return (
      <div className={`deposit-buy ${show ? 'show' : ''}`}>
        <h2>数量选择</h2>

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
          {/*{gearNum && (*/}
          <p>
            <span>赠送特价额度</span>
            <b>{gearNum ? (gearNum / 10).toFixed(0) : 0}</b>
          </p>
          {/*)}*/}
          <small>手续费费率：{(productDetail.serviceCharge || 0) * 100}%</small>
        </div>
        <aside>
          {/*{!personStore.isAuth && (*/}
          {/*<p>*/}
          {/**您暂未通过实名认证，无法参与计划*/}
          {/*<Link to="/verified-country">去认证</Link>*/}
          {/*</p>*/}
          {/*)}*/}
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
          onClick={() => this.onDeposit(gearNum)}
        >
          参与计划
        </Button>

        {/*输入交易密码弹窗*/}
        <div className={`confirm-wrapper ${showConfirm ? 'show' : ''}`}>
          <div className="content-box">
            <h2>
              请输入交易密码
              <img
                src={COMMON.CLOSE_ICON}
                alt=""
                onClick={() => this.setState({showConfirm: false})}
              />
            </h2>
            <div className="content">
              {/*先隐藏可用数量*/}

              {/*<p>*/}
              {/*<span>可用</span>*/}
              {/*<span>*/}
              {/*{formatCoinPrice(*/}
              {/*productDetail.userWarehouse,*/}
              {/*COIN_POINT_LENGTH*/}
              {/*)}*/}
              {/*</span>*/}
              {/*</p>*/}
              <div className="input-box">
                <input
                  type={pwdType}
                  placeholder="交易密码"
                  value={payPassword}
                  onChange={e => this.onInputChange(e, 'payPassword')}
                />
                <img
                  src={pwdType === 'text' ? COMMON.OPEN_PWD_ICON : COMMON.CLOSE_PWD_ICON}
                  alt="eyes"
                  onClick={() => this.onSetType(pwdType)}
                />
              </div>
              <div className="link">
                <Link to="/password/repay">忘记交易密码</Link>
              </div>
            </div>
            <Button
              activeClassName="active"
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

export default withRouter(DepositBuy)
