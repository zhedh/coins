import React, { Component } from 'react'
import { inject } from 'mobx-react'
import QrReader from 'react-qr-reader'
import { Toast } from 'antd-mobile'
import backWhiteIcon from '../../assets/images/back-white.png'
import './QrReader.scss'

@inject('localeStore')
class QrReaderPopup extends Component {
  state = {
    result: 'No result'
  }

  handleScan = data => {
    if (data) {
      this.props.onScan(data)
    }
  }

  handleError = err => {
    const { localeStore } = this.props
    const { TOAST } = localeStore.language || {}

    console.log(err)
    Toast.info(TOAST.SCAN_FAILED)
  }

  render() {
    const { show, onBack } = this.props
    return (
      <div className={`qr-reader__popup ${show ? 'show' : ''}`}>
        <header>
          <img src={backWhiteIcon} alt="返回" onClick={onBack} />
          扫描二维码
        </header>
        <div className="qr-reader__box">
          <QrReader
            delay={300}
            onError={this.handleError}
            onScan={this.handleScan}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    )
  }
}

export default QrReaderPopup
