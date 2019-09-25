import React, {Component} from 'react'
import {inject, observer} from "mobx-react"
import Header from '../../components/common/Header'
import {formatTime} from "../../utils/format";
import NoData from "../../components/common/NoData";
import './Notices.scss'

@inject('noticeStore')
@observer
class Notices extends Component {

  componentDidMount() {
    const {noticeStore} = this.props
    noticeStore.getNotices()
  }

  render() {
    const {history, noticeStore} = this.props

    return (
      <div id="notices">
        <Header
          title="公告列表"
          isShadow
          isFixed
          bgWhite
          onHandle={() => history.push('/user-center')}
        />
        <section>
          {noticeStore.notices.length ? (
            noticeStore.notices.map(notice => (
              <ul
                key={notice.id}
                className="list-item"
                // onClick={() => window.location.href = notice.linkUrl}
                onClick={() => history.push('/notice/' + notice.id)}
              >
                <li>{notice.title}</li>
                <li>{formatTime(notice.addTime)}</li>
              </ul>
            ))
          ) : (
            <NoData msg="暂无数据"/>
          )}
        </section>
      </div>
    )
  }
}

export default Notices
