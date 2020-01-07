import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import Header from "../../components/common/Header";
import {USER} from "../../assets/static";
import './LangSwitch.scss'

@inject('localeStore')
@observer
class LangSwitch extends Component {


  render() {
    const {history, localeStore} = this.props;
    const {languages, lang} = localeStore;
    return (
      <div id="lang-switch">
        <Header
          title="语言切换"
          isShadow
          isFixed
          bgPrimary
          onHandle={() => history.push('/user-center')}
        />
        <ul className="list">
          {
            languages.map(language =>
              <li key={language.value} onClick={() => localeStore.switchLang(language.value)}>
                <span>{language.label}</span>
                {language.value === lang && <img src={USER.ICON_LANG_SELECTED} alt=""/>}
              </li>
            )
          }
        </ul>
      </div>
    )
  }
}

export default LangSwitch
