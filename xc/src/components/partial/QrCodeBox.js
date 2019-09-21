import React, {Component} from "react"
import QRCode from "qrcode.react"
import './QrCodeBox.scss'

class QrCodeBox extends Component {
  state = {
    codeUrl: ''
  }

  componentDidMount() {
    const canvas = document.querySelector('.qr-code__box canvas')
    const codeUrl = canvas.toDataURL('image/png');
    this.setState({codeUrl})
  }

  render() {
    const {codeMsg = '', size = 150} = this.props
    const {codeUrl} = this.state

    return (
      <div className="qr-code__box">
        <QRCode
          className="qr-code"
          value={codeMsg}
        />
        <br/>
        <img src={codeUrl} width={size} alt=""/>
      </div>
    );
  }
}

export default QrCodeBox
