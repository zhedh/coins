import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Toast} from 'antd-mobile'
import Header from '../../components/common/Header'
import './NoticeDetail.scss'

@inject('noticeStore')
@inject('localeStore')
@observer
class NoticeDetail extends Component {
  state = {content: ''};

  componentDidMount() {
    const {noticeStore, match} = this.props;
    const {id} = match.params;
    noticeStore.getNotice(id).then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg)
      }
      this.setState({content: res.data.content})
    })
  }

  render() {
    const {content} = this.state;
    const {localeStore: {locale: {NOTICE_DETAIL}}} = this.props;

    return (
      <div className="notice-detail">
        <Header title={NOTICE_DETAIL.TITLE} isShadow isFixed bgWhite/>
        {content && (
          <div
            className="htmlContent"
            dangerouslySetInnerHTML={{__html: `<div>${content}</div>`}}
          />
        )}
      </div>
    )
  }
}

export default NoticeDetail
