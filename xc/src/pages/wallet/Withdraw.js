import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Toast, Button } from 'antd-mobile'
import { UserApi, PersonApi } from '../../api'
import {
  COIN_POINT_LENGTH,
  COUNT_DOWN,
  USDT_POINT_LENGTH
} from '../../utils/constants'
import { isMobile } from '../../utils/reg'
import { formatCoinPrice } from '../../utils/format'
import { getImagePath } from '../../utils/file'
import Header from '../../components/common/Header'
import scanIcon from '../../assets/images/scan.svg'
import Captcha from '../../components/common/Captcha'
import './Withdraw.scss'

@inject('walletStore')
@inject('personStore')
@inject('userStore')
@inject('localeStore')
@observer
class Withdraw extends Component {
  state = {
    code: '',
    amount: '',
    walletTo: '',
    type: '',
    imgSrc: '',
    captcha: '',
    captchaKey: +new Date(),
    count: COUNT_DOWN,
    isCountDown: false,
    isSubmit: false,
    newServiceCharge: '' // 根据地址获取的手续费
  }

  componentDidMount() {
    const { match, walletStore, personStore } = this.props
    const { type } = match.params
    this.setState({ type })
    walletStore.withdrawInit({ type }).then(res => {
      if (res.status !== 1) {
        Toast.show(res.msg)
      }
    })
    personStore.getUserInfo()
    this.getCaptchaPng()
  }

  componentWillUnmount() {
    clearTimeout(this.linkTimer)
    clearTimeout(this.timer)
  }

  getCaptchaPng = () => {
    const key = +new Date()

    UserApi.getCaptchaPng({ key }).then(res => {
      this.setState({ captchaKey: key, imgSrc: res })
    })
  }

  onInputChange = (e, key) => {
    const { value } = e.target
    this.setState({ [key]: value })
  }

  onAmountChange = e => {
    const { value } = e.target
    const reg = /^\d+(\.)?\d{0,4}?$/
    if (value && !reg.test(e.target.value)) {
      return
    }
    this.setState({ amount: value })
  }

