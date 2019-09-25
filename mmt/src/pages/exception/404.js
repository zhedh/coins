import React, { Component } from 'react'
import { inject } from 'mobx-react'
import { Toast } from 'antd-mobile'
import { TOAST_DURATION } from '../../utils/constants'

@inject('localeStore')
class NoMatch extends Component {
  componentDidMount() {
    const { history, localeStore } = this.props
    const { TOAST } = localeStore.language || {}
    Toast.info(TOAST.PAGE_NOT_AND_TO_HOME, TOAST_DURATION, () =>
      history.push('/home')
    )
  }

  render() {
    return <div></div>
  }
}

export default NoMatch
