import React, {Component} from 'react'
import QrReader from 'react-qr-reader'
import {Toast} from "antd-mobile"
import backWhiteIcon from "../../assets/images/back-white.png"
import './QrReader.scss'

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
    console.log(err)
    Toast.info('扫描失败')
  }

  render() {
    const {show, onBack} = this.props
    return (
      <div className={`qr-reader__popup ${show ? 'show' : ''}`}>
        <header>
          <img
            src={backWhiteIcon}
            alt="返回"
            onClick={onBack}
          />
          扫描二维码
        </header>
        <div className="qr-reader__box">
          <QrReader
            delay={300}
            onError={this.handleError}
            onScan={this.handleScan}
            style={{width: '100%'}}
          />
        </div>
      </div>
    )
  }
}

export default QrReaderPopup
