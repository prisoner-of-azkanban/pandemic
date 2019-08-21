import React from 'react'
import {Button} from 'react-bootstrap'
import {playerCards} from '../../game/playerCards'
import {epidemicCard} from '../../game/epidemic'
import {infectionCards} from '../../game/infectionCards'
import {roleCards} from '../../game/roleCards'
import {cityList} from '../../game/cityList'
import {connectedCities} from '../../game/connectedCities'
import {infectionRateNumber} from '../../game/infectionRateToken'
const shuffle = require('shuffle-array')
import firebase from 'firebase'
import {app, db} from '../../firebase-server/firebase'
import {GameMenu, PandemicMap} from './index'

class MainGame extends React.Component {
  constructor(props) {
    super(props)
    this._removeCubeCount = 0
    this._outbreak = new Set()
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
      win: 0,
      lose: 0,
      actionCount: 0,
      infectionRate: 0,
      outbreaks: 0,
      blueCubes: 0,
      redCubes: 0,
      blackCubes: 0,
      yellowCubes: 0,
      redCure: 0,
      blueCure: 0,
      blackCure: 0,
      yellowCure: 0
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
            ],
            win: 0,
            lose: 0,
            actionCount: 0,
            infectionRate: 0,
            outbreaks: 0,
            blueCubes: 24,
            redCubes: 24,
            blackCubes: 24,
            yellowCubes: 24,
            redCure: 0,
            blueCure: 0,
            blackCure: 0,
            yellowCure: 0
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
          lose: doc.data().lose,
          blueCubes: doc.data().blueCubes,
          redCubes: doc.data().redCubes,
          blackCubes: doc.data().blackCubes,
          yellowCubes: doc.data().yellowCubes,
          redCure: doc.data().redCure,
          blueCure: doc.data().blueCure,
          blackCure: doc.data().blackCure,
          yellowCure: doc.data().yellowCure
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
          outbreaks: doc.data().outbreaks,
          win: doc.data().win,
          lose: doc.data().lose,
          blueCubes: doc.data().blueCubes,
          redCubes: doc.data().redCubes,
          blackCubes: doc.data().blackCubes,
          yellowCubes: doc.data().yellowCubes
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
    cities.Seoul.red = 1
    // cities.Osaka.red = 3
    cities['San Francisco'].blue = 3
    this.props.game.set({cities: cities}, {merge: true})
    // this.infectWrapper('Tokyo', 'red')
    this.infectWrapper('Seoul', 'red', 3, true)
    // this.infectWrapper('Manila', 'red', 1)
    // this.infectWrapper('Beijing', 'red', 3)
    // this.infectWrapper('Tokyo', 'red', 2)
  }

  testPlayerTurn = () => {
    console.log('before turn')
    this.playerTurn(this.state.currentTurn)
    console.log('after turn')
  }

  reset = () => {
    this.props.game.set(
      {
        cities: cityList,
        redCubes: 24,
        blueCubes: 24,
        yellowCubes: 24,
        blackCubes: 24,
        outbreaks: 0,
        infectionRate: 0,
        playerCardDeck: [],
        playerCardDiscard: [],
        infectionCardDeck: [],
        infectionCardDiscard: []
      },
      {merge: true}
    )
  }
  //*******lara testing functions END*******

  //*********WIN/LOSE CONDITION START*********

  loseCheck = () => {
    console.log('in lose check')
    const updateLose = firebase.firestore.FieldValue.increment(1)
    if (this.state.outbreaks > 7) {
      console.log('outbreaks ded')
      this.props.game.update({lose: updateLose}).then(() => true)
    } else if (this.state.playerCardDeck.length < 1) {
      this.props.game.update({lose: updateLose})
      return true
    } else if (
      this.state.redCubes < 0 ||
      this.state.blueCubes < 0 ||
      this.state.yellowCubes < 0 ||
      this.state.blackCubes < 0
    ) {
      this.props.game.update({lose: updateLose})
      return true
    }
    return false
  }

  //*********WIN/LOSE CONDITION END*********

  //************PLAYER TURN START**************

  isCardEpidemic = card => {
    return card.type === 'epidemic'
  }

  playerInfectStep = (epidemicInfect = null) => {
    let infectDeck
    let oldInfectDiscard
    if (!epidemicInfect) {
      infectDeck = this.state.infectionCardDeck
      oldInfectDiscard = this.state.infectionCardDiscard
    } else {
      infectDeck = epidemicInfect
      oldInfectDiscard = []
    }
    const infectionRate = infectionRateNumber[this.state.infectionRate]
    let addToInfectDiscard = []
    for (let i = 0; i < infectionRate; i++) {
      const infectCard = infectDeck.shift()
      console.log(infectCard)
      addToInfectDiscard.push(infectCard)
      this.infectWrapper(infectCard.city, infectCard.color)
    }
    const newInfectDiscard = [...oldInfectDiscard, ...addToInfectDiscard]
    this.props.game.set(
      {infectionCardDeck: infectDeck, infectionCardDiscard: newInfectDiscard},
      {merge: true}
    )
  }

  epidemicDiscardShuffle = () => {
    const oldInfectDiscard = this.state.infectionCardDiscard
    let oldInfectDeck = this.state.infectionCardDeck
    const epidemicCity = oldInfectDeck.pop()
    const addToInfectDeck = [...oldInfectDiscard, epidemicCity]
    const shuffledAdd = shuffle(addToInfectDeck, {copy: true})
    const newInfectDeck = [...shuffledAdd, ...oldInfectDeck]
    return newInfectDeck
  }

  playerTurn = index => {
    console.log('taking a turn')
    let epidemicFlag = false
    //actions
    while (this.state.actionCount < 4) {
      continue
    }
    //draw cards
    //check if enough cards
    if (this.loseCheck()) {
      console.log('lost')
      return
    }
    let playerCardDeck = this.state.playerCardDeck
    // let playerCardDiscard = this.state.playerCardDiscard //need to figure out how to limit hand size
    let infectionCardDeck = this.state.infectionCardDeck
    const card1 = playerCardDeck.shift()
    const card2 = playerCardDeck.shift()
    let addToHand = []
    if (this.isCardEpidemic(card1)) {
      epidemicFlag = true
      const epidemic = infectionCardDeck[infectionCardDeck.length - 1]
      console.log('epidemic infect card 1', epidemic.city)
      this.infectWrapper(epidemic.city, epidemic.color, 3, true)
      this.playerInfectStep(this.epidemicDiscardShuffle())
      //check lose
      if (this.loseCheck()) {
        console.log('lost')
        return
      }
    } else {
      addToHand.push(card1)
    }
    if (this.isCardEpidemic(card2)) {
      epidemicFlag = true
      const epidemic = infectionCardDeck[infectionCardDeck.length - 1]
      console.log('epidemic infect card2', epidemic.city)
      this.infectWrapper(epidemic.city, epidemic.color, 3, true)
      this.playerInfectStep(this.epidemicDiscardShuffle())
      if (this.loseCheck()) {
        console.log('lost')
        return
      }
    } else {
      addToHand.push(card2)
    }
    let playerList = this.state.playerList
    playerList[index].hand = [...playerList[index].hand, ...addToHand]
    this.props.game.set(
      {playerCardDeck: playerCardDeck, playerList: playerList},
      {merge: true}
    )
    //infect
    if (!epidemicFlag) {
      this.playerInfectStep()
      if (this.loseCheck()) {
        console.log('lost')
        
      }
    }
  }

  //************PLAYER TURN END**************

  //*************INFECTION STEP START**************
  resetAfterInfect = () => {
    this._outbreak = new Set()
    this._removeCubeCount = 0
  }

  outbreakCheck = (city, color) => {
    return this.state.cities[city][color] === 3
  }

  updateCubeCount = (color, n) => {
    const updateCubeBy = firebase.firestore.FieldValue.increment(-n)
    switch (color) {
      case 'red':
        this.props.game.update({redCubes: updateCubeBy})
        break
      case 'blue':
        this.props.game.update({blueCubes: updateCubeBy})
        break
      case 'black':
        this.props.game.update({blackCubes: updateCubeBy})
        break
      case 'yellow':
        this.props.game.update({yellowCubes: updateCubeBy})
        break
      default:
        break
    }
  }

  infectWrapper = (city, color, number = 1, epidemic = false) => {
    this.infectStep(city, color, number, epidemic)
    this.updateCubeCount(color, this._removeCubeCount)
    this.resetAfterInfect()
  }

  //epidemic infect
  epidemicInfect = (city, color) => {
    const updateInfectRate = firebase.firestore.FieldValue.increment(1)
    this.props.game.update({infectionRate: updateInfectRate})
    const cubes = 3
    let cities = this.state.cities
    const willOutbreak = cities[city][color]
    const cubesToSub = 3 - this.state.cities[city][color]
    this._removeCubeCount += cubesToSub
    cities[city][color] = cubes
    this.props.game.set({cities: cities}, {merge: true})
    if (willOutbreak) {
      this.outbreakInfect(city, color)
    }
  }

  //normal infect
  normalInfect = (city, color, number = 1) => {
    const cubes = this.state.cities[city][color] + number
    let cities = this.state.cities
    cities[city][color] = cubes
    this.props.game.set({cities: cities}, {merge: true})
    this._removeCubeCount += number
  }
  //outbreak infect

  outbreakInfect = (city, color) => {
    console.log('OUTBREAK IN ', city)
    if (!this._outbreak.has(city)) {
      const updateOutbreaks = firebase.firestore.FieldValue.increment(1)
      this.props.game.update({outbreaks: updateOutbreaks})
      const cityConnections = connectedCities[city]
      this._outbreak.add(city)
      for (let i = 0; i < cityConnections.length; i++) {
        this.infectStep(cityConnections[i], color)
      }
    }
  }

  infectStep = (city, color, number = 1, epidemic = false) => {
    if (epidemic) {
      //epidemic card
      this.epidemicInfect(city, color)
    } else if (!this.outbreakCheck(city, color)) {
      //normal infect
      this.normalInfect(city, color, number)
    } else {
      //outbreak
      this.outbreakInfect(city, color)
    }
  }
  //*************INFECTION STEP END**************

  //*************GAME SET UP START****************
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
      if (i < 3) {
        shuffledIndex = 8
      } else {
        shuffledIndex = 7
      }
      let tempPile = shuffledPlayerCardDeck.splice(0, shuffledIndex)
      tempPile.push(epidemicCard)
      shuffle(tempPile)
      pile.push(tempPile)
    }
    // console.log('check length', shuffledPlayerCardDeck.length)

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
    threeCubes.forEach(city => this.infectWrapper(city.city, city.color, 3))
    twoCubes.forEach(city => this.infectWrapper(city.city, city.color, 2))
    oneCubes.forEach(city => this.infectWrapper(city.city, city.color))
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
    // this.state.playerCardDeck.map((card, index)=> console.log(index, card.title))
  }
  //**************GAME SET UP END**************

  render() {
    // console.log('game state', this.state.infectionCardDiscard.length)
    return this.state.playerList[0] ? (
      <div id="whole-game-screen">
        <div id="main-game-screen">
          {!this.state.lose ? (
            <PandemicMap
              cityList={this.state.cities}
              infectionRate={this.state.infectionRate}
              outbreaks={this.state.outbreaks}
              playerCardDeck={this.state.playerCardDeck}
              playerCardDiscard={this.state.playerCardDiscard}
              infectionCardDeck={this.state.infectionCardDeck}
              infectionCardDiscard={this.state.infectionCardDiscard}
              playerList={this.state.playerList}
              redCure={this.state.redCure}
              blueCure={this.state.blueCure}
              blackCure={this.state.blackCure}
              yellowCure={this.state.yellowCure}
              lose={this.state.lose}
              win={this.state.win}
            />
          ) : (
            <h1>LOST</h1>
          )}
        </div>
        <ul>
          Infect Deck {this.state.infectionCardDeck.length}
          {this.state.infectionCardDeck.map((card, index) => (
            <li key={index}>{card.city}</li>
          ))}
        </ul>
        <ul>
          Infect Discard {this.state.infectionCardDiscard.length}
          {this.state.infectionCardDiscard.map((card, index) => (
            <li key={index}>{card.city}</li>
          ))}
        </ul>
        <GameMenu
          players={this.state.playerList}
          username={this.props.username}
          turn={this.state.currentTurn}
          startGame={this.startGame}
          testOutbreak={this.testOutbreak}
          testPlayerTurn={this.testPlayerTurn}
          reset={this.reset}
        />
      </div>
    ) : (
      <div>Getting location</div>
    )
  }
}

export default MainGame
