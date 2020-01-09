import React, { Component } from 'react'
import { Button, Toast } from 'antd-mobile'
import { inject, observer } from 'mobx-react'
import { AUTH } from '../../assets/static'
import Header from '../../components/common/Header'
import './VerifiedResult.scss'

const resultOptions = [
  {
    type: 1,
    label: this.props.localeStore.locale.VERIFY_RESULT.WAITING_FOR_REVIEW,
    image: AUTH.IMG_WAIT
  },
  {
    type: 2,
    label: this.props.localeStore.locale.VERIFY_RESULT.HAD_REVIEWED,
    image: AUTH.IMG_SUCCESS
  },
  {
    type: 3,
    label: this.props.localeStore.locale.VERIFY_RESULT.REVIEWED_FAIL,
    image: AUTH.IMG_FAIL
  }
]

@inject('personStore')
@inject('localeStore')
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
    const {
      history,
      localeStore: {
        locale: { VERIFY_RESULT }
      }
    } = this.props
    const { resultOption } = this.state
    return (
      <div id="verified-result">
        <Header onHandle={() => history.push('/user-center')} />
        <img className="result-img" alt="result" src={resultOption.image} />

        {resultOption.type === 1 && (
          <div className="result-content">
            <div className="submit-success">
              {VERIFY_RESULT.SUBMIT_AND_WAIT}
            </div>
            <div className="submit-small">{VERIFY_RESULT.RESULT_MSG}</div>
          </div>
        )}
        {resultOption.type === 2 && (
          <div className="result-content">
            <div className="verified-success">
              {VERIFY_RESULT.CERTIFICATE_PASSED}
            </div>
          </div>
        )}
        {resultOption.type === 3 && (
          <div className="result-content">
            <div className="verified-fail">
              {VERIFY_RESULT.VERIFICATION_FAILED}
            </div>
            <br />
            <Button
              activeClassName="btn-common__active"
              className={`btn-common btn-common__bottom`}
              onClick={() => history.push('/verified-country')}
            >
              {VERIFY_RESULT.CONTINUE_TO_VERIFY}
            </Button>
          </div>
        )}
      </div>
    )
  }
}

export default VerifiedResult
