import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Toast } from 'antd-mobile'
import {AUTH_ASSET} from '../../assets'

import Header from '../../components/common/Header'
import './VerifiedUpload.scss'

@inject('localeStore')
@inject('authStore')
@observer
class VerifiedUpload extends Component {
  onSubmit = () => {
    const { history, authStore } = this.props
    authStore.submitAuthAudit().then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg)
        return
      }
      history.push('/verified-result')
    })
  }

  render() {
    const { authStore, localeStore } = this.props
    const { AUTH } = localeStore.language || {}
    const { cardFront, cardBack, cardHold } = authStore.photo
    const canSubmit = cardFront && cardBack && cardHold

    return (
      <div id="verified-upload">
        <Header title={AUTH.IDENTITY_VERIFICATION} isFixed bgWhite />

        <ul className="notices">
          <li>{AUTH.AUTH_EXPLAIN_ONE}</li>
          <li>{AUTH.AUTH_EXPLAIN_TWO}</li>
        </ul>

        <div className="upload-content">
          <p>{AUTH.ID_AND_PASSPORT_FRONT}</p>
          <img src={cardFront ? cardFront : AUTH_ASSET.IMG_FRONT} alt="" />
          <input
            type="file"
            className="upload-photo"
            accept="image/*"
            onChange={e => authStore.changePhotoItem(e, 'cardFront')}
          />
        </div>
        <div className="upload-content">
          <p>{AUTH.ID_AND_PASSPORT_BACK}</p>
          <img src={cardBack ? cardBack : AUTH_ASSET.IMG_BACK} alt="" />
          <input
            type="file"
            className="upload-photo"
            accept="image/*"
            onChange={e => authStore.changePhotoItem(e, 'cardBack')}
          />
        </div>
        <div className="upload-content">
          <p>{AUTH.ID_AND_PASSPORT_HOLD}</p>
          <img src={cardHold ? cardHold : AUTH_ASSET.IMG_HOLD} alt="" />
          <input
            type="file"
            className="upload-photo"
            accept="image/*"
            onChange={e => authStore.changePhotoItem(e, 'cardHold')}
          />
        </div>
        <Button
          activeClassName="active"
          className="primary-button upload-img"
          disabled={!canSubmit}
          onClick={this.onSubmit}
        >
          {AUTH.SUBMIT_VERIFY}
        </Button>
      </div>
    )
  }
}

export default VerifiedUpload
