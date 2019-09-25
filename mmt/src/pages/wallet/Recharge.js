import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {Toast} from 'antd-mobile'
import Header from '../../components/common/Header'
import QrCodeBox from '../../components/partial/QrCodeBox'
import './Recharge.scss'

@inject('localeStore')
@inject('walletStore')
@observer
class Recharge extends Component {
  state = {
    type: '',
    address: ''
  }

  componentDidMount() {
    const {walletStore, match} = this.props
    const {type} = match.params
    walletStore.getWalletAddress({type}).then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg)
        return
      }
      this.setState({type, address: res.data.wallet})
    })
  }

  render() {
    const {localeStore} = this.props
    const {TOAST, WALLET} = localeStore.language || {}
    const {type, address} = this.state
    const isUsdt = type === 'USDT'

    return (
      <div id="recharge">
        <Header title={`${type} ${WALLET.DEPOSIT}`} isFixed isShadow bgWhite/>
        <section className="section-main">
          <div className="group qr-code__group">
            <QrCodeBox key={address} codeMsg={address}/>
            <br/>
            <span>{WALLET.SAVE_QR_CODE}</span>
          </div>
          <div className="group address">
            <p>{address}</p>
            <CopyToClipboard
              text={address}
              onCopy={() => Toast.info(TOAST.COPIED)}
            >
              <span>{WALLET.COPY_ADDRESS}</span>
            </CopyToClipboard>
          </div>
        </section>
        <section className="section-aside">
          <p>{WALLET.DEPOSIT_NOTES}</p>
          {!isUsdt && (
            <p style={{color: '#d19193'}}>
              • {WALLET.RECHARGE_MSG_ONE}
            </p>
          )}
          <p>
            • {WALLET.RECHARGE_MSG_TWO[0]} {type}
            {WALLET.RECHARGE_MSG_TWO[1]} {type}
            {WALLET.RECHARGE_MSG_TWO[2]}
          </p>
          <p> • {WALLET.RECHARGE_MSG_THREE}</p>
          <p>
            • {WALLET.RECHARGE_MSG_FOUR[0]} {type}{WALLET.RECHARGE_MSG_FOUR[1]}
          </p>
        </section>
      </div>
    )
  }
}

export default Recharge
