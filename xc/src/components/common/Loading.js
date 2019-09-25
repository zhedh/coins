import {Component} from "react";
import {Toast} from "antd-mobile";
import React from "react";

class Loading extends Component {
  componentDidMount() {
    Toast.loading('加载中')
  }

  componentWillUnmount() {
    Toast.hide()
  }

  render() {
    return <div></div>;
  }
}

export default Loading
