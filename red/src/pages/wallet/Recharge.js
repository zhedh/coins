import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Toast } from 'antd-mobile'
import Header from '../../components/common/Header'
// import QrCodeBox from "../../components/partial/QrCodeBox"
import './Recharge.scss'

@inject('walletStore')
@inject('localeStore')
@observer
class Recharge extends Component {
  state = {
    type: '',
    address: ''
  }

  componentDidMount() {
    const { walletStore, match } = this.props
    const { type } = match.params
    walletStore.getWalletAddress({ type }).then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg)
        return
      }
      this.setState({ type, address: res.data.wallet })
    })
  }

  render() {
    const { type, address } = this.state
    const {
      localeStore: {
        locale: { RECHARGE }
      }
    } = this.props

    return (
      <div id="recharge">
        <Header
          title={`${type}${RECHARGE.RECHARGE}`}
          isFixed
          isShadow
          bgPrimary
        />
        <section className="section-main">
          {/*<div className="group qr-code__group">*/}
          {/*<QrCodeBox key={address} codeMsg={address}/>*/}
          {/*<br/>*/}
          {/*<span>点击或长按二维码保存图片</span>*/}
          {/*</div>*/}
          <div className="group address">
            <p>{address}</p>
            <CopyToClipboard
              text={address}
              onCopy={() => Toast.info(RECHARGE.COPY_SUCCESS)}
            >
              <span>{RECHARGE.COPY_ADDRESS}</span>
            </CopyToClipboard>
            <br />
            {type === 'USDT' && <aside>{RECHARGE.ADDRESS_HINT}</aside>}
          </div>
        </section>
        <section className="section-aside">
          <p>{RECHARGE.RECHARGE_EXPLAIN}</p>
          <p>
            {' '}
            • {RECHARGE.EXPLAIN_1_ONE}
            {type} {RECHARGE.EXPLAIN_1_TWO} {type} {RECHARGE.EXPLAIN_1_THREE}{' '}
            {type} {RECHARGE.EXPLAIN_1_FOUR}{' '}
          </p>
          <p> • {RECHARGE.EXPLAIN_2}</p>
          <p>
            {' '}
            • {RECHARGE.EXPLAIN_3_ONE} {type} {RECHARGE.EXPLAIN_3_TWO}
          </p>
        </section>
      </div>
    )
  }
}

export default Recharge
