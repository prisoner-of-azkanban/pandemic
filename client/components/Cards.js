import React from 'react'
import {Button} from 'react-bootstrap'
import {playerCards} from '../../game/playerCards'
import {epidemicCard} from '../../game/epidemic'
const shuffle = require('shuffle-array')
import firebase from 'firebase'
import {app, db} from '../../firebase-server/firebase'

class Cards extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    let players = this.props.players
    this.state = {
      deck: [],
      currentTurn: 0,
      player1: {
        id: 0,
        event: false,
        role: '',
        turn: false,
        location: 'Atlanta',
        hand: [],
        name: players[0]
      },
      player2: {
        id: 1,
        event: false,
        role: '',
        turn: false,
        location: 'Atlanta',
        hand: [],
        name: players[1]
      },
      player3: {
        id: 2,
        event: false,
        role: '',
        turn: false,
        location: 'Atlanta',
        hand: [],
        name: players[2]
      },
      player4: {
        id: 3,
        event: false,
        role: '',
        turn: false,
        location: 'Atlanta',
        hand: [],
        name: players[3]
      }
    }
    this.props.game.onSnapshot(this.listenStart)
  }

  componentDidMount() {
    this._isMounted = true
    const players = this.props.players
    this.props.game.get().then(doc => {
      if (!doc.data().player1.id) {
        this.props.game.set(
          {
            player1: {
              id: 0,
              event: false,
              role: '',
              turn: false,
              location: 'Atlanta',
              hand: [],
              name: players[0]
            },
            player2: {
              id: 1,
              event: false,
              role: '',
              turn: false,
              location: 'Atlanta',
              hand: [],
              name: players[1]
            },
            player3: {
              id: 2,
              event: false,
              role: '',
              turn: false,
              location: 'Atlanta',
              hand: [],
              name: players[2]
            },
            player4: {
              id: 3,
              event: false,
              role: '',
              turn: false,
              location: 'Atlanta',
              hand: [],
              name: players[3]
            }
          },
          {merge: true}
        )
      }
    })
  }

  listenStart = () => {
    this.props.game.get().then(doc => {
      if (this._isMounted)
        this.setState({
          player1: doc.data().player1,
          player2: doc.data().player2,
          player3: doc.data().player3,
          player4: doc.data().player4,
          deck: doc.data().deck,
          currentTurn: doc.data().currentTurn
        })
    })
  }

  componentWillUnmount() {
    this._isMounted = false
    const unsubscribe = this.props.game.onSnapshot(this.listenStart)
    unsubscribe()
  }

  // eslint-disable-next-line max-statements
  startGame = () => {
    //shuffle player deck
    let shuffled = shuffle(playerCards, {copy: true})
    //deal out player cards
    const player1Hand = shuffled.splice(0, 2)
    const player2Hand = shuffled.splice(0, 2)
    const player3Hand = shuffled.splice(0, 2)
    const player4Hand = shuffled.splice(0, 2)
    //find out who goes first
    const pop1 = player1Hand.map(card => card.population)
    const pop2 = player2Hand.map(card => card.population)
    const pop3 = player3Hand.map(card => card.population)
    const pop4 = player4Hand.map(card => card.population)
    let turns = [
      Math.max(...pop1),
      Math.max(...pop2),
      Math.max(...pop3),
      Math.max(...pop4)
    ]
    const maxPop = Math.max(...turns)
    turns = turns.map(pop => pop === maxPop)
    const playerFirst = turns.indexOf(true)
    //does hand have event cards
    const player1Event = !!player1Hand.filter(card => card.type === 'event')
      .length
    const player2Event = !!player2Hand.filter(card => card.type === 'event')
      .length
    const player3Event = !!player3Hand.filter(card => card.type === 'event')
      .length
    const player4Event = !!player4Hand.filter(card => card.type === 'event')
      .length

    //3 piles have 7, 3 piles have 8
    let pile1 = shuffled.splice(0, 7)
    pile1.push(epidemicCard)
    shuffle(pile1)
    let pile2 = shuffled.splice(0, 7)
    pile2.push(epidemicCard)
    shuffle(pile2)
    let pile3 = shuffled.splice(0, 7)
    pile3.push(epidemicCard)
    shuffle(pile3)
    let pile4 = shuffled.splice(0, 8)
    pile4.push(epidemicCard)
    shuffle(pile4)
    let pile5 = shuffled.splice(0, 8)
    pile5.push(epidemicCard)
    shuffle(pile5)
    let pile6 = shuffled.splice(0, 8)
    pile6.push(epidemicCard)
    shuffle(pile6)
    const deck = shuffle([pile1, pile2, pile3, pile4, pile5, pile6]).flat() //shuffle pile order and combine
    deck.map((card, index) => console.log(index + 1, card.title)) // check and make sure piles are properly split

    this.props.game.set(
      {
        player1: {
          ...this.state.player1,
          turn: turns[0],
          event: player1Event,
          hand: player1Hand
        },
        player2: {
          ...this.state.player2,
          turn: turns[1],
          event: player2Event,
          hand: player2Hand
        },
        player3: {
          ...this.state.player3,
          turn: turns[2],
          event: player3Event,
          hand: player3Hand
        },
        player4: {
          ...this.state.player4,
          turn: turns[3],
          event: player4Event,
          hand: player4Hand
        },
        deck: deck,
        currentTurn: playerFirst
      },
      {merge: true}
    )
  }

  render() {
    return this.state.player1.location ? (
      <React.Fragment>
        <p>First Player: {this.state.currentTurn}</p>
        <ul>
          {this.state.player1.name} event card in hand:
          {this.state.player1.event.toString()} turn:
          {this.state.player1.turn.toString()}
          {this.state.player1.hand.map(card => (
            <li key={card.title}>{card.title}</li>
          ))}
        </ul>
        <ul>
          {this.state.player2.name} event card in hand:
          {this.state.player2.event.toString()} turn:
          {this.state.player2.turn.toString()}
          {this.state.player2.hand.map(card => (
            <li key={card.title}>{card.title}</li>
          ))}
        </ul>
        <ul>
          {this.state.player3.name} event card in hand:
          {this.state.player3.event.toString()} turn:
          {this.state.player3.turn.toString()}
          {this.state.player3.hand.map(card => (
            <li key={card.title}>{card.title}</li>
          ))}
        </ul>
        <ul>
          {this.state.player4.name} event card in hand:
          {this.state.player4.event.toString()} turn:
          {this.state.player4.turn.toString()}
          {this.state.player4.hand.map(card => (
            <li key={card.title}>{card.title}</li>
          ))}
        </ul>
        <Button onClick={this.startGame}>test shuffle</Button>
      </React.Fragment>
    ) : (
      <div />
    )
  }
}

export default Cards
