/* eslint-disable complexity */
/* eslint-disable max-statements */

//need to discard cards
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
      this.playerList.set({playerList: allPlayers}, {merge: true})
    } else if (allPlayers[player].location === card) {
      let givePlayer = allPlayers[player]
      let takeCard = givePlayer.hand.filter(handCard => handCard.title === card)
      let newHand = givePlayer.hand.filter(handCard => handCard.title !== card)
      allPlayers[player].hand = newHand
      allPlayers[this.state.currentTurn].hand = [
        ...allPlayers[player].hand,
        ...takeCard
      ]
      this.playerList.set({playerList: allPlayers}, {merge: true})
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
      this.playerList.set({playerList: allPlayers}, {merge: true})
      playerCardDiscard = [...this.state.playerCardDiscard, ...discardHand]
      this.decks.set({playerCardDiscard: playerCardDiscard}, {merge: true})
    }
  }
}
