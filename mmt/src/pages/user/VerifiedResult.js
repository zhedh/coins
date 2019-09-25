import React, {Component} from 'react'
import {Button, Toast} from 'antd-mobile'
import {inject, observer} from "mobx-react"
import {AUTH} from '../../assets/static'
import Header from '../../components/common/Header'
import './VerifiedResult.scss'

const resultOptions = [
  {
    type: 1,
    label: '等待审核',
    image: AUTH.IMG_WAIT
  }, {
    type: 2,
    label: '已审核',
    image: AUTH.IMG_SUCCESS
  }, {
    type: 3,
    label: '失败',
    image: AUTH.IMG_FAIL
  },
]

@inject('personStore')
@observer
class VerifiedResult extends Component {
  state = {
    resultOption: resultOptions[0]
  }

  componentDidMount() {
    const {personStore} = this.props
    personStore.getUserInfo().then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg)
      }
      const {authentication} = personStore.userInfo
      const resultOption = resultOptions.find(option => option.type === authentication) || resultOptions[0]
      this.setState({resultOption})
    })
  }

  render() {
    const {history} = this.props
    const {resultOption} = this.state
    return (
      <div id="verified-result">
        <Header onHandle={() => history.push('/user-center')}/>
        <img
          className="result-img"
          alt="结果图片"
          src={resultOption.image}
        />

        {resultOption.type === 1 && (
          <div className="result-content">
            <div className="submit-success">提交成功，等待审核…</div>
            <div className="submit-small">认证结果将会显示在个人中心</div>
          </div>
        )}
        {resultOption.type === 2 && (
          <div className="result-content">
            <div className="verified-success">认证通过</div>
          </div>
        )}
        {resultOption.type === 3 && (
          <div className="result-content">
            <div className="verified-fail">认证失败！</div>
            <br/>
            <Button
              activeClassName="btn-common__active"
              className={`btn-common btn-common__bottom`}
              onClick={() => history.push('/verified-country')}>
              重新验证
            </Button>
          </div>
        )}
      </div>
    )
  }
}

export default VerifiedResult
