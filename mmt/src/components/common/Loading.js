import { Component } from 'react'
import { inject } from 'mobx-react'
import { Toast } from 'antd-mobile'
import React from 'react'

@inject('localeStore')
class Loading extends Component {
  componentDidMount() {
    const { localeStore } = this.props
    const { TOAST } = localeStore.language || {}

    Toast.loading(TOAST.LOADING)
  }

  componentWillUnmount() {
    Toast.hide()
  }

  render() {
    return <div></div>
  }
}

export default Loading
