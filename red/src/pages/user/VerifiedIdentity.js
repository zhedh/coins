import React, { Component, Fragment } from 'react'
import { Button, Toast } from 'antd-mobile'
import { inject, observer } from 'mobx-react'
import { AUTH } from '../../assets/static'
import Header from '../../components/common/Header'
import { COUNTRIES_LIST, TOAST_DURATION } from '../../utils/constants'
import './VerifiedIdentity.scss'

const typeList = [
  {
    name: this.props.localeStore.locale.IDENTITY_VERIFY.ID_CARD,
    icon: require('../../assets/images/common/auth-id-card.svg'),
    active: AUTH.IMG_ID_CARD
  },
  {
    name: this.props.localeStore.locale.IDENTITY_VERIFY.PASSPORT,
    icon: require('../../assets/images/common/auth-passport.svg'),
    active: AUTH.IMG_PASSPORT
  },
  {
    name: this.props.localeStore.locale.IDENTITY_VERIFY.DRIVING_LICENSE,
    icon: require('../../assets/images/common/auth-driving.svg'),
    active: AUTH.IMG_DRIVING
  }
]

@inject('CertificationStore')
@inject('localeStore')
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
    const {
      history,
      CertificationStore,
      localeStore: {
        locale: { IDENTITY_VERIFY }
      }
    } = this.props
    const { cardId } = CertificationStore.authInfo
    if (cardId.length < 7 && cardId.length <= 18) {
      Toast.info(IDENTITY_VERIFY.INPUT_REG, TOAST_DURATION)
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
    const {
      CertificationStore,
      localeStore: {
        locale: { IDENTITY_VERIFY }
      }
    } = this.props
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
          <h2>{IDENTITY_VERIFY.INPUT_MSG}</h2>
          <p>{IDENTITY_VERIFY.CONFIRM_MSG_AND_CARD}</p>
          {!isChina && <label>{IDENTITY_VERIFY.SELECT_AUTH_WAY}</label>}
          {/* <img src={require('../../assets/images/identity.png')} alt="" /> */}
        </div>
        <div className="identity-bottom">
          {isChina ? (
            <div className="identity-bottom__input input-center">
              <input
                type="text"
                maxLength={70}
                placeholder={IDENTITY_VERIFY.YOUR_NAME}
                value={firstName}
                onChange={e =>
                  CertificationStore.changeInfoItem(e.target.value, 'firstName')
                }
              />
              <input
                type="text"
                placeholder={IDENTITY_VERIFY.ID_NUMBER}
                value={cardId}
                onChange={e => {
                  CertificationStore.changeInfoItem(
                    IDENTITY_VERIFY.ID_NUMBER_01,
                    'cardType'
                  )
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
                  placeholder={IDENTITY_VERIFY.FAMILY_NAME}
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
                  placeholder={IDENTITY_VERIFY.LAST_NAME}
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
                  placeholder={IDENTITY_VERIFY.CARD_NUMBER}
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
          {IDENTITY_VERIFY.NEXT_STEP}
        </Button>
      </div>
    )
  }
}

export default VerifiedIdentity
