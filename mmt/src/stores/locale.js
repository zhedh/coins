import {observable, action, computed} from 'mobx'
import languages from '../locales'

class LocaleStore {
  @observable locale = 'zh_CN';

  @computed
  get language() {
    return languages[this.locale] || languages.en_US
  }

  @action
  changeLocale(locale) {
    this.locale = locale
    localStorage.setItem('LOCALE', locale)
  }

  @action
  getLocale() {
    this.locale = localStorage.getItem('LOCALE') || 'zh_CN'
  }
}

export default LocaleStore
