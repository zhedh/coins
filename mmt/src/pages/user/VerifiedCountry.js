import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { COUNTRIES_LIST } from '../../utils/constants'
import Header from '../../components/common/Header'
import './VerifiedCountry.scss'

@inject('authStore')
@inject('localeStore')
@observer
class VerifiedCountry extends Component {
  selectCountry = () => {
    const { history, authStore } = this.props
    const { country } = authStore.authInfo
    history.push('/verified-identity/' + country)
  }

  render() {
    const { authStore, localeStore } = this.props
    const { country } = authStore.authInfo
    const { USER_CENTER, COMMON } = localeStore.language || {}
    const selectedCountry = country

    return (
      <div id="verified-country">
        <Header title={USER_CENTER.CHANGE_COUNTRY} isFixed bgWhite>
          <p className="next-step" onClick={() => this.selectCountry()}>
            {COMMON.NEXT_STEP}
          </p>
        </Header>

        <ul className="country-list">
          {COUNTRIES_LIST.map((country, key) => (
            <li
              key={key.toString()}
              onClick={() => authStore.changeInfoItem(country, 'country')}
            >
              <span>{country}</span>
              {selectedCountry === country && (
                <img
                  src={require('../../assets/images/select-country.png')}
                  alt=""
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default VerifiedCountry
