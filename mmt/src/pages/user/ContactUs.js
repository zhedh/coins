import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { USER } from '../../assets/static'
import Header from '../../components/common/Header'
import './ContactUs.scss'

@inject('userStore')
@inject('localeStore')
@observer
class ContactUs extends Component {
  render() {
    const { history, localeStore } = this.props
    const { USER_CENTER } = localeStore.language || {}
    return (
      <div id="contact-us">
        <Header
          title={USER_CENTER.CONTACT_US}
          isShadow={true}
          onHandle={() => history.push('/user-center')}
        />
        <ul>
          {USER.CUSTOMERS.map((i, key) => (
            <li key={key.toString()}>
              <label>{i.LABEL}：</label>
              <span>{i.VALUE}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default ContactUs
