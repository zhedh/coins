import {observable, action, computed} from 'mobx'
import languages from '../locales'

class LocaleStore {
  @observable locale;

  @computed
  get language() {
    return languages[this.locale] || languages.en_US
  }

  @action
  getNotice(id) {
    // return OtherApi.getNoticeDetail({id})
  }
}

export default LocaleStore
