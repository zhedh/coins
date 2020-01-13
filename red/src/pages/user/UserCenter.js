import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {ASSET_USER} from '../../assets/static'
import {Modal, Toast} from 'antd-mobile'
import SimpleHeader from '../../components/common/SimpleHeader'
import './UserCenter.scss'

@inject('userStore')
@inject('personStore')
@inject('localeStore')
@observer
class UserCenter extends Component {
  state = {showFModal: false, showActiveModal: false};

  componentDidMount() {
    const {history, personStore, userStore, localeStore: {locale}} = this.props;
    const {USER_CENTER} = locale;
    if (!userStore.isOnline()) {
      Toast.info(USER_CENTER.PLEASE_LOGIN_FIRST, 2, () => history.push('/login'));
      return
    }
    personStore.getUserInfo();
  }

  onBack = () => {
    const {history} = this.props;
    history.push('/home');
  };

  logout = () => {
    const {localeStore: {locale}} = this.props;
    const {USER_CENTER} = locale;
    const {history, userStore} = this.props;
    // 调取退出登录接口
    Modal.alert(USER_CENTER.IS_LOGOUT, '', [
      {
        text: USER_CENTER.CANCEL,
        style: 'default'
      },
      {
        text: USER_CENTER.CONFIRM,
        onPress: () => {
          userStore.logout()
          history.push('/')
        }
      }
    ]);
  };

  render() {
    const {history, personStore, localeStore: {locale}} = this.props;
    const {userInfo} = personStore;
    const {showFModal, showActiveModal} = this.state;
    const {USER_CENTER} = locale;

    return (
      <div id="user-center">
        <section className="banner">
          <SimpleHeader
            title={USER_CENTER.USER_CENTER}
            bgColor="transparent"
            onHandle={() => this.onBack()}
          />
          <div className="user-box">
            <img src={ASSET_USER.USER_ICON} alt=""/>
            <p>{userInfo.email || userInfo.phoneNo}</p>
            <div className="tags">
              {/*<span*/}
              {/*className={`positive ${userInfo.isF && 'active'}`}*/}
              {/*onClick={() => this.setState({showFModal: true})}*/}
              {/*>*/}
              {/*<img src={userInfo.isGold !== 0 ? ASSET_USER.POSITIVE_PRE_ICON : ASSET_USER.POSITIVE_ICON} alt=""/>*/}
              {/*{USER_CENTER.GOLD_MEMBER}*/}
              {/*</span>*/}
              <span
                className={`positive ${userInfo.isF && 'active'}`}
                onClick={() => this.setState({showFModal: true})}
              >
                <img src={userInfo.isF ? ASSET_USER.POSITIVE_PRE_ICON : ASSET_USER.POSITIVE_ICON}
                     alt=""/>
                {USER_CENTER.ACTIVE}
              </span>
              <span
                className={`valid ${userInfo.isActive && 'active'}`}
                onClick={() => this.setState({showActiveModal: true})}
              >
                <img src={userInfo.isActive ? ASSET_USER.VALID_PRE_ICON : ASSET_USER.VALID_ICON}
                     alt=""/>
                {USER_CENTER.EFFECTIVE}
              </span>
            </div>
          </div>
        </section>
        <section className="menu-list">
          <ul>
            <li onClick={() => history.push('/notices')}>
              <img src={ASSET_USER.USER_NOTICE} alt=""/>
              <br/>
              {USER_CENTER.NOTICE_LIST}
            </li>
            <li onClick={() => history.push('/account')}>
              <img src={ASSET_USER.USER_SAFE} alt=""/>
              <br/>
              {USER_CENTER.ACCOUNT_SAFE}
            </li>
            <li onClick={() => history.push('/home/inviter-friend')}>
              <img src={ASSET_USER.USER_INVITE} alt=""/>
              <br/>
              {USER_CENTER.INVITER_FRIEND}
            </li>
            <li onClick={() => history.push('/contact-us')}>
              <img src={ASSET_USER.USER_CUSTOMER} alt=""/>
              <br/>
              {USER_CENTER.CONTACT_US}
            </li>
            <li onClick={() => history.push('/termination')}>
              <img src={ASSET_USER.USER_TERMINATION} alt=""/>
              <br/>
              {USER_CENTER.TERMINATION}
            </li>
            <li onClick={() => history.push('/lang-switch')}>
              <img src={ASSET_USER.USER_LANG} alt=""/>
              <br/>
              {USER_CENTER.LANG_SWITCH}
            </li>
            <li onClick={this.logout}>
              <img src={ASSET_USER.USER_LOGOUT} alt=""/>
              <br/>
              {USER_CENTER.LOGOUT}
            </li>
          </ul>
        </section>

        <Modal
          visible={showFModal}
          className="f-modal"
          closable
          maskClosable
          transparent
          title={USER_CENTER.ACTIVE_EXPLAIN}
          onClose={() => this.setState({showFModal: false})}
        >
          <div
            style={{
              fontSize: '1.5rem',
              textAlign: 'justify',
              paddingBottom: '10px'
            }}
          >
            <p>{USER_CENTER.ACTIVE_REMARK}</p>
            {userInfo.isF && (
              <p style={{color: '#ff8147'}}>
                {USER_CENTER.ACTIVE_OUT_TIME}：{userInfo.isFTime}
              </p>
            )}
          </div>
        </Modal>
        <Modal
          visible={showActiveModal}
          className="f-modal"
          closable
          maskClosable
          transparent
          title={USER_CENTER.EFFECTIVE_EXPLAIN}
          onClose={() => this.setState({showActiveModal: false})}
        >
          <div
            style={{
              fontSize: '1.5rem',
              textAlign: 'justify',
              paddingBottom: '10px'
            }}
          >
            <p>{USER_CENTER.EFFECTIVE_REMARK}</p>
            {userInfo.isActive && (
              <p style={{color: '#ff8147'}}>
                {USER_CENTER.EFFECTIVE_OUT_TIME}：{userInfo.isActiveTime}
              </p>
            )}
          </div>
        </Modal>
      </div>
    )
  }
}

export default UserCenter
