import React from "react";
import noDataImg from "../../assets/images/common/no-data.png";
import './NoData.scss'

function NoData(props) {
  return <div className="no-data">
    <img src={props.img || noDataImg} alt="空"/>
    <br/>
    {props.msg}
  </div>
}

export default NoData
