import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {withRouter} from 'react-router'
import {inject, observer} from 'mobx-react'
import {Button, Toast} from 'antd-mobile'
import {ASSET_COMMON} from '../../assets/static'
import './DepositBuy.scss'
import {formatCoinPrice} from "../../utils/format";

@inject('productStore')
@inject('userStore')
@inject('personStore')
@inject('localeStore')
@observer
class DepositBuy extends Component {
  state = {
    showConfirm: false,
    payPassword: '',
    pwdType: 'password',
    isSubmit: false
  };

  onInputChange = (e, key) => {
    const {value} = e.target;
    this.setState({[key]: value})
  };

  onSetType = currentType => {
    this.setState({pwdType: currentType === 'text' ? 'password' : 'text'})
  };

  onDeposit = gearNum => {
    const {localeStore: {locale: {DEPOSIT}}} = this.props;
    const {userStore} = this.props;
    if (!userStore.hasPayPassword) {
      Toast.info(DEPOSIT.SET_PAY_PASSWORD);
      return
    }
    if (gearNum) this.setState({showConfirm: true})
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
        productStore.createDepositOrder(payToken).then(res => {
          this.setState({isSubmit: false});
          if (res.status !== 1) {
            Toast.info(res.msg);
            return
          }
          Toast.success(DEPOSIT.ATTEND_SUCCESS, 2, () => window.location.reload());
          this.setState({showConfirm: false})
        })
      })
      .catch(err => {
        console.log(err);
        this.setState({isSubmit: false, showConfirm: false})
      })
  };

  render() {
    const {localeStore: {locale: {DEPOSIT}}} = this.props;
    const {show, productStore, userStore} = this.props;
    const {showConfirm, payPassword, pwdType, isSubmit} = this.state;
    const {productDetail, gears, gearNum} = productStore;
    const hasGears = gears && gears.length > 0;

    return (
      <div className={`deposit-buy ${show ? 'show' : ''}`}>
        <h2>{DEPOSIT.COUNT_SELECT}</h2>

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
          <p>
            <span>{DEPOSIT.GIVE_PROMOTION}</span>
            <b>{gearNum ? (gearNum * productDetail.specialRatio).toFixed(0) : 0}</b>
          </p>
          <small>{DEPOSIT.FEES}：{(productDetail.serviceCharge || 0) * 100}%</small>
        </div>
        <aside>
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

        {/*输入交易密码弹窗*/}
        <div className={`confirm-wrapper ${showConfirm ? 'show' : ''}`}>
          <div className="content-box">
            <h2>
              {DEPOSIT.CONFIRM_PAYMENT}
              <img
                src={ASSET_COMMON.CLOSE_ICON}
                alt=""
                onClick={() => this.setState({showConfirm: false})}
              />
            </h2>
            <div className="content">
              <p className="strong">
                <span>{DEPOSIT.JOIN_X_PLAN}</span>
                <span>{gearNum || '--'}</span>
              </p>
              <p className="assistant">
                <span>{DEPOSIT.FEE}{(productDetail.serviceCharge || 0) * 100}%</span>
                <span>
                  {formatCoinPrice(gearNum * productDetail.serviceCharge)}
                </span>
              </p>
              <br/>
              <p className="strong">
                <span>{DEPOSIT.AVAILABLE}</span>
                <span>
                  {formatCoinPrice(productDetail.userWarehouse)}
                </span>
              </p>
              <div className="input-box">
                <input
                  type={pwdType}
                  placeholder={DEPOSIT.PAY_PASSWORD}
                  value={payPassword}
                  onChange={e => this.onInputChange(e, 'payPassword')}
                />
                <img
                  src={pwdType === 'text' ? ASSET_COMMON.OPEN_PWD_ICON : ASSET_COMMON.CLOSE_PWD_ICON}
                  alt="eyes"
                  onClick={() => this.onSetType(pwdType)}
                />
              </div>
              <div className="link">
                <Link to="/password/repay">{DEPOSIT.FORGET_PAY_PASSWORD}</Link>
              </div>
            </div>
            <Button
              activeClassName="active"
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

export default withRouter(DepositBuy)
