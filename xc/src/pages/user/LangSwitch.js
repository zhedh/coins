import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Header from '../../components/common/Header'
import { ASSET_USER } from '../../assets/static'
import './LangSwitch.scss'

@inject('localeStore')
@observer
class LangSwitch extends Component {
  changeLang = lang => {
    const { history, localeStore } = this.props
    localeStore.switchLang(lang)
    setTimeout(() => {
      history.push('/user-center')
    }, 500)
  }

  render() {
    const {
      history,
      localeStore: {
        locale: { USER_CENTER },
        languages,
        lang
      }
    } = this.props
    return (
      <div id="lang-switch">
        <Header
          title={USER_CENTER.LANG_SWITCH}
          isShadow
          isFixed
          bgPrimary
          onHandle={() => history.push('/user-center')}
        />
        <ul className="list">
          {languages.map(language => (
            <li
              key={language.value}
              onClick={() => this.changeLang(language.value)}
            >
              <span>{language.label}</span>
              {language.value === lang && (
                <img src={ASSET_USER.ICON_LANG_SELECTED} alt="" />
              )}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default LangSwitch
