import {cityList} from '../../game/cityList'
import React from 'react'

class PandemicMap extends React.Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
    this.cityList = this.props.cityList ? this.props.cityList : cityList
  }
  componentDidMount() {
    this.drawRect()
  }
  drawRect = () => {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.font = '10px Courier New'
    // eslint-disable-next-line max-statements
    Object.keys(this.cityList).forEach(cityKey => {
      const city = this.cityList[cityKey]

      // City
      ctx.beginPath()
      ctx.fillStyle = 'rgba(255, 255, 255, 1)'
      ctx.arc(city.coords[0], city.coords[1], 10, 0, 2 * Math.PI)
      ctx.fillStyle = city.color
      ctx.fill()
      ctx.fillStyle = 'black'
      ctx.fillText(city.name, city.coords[0] - 20, city.coords[1] + 20)

      // Research Center
      ctx.beginPath()
      ctx.arc(city.coords[0], city.coords[1], 3, 0, 2 * Math.PI)
      ctx.fillStyle = 'white'
      ctx.fill()
      ctx.stroke()

      // Disease Cubes
      ctx.beginPath()
      ctx.rect(city.coords[0] - 20, city.coords[1] - 23, 10, 10)
      ctx.fillStyle = 'blue'
      ctx.fill()

      ctx.beginPath()
      ctx.rect(city.coords[0] - 10, city.coords[1] - 23, 10, 10)
      ctx.fillStyle = 'yellow'
      ctx.fill()

      ctx.beginPath()
      ctx.rect(city.coords[0], city.coords[1] - 23, 10, 10)
      ctx.fillStyle = 'black'
      ctx.fill()

      ctx.beginPath()
      ctx.rect(city.coords[0] + 10, city.coords[1] - 23, 10, 10)
      ctx.fillStyle = 'red'
      ctx.fill()

      // Disease Cube Numbers
      ctx.beginPath()
      ctx.fillStyle = 'white'
      ctx.fillText(city.blue, city.coords[0] - 18, city.coords[1] - 15)

      ctx.beginPath()
      ctx.fillStyle = 'black'
      ctx.fillText(city.yellow, city.coords[0] - 8, city.coords[1] - 15)

      ctx.beginPath()
      ctx.fillStyle = 'white'
      ctx.fillText(city.black, city.coords[0] + 3, city.coords[1] - 15)

      ctx.beginPath()
      ctx.fillStyle = 'black'
      ctx.fillText(city.red, city.coords[0] + 13, city.coords[1] - 15)

      // Player Pawns
      ctx.beginPath()
      ctx.arc(city.coords[0] - 6, city.coords[1] - 6, 3, 0, 2 * Math.PI)
      ctx.fillStyle = 'lime'
      ctx.fill()
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(city.coords[0] + 6, city.coords[1] + 6, 3, 0, 2 * Math.PI)
      ctx.fillStyle = 'pink'
      ctx.fill()
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(city.coords[0] + 6, city.coords[1] - 6, 3, 0, 2 * Math.PI)
      ctx.fillStyle = 'aqua'
      ctx.fill()
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(city.coords[0] - 6, city.coords[1] + 6, 3, 0, 2 * Math.PI)
      ctx.fillStyle = 'brown'
      ctx.fill()
      ctx.stroke()
    })
  }

  // drawPawn = (city) => {

  // }

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
        {/* <button className="map-button" onClick={this.drawRect}>
          click me
        </button> */}
      </React.Fragment>
    )
  }
}

export default PandemicMap
