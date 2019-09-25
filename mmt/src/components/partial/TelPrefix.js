import React, {Component} from 'react'
import TEL_PREFIX_DATA from '../../utils/tel-prefix'
import './TelPrefix.scss'

class TelPrefix extends Component {
  render() {
    const {show, prefix, confirm, cancel} = this.props
    const activeKey = prefix && (prefix.tel + prefix.short)

    return (
      <div className={show ? "tel-prefix__popup show" : "tel-prefix__popup"}
           onClick={() => cancel()}>
        <ul className="box">
          {TEL_PREFIX_DATA.map(i =>
            <li key={i.tel + i.short}
                className={activeKey === i.tel + i.short ? 'active' : ''}
                onClick={() => confirm(i)}>
              <label>{`${i.name}（${i.en}）`}</label>
              <span>+{i.tel}</span>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default TelPrefix
