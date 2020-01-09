import React from 'react'
import { Button, Modal, Toast } from 'antd-mobile'
import Header from '../../components/common/Header'
import PersonApi from '../../api/person'
import { inject, observer } from 'mobx-react'
import Captcha from '../../components/common/Captcha'
import { isMobile } from '../../utils/reg'
import UserApi from '../../api/user'
import { COUNT_DOWN } from '../../utils/constants'
import './Termination.scss'

@inject('userStore')
@inject('personStore')
@inject('localeStore')
@observer
class Termination extends React.Component {
  state = {
    walletTo: '',
    type: 'XC',
    canSubmit: true,
    showConfirm: false,
    initData: {
      lockOrderAmount: 0, // 本金
      winCount: 0, // 利润
      daysDeduct: 0, // 15天内解除的违约费用
      canUse: 0, // 实际可提现
      serviceCharge: 0, // 手续费率
      fee: 0 // 手续费
    },
    imgSrc: '',
    captcha: '',
    captchaKey: +new Date(),
    count: COUNT_DOWN,
    isCountDown: false,
    code: ''
  }

  componentDidMount() {
    const { personStore } = this.props
    const { type } = this.state
    this.terminationInit({ type })
    this.getCaptchaPng()
    personStore.getUserInfo()
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
    clearTimeout(this.countDowntimer)
  }

