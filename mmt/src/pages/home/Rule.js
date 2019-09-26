import React, { Component } from 'react'
import { Toast } from 'antd-mobile'
import { inject } from 'mobx-react'
import Header from '../../components/common/Header'
import OtherApi from '../../api/other'
import './Rule.scss'
@inject('localeStore')
class Rule extends Component {
  state = {
    content: ''
  }

  componentDidMount() {
    this.getRules()
  }

  getRules = () => {
    OtherApi.getRules().then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg)
        return
      }
      this.setState({ content: res.data[0].content })
    })
  }

  render() {
    const { localeStore } = this.props
    const { HOME } = localeStore.language || {}
    const { content } = this.state
    return (
      <div id="rule">
        <Header title={`MUSDT ${HOME.RULES}`} isFixed isShadow bgWhite />
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    )
  }
}

export default Rule
