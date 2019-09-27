import React, {Component, Fragment} from 'react'
import {Button, Toast} from 'antd-mobile'
import {inject, observer} from 'mobx-react'
import {AUTH} from '../../assets/static'
import Header from '../../components/common/Header'
import {COUNTRIES_LIST, TOAST_DURATION} from '../../utils/constants'
import './VerifiedIdentity.scss'

const typeList = [
  {
    name: '身份证',
    icon: require('../../assets/images/common/auth-id-card.svg'),
    active: AUTH.IMG_ID_CARD
  },
  {
    name: '护照',
    icon: require('../../assets/images/common/auth-passport.svg'),
    active: AUTH.IMG_PASSPORT
  },
  {
    name: '驾照',
    icon: require('../../assets/images/common/auth-driving.svg'),
    active: AUTH.IMG_DRIVING
  }
]

@inject('authStore')
@observer
class VerifiedIdentity extends Component {
  state = {
    isChina: true,
    activeType: null,
    userName: '',
    idCard: '',
    firstName: '',
    lastName: '',
    cardNumber: ''
  }

  componentDidMount() {
    const {authStore, match} = this.props
    const {country} = match.params
    if (country) {
      this.setState({isChina: country === COUNTRIES_LIST[0]})
      authStore.changeInfoItem(country, 'country')
    }
  }

  canSubmit = () => {
    const {authStore} = this.props
    const {
      country,
      cardType,
      firstName,
      lastName,
      cardId
    } = authStore.authInfo
    const {isChina} = this.state
    return isChina
      ? firstName && cardId
      : country && cardType && firstName && lastName && cardId
  }

  onSubmit = () => {
    const {history, authStore} = this.props
    const {cardId} = authStore.authInfo
    if (cardId.length < 7 && cardId.length <= 18) {
      Toast.info('请输入7-18位证件号码', TOAST_DURATION)
      return
    }
    authStore.submitAuthentication().then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg, TOAST_DURATION)
        return
      }
      history.push('/verified-upload')
    })
  }

  render() {
    const {authStore} = this.props
    const {cardType, firstName, lastName, cardId} = authStore.authInfo
    const {isChina} = this.state

    return (
      <div id="verified-identity">
        <Header/>
        <div className="identity-top">
          <img src={require('../../assets/images/identity.png')} alt=""/>
          <h2>填写信息</h2>
          <p>确认所填信息与证件一致</p>
        </div>
        <div className="identity-bottom">
          {isChina ? (
            <div className="identity-bottom__input input-center">
              <input
                type="text"
                maxLength={70}
                placeholder="您的姓名"
                value={firstName}
                onChange={e =>
                  authStore.changeInfoItem(e.target.value, 'firstName')
                }
              />
              <input
                type="text"
                placeholder="身份证号"
                value={cardId}
                onChange={e => {
                  authStore.changeInfoItem('身份证', 'cardType')
                  authStore.changeInfoItem(e.target.value, 'cardId')
                }}
              />
            </div>
          ) : (
            <Fragment>
              <label>您可以选择一下验证方式</label>
              <ul className="identity-bottom__type">
                {typeList.map(type => (
                  <li
                    key={type.name}
                    className={cardType === type.name ? 'active' : ''}
                    onClick={() =>
                      authStore.changeInfoItem(type.name, 'cardType')
                    }
                  >
                    <img
                      src={cardType === type.name ? type.active : type.icon}
                      alt=""
                    />
                    <br/>
                    <small>{type.name}</small>
                  </li>
                ))}
              </ul>
              <div className="identity-bottom__input">
                <input
                  type="text"
                  maxLength={70}
                  placeholder="姓"
                  value={firstName}
                  onChange={e =>
                    authStore.changeInfoItem(e.target.value, 'firstName')
                  }
                />
                <input
                  type="text"
                  maxLength={70}
                  placeholder="名"
                  value={lastName}
                  onChange={e =>
                    authStore.changeInfoItem(e.target.value, 'lastName')
                  }
                />
                <input
                  type="text"
                  maxLength={18}
                  placeholder="证件号"
                  value={cardId}
                  onChange={e =>
                    authStore.changeInfoItem(e.target.value, 'cardId')
                  }
                />
              </div>
            </Fragment>
          )}
        </div>
        <Button
          activeClassName="active"
          className="primary-button"
          disabled={!this.canSubmit()}
          onClick={this.onSubmit}>
          下一步
        </Button>
      </div>
    )
  }
}

export default VerifiedIdentity
