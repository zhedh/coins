import React, {Component} from 'react'
import {withRouter} from "react-router";
import {inject, observer} from "mobx-react";
import './AccountLangHeader.scss'

@inject('localeStore')
@observer
class AccountLangHeader extends Component {
  onBack = () => {
    const {history, onBack} = this.props;
    if (onBack) {
      onBack();
      return
    }
    history.goBack();
  };

  changeLang = (lang) => {
    const {localeStore} = this.props;
    localeStore.switchLang(lang);
  };

  render() {
    const {localeStore: {languages}} = this.props

    return (
      <div className="account-lang__header">
        <img
          src={require('../../assets/images/arrow-left.png')}
          alt="返回"
          onClick={this.onBack}
        />
        <ul>
          {
            languages.map(language =>
              <li key={language.value} onClick={() => this.changeLang(language.value)}>
                <span>{language.label}</span>
                <b>/</b>
              </li>
            )
          }
        </ul>
      </div>
    );
  }
}

export default withRouter(AccountLangHeader)
