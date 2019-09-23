import React, {Component} from "react"
import {inject, observer} from "mobx-react"
import {CopyToClipboard} from "react-copy-to-clipboard"
import {Toast} from "antd-mobile"
import Header from "../../components/common/Header"
import QrCodeBox from "../../components/partial/QrCodeBox"
import "./Recharge.scss"

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
    const {type, address} = this.state
    const isUsdt = type === 'USDT'

    return (
      <div id="recharge">
        <Header title={`${type}充值`} isFixed isShadow bgWhite/>
        <section className="section-main">
          <div className="group qr-code__group">
            <QrCodeBox key={address} codeMsg={address}/>
            <br/>
            <span>点击或长按二维码保存图片</span>
          </div>
          <div className="group address">
            <p>{address}</p>
            <CopyToClipboard
              text={address}
              onCopy={() => Toast.info('复制成功')}>
              <span>复制地址</span>
            </CopyToClipboard>
          </div>
        </section>
        <section className="section-aside">
          <p>转入说明</p>
          {!isUsdt && <p style={{color: '#d19193'}}>
            • 充值MMT后将自动根据 MMT/MUSDT 的时时汇率自动折合成 MUSDT ,折合时间根据MMT 到账时间为准。
          </p>}
          <p> • 转入是自动的，{type} 转账需要整个 {type} 网络进行确认，您的 {type} 会自动充值到您的账户中。 </p>
          <p> • 此地址是你唯一且独自使用的转入地址，你可以同时进行多次充值。</p>
          <p> • 本地址禁止充值除 {type} 之外的其它资产，任何其它资产充值将不可找回。</p>
        </section>
      </div>
    )
  }
}

export default Recharge
