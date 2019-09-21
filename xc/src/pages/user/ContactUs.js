import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {USER} from '../../assets/static'
import Header from '../../components/common/Header'
import './ContactUs.scss'

@inject('userStore')
@observer
class ContactUs extends Component {
  render() {
    const {history} = this.props
    return (
      <div id="contact-us">
        <Header
          title="联系我们"
          isShadow={true}
          onHandle={() => history.push('/user-center')}
        />
        <ul>
          {USER.CUSTOMERS.map(i => <li>
            <label>{i.LABEL}：</label>
            <span>{i.VALUE}</span>
          </li>)}
        </ul>
      </div>
    )
  }
}

export default ContactUs
