import React, { Component } from 'react'
import QRCode from 'qrcode.react'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Toast } from 'antd-mobile'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { MdContentCopy } from 'react-icons/md'
import Header from '../../components/common/Header'
import { TOAST_DURATION } from '../../utils/constants'
import { ASSET_HOME } from '../../assets/static'
import './InviterFriend.scss'

class QrCodeBox extends Component {
  state = {
    codeUrl: ''
  };

  componentDidMount() {
    const canvas = document.querySelector('.qr-code__box canvas');
    const codeUrl = canvas.toDataURL('image/png');
    this.setState({ codeUrl })
  }

  render() {
    const { inviterUrl } = this.props;
    const { codeUrl } = this.state;

    return (
      <div className="qr-code__box">
        <QRCode className="qr-code" value={inviterUrl} />
        <br />
        <img src={codeUrl} alt="" />
      </div>
    )
  }
}

@inject('personStore')
@inject('userStore')
@inject('localeStore')
@observer
class InviterFriend extends Component {
  componentDidMount() {
    const { personStore, userStore, history } = this.props;
    const {localeStore: {locale: {INVITER_FRIEND}}} = this.props;
    if (!userStore.isOnline()) {
      Toast.info(INVITER_FRIEND.PLEASE_LOGIN_FIRST, TOAST_DURATION, () => history.push('/login'))
      return
    }
    personStore.getUserInfo()
  }

  render() {
    const {localeStore: {locale: {INVITER_FRIEND}}} = this.props;
    const { personStore } = this.props;
    const { userInfo } = personStore;
    const { origin } = window.location;
    const inviterUrl =
      origin + '/register?recommendCode=' + userInfo.recommendCode

    return (
      <div id="inviter-friend">
        <Header title={INVITER_FRIEND.INVITER_FRIEND} isShadow bgPrimary isFixed />
        <section className="section-text">
          {userInfo.recommendCode}
          <CopyToClipboard
            text={userInfo.recommendCode}
            onCopy={() => Toast.info(INVITER_FRIEND.COPY_SUCCESS)}
          >
            <span>{INVITER_FRIEND.COPY_INVITE_NUM}</span>
          </CopyToClipboard>
        </section>
        <section
          className="section-main"
          style={{ backgroundImage: `url(${ASSET_HOME.INVITER_FRIEND_BG})` }}
        >
          <div className="qr-wrap">
            <QrCodeBox key={userInfo.recommendCode} inviterUrl={inviterUrl} />
            <aside>{INVITER_FRIEND.CLICK_SAVE_IMG}</aside>
          </div>

          <p>
            {inviterUrl}
            <CopyToClipboard
              text={inviterUrl}
              onCopy={() => Toast.info(INVITER_FRIEND.COPY_SUCCESS)}
            >
              <MdContentCopy className="icon" />
            </CopyToClipboard>
          </p>
          <div className="link">
            <Link to="/home/generalize">{INVITER_FRIEND.CHECK_REFERRING_DETAILS}</Link>
          </div>
        </section>
      </div>
    )
  }
}

export default InviterFriend
