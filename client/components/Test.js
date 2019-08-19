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
    Object.keys(this.state.cityList).forEach(cityKey => {
      const city = this.state.cityList[cityKey]
      ctx.rect(city.coords[0], city.coords[1], 50, 100)
      ctx.stroke()
    })
  }
  render() {
    return (
      <React.Fragment>
        <canvas
          ref={this.canvasRef}
          width="1200"
          height="800"
          style={{border: '5px solid #d3d3d3', margin: '10'}}
        />
        <button onClick={this.drawRect}>click me</button>
      </React.Fragment>
    )
  }
}

export default Test
