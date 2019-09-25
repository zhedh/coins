import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Toast, Button} from 'antd-mobile'
import {UserApi, PersonApi} from '../../api'
import {
  COIN_POINT_LENGTH,
  COUNT_DOWN,
  USDT_POINT_LENGTH
} from '../../utils/constants'
import {isMobile} from '../../utils/reg'
import {formatCoinPrice} from '../../utils/format'
import {getImagePath} from '../../utils/file'
import Header from '../../components/common/Header'
import scanIcon from '../../assets/images/scan.svg'
import recordIcon from '../../assets/images/record.png'
import Captcha from '../../components/common/Captcha'
import './Withdraw.scss'

@inject('localeStore')
@inject('walletStore')
@inject('personStore')
@inject('userStore')
@observer
class Withdraw extends Component {
  state = {
    code: '',
    amount: '',
    walletTo: '',
    type: '',
    imgSrc: 'http://47.75.138.157/api/captchapng/png',
    captcha: '',
    captchaKey: +new Date(),
    count: COUNT_DOWN,
    isCountDown: false,
    isSubmit: false,
    newServiceCharge: '' // 根据地址获取的手续费
  }

  componentDidMount() {
    const {match, walletStore, personStore} = this.props
    const {type} = match.params
    this.setState({type})
    walletStore.withdrawInit({type})
    personStore.getUserInfo()
    this.getCaptchaPng()
  }

  componentWillUnmount() {
    clearTimeout(this.linkTimer)
    clearTimeout(this.timer)
  }

  getCaptchaPng = () => {
    const key = +new Date()

    UserApi.getCaptchaPng({key}).then(res => {
      this.setState({captchaKey: key, imgSrc: res})
    })
  }

  onInputChange = (e, key) => {
    const {value} = e.target
    this.setState({[key]: value})
  }

