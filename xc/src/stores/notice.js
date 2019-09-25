import {observable, action, computed} from 'mobx'
import {OtherApi} from "../api";

class NoticeStore {
  @observable notices = [];

  @computed
  get newestNotice() {
    return this.notices[0]
  }

  @action
  getNotices() {
    OtherApi.getNotices().then(res => {
      if (res.status === 1) this.notices = res.data
    })
  }

  @action
  getNotice(id) {
    return OtherApi.getNoticeDetail({id})
  }
}

export default NoticeStore
