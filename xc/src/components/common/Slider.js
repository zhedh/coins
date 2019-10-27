import React, {Component} from 'react'
import Slider from 'react-slick'
import './Slider.scss'

class Index extends Component {
  render() {
    const {cards, onCheck} = this.props
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
          {cards.map(card => (
            <div key={card.name} className="slider-card">
              <h3>{card.name}</h3>
              <img src={card.bgImg} alt=""/>
            </div>
          ))}
        </Slider>
      </div>
    )
  }
}

export default Index
