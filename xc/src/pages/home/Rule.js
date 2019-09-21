import React, {Component} from 'react'
import Header from '../../components/common/Header'
import {Toast} from 'antd-mobile'
import {OtherApi} from '../../api'
import {HOME} from "../../assets/static";
import './Rule.scss'

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
      this.setState({content: res.data[0].content})
    })
  }

  render() {
    const {content} = this.state
    return (
      <div id="rule">
        <Header title={HOME.RULE_TITLE} isFixed isShadow bgWhite/>
        <div dangerouslySetInnerHTML={{__html: content}}/>
      </div>
    )
  }
}

export default Rule
