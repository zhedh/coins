import React, { Component, PureComponent } from 'react'
import { inject, observer } from 'mobx-react'
import { Modal } from 'antd-mobile'
import { SWITCH } from '../../config'
import { FaRegQuestionCircle } from 'react-icons/fa'
import Header from '../../components/common/Header'
import { hideChatButton } from '../../utils/common'
import './UserCenter.scss'

class ListItem extends PureComponent {
  render() {
    const { icon, name, url, onHandle } = this.props
    return (
      <div
        className="list-item"
        onClick={() => {
          if (onHandle) {
            onHandle()
          } else {
            window.location.href = url
          }
        }}
      >
        <img className="icon" src={icon} alt="" />
        <span>{name}</span>
        <img
          className="arrow"
          src={require('../../assets/images/arrow-right.png')}
          alt=""
        />
      </div>
    )
  }
}

@inject('userStore')
@inject('personStore')
@observer
class UserCenter extends Component {
  state = { isOnline: true, showFModal: false }

  componentDidMount() {
    const { personStore, userStore } = this.props
    if (SWITCH.PROJECT === 'XC') {
      this.createIframe()
    }

    if (userStore.isOnline) {
      personStore.getUserInfo()
    }
  }

  componentWillUnmount() {
    hideChatButton()
  }

  createIframe = () => {
    let script = document.createElement('script')

    script.type = 'text/javascript'
    // script.async = true
    script.defer = true
    script.id = 'ze-snippet'
    script.src =
      'https://static.zdassets.com/ekr/snippet.js?key=3abd36b7-3c9c-408f-ab7e-0b54e85bd08c'
    document.body.appendChild(script)
  }

  onBack = () => {
    const { history } = this.props
    history.push('/home')
  }

  logout = () => {
    const { history, userStore } = this.props
    // 调取退出登录接口
    Modal.alert('是否退出登录？', '', [
      {
        text: '取消',
        style: 'default'
      },
      {
        text: '确认',
        onPress: () => {
          userStore.logout()
          history.push('/')
        }
      }
    ])
  }

  getAuthLabel = status => {
    switch (status) {
      case 0:
        return '未实名认证'
      case 1:
        return '等待审核'
      case 2:
        return '已实名认证'
      case 3:
        return '认证失败'
      default:
        return ''
    }
  }

  render() {
    const { history, userStore, personStore } = this.props
    const { userInfo } = personStore
    const { showFModal } = this.state
    const hideAuthButton =
      userInfo.authentication === 1 || userInfo.authentication === 2

    return (
      <div id="user-center">
        <Header
          title="个人中心"
          isShadow={true}
          bgWhite
          onHandle={() => this.onBack()}
        />
        <section className={`list-content list-first`}>
          {userStore.isOnline ? (
            <div className="list-item">
              <img
                className="header-logo"
                src={require('../../assets/images/user-header.png')}
                alt=""
              />
              <ul>
                <li>{userInfo.email || userInfo.phoneNo}</li>
                <li>{this.getAuthLabel(userInfo.authentication)}</li>
              </ul>
              {!hideAuthButton && (
                <button
                  className={'auth-btn'}
                  onClick={() => history.push('/verified-country')}
                >
                  实名认证
                </button>
              )}
            </div>
          ) : (
            <h1 onClick={() => history.push('/login')}>
              您好，请登录
              <img
                src={require('../../assets/images/arrow-left.png')}
                alt="返回"
              />
            </h1>
          )}
          <div className="list-tip">
            {userInfo.isF ? (
              <span className="active">
                F用户生效中，{userInfo.isFTime}失效
              </span>
            ) : (
              <span> 非F用户，暂不可享推广奖励</span>
            )}
            &nbsp;
            <FaRegQuestionCircle
              onClick={() => this.setState({ showFModal: true })}
            />
          </div>
        </section>
        <section className={`list-content list-second`}>
          <ListItem
            icon={require('../../assets/images/notice.svg')}
            name="公告列表"
            url="/notices"
          />
          <ListItem
            icon={require('../../assets/images/account.svg')}
            name="账户安全"
            url={userStore.isOnline ? '/account' : '/login'}
          />
          {SWITCH.PROJECT !== 'XC' && (
            <ListItem
              icon={require('../../assets/images/kefu.png')}
              name="联系客服"
              url={'/contact-us'}
            />
          )}
        </section>
        {userStore.isOnline && (
          <section className={`list-content list-second`}>
            <ListItem
              icon={require('../../assets/images/logout.svg')}
              name="退出登录"
              url="/login"
              onHandle={this.logout}
            />
          </section>
        )}
        <Modal
          visible={showFModal}
          className="f-modal"
          closable
          maskClosable
          transparent
          title="F用户说明"
          onClose={() => this.setState({ showFModal: false })}
        >
          <div
            style={{
              fontSize: '1.5rem',
              textAlign: 'justify',
              padding: '10px'
            }}
          >
            当您参与计划成功后，将获得F用户的标示，F用户标示代表着您能够享受参与奖、代数奖、团队奖等相关奖励，f用户的有效期为3个交易日（包含成为当天）。
          </div>
        </Modal>
      </div>
    )
  }
}

export default UserCenter
