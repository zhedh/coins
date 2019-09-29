import React, { Component } from 'react'
import { Button } from 'antd-mobile'
import './404.scss'

class NoMatch extends Component {
  // componentDidMount() {
  //   // const { history } = this.props
  //   // Toast.info('页面不存在，正在跳转首页', TOAST_DURATION, () =>
  //   //   // history.push('/home')
  //   // )
  // }

  render() {
    const { history } = this.props

    return (
      <div className="no">
        <img
          src="https://cdn.cnviinet.com/static/404-201904230233.jpg"
          alt=""
        />
        <p className="sorry">页面找不到了</p>

        <Button
          className="goBack"
          onClick={() => {
            history.goBack()
          }}
        >
          返回上一页
        </Button>
      </div>
    )
  }
}

export default NoMatch
