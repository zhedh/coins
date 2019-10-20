import React, { Component, Fragment } from 'react'
import { Button, Toast } from 'antd-mobile'
import { inject, observer } from 'mobx-react'
import { AUTH } from '../../assets/static'
import Header from '../../components/common/Header'
import { COUNTRIES_LIST, TOAST_DURATION } from '../../utils/constants'
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

@inject('CertificationStore')
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
    const { CertificationStore, match } = this.props
    const { country } = match.params
    if (country) {
      this.setState({ isChina: country === COUNTRIES_LIST[0] })
      CertificationStore.changeInfoItem(country, 'country')
    }
  }

  canSubmit = () => {
    const { CertificationStore } = this.props
    const {
      country,
      cardType,
      firstName,
      lastName,
      cardId
    } = CertificationStore.authInfo
    const { isChina } = this.state
    return isChina
      ? firstName && cardId
      : country && cardType && firstName && lastName && cardId
  }

  onSubmit = () => {
    const { history, CertificationStore } = this.props
    const { cardId } = CertificationStore.authInfo
    if (cardId.length < 7 && cardId.length <= 18) {
      Toast.info('请输入7-18位证件号码', TOAST_DURATION)
      return
    }
    CertificationStore.submitAuthentication().then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg, TOAST_DURATION)
        return
      }
      history.push('/verified-upload')
    })
  }

  render() {
    const { CertificationStore } = this.props
    const {
      cardType,
      firstName,
      lastName,
      cardId
    } = CertificationStore.authInfo
    const { isChina } = this.state

    return (
      <div id="verified-identity">
        <Header bgPrimary />
        <div className="identity-top">
          <h2>填写信息</h2>
          <p>确认所填信息与证件一致</p>
          {!isChina && <label>您可以选择一下验证方式</label>}
          {/* <img src={require('../../assets/images/identity.png')} alt="" /> */}
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
                  CertificationStore.changeInfoItem(e.target.value, 'firstName')
                }
              />
              <input
                type="text"
                placeholder="身份证号"
                value={cardId}
                onChange={e => {
                  CertificationStore.changeInfoItem('身份证', 'cardType')
                  CertificationStore.changeInfoItem(e.target.value, 'cardId')
                }}
              />
            </div>
          ) : (
            <Fragment>
              <ul className="identity-bottom__type">
                {typeList.map(type => (
                  <li
                    key={type.name}
                    className={cardType === type.name ? 'active' : ''}
                    onClick={() =>
                      CertificationStore.changeInfoItem(type.name, 'cardType')
                    }
                  >
                    <img
                      src={cardType === type.name ? type.active : type.icon}
                      alt=""
                    />
                    <br />
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
                    CertificationStore.changeInfoItem(
                      e.target.value,
                      'firstName'
                    )
                  }
                />
                <input
                  type="text"
                  maxLength={70}
                  placeholder="名"
                  value={lastName}
                  onChange={e =>
                    CertificationStore.changeInfoItem(
                      e.target.value,
                      'lastName'
                    )
                  }
                />
                <input
                  type="text"
                  maxLength={18}
                  placeholder="证件号"
                  value={cardId}
                  onChange={e =>
                    CertificationStore.changeInfoItem(e.target.value, 'cardId')
                  }
                />
              </div>
            </Fragment>
          )}
        </div>
        <Button
          activeClassName="active"
          className={`primary-button ${
            !this.canSubmit() ? 'btn-disabled' : ''
          }`}
          disabled={!this.canSubmit()}
          onClick={this.onSubmit}
        >
          下一步
        </Button>
      </div>
    )
  }
}

export default VerifiedIdentity
