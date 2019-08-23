function randomNumGenerator() {
  return Math.floor(Math.random() * 1000000000 + 1)
}

function handleBasicTravel(city) {
  let allPlayers = [...this.state.playerList]
  allPlayers[this.state.currentTurn].location = city
  this.playerList
    .set({playerList: allPlayers}, {merge: true})
    .then(() => this.incrementAction())
    .then(() => {
      console.log('action count: ', this.state.actionCount)
      if (this.state.actionCount === 3) {
        this.loseCheck()
        this.playerTurnEnd(this.state.currentTurn)
        this.updatePlayerTurn()
      }
    })
}

module.exports = {randomNumGenerator, handleBasicTravel}

//functions we need for the game
//move:
//drive/ferry
//direct flight
//charter flight
//shuttle flight
//research
//treat
//share knowledge
//all 5 events
//special role modifications
