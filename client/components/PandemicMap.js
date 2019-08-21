import {cityList} from '../../game/cityList'
import {infectionRateToken} from '../../game/infectionRateToken'
import {outbreakToken} from '../../game/outbreakToken'
import React from 'react'

class PandemicMap extends React.Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
    this.cityList = this.props.cityList ? this.props.cityList : cityList
    this.infectionRate = this.props.infectionRate ? this.props.infectionRate : 6
    this.outbreaks = this.props.outbreaks ? this.props.outbreaks : 5
    this.playerCardDeck = this.props.playerCardDeck
      ? this.props.playerCardDeck
      : [0]
    this.playerCardDiscard = this.props.playerCardDiscard
      ? this.props.playerCardDiscard
      : [0]
    this.infectionCardDeck = this.props.infectionCardDeck
      ? this.props.infectionCardDeck
      : [0]
    this.infectionCardDiscard = this.props.infectionCardDiscard
      ? this.props.infectionCardDiscard
      : [0]
  }
  componentDidMount() {
    this.drawRect()
  }
  drawRect = () => {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')
    // eslint-disable-next-line max-statements
    Object.keys(this.cityList).forEach(cityKey => {
      const city = this.cityList[cityKey]

      // Font Size for Tokens
      ctx.font = '30px Courier New'
      // Outbreaks
      let coords = outbreakToken[this.outbreaks]
      ctx.beginPath()
      ctx.fillStyle = 'lilac'
      ctx.arc(coords[0], coords[1], 15, 0, 2 * Math.PI)
      ctx.fill()
      ctx.fillStyle = 'white'
      ctx.stroke()
      ctx.fillText(this.outbreaks, coords[0] - 9, coords[1] + 9)

      // Infections
      let infect = infectionRateToken[this.infectionRate]
      ctx.beginPath()
      ctx.fillStyle = 'violet'
      ctx.arc(infect[0], infect[1], 15, 0, 2 * Math.PI)
      ctx.fill()
      let rate = 3
      if (this.infectionRate <= 2) {
        rate = 2
      } else if (this.infectionRate > 4) {
        rate = 4
      }
      ctx.fillStyle = 'black'
      ctx.fillText(rate, infect[0] - 9, infect[1] + 9)

      // Font Size for Decks
      ctx.font = '25px Courier New'
      // Infection Deck
      if (this.infectionCardDeck.length) {
        ctx.beginPath()
        ctx.fillStyle = 'purple'
        ctx.rect(590, 30, 145, 110)
        ctx.fill()
        ctx.fillStyle = 'yellow'
        ctx.fillText('Infection', 595, 75)
        ctx.fillText('Deck', 630, 105)
        ctx.stroke()
      }

      // Infection Discard
      if (this.infectionCardDiscard.length) {
        ctx.beginPath()
        ctx.fillStyle = 'purple'
        ctx.rect(750, 30, 145, 110)
        ctx.fill()
        ctx.fillStyle = 'yellow'
        ctx.fillText('Infection', 755, 75)
        ctx.fillText('Discard', 770, 105)
        ctx.stroke()
      }

      // Player Deck
      if (this.playerCardDeck.length) {
        ctx.beginPath()
        ctx.fillStyle = 'teal'
        ctx.rect(592, 520, 105, 140)
        ctx.fill()
        ctx.fillStyle = 'white'
        ctx.fillText('Player', 600, 570)
        ctx.fillText('Deck', 610, 610)
        ctx.stroke()
      }

      // Player Deck
      if (this.playerCardDiscard.length) {
        ctx.beginPath()
        ctx.fillStyle = 'teal'
        ctx.rect(726, 520, 105, 140)
        ctx.fill()
        ctx.fillStyle = 'white'
        ctx.fillText('Player', 733, 570)
        ctx.fillText('Discard', 727, 610)
        ctx.stroke()
      }

      // Font Size for Everything else
      ctx.font = '10px Courier New'
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
