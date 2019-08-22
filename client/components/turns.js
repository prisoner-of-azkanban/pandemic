/* eslint-disable complexity */
/* eslint-disable max-statements */
handleDriveSubmit = city => {
  let allPlayers = [...this.state.playerList]
  allPlayers[this.state.currentTurn].location = city
  this.props.game.set({playerList: allPlayers}, {merge: true})
}

handleFlightSubmit = city => {
  let allPlayers = [...this.state.playerList]
  if (allPlayers[this.state.currentTurn].location !== city) {
    allPlayers[this.state.currentTurn].location = city
    this.props.game.set({playerList: allPlayers}, {merge: true})
  }
}

handleResearch = card => {
  let allPlayers = [...this.state.playerList]
  let allCities = [...this.state.cities]
  if (card === allPlayers[this.state.currentTurn].location) {
    allCities[card].research = true
    this.props.game.set({cities: allCities}, {merge: true})
  }
}
// allPlayers[this.state.currentTurn].location === card || allPlayers[player].location === card)
handleKnowledge = (player, card) => {
  let allPlayers = [...this.state.playerList]
  if (
    allPlayers[this.state.currentTurn].location === allPlayers[player].location
  ) {
    if (allPlayers[this.state.currentTurn].location === card) {
      let givePlayer = allPlayers[this.state.currentTurn]
      let takeCard = givePlayer.hand.filter(handCard => handCard.title === card)
      let newHand = givePlayer.hand.filter(handCard => handCard.title !== card)
      allPlayers[this.state.currentTurn].hand = newHand
      allPlayers[player].hand = [...allPlayers[player].hand, ...takeCard]
      this.props.game.set({playerList: allPlayers}, {merge: true})
    } else if (allPlayers[player].location === card) {
      let givePlayer = allPlayers[player]
      let takeCard = givePlayer.hand.filter(handCard => handCard.title === card)
      let newHand = givePlayer.hand.filter(handCard => handCard.title !== card)
      allPlayers[player].hand = newHand
      allPlayers[this.state.currentTurn].hand = [
        ...allPlayers[player].hand,
        ...takeCard
      ]
      this.props.game.set({playerList: allPlayers}, {merge: true})
    }
  }
}

// eslint-disable-next-line complexity
// eslint-disable-next-line max-statements
// eslint-disable-next-line complexity
handleCure = (cards, color) => {
  const eradicate = firebase.firestore.FieldValue.increment(2)
  const cure = firebase.firestore.FieldValue.increment(1)
  const cardNames = new Set(cards)
  let allPlayers = [...this.state.playerList]
  let playerCardDiscard = [...this.state.playerCardDiscard]
  let allCities = [...this.state.cities]
  if (allCities[allPlayers[this.state.currentTurn].location].research) {
    const colored = cards.filter(card => card.color === color).length === 5
    let cured
    let cubes
    switch (color) {
      case 'red':
        cured = this.state.redCure
        cubes = this.state.redCubes
        if (colored && !cured) {
          if (cubes === 24) {
            this.props.game.update({redCure: eradicate})
          } else {
            this.props.game.update({redCure: cure})
          }
        }
        break
      case 'blue':
        cured = this.state.blueCure
        cubes = this.state.blueCubes
        if (colored && !cured) {
          if (cubes === 24) {
            this.props.game.update({blueCure: eradicate})
          } else {
            this.props.game.update({blueCure: cure})
          }
        }
        break
      case 'yellow':
        cured = this.state.yellowCure
        cubes = this.state.yellowCubes
        if (colored && !cured) {
          if (cubes === 24) {
            this.props.game.update({yellowCure: eradicate})
          } else {
            this.props.game.update({yellowCure: cure})
          }
        }
        break
      case 'black':
        cured = this.state.blackCure
        cubes = this.state.blackCubes
        if (colored && !cured) {
          if (cubes === 24) {
            this.props.game.update({blackCure: eradicate})
          } else {
            this.props.game.update({blackCure: cure})
          }
        }
        break
      default:
        break
    }
    if (colored) {
      let givePlayer = allPlayers[this.state.currentTurn]
      let discardHand = []
      let newHand = []
      for (let i = 0; i < givePlayer.hand.length; i++) {
        if (cardNames.has(givePlayer.hand[i].title)) {
          discardHand.push(givePlayer.hand[i])
        } else {
          newHand.push(givePlayer.hand[i])
        }
      }
      allPlayers[this.state.currentTurn].hand = newHand
      this.props.game.set({playerList: allPlayers}, {merge: true})
      playerCardDiscard = [...this.state.playerCardDiscard, ...discardHand]
      this.props.game.set({playerCardDiscard: playerCardDiscard}, {merge: true})
    }
  }
}

handleTreat = color => {
  let removedCubeCount = 0
  const supply = firebase.firestore.FieldValue.increment(removedCubeCount)
  let allPlayers = [...this.state.playerList]
  let allCities = [...this.state.cities]
  switch (color) {
    case 'red':
      if (this.state.redCure === 1) {
        removedCubeCount =
          allCities[allPlayers[this.state.currentTurn].location].redCubes
        allCities[allPlayers[this.state.currentTurn].location].redCubes = 0
      } else if (this.state.redCure === 0) {
        removedCubeCount = 1
        allCities[allPlayers[this.state.currentTurn].location].redCubes--
      }
      this.props.game.set({cities: allCities}, {merge: true})
      this.props.game.update({redCubes: supply})
      break

    case 'blue':
      if (this.state.redCure === 1) {
        removedCubeCount =
          allCities[allPlayers[this.state.currentTurn].location].blueCubes
        allCities[allPlayers[this.state.currentTurn].location].blueCubes = 0
      } else if (this.state.blueCure === 0) {
        removedCubeCount = 1
        allCities[allPlayers[this.state.currentTurn].location].blueCubes--
      }
      this.props.game.set({cities: allCities}, {merge: true})
      this.props.game.update({blueCubes: supply})
      break

    case 'yellow':
      if (this.state.redCure === 1) {
        removedCubeCount =
          allCities[allPlayers[this.state.currentTurn].location].yellowCubes
        allCities[allPlayers[this.state.currentTurn].location].yellowCubes = 0
      } else if (this.state.yellowCure === 0) {
        removedCubeCount = 1
        allCities[allPlayers[this.state.currentTurn].location].yellowCubes--
      }
      this.props.game.set({cities: allCities}, {merge: true})
      this.props.game.update({yellowCubes: supply})
      break

    case 'black':
      if (this.state.redCure === 1) {
        removedCubeCount =
          allCities[allPlayers[this.state.currentTurn].location].blackCubes
        allCities[allPlayers[this.state.currentTurn].location].blackCubes = 0
      } else if (this.state.blackCure === 0) {
        removedCubeCount = 1
        allCities[allPlayers[this.state.currentTurn].location].blackCubes--
      }
      this.props.game.set({cities: allCities}, {merge: true})
      this.props.game.update({blackCubes: supply})
      break

    default:
      break
  }
}