  terminationInit = (options = {}) => {
    return PersonApi.terminationInit(options).then(res => {
      if (res.status !== 200 && res.status !== 1) {
        Toast.info(res.msg)
        return
      }
      this.setState({ initData: res.data })
    })
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

  onAddressChange = e => {
    const { value } = e.target
    this.setState({ walletTo: value })
  }

  onAddressBlur = e => {
    const { value } = e.target
    const { type, canSubmit } = this.state
    if (!value || !canSubmit) return
    this.terminationInit({ type, walletTo: value })
  }

  onCountDown = () => {
    let { count } = this.state
    this.countDowntimer = setTimeout(() => {
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
      userStore,
      localeStore: {
        locale: { TERMINATION }
      }
    } = this.props
    const { captcha, captchaKey } = this.state
    if (!captcha) {
      Toast.info(TERMINATION.INPUT_GRAPH_CODE)
      return
    }
    userStore
      .getCode(
        {
          captcha,
          account: userName,
          type: 'termination'
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
      personStore: { userName },
      localeStore: {
        locale: { TERMINATION }
      }
    } = this.props
    const { walletTo, code } = this.state

    if (!walletTo) {
      Toast.info(TERMINATION.INPUT_WALLET_ADDRESS)
      return
    }
    if (!code) {
      Toast.info(
        `${TERMINATION.INPUT_PHONE_CODE_01}${
          isMobile(userName)
            ? TERMINATION.INPUT_PHONE_CODE_02
            : TERMINATION.INPUT_PHONE_CODE_03
        }${TERMINATION.INPUT_PHONE_CODE_04}`
      )
      return
    }
    this.setState({ showConfirm: true })
  }

  submitTermination = () => {
    const {
      history,
      userStore,
      localeStore: {
        locale: { TERMINATION }
      }
    } = this.props
    const { type, walletTo, code } = this.state
    this.setState({ canSubmit: false, showConfirm: false })
    PersonApi.termination({ type, walletTo, code }).then(res => {
      this.timer = setTimeout(() => this.setState({ canSubmit: true }), 500)
      if (res.status === -103) {
        history.push('/login')
      }
      if (res.status !== 200 && res.status !== 1) {
        Toast.info(res.msg)
        return
      }
      Toast.success(TERMINATION.TERMINATION_SUCCESS, 2, () => {
        userStore.logout()
        history.push('/login')
      })
    })
  }

  render() {
    const {
      walletTo,
      canSubmit,
      initData,
      showConfirm,
      code,
      imgSrc,
      captcha,
      count,
      isCountDown
    } = this.state
    const {
      personStore: { userName },
      localeStore: {
        locale: { TERMINATION }
      }
    } = this.props
    const disabled = !walletTo || !canSubmit || !code

    return (
      <div className="termination">
        <Header
          title={TERMINATION.TERMINATION}
          bgPrimary
          isFixed
          isShadow
        ></Header>
        <section className="section-form">
          <div className="row">
            <label>{TERMINATION.RECEIPT_ADDRESS}</label>
            <div className="input-box">
              <input
                type="text"
                placeholder={TERMINATION.INPUT_OR_PASTE_ADDRESS}
                value={walletTo}
                onChange={this.onAddressChange}
                onBlur={this.onAddressBlur}
              />
            </div>
            <small>
              <span>
                {TERMINATION.TAKE_OUT_FIRST_ORDER}
                {initData.daysDeduct}XC
              </span>
              <span>
                {TERMINATION.FEE}：{(initData.serviceCharge || 0) * 100}%
              </span>
            </small>
          </div>
          <div className="row">
            <label>{TERMINATION.GRAPH_CODE}</label>
            <Captcha
              imgSrc={imgSrc}
              value={captcha}
              onChange={e => this.onInputChange(e, 'captcha')}
              getCaptchaPng={this.getCaptchaPng}
            />
          </div>
          <div className="row">
            <label>
              {isMobile(userName)
                ? TERMINATION.PHONE_CODE
                : TERMINATION.EMAIL_CODE}
            </label>
            <div className="input-box">
              <input
                type="text"
                placeholder={TERMINATION.INPUT_CODE}
                value={code}
                onChange={e => this.onInputChange(e, 'code')}
              />
              <button
                className={isCountDown ? 'count-down' : ''}
                onClick={this.getCode}
              >
                {isCountDown ? `${count}S` : TERMINATION.GET_CODE}
              </button>
            </div>
          </div>
          <div className="btn-box">
            <small>
              {TERMINATION.TO_ACCOUNT_COUNT}：{initData.canUse}XC
            </small>
            <Button
              activeClassName="active"
              className="primary-button"
              disabled={disabled}
              onClick={this.onSubmit}
            >
              {TERMINATION.TERMINATION}
            </Button>
          </div>
        </section>
        <section className="section-agreement">
          {TERMINATION.TERMINATION_EXPLAIN}：
          <br />
          {TERMINATION.EXPLAIN_1}
          <br />
          {TERMINATION.EXPLAIN_2}
          <br />
          {TERMINATION.EXPLAIN_3}
          <br />
          {TERMINATION.EXPLAIN_4}
          <br />
          {TERMINATION.EXPLAIN_5}
          <br />
          <span style={{ color: '#e22020' }}>{TERMINATION.EXPLAIN_6}</span>
        </section>
        <Modal
          visible={showConfirm}
          className="confirm-modal"
          maskClosable
          transparent
          onClose={() => this.setState({ showConfirm: false })}
        >
          <div
            style={{
              fontSize: '1.5rem',
              textAlign: 'justify',
              color: '#333',
              background: 'rgba(255,255,255,0.7)'
            }}
          >
            <p style={{ margin: '0', padding: '10px 15px 20px' }}>
              {TERMINATION.TERMINATION_HINT}
            </p>
            <aside
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderTop: '1px solid #eee'
              }}
            >
              <button
                style={{
                  width: '50%',
                  height: '40px',
                  lineHeight: '40px',
                  border: 'none',
                  background: 'transparent',
                  borderRight: '1px solid #eee'
                }}
                onClick={() => this.setState({ showConfirm: false })}
              >
                {TERMINATION.CANCEL}
              </button>
              <button
                style={{
                  width: '50%',
                  height: '40px',
                  lineHeight: '40px',
                  border: 'none',
                  background: 'transparent'
                }}
                onClick={this.submitTermination}
              >
                {TERMINATION.CONFIRM}
              </button>
            </aside>
          </div>
        </Modal>
      </div>
    )
  }
}

export default Termination
