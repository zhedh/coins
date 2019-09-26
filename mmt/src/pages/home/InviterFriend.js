import React, { Component } from 'react'
import QRCode from 'qrcode.react'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Toast } from 'antd-mobile'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { MdContentCopy } from 'react-icons/md'
import Header from '../../components/common/Header'
import { TOAST_DURATION } from '../../utils/constants'
import './InviterFriend.scss'
@inject('localeStore')
class QrCodeBox extends Component {
  state = {
    codeUrl: ''
  }

  componentDidMount() {
    const canvas = document.querySelector('.qr-code__box canvas')
    const codeUrl = canvas.toDataURL('image/png')
    this.setState({ codeUrl })
  }

  render() {
    const { inviterUrl, localeStore } = this.props
    const { WALLET } = localeStore.language || {}
    const { codeUrl } = this.state

    return (
      <div className="qr-code__box">
        <QRCode className="qr-code" value={inviterUrl} />
        <br />
        <img src={codeUrl} alt="" />
        <br />
        <span>{WALLET.SAVE_QR_CODE}</span>
      </div>
    )
  }
}

@inject('localeStore')
@inject('personStore')
@inject('userStore')
@observer
class InviterFriend extends Component {
  componentDidMount() {
    const { personStore, userStore, history, localeStore } = this.props
    const { TOAST } = localeStore.language || {}
    if (!userStore.isOnline) {
      Toast.info(TOAST.PLEASE_LOGIN_FIRST, TOAST_DURATION, () =>
        history.push('/login')
      )
      return
    }
    personStore.getUserInfo()
  }

  render() {
    const { history, personStore, localeStore } = this.props
    const { TOAST, HOME } = localeStore.language || {}
    const { userInfo } = personStore
    const { origin } = window.location
    const inviterUrl =
      origin + '/register?recommendCode=' + userInfo.recommendCode

    return (
      <div id="inviter-friend">
        <Header
          title={HOME.INVITE_FRIENDS}
          isShadow={true}
          isFixed={true}
          bgWhite
          onHandle={() => {
            history.push('/home')
          }}
        />
        <section className="section-text">
          {userInfo.recommendCode}
          <br />
          <CopyToClipboard
            text={userInfo.recommendCode}
            onCopy={() => Toast.info(TOAST.COPIED)}
          >
            <span>{HOME.COPY_INVITATION_CODE}</span>
          </CopyToClipboard>
        </section>
        <section className="section-qr">
          <QrCodeBox key={userInfo.recommendCode} inviterUrl={inviterUrl} />
          <p>
            {inviterUrl}
            <CopyToClipboard
              text={inviterUrl}
              onCopy={() => Toast.info(TOAST.COPIED)}
            >
              <MdContentCopy className="icon" />
            </CopyToClipboard>
          </p>
        </section>
        <section className="section-link">
          <Link to="/home/generalize">{HOME.CHECK_REFERRING_DETAILS}</Link>
        </section>
      </div>
    )
  }
}

export default InviterFriend
