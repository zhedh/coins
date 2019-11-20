import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {USER} from '../../assets/static'
import {Modal, Toast} from 'antd-mobile'
import {PersonApi} from "../../api"
import SimpleHeader from '../../components/common/SimpleHeader'
import './UserCenter.scss'

@inject('userStore')
@inject('personStore')
@inject('productStore')
@observer
class UserCenter extends Component {
  state = {
    showGoldModal: false,
    showFModal: false,
    showActiveModal: false,
  }

  componentDidMount() {
    const {history, personStore, userStore} = this.props

    if (!userStore.isOnline()) {
      Toast.info('请先登录', 2, () => history.push('/login'))
      return
    }
    personStore.getUserInfo()
  }

  joinGoldClub = () => {
    this.setState({showGoldModal: false})
    Modal.alert(null, '您是否确定成为黄金用户？', [{
      text: '否'
    }, {
      text: '是',
      onPress: () => {
        const {productStore, personStore} = this.props

        productStore.getProductId().then(productId => {
          return PersonApi.joinGoldClub({productId})
        }).then(res => {
          if (res.status !== 1) {
            Toast.info(res.msg)
            return
          }
          Toast.info('恭喜您成为黄金会员', 2, () => personStore.getUserInfo())
        })
      }
    }])
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
    const {showGoldModal, showFModal, showActiveModal} = this.state

    return (
      <div id="user-center">
        <section className="banner">
          <SimpleHeader
            title="个人中心"
            bgColor="transparent"
          />
          <div className="user-box">
            <img src={USER.USER_ICON} alt=""/>
            <p>{userInfo.email || userInfo.phoneNo}</p>
            <div className="tags">
              <span
                className={`positive ${userInfo.isF && 'active'}`}
                onClick={() => this.setState({showGoldModal: true})}
              >
                <img src={userInfo.isGold !== 0 ? USER.GOLD_PRE_ICON : USER.GOLD_ICON}
                     alt=""/>
                黄金会员
              </span>
              <span
                className={`positive ${userInfo.isF && 'active'}`}
                onClick={() => this.setState({showFModal: true})}
              >
                <img src={userInfo.isF ? USER.POSITIVE_PRE_ICON : USER.POSITIVE_ICON} alt=""/>
                活跃
              </span>
              <span
                className={`valid ${userInfo.isActive && 'active'}`}
                onClick={() => this.setState({showActiveModal: true})}
              >
                <img src={userInfo.isActive ? USER.VALID_PRE_ICON : USER.VALID_ICON} alt=""/>
                有效
              </span>
            </div>
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
          visible={showGoldModal}
          className="f-modal"
          transparent
          maskClosable={true}
          onClose={() => this.setState({showGoldModal: false})}
          title="黄金会员说明"
        >
          <div className="antd-modal">
            <div>
              XC余额大于等于200XC或当前有参加计划中的排单，即可成为黄金会员，成为黄金会员后，即可随意参与计划。
              {userInfo.isGold !== 0 ?
                <aside className="primary-color">
                  当前您已是黄金会员。
                </aside>
                :
                <aside className="btn-box">
                  <button onClick={this.joinGoldClub}>成为黄金会员</button>
                </aside>
              }
            </div>
          </div>
        </Modal>

        <Modal
          visible={showFModal}
          className="f-modal"
          closable
          maskClosable
          transparent
          title="活跃用户说明"
          onClose={() => this.setState({showFModal: false})}
        >
          <div className="antd-modal">
            <p>
              活跃用户：当您参与计划成功后可变成活跃用户，活跃用户有效为三个交易日。
            </p>
            {
              userInfo.isF &&
              <p style={{color: '#ff8147'}}>
                当前您的活跃用户到期时间：{userInfo.isFTime}
              </p>
            }
          </div>
        </Modal>
        <Modal
          visible={showActiveModal}
          className="f-modal"
          closable
          maskClosable
          transparent
          title="用户标示说明"
          onClose={() => this.setState({showActiveModal: false})}
        >
          <div className="antd-modal">
            <p>
              有效用户：在参与计划中有排单即为有效用户，没有参与计划中排单则不为有效用户。
            </p>
            {
              userInfo.isActive &&
              <p style={{color: '#ff8147'}}>
                当前您的有效用户到期时间：{userInfo.isActiveTime}
              </p>
            }
          </div>
        </Modal>
      </div>
    )
  }
}

export default UserCenter
