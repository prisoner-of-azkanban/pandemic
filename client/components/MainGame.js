/* eslint-disable complexity */
/* eslint-disable max-statements */
import React from 'react'
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
import {GameMenu, PandemicMap, Lose, Win} from './index'
import {
  isCardEpidemic,
  setupPlayer,
  findMaxPop,
  setupPlayerCards,
  setupPlayerRoles
} from './utils'

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
          name: players[0],
          color: 'lime'
        },
        {
          id: 1,
          event: false,
          role: '',
          turn: false,
          location: 'Atlanta',
          hand: [],
          name: players[1],
          color: 'aqua'
        },
        {
          id: 2,
          event: false,
          role: '',
          turn: false,
          location: 'Atlanta',
          hand: [],
          name: players[2],
          color: 'fuchsia'
        },
        {
          id: 3,
          event: false,
          role: '',
          turn: false,
          location: 'Atlanta',
          hand: [],
          name: players[3],
          color: 'orange'
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
      yellowCure: 0,
      gameStart: 0,
      epidemicList: []
    }
    this.decks = this.props.game.collection('gamestate').doc('decks')
    this.cities = this.props.game.collection('gamestate').doc('cities')
    this.playerList = this.props.game.collection('gamestate').doc('playerList')
    this.cubes = this.props.game.collection('gamestate').doc('cubes')
    this.chatroom = this.props.game.collection('chatroom')
    this.props.game.onSnapshot(this.listenMain)
    this.decks.onSnapshot(this.listenDecks)
    this.cities.onSnapshot(this.listenCities)
    this.playerList.onSnapshot(this.listenPlayerList)
    this.cubes.onSnapshot(this.listenCubes)
  }

  componentDidMount() {
    this._isMounted = true
    const players = this.props.players
    this.cities
      .get()
      .then(doc => {
        if (!doc.data().cities.Atlanta) {
          this.playerList
            .set(
              {
                playerList: [
                  {
                    id: 0,
                    event: false,
                    role: '',
                    turn: false,
                    location: 'Atlanta',
                    hand: [],
                    name: players[0],
                    color: 'lime'
                  },
                  {
                    id: 1,
                    event: false,
                    role: '',
                    turn: false,
                    location: 'Atlanta',
                    hand: [],
                    name: players[1],
                    color: 'aqua'
                  },
                  {
                    id: 2,
                    event: false,
                    role: '',
                    turn: false,
                    location: 'Atlanta',
                    hand: [],
                    name: players[2],
                    color: 'fuchsia'
                  },
                  {
                    id: 3,
                    event: false,
                    role: '',
                    turn: false,
                    location: 'Atlanta',
                    hand: [],
                    name: players[3],
                    color: 'orange'
                  }
                ]
              },
              {merge: true}
            )
            .then(() => {
              this.cities.set({cities: cityList})
            })
        }
      })
      .then(() =>
        this.decks.get().then(doc => {
          if (this._isMounted)
            this.setState({
              playerCardDeck: doc.data().playerCardDeck,
              playerCardDiscard: doc.data().playerCardDiscard,
              infectionCardDeck: doc.data().infectionCardDeck,
              infectionCardDiscard: doc.data().infectionCardDiscard
            })
        })
      )
      .then(() =>
        this.props.game.get().then(doc => {
          if (this._isMounted)
            this.setState({
              currentTurn: doc.data().currentTurn,
              win: doc.data().win,
              lose: doc.data().lose,
              redCure: doc.data().redCure,
              blueCure: doc.data().blueCure,
              blackCure: doc.data().blackCure,
              yellowCure: doc.data().yellowCure,
              gameStart: doc.data().gameStart,
              epidemicList: doc.data().epidemicList
            })
        })
      )
      .then(() =>
        this.cities.get().then(doc => {
          if (this._isMounted)
            this.setState({
              cities: doc.data().cities
            })
        })
      )
      .then(() =>
        this.cubes.get().then(doc => {
          if (this._isMounted)
            this.setState({
              blueCubes: doc.data().blueCubes,
              redCubes: doc.data().redCubes,
              blackCubes: doc.data().blackCubes,
              yellowCubes: doc.data().yellowCubes
            })
        })
      )
      .then(() =>
        this.playerList.get().then(doc => {
          if (this._isMounted)
            this.setState({
              playerList: doc.data().playerList
            })
        })
      )
      .catch(err => {
        console.log('an error has occurred getting the game state', err.message)
        alert('an error has occurred')
      })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this._isMounted) {
      if (this.state.playerList !== prevState.playerList) {
        this.setState({
          playerList: this.state.playerList,
          actionCount: this.state.actionCount
        })
      }
      if (this.state.cities !== prevState.cities) {
        this.setState({
          cities: this.state.cities
        })
      }
      if (this.state.blueCubes !== prevState.blueCubes) {
        this.setState({
          blueCubes: this.state.blueCubes,
          redCubes: this.state.redCubes,
          blackCubes: this.state.blackCubes,
          yellowCubes: this.state.yellowCubes
        })
      }
      if (this.state.blueCure !== prevState.blueCure) {
        this.setState({
          blueCure: this.state.blueCure,
          redCure: this.state.redCure,
          blackCure: this.state.blackCure,
          yellowCure: this.state.yellowCure
        })
      }
      if (this.state.playerCardDeck !== prevState.playerCardDeck) {
        this.setState({
          playerCardDeck: this.state.playerCardDeck,
          playerCardDiscard: this.state.playerCardDiscard,
          infectionCardDeck: this.state.infectionCardDeck,
          infectionCardDiscard: this.state.infectionCardDiscard
        })
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false
    const unsubscribe = this.props.game.onSnapshot(this.listenMain)
    unsubscribe()
  }

  //firebase listeners
  listenMain = () => {
    this.props.game
      .get()
      .then(doc => {
        if (this._isMounted)
          this.setState({
            currentTurn: doc.data().currentTurn,
            infectionRate: doc.data().infectionRate,
            outbreaks: doc.data().outbreaks,
            win: doc.data().win,
            lose: doc.data().lose,
            redCure: doc.data().redCure,
            blueCure: doc.data().blueCure,
            blackCure: doc.data().blackCure,
            yellowCure: doc.data().yellowCure,
            actionCount: doc.data().actionCount,
            gameStart: doc.data().gameStart,
            epidemicList: doc.data().epidemicList
          })
      })
      .catch(err => {
        console.log('an error has occurred getting the game state', err.message)
        alert('an error has occurred')
      })
  }

  listenCubes = () => {
    this.cubes
      .get()
      .then(doc => {
        if (this._isMounted)
          this.setState({
            blueCubes: doc.data().blueCubes,
            redCubes: doc.data().redCubes,
            blackCubes: doc.data().blackCubes,
            yellowCubes: doc.data().yellowCubes
          })
      })
      .catch(err => {
        console.log(
          'an error has occurred getting the cubes state',
          err.message
        )
        alert('an error has occurred')
      })
  }

  listenPlayerList = () => {
    this.playerList
      .get()
      .then(doc => {
        if (this._isMounted) {
          this.setState(() => {
            return {
              playerList: doc.data().playerList
              // actionCount: doc.data().actionCount
            }
          })
        }
      })
      .catch(err => {
        console.log(
          'an error has occurred getting the player list state',
          err.message
        )
        alert('an error has occurred')
      })
  }

  listenDecks = () => {
    this.decks
      .get()
      .then(doc => {
        if (this._isMounted)
          this.setState({
            playerCardDeck: doc.data().playerCardDeck,
            playerCardDiscard: doc.data().playerCardDiscard,
            infectionCardDeck: doc.data().infectionCardDeck,
            infectionCardDiscard: doc.data().infectionCardDiscard
          })
      })
      .catch(err => {
        console.log(
          'an error has occurred getting the decks state',
          err.message
        )
        alert('an error has occurred')
      })
  }

  listenCities = () => {
    this.cities
      .get()
      .then(doc => {
        if (this._isMounted)
          this.setState({
            cities: doc.data().cities
          })
      })
      .catch(err => {
        console.log(
          'an error has occurred getting the cities state',
          err.message
        )
        alert('an error has occurred')
      })
  }

  //************************ACTION METHODS START*************************
  //movement
  handleBasicTravel = city => {
    let allPlayers = [...this.state.playerList]
    allPlayers[this.state.currentTurn].location = city
    this.playerList
      .set({playerList: allPlayers}, {merge: true})
      .then(() => this.incrementAction())
      .then(() => {
        if (this.state.actionCount === 3) {
          this.loseCheck()
          this.playerTurnEnd(this.state.currentTurn)
          this.updatePlayerTurn()
        }
      })
      .then(() =>
        this.chatroom.add({
          username: 'Admin',
          message: `${
            allPlayers[this.state.currentTurn].name
          } has moved to ${city}`,
          createdAt: firebase.firestore.Timestamp.fromDate(new Date())
        })
      )
      .catch(err => {
        console.log(
          'an error has occurred with handle basic travel',
          err.message
        )
        alert('an error has occurred')
      })
  }

  handleOtherFlightSubmit = (cityGo, cardDiscard) => {
    let allPlayers = [...this.state.playerList]
    allPlayers[this.state.currentTurn].location = cityGo
    allPlayers[this.state.currentTurn].hand = allPlayers[
      this.state.currentTurn
    ].hand.filter(card => card.title !== cardDiscard)
    let newDiscard = [...this.state.playerCardDiscard, cardDiscard]
    this.decks.set({playerCardDiscard: newDiscard}, {merge: true})
    this.playerList
      .set({playerList: allPlayers})
      .then(() => this.incrementAction())
      .then(() => {
        if (this.state.actionCount === 3) {
          this.loseCheck()
          this.playerTurnEnd(this.state.currentTurn)
          this.updatePlayerTurn()
        }
      })
      .then(() =>
        this.chatroom.add({
          username: 'Admin',
          message: `${
            allPlayers[this.state.currentTurn].name
          } has moved to ${cityGo}`,
          createdAt: firebase.firestore.Timestamp.fromDate(new Date())
        })
      )
      .catch(err => {
        console.log('an error has occurred with the flight action', err.message)
        alert('an error has occurred')
      })
  }

  //build research station
  handleResearchSubmit = () => {
    let allPlayers = [...this.state.playerList]
    let allCities = {...this.state.cities}
    let currentCity = allPlayers[this.state.currentTurn].location
    allCities[currentCity].research = true
    this.cities.set({cities: allCities})
    allPlayers[this.state.currentTurn].hand = allPlayers[
      this.state.currentTurn
    ].hand.filter(card => card.title !== currentCity)
    const discardCard = playerCards.filter(
      card => card.title === currentCity
    )[0]
    let newDiscard = [...this.state.playerCardDiscard, discardCard]
    this.decks.set({playerCardDiscard: newDiscard}, {merge: true})
    this.playerList
      .set({playerList: allPlayers})
      .then(() => this.incrementAction())
      .then(() => {
        if (this.state.actionCount === 3) {
          this.loseCheck()
          this.playerTurnEnd(this.state.currentTurn)
          this.updatePlayerTurn()
        }
      })
      .then(() =>
        this.chatroom.add({
          username: 'Admin',
          message: `${
            allPlayers[this.state.currentTurn].name
          } has built a research station in ${currentCity}`,
          createdAt: firebase.firestore.Timestamp.fromDate(new Date())
        })
      )
      .catch(err => {
        console.log(
          'an error has occurred with the research action',
          err.message
        )
        alert('an error has occurred')
      })
  }

  // share/take knowledge
  handleKnowledgeSubmit = (playerGive, playerTake, card) => {
    let allPlayers = [...this.state.playerList]
    let transferredCard = playerCards.filter(
      allCards => allCards.title === card
    )
    let newPlayers = allPlayers.map(player => {
      if (player.name === playerGive) {
        player.hand = player.hand.filter(
          playerCard => playerCard.title !== card
        )
      }
      if (player.name === playerTake) {
        player.hand = [...player.hand, ...transferredCard]
      }
      return player
    })
    this.playerList
      .set({playerList: newPlayers}, {merge: true})
      .then(() => this.incrementAction())
      .then(() => {
        if (this.state.actionCount === 3) {
          this.loseCheck()
          this.playerTurnEnd(this.state.currentTurn)
          this.updatePlayerTurn()
        }
      })
      .then(() =>
        this.chatroom.add({
          username: 'Admin',
          message: `${playerGive} has shared knowledge of ${card} with ${playerTake}`,
          createdAt: firebase.firestore.Timestamp.fromDate(new Date())
        })
      )
      .catch(err => {
        console.log(
          'an error has occurred with the knowledge action',
          err.message
        )
        alert('an error has occurred')
      })
  }

  //treat
  handleTreatSubmit = color => {
    let removedCubeCount = 0
    //need to deal w below
    let supply = firebase.firestore.FieldValue.increment(removedCubeCount)
    const eradicate = firebase.firestore.FieldValue.increment(1)
    let allPlayers = [...this.state.playerList]
    let allCities = {...this.state.cities}
    this.chatroom.add({
      username: 'Admin',
      message: `${
        allPlayers[this.state.currentTurn].name
      } has treated ${color} in ${allPlayers[this.state.currentTurn].location}`,
      createdAt: firebase.firestore.Timestamp.fromDate(new Date())
    })

    switch (color) {
      case 'red':
        if (this.state.redCure === 1) {
          removedCubeCount =
            allCities[allPlayers[this.state.currentTurn].location].red
          supply = firebase.firestore.FieldValue.increment(removedCubeCount)
          allCities[allPlayers[this.state.currentTurn].location].red = 0
          this.cubes
            .update({redCubes: supply})
            .then(() => {
              if (this.state.redCubes === 24) {
                this.props.game.update({redCure: eradicate}).then(() =>
                  this.chatroom.add({
                    username: 'Admin',
                    message: `${
                      allPlayers[this.state.currentTurn].name
                    } has eradicated red`,
                    createdAt: firebase.firestore.Timestamp.fromDate(new Date())
                  })
                )
              }
            })
            .catch(err => {
              console.log(
                'an error has occurred with the treat action',
                err.message
              )
              alert('an error has occurred')
            })
        } else if (this.state.redCure === 0) {
          removedCubeCount = 1
          supply = firebase.firestore.FieldValue.increment(removedCubeCount)
          allCities[allPlayers[this.state.currentTurn].location].red--
          this.cubes.update({redCubes: supply}).catch(err => {
            console.log(
              'an error has occurred with the treat action',
              err.message
            )
            alert('an error has occurred')
          })
        }
        this.cities
          .set({cities: allCities}, {merge: true})
          .then(() => this.incrementAction())
          .then(() => {
            if (this.state.actionCount === 3) {
              this.loseCheck()
              this.playerTurnEnd(this.state.currentTurn)
              this.updatePlayerTurn()
            }
          })
          .catch(err => {
            console.log(
              'an error has occurred with the treat action',
              err.message
            )
            alert('an error has occurred')
          })
        break

      case 'blue':
        if (this.state.blueCure === 1) {
          removedCubeCount =
            allCities[allPlayers[this.state.currentTurn].location].blue
          supply = firebase.firestore.FieldValue.increment(removedCubeCount)
          allCities[allPlayers[this.state.currentTurn].location].blue = 0
          this.cubes
            .update({blueCubes: supply})
            .then(() => {
              if (this.state.blueCubes === 24) {
                this.props.game.update({blueCure: eradicate}).then(() =>
                  this.chatroom.add({
                    username: 'Admin',
                    message: `${
                      allPlayers[this.state.currentTurn].name
                    } has eradicated blue`,
                    createdAt: firebase.firestore.Timestamp.fromDate(new Date())
                  })
                )
              }
            })
            .catch(err => {
              console.log(
                'an error has occurred with the treat action',
                err.message
              )
              alert('an error has occurred')
            })
        } else if (this.state.blueCure === 0) {
          removedCubeCount = 1
          supply = firebase.firestore.FieldValue.increment(removedCubeCount)
          allCities[allPlayers[this.state.currentTurn].location].blue--
          this.cubes.update({blueCubes: supply}).catch(err => {
            console.log(
              'an error has occurred with the treat action',
              err.message
            )
            alert('an error has occurred')
          })
        }
        this.cities
          .set({cities: allCities}, {merge: true})
          .then(() => this.incrementAction())
          .then(() => {
            if (this.state.actionCount === 3) {
              this.loseCheck()
              this.playerTurnEnd(this.state.currentTurn)
              this.updatePlayerTurn()
            }
          })
          .catch(err => {
            console.log(
              'an error has occurred with the treat action',
              err.message
            )
            alert('an error has occurred')
          })

        break

      case 'yellow':
        if (this.state.yellowCure === 1) {
          removedCubeCount =
            allCities[allPlayers[this.state.currentTurn].location].yellow
          supply = firebase.firestore.FieldValue.increment(removedCubeCount)
          allCities[allPlayers[this.state.currentTurn].location].yellow = 0
          this.cubes
            .update({yellowCubes: supply})
            .then(() => {
              if (this.state.yellowCubes === 24) {
                this.props.game.update({yellowCure: eradicate}).then(() =>
                  this.chatroom.add({
                    username: 'Admin',
                    message: `${
                      allPlayers[this.state.currentTurn].name
                    } has eradicated yellow`,
                    createdAt: firebase.firestore.Timestamp.fromDate(new Date())
                  })
                )
              }
            })
            .catch(err => {
              console.log(
                'an error has occurred with the treat action',
                err.message
              )
              alert('an error has occurred')
            })
        } else if (this.state.yellowCure === 0) {
          removedCubeCount = 1
          supply = firebase.firestore.FieldValue.increment(removedCubeCount)
          allCities[allPlayers[this.state.currentTurn].location].yellow--
          this.cubes.update({yellowCubes: supply}).catch(err => {
            console.log(
              'an error has occurred with the treat action',
              err.message
            )
            alert('an error has occurred')
          })
        }
        this.cities
          .set({cities: allCities}, {merge: true})
          .then(() => this.incrementAction())
          .then(() => {
            if (this.state.actionCount === 3) {
              this.loseCheck()
              this.playerTurnEnd(this.state.currentTurn)
              this.updatePlayerTurn()
            }
          })
          .catch(err => {
            console.log(
              'an error has occurred with the treat action',
              err.message
            )
            alert('an error has occurred')
          })

        break

      case 'black':
        if (this.state.blackCure === 1) {
          removedCubeCount =
            allCities[allPlayers[this.state.currentTurn].location].black
          supply = firebase.firestore.FieldValue.increment(removedCubeCount)
          allCities[allPlayers[this.state.currentTurn].location].black = 0
          this.cubes
            .update({blackCubes: supply})
            .then(() => {
              if (this.state.blackCubes === 24) {
                this.props.game.update({blackCure: eradicate}).then(() =>
                  this.chatroom.add({
                    username: 'Admin',
                    message: `${
                      allPlayers[this.state.currentTurn].name
                    } has eradicated black`,
                    createdAt: firebase.firestore.Timestamp.fromDate(new Date())
                  })
                )
              }
            })
            .catch(err => {
              console.log(
                'an error has occurred with the treat action',
                err.message
              )
              alert('an error has occurred')
            })
        } else if (this.state.blackCure === 0) {
          removedCubeCount = 1
          supply = firebase.firestore.FieldValue.increment(removedCubeCount)
          allCities[allPlayers[this.state.currentTurn].location].black--
          this.cubes.update({blackCubes: supply}).catch(err => {
            console.log(
              'an error has occurred with the treat action',
              err.message
            )
            alert('an error has occurred')
          })
        }
        this.cities
          .set({cities: allCities}, {merge: true})
          .then(() => this.incrementAction())
          .then(() => {
            if (this.state.actionCount === 3) {
              this.loseCheck()
              this.playerTurnEnd(this.state.currentTurn)
              this.updatePlayerTurn()
            }
          })
          .catch(err => {
            console.log(
              'an error has occurred with the treat action',
              err.message
            )
            alert('an error has occurred')
          })

        break

      default:
        break
    }
  }

  //find cure
  handleCureSubmit = (cards, color) => {
    const eradicate = firebase.firestore.FieldValue.increment(2)
    const cure = firebase.firestore.FieldValue.increment(1)
    // const cardNames = new Set(cards)
    let allPlayers = [...this.state.playerList]
    let playerCardDiscard = [...this.state.playerCardDiscard]
    let allCities = {...this.state.cities}
    if (allCities[allPlayers[this.state.currentTurn].location].research) {
      const colored = cards.filter(card => card.color === color).length === 4
      let cured
      let cubes
      switch (color) {
        case 'red':
          cured = this.state.redCure
          cubes = this.state.redCubes
          if (colored && !cured) {
            if (cubes === 24) {
              this.props.game
                .update({redCure: eradicate})
                .then(() =>
                  this.chatroom.add({
                    username: 'Admin',
                    message: `${
                      allPlayers[this.state.currentTurn].name
                    } has eradicated red`,
                    createdAt: firebase.firestore.Timestamp.fromDate(new Date())
                  })
                )
                .then(() => this.winCheck())
                .catch(err => {
                  console.log(
                    'an error has occurred with the cure action',
                    err.message
                  )
                  alert('an error has occurred')
                })
            } else {
              this.props.game
                .update({redCure: cure})
                .then(() =>
                  this.chatroom.add({
                    username: 'Admin',
                    message: `${
                      allPlayers[this.state.currentTurn].name
                    } has cured red`,
                    createdAt: firebase.firestore.Timestamp.fromDate(new Date())
                  })
                )
                .then(() => this.winCheck())
                .catch(err => {
                  console.log(
                    'an error has occurred with the cure action',
                    err.message
                  )
                  alert('an error has occurred')
                })
            }
          }
          break
        case 'blue':
          cured = this.state.blueCure
          cubes = this.state.blueCubes
          if (colored && !cured) {
            if (cubes === 24) {
              this.props.game
                .update({blueCure: eradicate})
                .then(() =>
                  this.chatroom.add({
                    username: 'Admin',
                    message: `${
                      allPlayers[this.state.currentTurn].name
                    } has eradicated blue`,
                    createdAt: firebase.firestore.Timestamp.fromDate(new Date())
                  })
                )
                .then(() => this.winCheck())
                .catch(err => {
                  console.log(
                    'an error has occurred with the cure action',
                    err.message
                  )
                  alert('an error has occurred')
                })
            } else {
              this.props.game
                .update({blueCure: cure})
                .then(() =>
                  this.chatroom.add({
                    username: 'Admin',
                    message: `${
                      allPlayers[this.state.currentTurn].name
                    } has cured blue`,
                    createdAt: firebase.firestore.Timestamp.fromDate(new Date())
                  })
                )
                .then(() => this.winCheck())
                .catch(err => {
                  console.log(
                    'an error has occurred with the cure action',
                    err.message
                  )
                  alert('an error has occurred')
                })
            }
          }
          break
        case 'yellow':
          cured = this.state.yellowCure
          cubes = this.state.yellowCubes
          if (colored && !cured) {
            if (cubes === 24) {
              this.props.game
                .update({yellowCure: eradicate})
                .then(() =>
                  this.chatroom.add({
                    username: 'Admin',
                    message: `${
                      allPlayers[this.state.currentTurn].name
                    } has eradicated yellow`,
                    createdAt: firebase.firestore.Timestamp.fromDate(new Date())
                  })
                )
                .then(() => this.winCheck())
                .catch(err => {
                  console.log(
                    'an error has occurred with the cure action',
                    err.message
                  )
                  alert('an error has occurred')
                })
            } else {
              this.props.game
                .update({yellowCure: cure})
                .then(() =>
                  this.chatroom.add({
                    username: 'Admin',
                    message: `${
                      allPlayers[this.state.currentTurn].name
                    } has cured yellow`,
                    createdAt: firebase.firestore.Timestamp.fromDate(new Date())
                  })
                )
                .then(() => this.winCheck())
                .catch(err => {
                  console.log(
                    'an error has occurred with the cure action',
                    err.message
                  )
                  alert('an error has occurred')
                })
            }
          }
          break
        case 'black':
          cured = this.state.blackCure
          cubes = this.state.blackCubes
          if (colored && !cured) {
            if (cubes === 24) {
              this.props.game
                .update({blackCure: eradicate})
                .then(() =>
                  this.chatroom.add({
                    username: 'Admin',
                    message: `${
                      allPlayers[this.state.currentTurn].name
                    } has eradicated black`,
                    createdAt: firebase.firestore.Timestamp.fromDate(new Date())
                  })
                )
                .then(() => this.winCheck())
                .catch(err => {
                  console.log(
                    'an error has occurred with the cure action',
                    err.message
                  )
                  alert('an error has occurred')
                })
            } else {
              this.props.game
                .update({blackCure: cure})
                .then(() =>
                  this.chatroom.add({
                    username: 'Admin',
                    message: `${
                      allPlayers[this.state.currentTurn].name
                    } has cured black`,
                    createdAt: firebase.firestore.Timestamp.fromDate(new Date())
                  })
                )
                .then(() => this.winCheck())
                .catch(err => {
                  console.log(
                    'an error has occurred with the cure action',
                    err.message
                  )
                  alert('an error has occurred')
                })
            }
          }
          break
        default:
          break
      }
      if (colored) {
        console.log('trying to remove card')
        console.log(cards)
        // console.log(cardNames)
        let givePlayer = allPlayers[this.state.currentTurn]
        let discardHand = []
        let newHand = []
        const cityNames = cards.map(card => card.title)
        for (let i = 0; i < givePlayer.hand.length; i++) {
          // console.log(givePlayer.hand[i])
          // console.log(cityNames.includes(givePlayer.hand[i].title))
          if (cityNames.includes(givePlayer.hand[i].title)) {
            discardHand.push(givePlayer.hand[i])
          } else {
            newHand.push(givePlayer.hand[i])
          }
        }
        allPlayers[this.state.currentTurn].hand = newHand
        this.playerList
          .set({playerList: allPlayers}, {merge: true})
          .catch(err => {
            console.log(
              'an error has occurred with the cure action',
              err.message
            )
            alert('an error has occurred')
          })
        playerCardDiscard = [...this.state.playerCardDiscard, ...discardHand]
        this.decks
          .set({playerCardDiscard: playerCardDiscard}, {merge: true})
          .then(() => this.incrementAction())
          .then(() => {
            if (this.state.actionCount === 3) {
              this.loseCheck()
              this.playerTurnEnd(this.state.currentTurn)
              this.updatePlayerTurn()
            }
          })
          .catch(err => {
            console.log(
              'an error has occurred with the cure action',
              err.message
            )
            alert('an error has occurred')
          })
      }
    }
  }
  //************************ACTION METHODS END*************************

  //***********************WIN/LOSE CONDITION START********************
  winCheck = () => {
    const updateWin = firebase.firestore.FieldValue.increment(1)
    if (
      this.state.redCure &&
      this.state.blueCure &&
      this.state.blackCure &&
      this.state.yellowCure
    ) {
      this.props.game
        .update({win: updateWin})
        .then(() => true)
        .then(() =>
          this.chatroom.add({
            username: 'Admin',
            message: `Congratulations, you win the game!`,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date())
          })
        )
        .catch(err => {
          console.log('an error has occurred with the win check', err.message)
          alert('an error has occurred')
        })
    }
    return false
  }

  loseCheck = () => {
    const updateLose = firebase.firestore.FieldValue.increment(1)
    if (this.state.outbreaks > 7) {
      this.props.game
        .update({lose: updateLose})
        .then(() => true)
        .then(() =>
          this.chatroom.add({
            username: 'Admin',
            message: `Too many outbreaks - a worldwide panic has occurred. Game over.`,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date())
          })
        )
        .catch(err => {
          console.log('an error has occurred with the lose check', err.message)
          alert('an error has occurred')
        })
    } else if (this.state.playerCardDeck.length < 2) {
      this.props.game
        .update({lose: updateLose})
        .then(() => true)
        .then(() => true)
        .then(() =>
          this.chatroom.add({
            username: 'Admin',
            message: `You have run out of time. Game over.`,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date())
          })
        )
        .catch(err => {
          console.log('an error has occurred with the lose check', err.message)
          alert('an error has occurred')
        })
    } else if (
      this.state.redCubes < 0 ||
      this.state.blueCubes < 0 ||
      this.state.yellowCubes < 0 ||
      this.state.blackCubes < 0
    ) {
      this.props.game
        .update({lose: updateLose})
        .then(() => true)
        .then(() => true)
        .then(() =>
          this.chatroom.add({
            username: 'Admin',
            message: `The disease has spread too much - game over.`,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date())
          })
        )
        .catch(err => {
          console.log('an error has occurred with the lose check', err.message)
          alert('an error has occurred')
        })
    }
    return false
  }
  //*********WIN/LOSE CONDITION END*********

  //************END OF PLAYER TURN START**************
  incrementAction = () => {
    const incrementAction = firebase.firestore.FieldValue.increment(1)
    this.props.game.update({actionCount: incrementAction}).catch(err => {
      console.log(
        'an error has occurred with the increment action',
        err.message
      )
      alert('an error has occurred')
    })
  }

  updatePlayerTurn = () => {
    let turn = this.state.currentTurn
    let allPlayers = this.state.playerList
    allPlayers[turn].turn = false
    turn = (turn + 1) % 4
    allPlayers[turn].turn = true
    this.playerList
      .set({playerList: allPlayers}, {merge: true})
      .then(() =>
        this.chatroom.add({
          username: 'Admin',
          message: `It is now ${allPlayers[turn].name}'s turn`,
          createdAt: firebase.firestore.Timestamp.fromDate(new Date())
        })
      )
      .catch(err => {
        console.log(
          'an error has occurred with update player turn',
          err.message
        )
        alert('an error has occurred')
      })
    this.props.game
      .set({currentTurn: turn, actionCount: 0}, {merge: true})
      .catch(err => {
        console.log(
          'an error has occurred with update player turn',
          err.message
        )
        alert('an error has occurred')
      })
  }

  // isCardEpidemic = card => {
  //   return card.type === 'epidemic'
  // }

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
      addToInfectDiscard.push(infectCard)
      this.infectWrapper(infectCard.city, infectCard.color)
    }
    const newInfectDiscard = [...oldInfectDiscard, ...addToInfectDiscard]
    this.decks
      .set(
        {infectionCardDeck: infectDeck, infectionCardDiscard: newInfectDiscard},
        {merge: true}
      )
      .then(() =>
        addToInfectDiscard.forEach(card =>
          this.chatroom.add({
            username: 'Admin',
            message: `${card.city} has been infected!`,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date())
          })
        )
      )
      .catch(err => {
        console.log('an error has occurred with the infect step', err.message)
        alert('an error has occurred')
      })
  }

  //for when epidemic happens, need to put cards back into deck, cannot use current state
  epidemicDiscardShuffle = (infectionDeck = null) => {
    const oldInfectDiscard = this.state.infectionCardDiscard
    let oldInfectDeck
    let newInfectDeck
    if (infectionDeck) {
      oldInfectDeck = infectionDeck
      const epidemicCity = oldInfectDeck.pop()
      newInfectDeck = [epidemicCity, ...oldInfectDeck]
    } else {
      oldInfectDeck = this.state.infectionCardDeck
      const epidemicCity = oldInfectDeck.pop()
      const addToInfectDeck = [...oldInfectDiscard, epidemicCity]
      const shuffledAdd = shuffle(addToInfectDeck, {copy: true})
      newInfectDeck = [...shuffledAdd, ...oldInfectDeck]
    }
    console.log(infectionDeck === null, newInfectDeck)
    return newInfectDeck
  }

  playerTurnEnd = index => {
    let epidemicFlag = false
    let playerCardDeck = this.state.playerCardDeck
    let infectionCardDeck = this.state.infectionCardDeck
    //draw 2 cards
    const card1 = playerCardDeck.shift()
    const card2 = playerCardDeck.shift()
    let addToHand = []
    //check if card1 epidemic, resolve
    if (isCardEpidemic(card1) && isCardEpidemic(card2)) {
      epidemicFlag = true
      const epidemic1 = infectionCardDeck[infectionCardDeck.length - 1]
      let newEpidemicList = [...this.state.epidemicList, epidemic1]
      this.props.game
        .set({epidemicList: newEpidemicList}, {merge: true})
        .then(() =>
          this.chatroom.add({
            username: 'Admin',
            message: `${epidemic1.city} has broken out in an epidemic!`,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date())
          })
        )
        .catch(error => {
          console.log(
            'an error has occurred setting the epidemic list',
            error.message
          )
          alert('an error has occurred')
        })
      this.infectWrapper(epidemic1.city, epidemic1.color, 3, true)
      const infectDeck1 = this.epidemicDiscardShuffle()
      const epidemic2 = infectionCardDeck[infectionCardDeck.length - 1]
      newEpidemicList.push(epidemic2)
      this.props.game
        .set({epidemicList: newEpidemicList}, {merge: true})
        .then(() =>
          this.props.game.collection('chatroom').add({
            username: 'Admin',
            message: `${epidemic2.city} has broken out in an epidemic!`,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date())
          })
        )
        .catch(error => {
          console.log(
            'an error has occurred setting the epidemic list',
            error.message
          )
          alert('an error has occurred')
        })
      this.infectWrapper(epidemic2.city, epidemic2.color, 3, true)
      const infectDeck2 = this.epidemicDiscardShuffle(infectDeck1)
      this.playerInfectStep(infectDeck2)
    } else {
      if (isCardEpidemic(card1)) {
        epidemicFlag = true
        const epidemic = infectionCardDeck[infectionCardDeck.length - 1]
        const newEpidemicList = [...this.state.epidemicList, epidemic]
        this.props.game
          .set({epidemicList: newEpidemicList}, {merge: true})
          .then(() =>
            this.props.game.collection('chatroom').add({
              username: 'Admin',
              message: `${epidemic.city} has broken out in an epidemic!`,
              createdAt: firebase.firestore.Timestamp.fromDate(new Date())
            })
          )
          .catch(error => {
            console.log(
              'an error has occurred setting the epidemic list',
              error.message
            )
            alert('an error has occurred')
          })
        this.infectWrapper(epidemic.city, epidemic.color, 3, true)
        this.playerInfectStep(this.epidemicDiscardShuffle())
      } else {
        addToHand.push(card1)
      }
      //check if card2 epidemic, resolve
      if (isCardEpidemic(card2)) {
        epidemicFlag = true
        const epidemic = infectionCardDeck[infectionCardDeck.length - 1]
        const newEpidemicList = [...this.state.epidemicList, epidemic]
        this.props.game
          .set({epidemicList: newEpidemicList}, {merge: true})
          .then(() =>
            this.props.game.collection('chatroom').add({
              username: 'Admin',
              message: `${epidemic.city} has broken out in an epidemic!`,
              createdAt: firebase.firestore.Timestamp.fromDate(new Date())
            })
          )
          .catch(error => {
            console.log(
              'an error has occurred setting the epidemic list',
              error.message
            )
            alert('an error has occurred')
          })
        this.infectWrapper(epidemic.city, epidemic.color, 3, true)
        this.playerInfectStep(this.epidemicDiscardShuffle())
      } else {
        addToHand.push(card2)
      }
    }
    let playerList = this.state.playerList
    //add non-epidemic cards to hand
    playerList[index].hand = [...playerList[index].hand, ...addToHand]
    this.playerList.set({playerList: playerList}, {merge: true}).catch(err => {
      console.log(
        'an error has occurred with the player turn resolution',
        err.message
      )
      alert('an error has occurred')
    })
    this.decks
      .set({playerCardDeck: playerCardDeck}, {merge: true})
      .catch(err => {
        console.log(
          'an error has occurred with the player turn resolution',
          err.message
        )
        alert('an error has occurred')
      })
    //infect if not epidemic
    if (!epidemicFlag) {
      this.playerInfectStep()
    }
  }
  //************END OF PLAYER TURN END**************

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
        this.cubes
          .update({redCubes: updateCubeBy})
          .then(() => this.loseCheck())
          .catch(err => {
            console.log(
              'an error has occurred with updating the cube count',
              err.message
            )
            alert('an error has occurred')
          })
        break
      case 'blue':
        this.cubes
          .update({blueCubes: updateCubeBy})
          .then(() => this.loseCheck())
          .catch(err => {
            console.log(
              'an error has occurred with updating the cube count',
              err.message
            )
            alert('an error has occurred')
          })
        break
      case 'black':
        this.cubes
          .update({blackCubes: updateCubeBy})
          .then(() => this.loseCheck())
          .catch(err => {
            console.log(
              'an error has occurred with updating the cube count',
              err.message
            )
            alert('an error has occurred')
          })
        break
      case 'yellow':
        this.cubes
          .update({yellowCubes: updateCubeBy})
          .then(() => this.loseCheck())
          .catch(err => {
            console.log(
              'an error has occurred with updating the cube count',
              err.message
            )
            alert('an error has occurred')
          })

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
    this.props.game
      .update({infectionRate: updateInfectRate})
      .then(() =>
        this.chatroom.add({
          username: 'Admin',
          message: `The infection rate has increased to ${
            infectionRateNumber[this.state.infectionRate]
          }`,
          createdAt: firebase.firestore.Timestamp.fromDate(new Date())
        })
      )
      .catch(err => {
        console.log(
          'an error has occurred with the epidemic infect stage',
          err.message
        )
        alert('an error has occurred')
      })
    const cubes = 3
    let cities = this.state.cities
    const willOutbreak = cities[city][color]
    const cubesToSub = 3 - this.state.cities[city][color]
    this._removeCubeCount += cubesToSub
    cities[city][color] = cubes
    this.cities.set({cities: cities}, {merge: true}).catch(err => {
      console.log(
        'an error has occurred with the epidemic infect stage',
        err.message
      )
      alert('an error has occurred')
    })
    if (willOutbreak) {
      this.outbreakInfect(city, color)
    }
  }

  //normal infect
  normalInfect = (city, color, number = 1) => {
    const cubes = this.state.cities[city][color] + number
    let cities = this.state.cities
    cities[city][color] = cubes
    this.cities.set({cities: cities}, {merge: true}).catch(err => {
      console.log(
        'an error has occurred with the normal infect stage',
        err.message
      )
      alert('an error has occurred')
    })
    this._removeCubeCount += number
  }
  //outbreak infect
  outbreakInfect = (city, color) => {
    if (!this._outbreak.has(city)) {
      // console.log('OUTBREAK IN ', city)
      const updateOutbreaks = firebase.firestore.FieldValue.increment(1)
      this.props.game
        .update({outbreaks: updateOutbreaks})
        .then(() =>
          this.props.game.collection('chatroom').add({
            username: 'Admin',
            message: `${city} has broken out and ${color} disease is spreading!`,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date())
          })
        )
        .then(() => this.loseCheck())
        .catch(err => {
          console.log(
            'an error has occurred with the outbreak infect stage',
            err.message
          )
          alert('an error has occurred')
        })
      const cityConnections = connectedCities[city]
      this._outbreak.add(city)
      for (let i = 0; i < cityConnections.length; i++) {
        // console.log('outbreak infect', cityConnections[i])
        this.infectStep(cityConnections[i], color)
      }
    }
  }

  infectStep = (city, color, number = 1, epidemic = false) => {
    switch (color) { //checks if eradicated
      case 'red':
        if (this.state.redCure !== 2) {
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
        break
      case 'blue':
        if (this.state.blueCure !== 2) {
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

        break
      case 'black':
        if (this.state.blackCure !== 2) {
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

        break
      case 'yellow':
        if (this.state.yellowCure !== 2) {
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
        break
      default:
        break
    }
  }
  //*************INFECTION STEP END**************

  //*************GAME SET UP START****************
  // setupPlayerRoles = (players, roleDeck) => {
  //   let shuffledRoles = shuffle(roleDeck, {copy: true})
  //   return players.map(role => (role = shuffledRoles.shift()))
  // }

  // setupPlayerCards = (players, cardDeck) => {
  //   let shuffledPlayerCardDeck = shuffle(cardDeck, {copy: true})
  //   return players.map(player => (player = shuffledPlayerCardDeck.splice(0, 2)))
  // }

  //see who goes first
  // findMaxPop = playerHands => {
  //   let playerPop = playerHands.map(hand =>
  //     hand.map(card => parseInt(card.population, 10))
  //   )
  //   let turns = playerPop.map(pop => Math.max(...pop))
  //   return [Math.max(...playerPop.map(pop => Math.max(...pop))), turns]
  // }

  //sets up player
  // setupPlayer = (player, playerHand, roles, turns, index) => {
  //   return {
  //     ...player,
  //     turn: turns[index],
  //     event: playerHand.filter(card => card.type === 'event').length > 0,
  //     hand: playerHand,
  //     role: roles[index]
  //   }
  // }

  // eslint-disable-next-line max-statements
  startGame = () => {
    this.props.game.set({gameStart: 1}, {merge: true})
    //shuffle roles
    let roles = setupPlayerRoles(this.props.players, roleCards)

    //shuffle player deck
    let shuffledPlayerCardDeck = shuffle(playerCards, {copy: true})
    let extraCards = shuffle(playerCards, {copy: true})
    shuffledPlayerCardDeck = [
      ...shuffledPlayerCardDeck,
      ...extraCards.slice(0, 5)
    ]

    //deal out player cards
    let hands = []
    for (let i = 0; i < 4; i++) {
      hands.push(shuffledPlayerCardDeck.splice(0, 2))
    }

    //find max population
    const turnsMapPop = findMaxPop(hands)
    const maxPop = turnsMapPop[0]
    let turns = turnsMapPop[1]
    turns = turns.map(pop => pop === maxPop)
    const playerFirst = turns.indexOf(true)

    let pile = []
    for (let i = 0; i < 4; i++) {
      let shuffledIndex
      if (i < 3) {
        shuffledIndex = 11
      } else {
        shuffledIndex = 12
      }
      let tempPile = shuffledPlayerCardDeck.splice(0, shuffledIndex)
      tempPile.push(epidemicCard)
      shuffle(tempPile)
      pile.push(tempPile)
    }

    const playerCardDeck = shuffle(pile).flat() //shuffle pile order and combine

    //shuffle infection cards
    let shuffledInfectionDeck = shuffle(infectionCards, {copy: true})
    let threeCubes = shuffledInfectionDeck.splice(0, 3)
    let twoCubes = shuffledInfectionDeck.splice(0, 3)
    let oneCubes = shuffledInfectionDeck.splice(0, 3)

    threeCubes.forEach(city => this.infectWrapper(city.city, city.color, 3))
    twoCubes.forEach(city => this.infectWrapper(city.city, city.color, 2))
    oneCubes.forEach(city => this.infectWrapper(city.city, city.color))
    //add cards to infect discard
    const infectionDiscard = [threeCubes, twoCubes, oneCubes].flat()
    //set state for game start
    let playerList = []
    playerList.push(
      setupPlayer(this.state.playerList[0], hands[0], roles, turns, 0)
    )
    playerList.push(
      setupPlayer(this.state.playerList[1], hands[1], roles, turns, 1)
    )
    playerList.push(
      setupPlayer(this.state.playerList[2], hands[2], roles, turns, 2)
    )
    playerList.push(
      setupPlayer(this.state.playerList[3], hands[3], roles, turns, 3)
    )
    this.props.game.set(
      {
        currentTurn: playerFirst
      },
      {merge: true}
    )
    this.playerList.set({
      playerList: playerList
    })
    this.decks
      .set(
        {
          playerCardDeck: playerCardDeck,
          infectionCardDiscard: infectionDiscard,
          infectionCardDeck: shuffledInfectionDeck
        },
        {merge: true}
      )
      .then(() =>
        this.chatroom.add({
          username: 'Admin',
          message: `Cards have been dealt, it is ${
            playerList[playerFirst].name
          }'s turn`,
          createdAt: firebase.firestore.Timestamp.fromDate(new Date())
        })
      )
      .catch(err => {
        console.log('an error has occurred with the game setup', err.message)
        alert('an error has occurred')
      })
  }
  //**************GAME SET UP END**************

  render() {
    return this.state.win ? (
      <Win />
    ) : this.state.lose ? (
      <Lose />
    ) : this.state.playerList[0] ? (
      <div id="whole-game-screen">
        <div id="main-game-screen">
          <PandemicMap
            cityList={this.state.cities}
            infectionRate={this.state.infectionRate}
            outbreaks={this.state.outbreaks}
            playerCardDeck={this.state.playerCardDeck}
            playerCardDiscard={this.state.playerCardDiscard}
            infectionCardDeck={this.state.infectionCardDeck}
            infectionCardDiscard={this.state.infectionCardDiscard}
            playerList={this.state.playerList}
            redCubes={this.state.redCubes}
            blueCubes={this.state.blueCubes}
            blackCubes={this.state.blackCubes}
            yellowCubes={this.state.yellowCubes}
            redCure={this.state.redCure}
            blueCure={this.state.blueCure}
            blackCure={this.state.blackCure}
            yellowCure={this.state.yellowCure}
            lose={this.state.lose}
            win={this.state.win}
          />
        </div>

        {this.state.cities.Atlanta ? ( //checks to see if data has been obtained first
          <GameMenu
            players={this.state.playerList}
            username={this.props.username}
            turn={this.state.currentTurn}
            startGame={this.startGame}
            cities={this.state.cities}
            handleBasicTravel={this.handleBasicTravel}
            handleResearchSubmit={this.handleResearchSubmit}
            handleOtherFlightSubmit={this.handleOtherFlightSubmit}
            handleTreatSubmit={this.handleTreatSubmit}
            handleKnowledgeSubmit={this.handleKnowledgeSubmit}
            handleCureSubmit={this.handleCureSubmit}
            infectionCardDeck={this.state.infectionCardDeck}
            infectionCardDiscard={this.state.infectionCardDiscard}
            gameStart={this.state.gameStart}
            epidemicList={this.state.epidemicList}
            blackCure={this.state.blackCure}
            redCure={this.state.redCure}
            yellowCure={this.state.yellowCure}
            blueCure={this.state.blueCure}
            actionCount={this.state.actionCount}
          />
        ) : (
          <div>Data loading</div>
        )}
      </div>
    ) : (
      <div>Getting location</div>
    )
  }
}

export default MainGame
