import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {USER} from '../../assets/static'
import {Modal, Toast} from 'antd-mobile'
import {FaRegQuestionCircle} from 'react-icons/fa'
import SimpleHeader from '../../components/common/SimpleHeader'
import './UserCenter.scss'

@inject('userStore')
@inject('personStore')
@observer
class UserCenter extends Component {
  state = {showFModal: false}

  componentDidMount() {
    const {history, personStore, userStore} = this.props

    if (!userStore.isOnline()) {
      Toast.info('请先登录', 2, () => history.push('/login'))
      return
    }
    personStore.getUserInfo()
  }

  onBack = () => {
    const {history} = this.props
    history.push('/home')
  }

  logout = () => {
    const {history, userStore} = this.props
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

  render() {
    const {history, personStore} = this.props
    const {userInfo} = personStore
    const {showFModal} = this.state

    return (
      <div id="user-center">
        <section className="banner">
          <SimpleHeader
            title="个人中心"
            bgColor="transparent"
            onHandle={() => this.onBack()}
          />
          <div className="user-box">
            <img src={USER.USER_ICON} alt=""/>
            <p>{userInfo.email || userInfo.phoneNo}</p>
            <div className="tags">
              <span className={`positive ${userInfo.isF && 'active'}`}>
                <img src={userInfo.isF ? USER.POSITIVE_PRE_ICON : USER.POSITIVE_ICON} alt=""/>
                活跃
              </span>
              <span className={`valid ${userInfo.isActive && 'active'}`}>
                <img src={userInfo.isActive ? USER.VALID_PRE_ICON : USER.VALID_ICON} alt=""/>
                有效
              </span>
            </div>
          </div>
          <div
            className="tip"
            onClick={() => this.setState({showFModal: true})}
          >
            <span>活跃用户到期时间：{userInfo.isFTime}</span>
            <span>
              用户标示说明&nbsp;
              <FaRegQuestionCircle/>
            </span>
          </div>
        </section>
        <section className="menu-list">
          <ul>
            <li onClick={() => history.push('/notices')}>
              <img src={USER.USER_NOTICE} alt=""/>
              <br/>
              公告列表
            </li>
            <li onClick={() => history.push('/account')}>
              <img src={USER.USER_SAFE} alt=""/>
              <br/>
              账户安全
            </li>
            <li onClick={() => history.push('/home/inviter-friend')}>
              <img src={USER.USER_INVITE} alt=""/>
              <br/>
              邀请好友
            </li>
            <li onClick={() => history.push('/contact-us')}>
              <img src={USER.USER_CUSTOMER} alt=""/>
              <br/>
              联系客服
            </li>
            <li onClick={this.logout}>
              <img src={USER.USER_LOGOUT} alt=""/>
              <br/>
              退出登录
            </li>
          </ul>
        </section>

        <Modal
          visible={showFModal}
          className="f-modal"
          closable
          maskClosable
          transparent
          title="用户标示说明"
          onClose={() => this.setState({showFModal: false})}
        >
          <div
            style={{
              fontSize: '1.5rem',
              textAlign: 'justify',
              paddingBottom: '10px'
            }}
          >
            <p>
              活跃用户：当您参与计划成功后可变成活跃用户，活跃用户有效为三个交易日。
            </p>
            <p>
              {' '}
              有效用户：在参与计划中有排单即为有效用户，没有参与计划中排单则不为有效用户。
            </p>
          </div>
        </Modal>
      </div>
    )
  }
}

export default UserCenter
