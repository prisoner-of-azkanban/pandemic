import React from 'react'
import {Button} from 'react-bootstrap'
import {playerCards} from '../../game/playerCards'
import {epidemicCard} from '../../game/epidemic'
import {infectionCards} from '../../game/infectionCards'
import {roleCards} from '../../game/roleCards'
import {cityList} from '../../game/cityList'
import {connectedCities} from '../../game/connectedCities'
const shuffle = require('shuffle-array')
import firebase from 'firebase'
import {app, db} from '../../firebase-server/firebase'
import {GameMenu, PandemicMap} from './index'

class MainGame extends React.Component {
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
      playerList: [
        {
          id: 0,
          event: false,
          role: '',
          turn: false,
          location: 'Atlanta',
          hand: [],
          name: players[0]
        },
        {
          id: 1,
          event: false,
          role: '',
          turn: false,
          location: 'Atlanta',
          hand: [],
          name: players[1]
        },
        {
          id: 2,
          event: false,
          role: '',
          turn: false,
          location: 'Atlanta',
          hand: [],
          name: players[2]
        },
        {
          id: 3,
          event: false,
          role: '',
          turn: false,
          location: 'Atlanta',
          hand: [],
          name: players[3]
        }
      ],
      cities: cityList,
      outbreak: new Set(),
      win: false,
      lose: false,
      actionCount: 0,
      infectionRate: 0,
      outbreaks: 0
    }
    this.props.game.onSnapshot(this.listenStart)
  }

  componentDidMount() {
    this._isMounted = true
    const players = this.props.players
    this.props.game.get().then(doc => {
      if (!doc.data().playerList[0]) {
        this.props.game.set(
          {
            cities: cityList,
            playerList: [
              {
                id: 0,
                event: false,
                role: '',
                turn: false,
                location: 'Atlanta',
                hand: [],
                name: players[0]
              },
              {
                id: 1,
                event: false,
                role: '',
                turn: false,
                location: 'Atlanta',
                hand: [],
                name: players[1]
              },
              {
                id: 2,
                event: false,
                role: '',
                turn: false,
                location: 'Atlanta',
                hand: [],
                name: players[2]
              },
              {
                id: 3,
                event: false,
                role: '',
                turn: false,
                location: 'Atlanta',
                hand: [],
                name: players[3]
              }
            ]
          },
          {merge: true}
        )
      } else if (this._isMounted) {
        this.setState({
          playerList: doc.data().playerList,
          playerCardDeck: doc.data().playerCardDeck,
          playerCardDiscard: doc.data().playerCardDiscard,
          infectionCardDeck: doc.data().infectionCardDeck,
          infectionCardDiscard: doc.data().infectionCardDiscard,
          currentTurn: doc.data().currentTurn,
          cities: doc.data().cities,
          win: doc.data().win,
          lose: doc.data().lose
        })
      }
    })
  }

  listenStart = () => {
    this.props.game.get().then(doc => {
      if (this._isMounted)
        this.setState({
          playerList: doc.data().playerList,
          playerCardDeck: doc.data().playerCardDeck,
          playerCardDiscard: doc.data().playerCardDiscard,
          infectionCardDeck: doc.data().infectionCardDeck,
          infectionCardDiscard: doc.data().infectionCardDiscard,
          currentTurn: doc.data().currentTurn,
          cities: doc.data().cities,
          actionCount: doc.data().actionCount,
          infectionRate: doc.data().infectionRate,
          outbreaks: doc.data().outbreaks
        })
    })
  }

  componentWillUnmount() {
    this._isMounted = false
    const unsubscribe = this.props.game.onSnapshot(this.listenStart)
    unsubscribe()
  }
  //*******lara testing functions START*******
  testOutbreak = () => {
    let cities = this.state.cities
    cities.Tokyo.red = 3
    cities.Osaka.red = 3
    cities['San Francisco'].blue = 3
    this.props.game.set({cities: cities}, {merge: true})
    console.log(this.state.cities)
    this.infectCity('Tokyo', 'red')
    console.log('after outbreak', this.state.cities)
  }

  reset = () => {
    this.props.game.set({cities: cityList}, {merge: true})
    console.log(this.state.cities)
  }
  //*******lara testing functions END*******

  //************PLAYER TURN START**************

  playerTurn = index => {
    this.resetOutbreakSet() //must reset outbreak set first
    //actions

    //draw cards
    let playerCardDeck = this.state.playerCardDeck
    let playerCardDiscard = this.state.playerCardDiscard
    let infectionCardDeck = this.state.infectionCardDeck
    const card1 = playerCardDeck.shift()
    const card2 = playerCardDeck.shift()
    if (card1.type === 'epidemic' || card2.type === 'epidemic') {
      const epidemic = infectionCardDeck.pop()
      this.infectCity(epidemic.city, epidemic.color, 3, true)
    }

    //infect
  }

  //************PLAYER TURN END**************

  //infect step
  resetOutbreakSet = () => this.setState({outbreak: new Set()})
  outbreakCheck = (city, color) => {
    return this.state.cities[city][color] === 3
  }

  infectCity = (city, color, number = 1, epidemic = false) => {
    if (epidemic) {
      //epidemic card
      const cubes = 3
      let cities = this.state.cities
      cities[city][color] = cubes
      this.props.game.set({cities: cities}, {merge: true})
    } else if (!this.outbreakCheck(city, color)) {
      //normal infect
      const cubes = this.state.cities[city][color] + number
      let cities = this.state.cities
      cities[city][color] = cubes
      this.props.game.set({cities: cities}, {merge: true})
    } else {
      //outbreak
      if (!this.state.outbreak.has(city)) {
        const cityConnections = connectedCities[city]
        this.state.outbreak.add(city)
        console.log(this.state.outbreak)
        for (let i = 0; i < cityConnections.length; i++) {
          this.infectCity(cityConnections[i], color)
        }
      }
    }
  }

  //*********GAME SET UP START****************
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
    let playerList = []
    playerList.push(
      this.setupPlayer(this.state.playerList[0], hands[0], roles, turns, 0)
    )
    playerList.push(
      this.setupPlayer(this.state.playerList[1], hands[1], roles, turns, 1)
    )
    playerList.push(
      this.setupPlayer(this.state.playerList[2], hands[2], roles, turns, 2)
    )
    playerList.push(
      this.setupPlayer(this.state.playerList[3], hands[3], roles, turns, 3)
    )
    this.props.game.set(
      {
        playerList: playerList,
        playerCardDeck: playerCardDeck,
        currentTurn: playerFirst,
        infectionCardDiscard: infectionDiscard,
        infectionCardDeck: shuffledInfectionDeck
      },
      {merge: true}
    )
  }
  //**************GAME SET UP END**************

  render() {
    return this.state.playerList[0] ? (
      <div id="whole-game-screen">
        <div id="main-game-screen">
          <PandemicMap cityList={this.state.cities} />
        </div>
        <Button onClick={this.startGame}>test shuffle</Button>
        <Button onClick={this.testOutbreak}>test outbreak</Button>
        <Button onClick={this.reset}>reset cities</Button>
        <GameMenu
          players={this.state.playerList}
          username={this.props.username}
          turn={this.state.currentTurn}
        />
      </div>
    ) : (
      <div>Getting location</div>
    )
  }
}

export default MainGame
