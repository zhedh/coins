import React, { Component } from 'react'
import { Button, Toast } from 'antd-mobile'
import { inject, observer } from 'mobx-react'
import { AUTH } from '../../assets/static'
import Header from '../../components/common/Header'
import './VerifiedResult.scss'

const resultOptions = [
  {
    type: 1,
    label: '等待审核',
    image: AUTH.IMG_WAIT
  },
  {
    type: 2,
    label: '已审核',
    image: AUTH.IMG_SUCCESS
  },
  {
    type: 3,
    label: '失败',
    image: AUTH.IMG_FAIL
  }
]
@inject('localeStore')
@inject('personStore')
@observer
class VerifiedResult extends Component {
  state = {
    resultOption: resultOptions[0]
  }

  componentDidMount() {
    const { personStore } = this.props
    personStore.getUserInfo().then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg)
      }
      const { authentication } = personStore.userInfo
      const resultOption =
        resultOptions.find(option => option.type === authentication) ||
        resultOptions[0]
      this.setState({ resultOption })
    })
  }

  render() {
    const { history, localeStore } = this.props
    const { AUTH } = localeStore.language || {}
    const { resultOption } = this.state
    return (
      <div id="verified-result">
        <Header onHandle={() => history.push('/user-center')} />
        <img className="result-img" alt="结果图片" src={resultOption.image} />

        {resultOption.type === 1 && (
          <div className="result-content">
            <div className="submit-success">{AUTH.SUBMIT_AND_WAIT}</div>
            <div className="submit-small">{AUTH.RESULT_MSG}</div>
          </div>
        )}
        {resultOption.type === 2 && (
          <div className="result-content">
            <div className="verified-success">{AUTH.CERTIFICATE_PASSED}</div>
          </div>
        )}
        {resultOption.type === 3 && (
          <div className="result-content">
            <div className="verified-fail">{AUTH.VERIFICATION_FAILED}</div>
            <br />
            <Button
              activeClassName="btn-common__active"
              className={`btn-common btn-common__bottom`}
              onClick={() => history.push('/verified-country')}
            >
              {AUTH.CONTINUE_TO_VERIFY}
            </Button>
          </div>
        )}
      </div>
    )
  }
}

export default VerifiedResult
