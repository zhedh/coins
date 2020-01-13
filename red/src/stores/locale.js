import {observable, action, computed} from 'mobx'
import locales from '../locales'

class LocaleStore {
  @observable lang = 'zh-cn';
  @observable languages = [
    {
      label: '中文',
      value: 'zh-cn',
    }, {
      label: 'English',
      value: 'en-us',
    }, {
      label: '한국어',
      value: 'ko-kr',
    },
  ];

  @computed
  get locale() {
    return locales[this.lang] || locales['zh-cn']
  }

  @action
  switchLang(lang) {
    this.lang = lang;
    localStorage.setItem('LANG', lang);
  }

  @action
  getLang() {
    this.lang = localStorage.getItem('LANG') || 'zh-cn';
  }
}

export default LocaleStore