  onAddressBlur = e => {
    const { value } = e.target
    const { type } = this.state
    if (!value) return
    PersonApi.serviceCharge({ address: value, type }).then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg)
        return
      }
      this.setState({ newServiceCharge: res.data.serviceCharge })
      // this.setState({newServiceCharge: 0})
    })
  }

  onChangeFile = e => {
    const {
      localeStore: {
        locale: { WITHDRAW }
      }
    } = this.props
    const { files } = e.target
    if (!files) return

    getImagePath(files[0], url => {
      window.qrcode.decode(url)
      window.qrcode.callback = msg => {
        if (msg === 'error decoding QR Code') {
          Toast.info(WITHDRAW.DISCERN_FAILURE)
          return
        }
        this.setState({ walletTo: msg })
      }
    })
  }

  onCountDown = () => {
    let { count } = this.state
    this.timer = setTimeout(() => {
      if (count <= 0) {
        this.setState({ isCountDown: false, count: COUNT_DOWN })
        clearTimeout(this.timer)
      } else {
        this.setState({ count: --count })
        this.onCountDown()
      }
    }, 1000)
  }

  getCode = () => {
    const {
      personStore: { userName },
      userStore
    } = this.props
    const { captcha, captchaKey } = this.state
    userStore
      .getCode(
        {
          captcha,
          account: userName,
          type: 'withdraw'
        },
        { key: captchaKey }
      )
      .then(res => {
        if (res.status !== 1) {
          Toast.info(res.msg)
          this.getCaptchaPng()
          return
        }
        this.setState({ isCountDown: true, count: COUNT_DOWN })
        this.onCountDown()
      })
  }

  onSubmit = () => {
    const {
      history,
      walletStore,
      localeStore: {
        locale: { WITHDRAW }
      }
    } = this.props
    let { code, amount, walletTo, type } = this.state
    const { amountMin, amountMax, balance } = walletStore.withdrawInfo

    amount = Number(amount)
    if (!walletTo) {
      Toast.info(WITHDRAW.INPUT_ADDRESS)
      return
    }
    if (type === 'USDT' && !/^(1|3)[a-zA-Z\d]{24,33}$/.test(walletTo)) {
      Toast.info(WITHDRAW.ADDRESS_ERR)
      return
    }
    if (type !== 'USDT' && !/^(0x)?[0-9a-fA-F]{40}$/.test(walletTo)) {
      Toast.info(WITHDRAW.ADDRESS_ERR)
      return
    }
    if (!amount) {
      Toast.info(WITHDRAW.INPUT_COUNT)
      return
    }
    if (amount < amountMin) {
      Toast.info(WITHDRAW.LESS_MIN_COUNT)
      return
    }
    if (amount > amountMax) {
      Toast.info(WITHDRAW.MORE_MAX_COUNT)
      return
    }
    if (amount > balance) {
      Toast.info(WITHDRAW.ACCOUNT_NO_MORE)
      return
    }

    this.setState({ isSubmit: true })
    walletStore
      .withdraw({
        walletTo,
        code,
        amount,
        type
      })
      .then(res => {
        this.setState({ isSubmit: false })
        if (res.status !== 1) {
          Toast.info(res.msg)
          return
        }
        Toast.info(WITHDRAW.WITHDRAW_SUCCESS_TO_JUMP)
        this.linkTimer = setTimeout(() => {
          history.push('/wallet/withdraw-record/' + type)
        }, 2000)
      })
      .catch(() => this.setState({ isSubmit: false }))
  }

  render() {
    const {
      history,
      walletStore,
      personStore: { userName },
      localeStore: {
        locale: { WITHDRAW }
      }
    } = this.props

    const {
      code,
      amount,
      walletTo,
      type,
      imgSrc,
      captcha,
      count,
      isCountDown,
      isSubmit,
      newServiceCharge
    } = this.state
    const {
      dayMax,
      amountMin,
      amountMax,
      balance,
      serviceChargeIn,
      serviceChargeOut,
      canCashBalance
    } = walletStore.withdrawInfo || {}

    const displayServiceCharge =
      newServiceCharge === 0 ? 0 : newServiceCharge || serviceChargeOut
    const canSubmit = walletTo && amount && code
    const realAmount = amount
      ? Number(amount) - Number(amount) * Number(displayServiceCharge)
      : '--'

    return (
      <div id="withdraw">
        <Header
          title={type + WITHDRAW.WITHDRAW_COIN}
          bgPrimary
          isFixed
          isShadow
        >
          <span onClick={() => history.push('/wallet/withdraw-record/' + type)}>
            {WITHDRAW.WITHDRAW_AMOUNT}
          </span>
        </Header>
        <section className="section-form">
          <div className="row">
            <span className="balance">
              {WITHDRAW.ACCOUNT_AVAILABLE_01}
              {type === 'XC' ? WITHDRAW.ACCOUNT_AVAILABLE_02 : ''}：
              {formatCoinPrice(
                balance,
                type === 'USDT' ? USDT_POINT_LENGTH : COIN_POINT_LENGTH
              )}
            </span>
            {type === 'XC' && (
              <span className="balance">
                {WITHDRAW.ACCOUNT_WITHDRAW}：
                {formatCoinPrice(canCashBalance, COIN_POINT_LENGTH)}
              </span>
            )}
          </div>
          <div className="row">
            <label>{WITHDRAW.WITHDRAW_ADDRESS}</label>
            <div className="input-box">
              <input
                type="text"
                placeholder={WITHDRAW.INPUT_OR_PASTE_ADDRESS}
                value={walletTo}
                onChange={e => this.onInputChange(e, 'walletTo')}
                onBlur={this.onAddressBlur}
              />
              <div className="file-btn">
                <input type="file" onChange={this.onChangeFile} />
                <button>
                  <img src={scanIcon} alt={WITHDRAW.SCAN_CODE} />
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <label>
              {WITHDRAW.AMOUNT}（{type}）
            </label>
            <div className="input-box">
              <input
                type="text"
                placeholder={WITHDRAW.MIN_WITHDRAWAL_AMOUNT + amountMin}
                value={amount}
                onChange={this.onAmountChange}
              />
            </div>
            <small>
              {WITHDRAW.FEE}：{(displayServiceCharge || 0) * 100}%
            </small>
          </div>
          <div className="row">
            <label>{WITHDRAW.GRAPH_CODE}</label>
            <Captcha
              imgSrc={imgSrc}
              value={captcha}
              onChange={e => this.onInputChange(e, 'captcha')}
              getCaptchaPng={this.getCaptchaPng}
            />
          </div>
          <div className="row">
            <label>
              {isMobile(userName) ? WITHDRAW.PHONE_CODE : WITHDRAW.EMAIL_CODE}
            </label>
            <div className="input-box">
              <input
                type="text"
                placeholder={WITHDRAW.INPUT_CODE}
                value={code}
                onChange={e => this.onInputChange(e, 'code')}
              />
              <button
                className={isCountDown ? 'count-down' : ''}
                onClick={this.getCode}
              >
                {isCountDown ? `${count}S` : WITHDRAW.GET_CODE}
              </button>
            </div>
          </div>
          <div className="row">
            <label>
              <span>{WITHDRAW.TO_ACCOUNT_COUNT}</span>
              <span>
                {formatCoinPrice(
                  realAmount,
                  type === 'USDT' ? USDT_POINT_LENGTH : COIN_POINT_LENGTH
                )}
              </span>
            </label>
          </div>
          <div className="btn-box">
            <Button
              activeClassName="active"
              className="primary-button"
              disabled={!canSubmit || isSubmit}
              onClick={this.onSubmit}
            >
              {WITHDRAW.WITHDRAW}
            </Button>
          </div>
        </section>
        <section className="section-aside">
          <p>{WITHDRAW.WARM_REMINDER}</p>
          <p>
            {' '}
            • {WITHDRAW.REMARK_1} {dayMax} {type}， {WITHDRAW.REMARK_2}
            {amountMin} - {amountMax} {type}， {WITHDRAW.REMARK_3}{' '}
            {(serviceChargeOut || 0) * 100}%。 {WITHDRAW.REMARK_4}{' '}
            {(serviceChargeIn || 0) * 100}%。
          </p>
          <p> • {WITHDRAW.REMARK_5}</p>
        </section>
      </div>
    )
  }
}

export default Withdraw
