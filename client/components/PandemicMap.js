/* eslint-disable max-statements */
/* eslint-disable complexity */
import {cityList} from '../../game/cityList'
import {
  infectionRateToken,
  infectionRateNumber
} from '../../game/infectionRateToken'
import {outbreakToken} from '../../game/outbreakToken'
import React from 'react'
import {app, db} from '../../firebase-server/firebase'

class PandemicMap extends React.Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
  }
  componentDidMount() {
    this.drawRect()
  }

  componentWillReceiveProps() {
    this.drawRect()
  }

  drawRect = () => {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // Font Size for Tokens
    ctx.font = '20px Impact'

    // Outbreak Token
    this.outbreakFn(ctx)

    // Infection Rate Token
    this.infectionRateFn(ctx)

    // Cure Tokens
    this.blueCure(ctx, this.props.blueCure)
    this.yellowCure(ctx, this.props.yellowCure)
    this.blackCure(ctx, this.props.blackCure)
    this.redCure(ctx, this.props.redCure)

    // Font Size for Decks
    ctx.font = '20px Impact'

    // Infection Deck
    this.infectionCardDeckFn(ctx)

    // Infection Discard
    this.infectionCardDiscardFn(ctx)

    // Player Deck
    this.playerCardDeckFn(ctx)

    // Player Discard
    this.playerCardDiscardFn(ctx)

    // Font Size for Number of Cubes
    ctx.font = '15px Courier New'
    ctx.shadowColor = ''
    // Number of Cubes
    this.numCubes(ctx)

    // eslint-disable-next-line max-statements
    Object.keys(this.props.cityList).forEach(cityKey => {
      const city = this.props.cityList[cityKey]

      // Font Size for Everything else
      ctx.font = '10px Courier New'

      // City
      this.cityPlacement(ctx, city)

      // Research Center
      if (city.research) {
        this.researchCenterPlacement(ctx, city)
      }

      // Disease Cubes
      // blue
      if (city.blue) {
        this.bluePlacement(ctx, city)
        this.blueNum(ctx, city)
      }
      // yellow
      if (city.yellow) {
        this.yellowPlacement(ctx, city)
        this.yellowNum(ctx, city)
      }
      // black
      if (city.black) {
        this.blackPlacement(ctx, city)
        this.blackNum(ctx, city)
      }
      // red
      if (city.red) {
        this.redPlacement(ctx, city)
        this.redNum(ctx, city)
      }

      // Player Pawns Placement
      this.playerOne(ctx, this.props.playerList)
      this.playerTwo(ctx, this.props.playerList)
      this.playerThree(ctx, this.props.playerList)
      this.playerFour(ctx, this.props.playerList)
    })
  }

  // Methods
  // Outbreak Token Method
  outbreakFn = ctx => {
    if (this.props.outbreaks < 8) {
      let coords = outbreakToken[this.props.outbreaks]
      ctx.beginPath()
      ctx.fillStyle = 'lilac'
      ctx.arc(coords[0], coords[1], 15, 0, 2 * Math.PI)
      ctx.fill()
      ctx.fillStyle = 'white'
      ctx.stroke()
      ctx.fillText(this.props.outbreaks, coords[0] - 6, coords[1] + 9)
    }
  }

  // Infection Rate Token Method
  infectionRateFn = ctx => {
    if (this.props.infectionRate < 7) {
      let infect = infectionRateToken[this.props.infectionRate]
      ctx.beginPath()
      ctx.fillStyle = 'violet'
      ctx.arc(infect[0], infect[1], 15, 0, 2 * Math.PI)
      ctx.fill()
      ctx.fillStyle = 'black'
      ctx.fillText(
        infectionRateNumber[this.props.infectionRate],
        infect[0] - 6,
        infect[1] + 9
      )
    }
  }

  // Cure Token
  blueCure = (ctx, state) => {
    if (state) {
      ctx.beginPath()
      ctx.fillStyle = 'blue'
      ctx.rect(407, 640, 30, 30)
      ctx.fill()
      if (state === 2) {
        ctx.fillStyle = 'white'
        ctx.fillText('X', 413, 664)
      }
    }
  }

  yellowCure = (ctx, state) => {
    if (state) {
      ctx.beginPath()
      ctx.fillStyle = 'yellow'
      ctx.rect(320, 640, 30, 30)
      ctx.fill()
      if (state === 2) {
        ctx.fillStyle = 'black'
        ctx.fillText('X', 326, 664)
      }
    }
  }

  blackCure = (ctx, state) => {
    if (state) {
      ctx.beginPath()
      ctx.fillStyle = 'black'
      ctx.rect(450, 640, 30, 30)
      ctx.fill()
      if (state === 2) {
        ctx.fillStyle = 'white'
        ctx.fillText('X', 456, 664)
      }
    }
  }

  redCure = (ctx, state) => {
    if (state) {
      ctx.beginPath()
      ctx.fillStyle = 'red'
      ctx.rect(363, 640, 30, 30)
      ctx.fill()
      if (state === 2) {
        ctx.fillStyle = 'white'
        ctx.fillText('X', 369, 664)
      }
    }
  }

  // Infection Deck Placement Function
  infectionCardDeckFn = ctx => {
    ctx.beginPath()
    ctx.fillStyle = 'black'
    ctx.rect(590, 30, 145, 110)
    ctx.fillText('Infection', 621, 71)
    ctx.fillText('Deck', 635, 97)
    if (this.props.infectionCardDeck.length > 9) {
      ctx.fillText(this.props.infectionCardDeck.length, 646, 120)
    } else {
      ctx.fillText(this.props.infectionCardDeck.length, 655, 120)
    }
  }

  // Infection Discard Placement Function
  infectionCardDiscardFn = ctx => {
    ctx.beginPath()
    ctx.fillStyle = 'black'
    ctx.rect(750, 30, 145, 110)
    ctx.fillText('Infection', 786, 71)
    ctx.fillText('Discard', 790, 97)
    if (this.props.infectionCardDiscard.length < 10) {
      ctx.fillText(this.props.infectionCardDiscard.length, 816, 120)
    } else {
      ctx.fillText(this.props.infectionCardDiscard.length, 812, 120)
    }
  }

  // Player Deck Placement Method
  playerCardDeckFn = ctx => {
    ctx.beginPath()
    ctx.fillStyle = 'black'
    ctx.rect(592, 520, 105, 140)
    ctx.fillText('Player', 618, 560)
    ctx.fillText('Deck', 620, 590)
    if (this.props.playerCardDeck.length > 10) {
      ctx.fillText(this.props.playerCardDeck.length, 633, 620)
    } else {
      ctx.fillText(this.props.playerCardDeck.length, 637, 620)
    }
  }

  // Player Discard Placement Method
  playerCardDiscardFn = ctx => {
    ctx.beginPath()
    ctx.fillStyle = 'black'
    ctx.rect(726, 520, 105, 140)
    ctx.fillText('Player', 752, 560)
    ctx.fillText('Discard', 745, 590)
    if (this.props.playerCardDiscard.length > 10) {
      ctx.fillText(this.props.playerCardDiscard.length, 772, 620)
    } else {
      ctx.fillText(this.props.playerCardDiscard.length, 767, 620)
    }
  }

  // City Placement Method
  cityPlacement = (ctx, city) => {
    ctx.beginPath()
    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.arc(city.coords[0], city.coords[1], 10, 0, 2 * Math.PI)
    ctx.fillStyle = city.color
    ctx.fill()
    ctx.fillStyle = 'black'
    ctx.fillText(city.name, city.coords[0] - 20, city.coords[1] + 20)
  }

  // Research Center Placement Method
  researchCenterPlacement = (ctx, city) => {
    ctx.beginPath()
    ctx.arc(city.coords[0], city.coords[1], 3, 0, 2 * Math.PI)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.stroke()
  }

  // Disease Cube Placement and Number Methods
  // Blue Cube
  bluePlacement = (ctx, city) => {
    ctx.beginPath()
    ctx.rect(city.coords[0] - 20, city.coords[1] - 23, 10, 10)
    ctx.fillStyle = 'blue'
    ctx.fill()
  }
  blueNum = (ctx, city) => {
    ctx.beginPath()
    ctx.fillStyle = 'white'
    ctx.fillText(city.blue, city.coords[0] - 18, city.coords[1] - 15)
  }

  // Yellow Cube
  yellowPlacement = (ctx, city) => {
    ctx.beginPath()
    ctx.rect(city.coords[0] - 10, city.coords[1] - 23, 10, 10)
    ctx.fillStyle = 'yellow'
    ctx.fill()
  }
  yellowNum = (ctx, city) => {
    ctx.beginPath()
    ctx.fillStyle = 'black'
    ctx.fillText(city.yellow, city.coords[0] - 8, city.coords[1] - 15)
  }

  // Black Cube
  blackPlacement = (ctx, city) => {
    ctx.beginPath()
    ctx.rect(city.coords[0], city.coords[1] - 23, 10, 10)
    ctx.fillStyle = 'black'
    ctx.fill()
  }
  blackNum = (ctx, city) => {
    ctx.beginPath()
    ctx.fillStyle = 'white'
    ctx.fillText(city.black, city.coords[0] + 3, city.coords[1] - 15)
  }

  // Red Cube
  redPlacement = (ctx, city) => {
    ctx.beginPath()
    ctx.rect(city.coords[0] + 10, city.coords[1] - 23, 10, 10)
    ctx.fillStyle = 'red'
    ctx.fill()
  }
  redNum = (ctx, city) => {
    ctx.beginPath()
    ctx.fillStyle = 'black'
    ctx.fillText(city.red, city.coords[0] + 13, city.coords[1] - 15)
  }

  // Cube Number Method
  numCubes = ctx => {
    // red cubes
    ctx.beginPath()
    ctx.fillStyle = 'red'
    ctx.rect(365, 55, 30, 30)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = 'black'
    if (this.props.redCubes >= 0 && this.props.redCubes < 10) {
      ctx.fillText(this.props.redCubes, 376, 75)
    } else {
      ctx.fillText(this.props.redCubes, 370, 75)
    }
    // black cubes
    ctx.beginPath()
    ctx.fillStyle = 'black'
    ctx.rect(405, 55, 30, 30)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = 'white'
    if (this.props.blackCubes >= 0 && this.props.blackCubes < 10) {
      ctx.fillText(this.props.blackCubes, 416, 75)
    } else {
      ctx.fillText(this.props.blackCubes, 410, 75)
    }
    // blue cubes
    ctx.beginPath()
    ctx.fillStyle = 'blue'
    ctx.rect(445, 55, 30, 30)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = 'white'
    if (this.props.blackCubes >= 0 && this.props.blackCubes < 10) {
      ctx.fillText(this.props.blueCubes, 456, 75)
    } else {
      ctx.fillText(this.props.blueCubes, 450, 75)
    }
    // yellow cubes
    ctx.beginPath()
    ctx.fillStyle = 'yellow'
    ctx.rect(485, 55, 30, 30)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = 'black'
    if (this.props.blackCubes >= 0 && this.props.blackCubes < 10) {
      ctx.fillText(this.props.yellowCubes, 496, 75)
    } else {
      ctx.fillText(this.props.yellowCubes, 490, 75)
    }
  }

  // Player Pawn Placement Method
  playerOne = (ctx, playerList) => {
    let key = playerList[0].location
    let city = cityList[key]
    ctx.beginPath()
    ctx.arc(city.coords[0] - 6, city.coords[1] - 6, 3, 0, 2 * Math.PI)
    ctx.fillStyle = 'lime'
    ctx.fill()
    ctx.stroke()
  }

  playerTwo = (ctx, playerList) => {
    let key = playerList[1].location
    let city = cityList[key]
    ctx.beginPath()
    ctx.arc(city.coords[0] + 6, city.coords[1] + 6, 3, 0, 2 * Math.PI)
    ctx.fillStyle = 'pink'
    ctx.fill()
    ctx.stroke()
  }

  playerThree = (ctx, playerList) => {
    let key = playerList[2].location
    let city = cityList[key]
    ctx.beginPath()
    ctx.arc(city.coords[0] + 6, city.coords[1] - 6, 3, 0, 2 * Math.PI)
    ctx.fillStyle = 'aqua'
    ctx.fill()
    ctx.stroke()
  }

  playerFour = (ctx, playerList) => {
    let key = playerList[3].location
    let city = cityList[key]
    ctx.beginPath()
    ctx.arc(city.coords[0] - 6, city.coords[1] + 6, 3, 0, 2 * Math.PI)
    ctx.fillStyle = 'brown'
    ctx.fill()
    ctx.stroke()
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
      </React.Fragment>
    )
  }
}

export default PandemicMap
