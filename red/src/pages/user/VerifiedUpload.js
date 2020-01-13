import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Toast } from 'antd-mobile'
import { AUTH } from '../../assets/static'
import Header from '../../components/common/Header'
import './VerifiedUpload.scss'

@inject('CertificationStore')
@inject('localeStore')
@observer
class VerifiedUpload extends Component {
  onSubmit = () => {
    const { history, CertificationStore } = this.props
    CertificationStore.submitAuthAudit().then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg)
        return
      }
      history.push('/verified-result')
    })
  }

  render() {
    const {
      CertificationStore,
      localeStore: {
        locale: { VERIFY_UPLOAD }
      }
    } = this.props
    const { cardFront, cardBack, cardHold } = CertificationStore.photo
    const canSubmit = cardFront && cardBack && cardHold

    return (
      <div id="verified-upload">
        <Header title={VERIFY_UPLOAD.IDENTITY_VERIFICATION} isFixed bgPrimary />

        <ul className="notices">
          <li>{VERIFY_UPLOAD.AUTH_EXPLAIN_ONE}</li>
          <li>{VERIFY_UPLOAD.AUTH_EXPLAIN_TWO}</li>
        </ul>

        <div className="upload-content">
          <p>{VERIFY_UPLOAD.ID_AND_PASSPORT_FRONT}</p>
          <img src={cardFront ? cardFront : AUTH.IMG_FRONT} alt="" />
          <input
            type="file"
            className="upload-photo"
            accept="image/*"
            onChange={e => CertificationStore.changePhotoItem(e, 'cardFront')}
          />
        </div>
        <div className="upload-content">
          <p>{VERIFY_UPLOAD.ID_AND_PASSPORT_BACK}</p>
          <img src={cardBack ? cardBack : AUTH.IMG_BACK} alt="" />
          <input
            type="file"
            className="upload-photo"
            accept="image/*"
            onChange={e => CertificationStore.changePhotoItem(e, 'cardBack')}
          />
        </div>
        <div className="upload-content">
          <p>{VERIFY_UPLOAD.ID_AND_PASSPORT_HOLD}</p>
          <img src={cardHold ? cardHold : AUTH.IMG_HOLD} alt="" />
          <input
            type="file"
            className="upload-photo"
            accept="image/*"
            onChange={e => CertificationStore.changePhotoItem(e, 'cardHold')}
          />
        </div>
        <Button
          activeClassName="active"
          className="primary-button upload-img"
          disabled={!canSubmit}
          onClick={this.onSubmit}
        >
          {VERIFY_UPLOAD.SUBMIT_VERIFY}
        </Button>
      </div>
    )
  }
}

export default VerifiedUpload
