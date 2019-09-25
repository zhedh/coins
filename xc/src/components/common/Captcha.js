import React from 'react';
import './Captcha.scss'

function CaptchaPng(props) {
  const {imgSrc, value, onChange, getCaptchaPng} = props;

  return (
    <div id="captcha-box">
      <input
        type="text"
        maxLength={4}
        placeholder="图形验证码"
        value={value}
        onChange={onChange}
      />
      <img
        id="captcha"
        src={imgSrc}
        onClick={getCaptchaPng}
        alt="图形验证码"
      />
    </div>
  );
}

export default CaptchaPng;
