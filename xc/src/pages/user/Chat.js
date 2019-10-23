import React, { Component } from 'react'
import chatImg from '../../assets/images/new/chat.png'
import Header from '../../components/common/Header'
import './Chat.scss'

class AccountSafe extends Component {
  render() {
    const { history } = this.props

    return (
      <div id="chat">
        <Header
          // title="安全中心"
          isShadow={false}
          onHandle={() => history.push('/user-center')}
        />
        <div class="chat-wrapper">
          <img src={chatImg} alt="" />
          <p>
            点击右下角的联系客服
            <br />
            即可开始与客服的沟通
            <br />
            若未出现联系客服,请耐心等待1~2秒
          </p>
        </div>
      </div>
    )
  }
}

export default AccountSafe
