import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import Header from '../../components/common/Header'
import AuthBanner from '../../assets/images/xc/auth-advantage.png'
import './ZbxLogin.scss'
import {CONFIG} from "../../config";

@inject('localeStore')
@observer
class Index extends Component {
  onZbxLogin = () => {
    window.location.href = CONFIG.XC_AUTH_URL
  };

  render() {
    const {localeStore: {locale: {AUTH_LOGIN}}} = this.props;

    return (
      <div id="zbx-Login">
        <Header bgWhite isFixed isShadow title={AUTH_LOGIN.SELECT_AUTH_WAY}/>
        <div className="main-content">
          <img className="banner" src={AuthBanner} alt=""/>

          <div className="line zbx" onClick={this.onZbxLogin}>
            <p>{AUTH_LOGIN.AUTH_LOGIN}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Index;
