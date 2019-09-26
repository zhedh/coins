import React, { Component } from 'react'
import { Toast } from 'antd-mobile'
import { inject } from 'mobx-react'
import OtherApi from '../../api/other'
import { chineseCapital } from '../../utils/common'
import { formatTime } from '../../utils/format'
import Header from '../../components/common/Header'
import NoData from '../../components/common/NoData'
import './GeneralizeDetail.scss'
@inject('localeStore')
class GeneralizeDetail extends Component {
  state = {
    title: '一代推荐',
    users: []
  }

  componentDidMount() {
    const { match, localeStore } = this.props
    const { HOME } = localeStore.language || {}
    const { id } = match.params
    this.setState({ title: chineseCapital(id) + HOME.GENERATION_REFERRALS })
    this.getSpreadList(id)
  }

  getSpreadList = id => {
    OtherApi.getSpreadList({
      type: id
    }).then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg)
        return
      }
      this.setState({ users: res.data })
    })
  }

  render() {
    const { localeStore } = this.props
    const { HOME, COMMON } = localeStore.language || {}
    const { title, users } = this.state
    const hasUsers = users && users.length > 0

    return (
      <div id="generalize-detail">
        <Header title={title} isShadow isFixed />
        {hasUsers ? (
          <ul>
            <li>
              <span>{HOME.MEMBERS}</span>
              <time>{HOME.REFERRING_DATE}</time>
            </li>
            {users.map(user => (
              <li key={user.regTime}>
                <span>{user.phoneNo || user.email}</span>
                <time>{formatTime(user.regTime)}</time>
              </li>
            ))}
          </ul>
        ) : (
          <NoData msg={COMMON.NO_DATA} />
        )}
      </div>
    )
  }
}

export default GeneralizeDetail
