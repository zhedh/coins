import React, {Component} from 'react'
import {Button} from 'antd-mobile'
import {inject, observer} from 'mobx-react'
import './404.scss'

@inject('localeStore')
@observer
class NoMatch extends Component {
  // componentDidMount() {
  //   // const { history,localeStore: {
  //   locale: { EXCEPTION }
  // } } = this.props
  //   // Toast.info(EXCEPTION.UN_PAGE_TO_JUMP, TOAST_DURATION, () =>
  //   //   // history.push('/home')
  //   // )
  // }

  render() {
    const {
      history,
      localeStore: {locale: {EXCEPTION}}
    } = this.props
    return (
      <div className="no">
        <img
          src="https://cdn.cnviinet.com/static/404-201904230233.jpg"
          alt=""
        />
        <p className="sorry">{EXCEPTION.PAGE_NO_FOUND}</p>

        <Button
          className="goBack"
          onClick={() => history.goBack()}
        >
          {EXCEPTION.BACK_PREV_PAGE}
        </Button>
      </div>
    )
  }
}

export default NoMatch
