import React, {Component, PureComponent} from 'react'
import {inject, observer} from 'mobx-react'
import {Modal} from 'antd-mobile'
import {FaRegQuestionCircle} from 'react-icons/fa'
import Header from '../../components/common/Header'
import {hideChatButton} from '../../utils/common'
import './UserCenter.scss'

class ListItem extends PureComponent {
  render() {
    const {icon, name, url, onHandle} = this.props
    return (
      <div
        className="list-item"
        onClick={() => {
          onHandle ? onHandle() : (window.location.href = url)
        }}
      >
        <img className="icon" src={icon} alt=""/>
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
@inject('localeStore')
@inject('personStore')
@observer
class UserCenter extends Component {
  state = {
    isOnline: true,
    showFModal: false,
    showLocaleModal: false
  }

  componentDidMount() {
    const {personStore, userStore} = this.props

    if (userStore.isOnline) {
      personStore.getUserInfo()
    }
  }

  componentWillUnmount() {
    hideChatButton()
  }

  onBack = () => {
    const {history} = this.props
    history.push('/home')
  }

  onChangeLocale = locale => {
    const {localeStore} = this.props
    localeStore.changeLocale(locale)
    this.setState({showLocaleModal: false})
  }

  logout = () => {
    const {history, userStore, localeStore} = this.props
    const {TOAST, COMMON} = localeStore.language || {}

    // 调取退出登录接口
    Modal.alert(TOAST.IS_SIGN_OUT, '', [
      {
        text: TOAST.CANCEL_SIGN_OUT,
        style: 'default'
      },
      {
        text: COMMON.CONFIRM,
        onPress: () => {
          userStore.logout()
          history.push('/')
        }
      }
    ])
  }

  getAuthLabel = status => {
    const {localeStore} = this.props
    const {TOAST} = localeStore.language || {}
    switch (status) {
      case 0:
        return TOAST.UNVERIFIED
      case 1:
        return TOAST.VERIFYING
      case 2:
        return TOAST.HAS_REAL_NAME_AUTH
      case 3:
        return TOAST.VERIFY_FAILED
      default:
        return ''
    }
  }

  render() {
    const {history, userStore, personStore, localeStore} = this.props
    const {userInfo} = personStore
    const {locale, USER_CENTER} = localeStore.language || {}
    const {showFModal, showLocaleModal} = this.state
    const hideAuthButton =
      userInfo.authentication === 1 || userInfo.authentication === 2

    return (
      <div id="user-center">
        <Header
          title={USER_CENTER.USER_CENTER}
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
                  {USER_CENTER.IDENTITIY_VERIFICATION}
                </button>
              )}
            </div>
          ) : (
            <h1 onClick={() => history.push('/login')}>
              {USER_CENTER.HI_TO_LOGIN}
              <img
                src={require('../../assets/images/arrow-left.png')}
                alt="返回"
              />
            </h1>
          )}
          <div className="list-tip">
            {userInfo.isF ? (
              <span className="active">
                {USER_CENTER.F_MEMBER_ING}
                {userInfo.isFTime}
                {USER_CENTER.F_MEMBER_INVALID}
              </span>
            ) : (
              <span> {USER_CENTER.NOT_F_MEMBER}</span>
            )}
            &nbsp;
            <FaRegQuestionCircle
              onClick={() => this.setState({showFModal: true})}
            />
          </div>
        </section>
        <section className={`list-content list-second`}>
          <ListItem
            icon={require('../../assets/images/notice.svg')}
            name={USER_CENTER.ANNOUNCEMENTS}
            url="/notices"
          />
          <ListItem
            icon={require('../../assets/images/account.svg')}
            name={USER_CENTER.ACCOUNT_SECURITY}
            url={userStore.isOnline ? '/account' : '/login'}
          />
          <ListItem
            icon={require('../../assets/images/kefu.png')}
            name={USER_CENTER.CONTACT_CUSTOMER_SERVICE}
            url={'/contact-us'}
          />
          <ListItem
            icon={require('../../assets/images/locale.png')}
            name={USER_CENTER.CHANGE_LANG}
            onHandle={() => this.setState({showLocaleModal: true})}
          />
        </section>
        {userStore.isOnline && (
          <section className={`list-content list-second`}>
            <ListItem
              icon={require('../../assets/images/logout.svg')}
              name={USER_CENTER.SIGN_OUT}
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
          title={USER_CENTER.F_MEMBER_INTRODUCTION}
          onClose={() => this.setState({showFModal: false})}
        >
          <div
            style={{
              fontSize: '1.5rem',
              textAlign: 'justify',
              padding: '10px'
            }}
          >
            {USER_CENTER.F_INFO}
          </div>
        </Modal>
        <div className={`locale-modal ${showLocaleModal ? 'show' : ''}`}>
          <ul>
            <li
              className={locale === 'zh_CN' ? 'active' : ''}
              onClick={() => this.onChangeLocale('zh_CN')}
            >
              中文
            </li>
            <li
              className={locale === 'en_US' ? 'active' : ''}
              onClick={() => this.onChangeLocale('en_US')}
            >
              English
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default UserCenter
