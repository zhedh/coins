import React, { Component } from 'react'
import Slider from 'react-slick'
import walletUsdt from '../../assets/images/new/wallet-usdt.png'
import walletXc from '../../assets/images/new/wallet-xc.png'
import './Slider.scss'

class Index extends Component {
  render() {
    const { cards, onCheck } = this.props
    const settings = {
      className: 'center',
      centerMode: true,
      arrows: false,
      dots: true,
      infinite: false,
      centerPadding: '38px',
      slidesToShow: 1,
      speed: 500,
      afterChange: index => onCheck(index)
    }
    return (
      <div className="slider-wrapper">
        <Slider {...settings}>
          {cards.map((card, key) => (
            <div key={key.toString()} className="slider-card">
              <h3>{card.name}</h3>
              <img src={card.cardImg} alt="" />
            </div>
          ))}
        </Slider>
      </div>
    )
  }
}

export default Index
