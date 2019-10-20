import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { COUNTRIES_LIST } from '../../utils/constants'
import Header from '../../components/common/Header'
import './VerifiedCountry.scss'

@inject('CertificationStore')
@observer
class VerifiedCountry extends Component {
  selectCountry = () => {
    const { history, CertificationStore } = this.props
    const { country } = CertificationStore.authInfo
    history.push('/verified-identity/' + country)
  }

  render() {
    const { CertificationStore } = this.props
    const { country } = CertificationStore.authInfo
    const selectedCountry = country

    return (
      <div id="verified-country">
        <Header
          title="选择国家"
          icon={require('../../assets/images/arrow-left-1.png')}
          isFixed
          bgPrimary
        >
          <p className="next-step" onClick={() => this.selectCountry()}>
            下一步
          </p>
        </Header>

        <ul className="country-list">
          {COUNTRIES_LIST.map((country, key) => (
            <li
              key={key.toString()}
              onClick={() =>
                CertificationStore.changeInfoItem(country, 'country')
              }
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
