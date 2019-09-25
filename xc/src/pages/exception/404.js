import React, {Component} from 'react';
import {Toast} from "antd-mobile";
import {TOAST_DURATION} from "../../utils/constants";

class NoMatch extends Component {
  componentDidMount() {
    const {history} = this.props
    Toast.info('页面不存在，正在跳转首页', TOAST_DURATION, () => history.push('/home'))
  }

  render() {
    return (
      <div>

      </div>
    );
  }
}

export default NoMatch;
