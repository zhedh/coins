import React, {Component} from 'react';
import Header from "../../components/common/Header";
import './StoFlow.scss';

class StoFlow extends Component {
  render() {
    const {history} = this.props
    return (
      <div className="sto-flow">
        <Header
          title="STO 账户流水"
          isShadow
          isFixed
          bgPrimary
          onHandle={() => history.push('/user-center')}
        />
        <ul>
          <li>
            <div className="info">
              STO增加
              <small>2018-08-29 13:42:39</small>
            </div>
            <div className="amount">
              +10.06
            </div>
          </li>
          <li>
            <div className="info">
              STO增加
              <small>2018-08-29 13:42:39</small>
            </div>
            <div className="amount">
              +10.06
            </div>
          </li>
          <li>
            <div className="info">
              STO增加
              <small>2018-08-29 13:42:39</small>
            </div>
            <div className="amount">
              +10.06
            </div>
          </li>
          <li>
            <div className="info">
              STO增加
              <small>2018-08-29 13:42:39</small>
            </div>
            <div className="amount">
              +10.06
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default StoFlow;
