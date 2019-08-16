import React from 'react'
import {Button} from 'react-bootstrap'
import {playerCards} from '../../game/playerCards'
const shuffle = require('shuffle-array')

class Test extends React.Component {
  constructor() {
    super()
    this.state = {
      deck: playerCards,
      player1: [],
      player2: [],
      player3: [],
      player4: []
    }
  }

  startShuffle = () => {
    let shuffled = shuffle(this.state.deck, {copy: true})
    this.setState({
      player1: [shuffled[0], shuffled[4]],
      player2: [shuffled[1], shuffled[5]],
      player3: [shuffled[2], shuffled[6]],
      player4: [shuffled[3], shuffled[7]],
      deck: shuffled.slice(8)
    })
  }

  render() {
    return (
      <React.Fragment>
        <ul>
          player1
          {this.state.player1.map(card => (
            <li key={card.title}>{card.title}</li>
          ))}
        </ul>
        <ul>
          player2
          {this.state.player2.map(card => (
            <li key={card.title}>{card.title}</li>
          ))}
        </ul>
        <ul>
          player3
          {this.state.player3.map(card => (
            <li key={card.title}>{card.title}</li>
          ))}
        </ul>
        <ul>
          player4
          {this.state.player4.map(card => (
            <li key={card.title}>{card.title}</li>
          ))}
        </ul>
        <Button onClick={this.startShuffle}>test shuffle</Button>
      </React.Fragment>
    )
  }
}

export default Test