  onAddressBlur = e => {
    const {value} = e.target
    const {type} = this.state
    if (!value) return
    PersonApi.serviceCharge({address: value, type}).then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg)
        return
      }
      this.setState({newServiceCharge: res.data.serviceCharge})
    })
  }

  onChangeFile = e => {
    const {localeStore} = this.props
    const {TOAST} = localeStore.language || {}
    const {files} = e.target
    if (!files) return

    getImagePath(files[0], url => {
      window.qrcode.decode(url)
      window.qrcode.callback = msg => {
        if (msg === 'error decoding QR Code') {
          Toast.info(TOAST.IDENTIFY_FAILED)
          return
        }
        this.setState({walletTo: msg})
      }
    })
  }

  onCountDown = () => {
    let {count} = this.state
    this.timer = setTimeout(() => {
      if (count <= 0) {
        this.setState({isCountDown: false, count: COUNT_DOWN})
        clearTimeout(this.timer)
      } else {
        this.setState({count: --count})
        this.onCountDown()
      }
    }, 1000)
  }

  getCode = () => {
    const {
      personStore: {userName},
      userStore
    } = this.props
    const {captcha, captchaKey} = this.state
    userStore
      .getCode(
        {
          captcha,
          account: userName,
          type: 'withdraw'
        },
        {key: captchaKey}
      )
      .then(res => {
        if (res.status !== 1) {
          Toast.info(res.msg)
          this.getCaptchaPng()
          return
        }
        this.setState({isCountDown: true, count: COUNT_DOWN})
        this.onCountDown()
      })
  }

  onSubmit = () => {
    const {history, walletStore, localeStore} = this.props
    const {TOAST} = localeStore.language || {}
    let {code, amount, walletTo, type} = this.state
    const {amountMin, amountMax, balance} = walletStore.withdrawInfo

    amount = Number(amount)
    if (!walletTo) {
      Toast.info(TOAST.PLEASE_INPUT_ADDRESS)
      return
    }
    if (type === 'USDT' && !/^(1|3)[a-zA-Z\d]{24,33}$/.test(walletTo)) {
      Toast.info(TOAST.ADRESS_ERROR)
      return
    }
    if (type !== 'USDT' && !/^(0x)?[0-9a-fA-F]{40}$/.test(walletTo)) {
      Toast.info(TOAST.ADRESS_ERROR)
      return
    }
    if (!amount) {
      Toast.info(TOAST.PLEASE_INPUT_AMOUNT)
      return
    }
    if (amount < amountMin) {
      Toast.info(TOAST.LESS_MIN_AMOUNT)
      return
    }
    if (amount > amountMax) {
      Toast.info(TOAST.MORE_MIN_AMOUNT)
      return
    }
    if (amount > balance) {
      Toast.info(TOAST.INSUFFICIENT_ACCOUNT)
      return
    }

    this.setState({isSubmit: true})
    walletStore
      .withdraw({
        walletTo,
        code,
        amount,
        type
      })
      .then(res => {
        this.setState({isSubmit: false})
        if (res.status !== 1) {
          Toast.info(res.msg)
          return
        }
        Toast.info(TOAST.WITHDRAW_SUCCESS)
        this.linkTimer = setTimeout(() => {
          history.push('/wallet/withdraw-record/' + type)
        }, 2000)
      })
      .catch(() => this.setState({isSubmit: false}))
  }

  getRealAmount = (amount, serviceCharge, mmtPrice) => {
    const {type} = this.state
    let realAmount
    if (!amount) return ''

    realAmount = Number(amount) - Number(serviceCharge)
    if (type !== 'USDT') {
      realAmount = realAmount / mmtPrice
    }
    if (realAmount <= 0) return 0
    return formatCoinPrice(realAmount)
  }

  render() {
    const {
      history,
      walletStore,
      personStore: {userName},
      localeStore
    } = this.props
    const {WALLET,COMMON} = localeStore.language || {}
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
    const {dayMax, amountMin, amountMax, balance, mmtPrice, serviceCharge} =
    walletStore.withdrawInfo || {}
    const displayServiceCharge =
      newServiceCharge === 0 ? 0 : newServiceCharge || serviceCharge
    const isUsdt = type === 'USDT'
    const canSubmit = walletTo && amount && code
    let realAmount = this.getRealAmount(amount, displayServiceCharge, mmtPrice)

    return (
      <div id="withdraw">
        <Header title={type + ' ' + WALLET.DEPOSIT} bgWhite isFixed isShadow>
          <img
            className="record-icon"
            src={recordIcon}
            alt="提现记录"
            onClick={() => history.push('/wallet/withdraw-record/' + type)}
          />
        </Header>
        <section className="section-form">
          <div className="row">
            <span className="balance">
              {WALLET.AVAILABLE}：
              {formatCoinPrice(
                balance,
                type === 'USDT' ? USDT_POINT_LENGTH : COIN_POINT_LENGTH
              )}
            </span>
          </div>
          <div className="row">
            <label>{WALLET.WITHDRAWAL_ADDRESS}</label>
            <div className="input-box">
              <input
                type="text"
                placeholder={WALLET.PASTE_ADDRESS}
                value={walletTo}
                onChange={e => this.onInputChange(e, 'walletTo')}
                onBlur={this.onAddressBlur}
              />
              <div className="file-btn">
                <input type="file" onChange={this.onChangeFile}/>
                <button>
                  <img src={scanIcon} alt="扫码"/>
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <label>{WALLET.AMOUNT}（{type}）</label>
            <div className="input-box">
              <input
                type="text"
                placeholder={WALLET.MIN_WITHDRAWAL_AMOUNT + ' ' + amountMin}
                value={amount}
                onChange={e => this.onInputChange(e, 'amount')}
              />
            </div>
            <small>
              {!isUsdt && <span>MMT/MUSDT：{mmtPrice}</span>}
              <span>
                {WALLET.FEES}：{displayServiceCharge}
                {type}
              </span>
            </small>
          </div>
          <div className="row">
            <label>{COMMON.GRAPH_CODE}</label>
            <Captcha
              imgSrc={imgSrc}
              value={captcha}
              onChange={e => this.onInputChange(e, 'captcha')}
              getCaptchaPng={this.getCaptchaPng}
            />
          </div>
          <div className="row">
            <label>{isMobile(userName) ? WALLET.PHONE_VERIFY_CODE : WALLET.EMAIL_VERIFY_CODE}</label>
            <div className="input-box">
              <input
                type="text"
                placeholder={COMMON.VERIFY_CODE}
                value={code}
                onChange={e => this.onInputChange(e, 'code')}
              />
              <button
                className={isCountDown ? 'count-down' : ''}
                onClick={this.getCode}
              >
                {isCountDown ? `${count}S` : WALLET.GET_CODE}
              </button>
            </div>
          </div>
          <div className="row">
            <label>
              <span>{WALLET.YOU_WILL_GET}{!isUsdt && '（MMT）'}</span>
              <span>{realAmount}</span>
            </label>
          </div>
          <div className="btn-box">
            <Button
              activeClassName="active"
              className="primary-button"
              disabled={!canSubmit || isSubmit}
              onClick={this.onSubmit}
            >
              {WALLET.WITHDRAW}
            </Button>
          </div>
        </section>
        <section className="section-aside">
          <p>{WALLET.WARM_REMINDER}</p>
          <p>
            • {WALLET.MSG_ONE_LIST[0]} {dayMax} {type}
            {WALLET.MSG_ONE_LIST[1]}
            {amountMin} {WALLET.MSG_ONE_LIST[2]} {amountMax} {type}
            ， {WALLET.MSG_ONE_LIST[3]}
            {displayServiceCharge} {type}
            {WALLET.MSG_ONE_LIST[4]}
          </p>
          <p> • {WALLET.MSG_TWO}</p>
          {!isUsdt && (
            <p style={{color: '#d19193'}}>
              •{WALLET.MSG_THREE}
            </p>
          )}
        </section>
      </div>
    )
  }
}

export default Withdraw
