import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import './Captcha.scss'

@inject('localeStore')
@observer
class CaptchaPng extends Component {
  render() {
    const {imgSrc, value, onChange, getCaptchaPng, localeStore} = this.props;
    const {COMMON} = localeStore.language || {}

    return (
      <div id="captcha-box">
        <input
          type="text"
          maxLength={4}
          placeholder={COMMON.GRAPH_CODE}
          value={value}
          onChange={onChange}
        />
        <img
          id="captcha"
          src={imgSrc}
          onClick={getCaptchaPng}
          alt={COMMON.GRAPH_CODE}
        />
      </div>
    );
  }

}

export default CaptchaPng;
