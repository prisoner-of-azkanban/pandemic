import {cityList} from '../../game/cityList'
import React from 'react'

class Test extends React.Component {
  constructor() {
    super()
    this.canvasRef = React.createRef()
    this.state = {
      cityList: cityList
    }
  }
  drawRect = () => {
    console.log('i was clicked')
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')
    const image = this.refs.image
    ctx.font = '10px Courier New'
    Object.keys(this.state.cityList).forEach(cityKey => {
      const city = this.state.cityList[cityKey]
      ctx.beginPath()
      ctx.fillStyle = 'rgba(255, 255, 255, 1)'
      ctx.arc(city.coords[0], city.coords[1], 10, 0, 2 * Math.PI)
      ctx.fillStyle = city.color
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = 'black'
      ctx.fillText(city.name, city.coords[0] - 20, city.coords[1] - 15)
    })
  }
  render() {
    return (
      <React.Fragment>
        <canvas className="map" width="999" height="708" />
        <canvas
          ref={this.canvasRef}
          width="999"
          height="708"
          style={{border: '5px solid #d3d3d3', margin: '10'}}
        />
        <button className="map-button" onClick={this.drawRect}>
          click me
        </button>
      </React.Fragment>
    )
  }
}

export default Test
