import React from 'react'
import {Button} from 'react-bootstrap'
import {playerCards} from '../../game/playerCards'
import {epidemicCard} from '../../game/epidemic'
import {infectionCards} from '../../game/infectionCards'
import {roleCards} from '../../game/roleCards'
import {cityList} from '../../game/cityList'
const shuffle = require('shuffle-array')
import firebase from 'firebase'
import {app, db} from '../../firebase-server/firebase'

class Cards extends React.Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    let players = this.props.players
    this.state = {
      playerCardDeck: [],
      playerCardDiscard: [],
      infectionCardDeck: [],
      infectionCardDiscard: [],
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
      },
      cities: cityList
    }
    this.props.game.onSnapshot(this.listenStart)
  }

  componentDidMount() {
    this._isMounted = true
    const players = this.props.players
    this.props.game.get().then(doc => {
      if (!doc.data().player1.location) {
        this.props.game.set({cities: cityList}, {merge: true})
      } else if (this._isMounted) {
        this.setState({
          player1: doc.data().player1,
          player2: doc.data().player2,
          player3: doc.data().player3,
          player4: doc.data().player4,
          playerCardDeck: doc.data().playerCardDeck,
          playerCardDiscard: doc.data().playerCardDiscard,
          infectionCardDeck: doc.data().infectionCardDeck,
          infectionCardDiscard: doc.data().infectionCardDiscard,
          currentTurn: doc.data().currentTurn,
          cities: doc.data().cities
        })
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
          playerCardDeck: doc.data().playerCardDeck,
          playerCardDiscard: doc.data().playerCardDiscard,
          infectionCardDeck: doc.data().infectionCardDeck,
          infectionCardDiscard: doc.data().infectionCardDiscard,
          currentTurn: doc.data().currentTurn,
          cities: doc.data().cities
        })
    })
  }

  componentWillUnmount() {
    this._isMounted = false
    const unsubscribe = this.props.game.onSnapshot(this.listenStart)
    unsubscribe()
  }

  outbreakCheck = (city, color) => {
    return this.state.cities[city][color] === 3
  }

  infectCity = (city, color, number = 1, epidemic = false) => {
    if (epidemic) {
      const cubes = 3
      let cities = this.state.cities
      cities[city][color] = cubes
      this.props.game.set({cities: cities}, {merge: true})
    } else if (!this.outbreakCheck(city, color)) {
      const cubes = this.state.cities[city][color] + number
      let cities = this.state.cities
      cities[city][color] = cubes
      this.props.game.set({cities: cities}, {merge: true})
    }
    //else we outbreak, need a new funciton for that, need connections
  }

  setupPlayerRoles = (players, roleDeck) => {
    let shuffledRoles = shuffle(roleDeck, {copy: true})
    return players.map(role => (role = shuffledRoles.shift()))
  }

  setupPlayerCards = (players, cardDeck) => {
    let shuffledPlayerCardDeck = shuffle(cardDeck, {copy: true})
    return players.map(player => (player = shuffledPlayerCardDeck.splice(0, 2)))
  }

  //see who goes first
  findMaxPop = playerHands => {
    let playerPop = playerHands.map(hand =>
      hand.map(card => parseInt(card.population, 10))
    )
    let turns = playerPop.map(pop => Math.max(...pop))
    return [Math.max(...playerPop.map(pop => Math.max(...pop))), turns]
  }

  //sets up player
  setupPlayer = (player, playerHand, roles, turns, index) => {
    return {
      ...player,
      turn: turns[index],
      event: playerHand.filter(card => card.type === 'event').length > 0,
      hand: playerHand,
      role: roles[index]
    }
  }

  // eslint-disable-next-line max-statements
  startGame = () => {
    //shuffle roles
    let roles = this.setupPlayerRoles(this.props.players, roleCards)

    //shuffle player deck
    let shuffledPlayerCardDeck = shuffle(playerCards, {copy: true})

    //deal out player cards
    let hands = []
    for (let i = 0; i < 4; i++) {
      hands.push(shuffledPlayerCardDeck.splice(0, 2))
    }

    //find max population
    const turnsMapPop = this.findMaxPop(hands)
    console.log(turnsMapPop)
    const maxPop = turnsMapPop[0]
    let turns = turnsMapPop[1]
    turns = turns.map(pop => pop === maxPop)
    const playerFirst = turns.indexOf(true)

    let pile = []
    for (let i = 0; i < 6; i++) {
      let shuffledIndex
      if (i > 3) {
        shuffledIndex = 8
      } else {
        shuffledIndex = 7
      }
      let tempPile = shuffledPlayerCardDeck.splice(0, shuffledIndex)
      tempPile.push(epidemicCard)
      shuffle(tempPile)
      pile.push(tempPile)
    }

    const playerCardDeck = shuffle(pile).flat() //shuffle pile order and combine
    // playerCardDeck.map((card, index) => console.log(index + 1, card.title)) // check and make sure piles are properly split
    //shuffle infection cards
    let shuffledInfectionDeck = shuffle(infectionCards, {copy: true})
    let threeCubes = shuffledInfectionDeck.splice(0, 3)
    let twoCubes = shuffledInfectionDeck.splice(0, 3)
    let oneCubes = shuffledInfectionDeck.splice(0, 3)
    // console.log('three', threeCubes)
    // console.log('two', twoCubes)
    // console.log('one', oneCubes)
    threeCubes.forEach(city => this.infectCity(city.city, city.color, 3))
    twoCubes.forEach(city => this.infectCity(city.city, city.color, 2))
    oneCubes.forEach(city => this.infectCity(city.city, city.color))
    //add cards to infect discard
    const infectionDiscard = [threeCubes, twoCubes, oneCubes].flat()
    //set state for game start

    this.props.game.set(
      {
        player1: this.setupPlayer(
          this.state.player1,
          hands[0],
          roles,
          turns,
          0
        ),
        player2: this.setupPlayer(
          this.state.player2,
          hands[1],
          roles,
          turns,
          1
        ),
        player3: this.setupPlayer(
          this.state.player3,
          hands[2],
          roles,
          turns,
          2
        ),
        player4: this.setupPlayer(
          this.state.player4,
          hands[3],
          roles,
          turns,
          3
        ),
        playerCardDeck: playerCardDeck,
        currentTurn: playerFirst,
        infectionCardDiscard: infectionDiscard,
        infectionCardDeck: shuffledInfectionDeck
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
