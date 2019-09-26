import React, {Component, Fragment} from 'react'
import {Button, Toast} from 'antd-mobile'
import {inject, observer} from 'mobx-react'
import Header from '../../components/common/Header'
import {COUNTRIES_LIST, TOAST_DURATION} from '../../utils/constants'
import {AUTH_ASSET} from '../../assets'
import './VerifiedIdentity.scss'

@inject('localeStore')
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
    const {history, authStore, localeStore} = this.props
    const {TOAST} = localeStore.language || {}
    const {cardId} = authStore.authInfo
    if (cardId.length < 7 && cardId.length <= 18) {
      Toast.info(TOAST.PLEASE_INPUT_CARD_NUMBER, TOAST_DURATION)
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
    const {authStore, localeStore} = this.props
    const {TOAST, AUTH, COMMON} = localeStore.language || {}
    const {cardType, firstName, lastName, cardId} = authStore.authInfo
    const {isChina} = this.state
    const typeList = [
      {
        name: TOAST.ID_CARD,
        icon: require('../../assets/images/common/auth-id-card.svg'),
        active: AUTH_ASSET.IMG_ID_CARD
      },
      {
        name: TOAST.PASSPORT,
        icon: require('../../assets/images/common/auth-passport.svg'),
        active: AUTH_ASSET.IMG_PASSPORT
      },
      {
        name: TOAST.DRIVING_LICENSE,
        icon: require('../../assets/images/common/auth-driving.svg'),
        active: AUTH_ASSET.IMG_DRIVING
      }
    ]
    return (
      <div id="verified-identity">
        <Header/>
        <div className="identity-top">
          <img src={require('../../assets/images/identity.png')} alt=""/>
          <h2>{AUTH.INPUT_MSG}</h2>
          <p>{AUTH.CONFIRM_MSG_AND_CARD}</p>
        </div>
        <div className="identity-bottom">
          {isChina ? (
            <div className="identity-bottom__input input-center">
              <input
                type="text"
                maxLength={70}
                placeholder={AUTH.YOUR_NAME}
                value={firstName}
                onChange={e =>
                  authStore.changeInfoItem(e.target.value, 'firstName')
                }
              />
              <input
                type="text"
                placeholder={AUTH.ID_NUMBER}
                value={cardId}
                onChange={e => {
                  authStore.changeInfoItem(AUTH.ID_CARD, 'cardType')
                  authStore.changeInfoItem(e.target.value, 'cardId')
                }}
              />
            </div>
          ) : (
            <Fragment>
              <label>{AUTH.SELECT_AUTH_WAY}</label>
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
                  placeholder={AUTH.FAMILY_NAME}
                  value={firstName}
                  onChange={e =>
                    authStore.changeInfoItem(e.target.value, 'firstName')
                  }
                />
                <input
                  type="text"
                  maxLength={70}
                  placeholder={AUTH.LAST_NAME}
                  value={lastName}
                  onChange={e =>
                    authStore.changeInfoItem(e.target.value, 'lastName')
                  }
                />
                <input
                  type="text"
                  maxLength={18}
                  placeholder={AUTH.CARD_NUMBER}
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
          onClick={this.onSubmit}
        >
          {COMMON.NEXT_STEP}
        </Button>
      </div>
    )
  }
}

export default VerifiedIdentity
