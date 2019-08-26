const shuffle = require('shuffle-array')

function randomNumGenerator() {
  return Math.floor(Math.random() * 1000000000 + 1)
}

//checks if card is epidemic card
function isCardEpidemic(card) {
  return card.type === 'epidemic'
}

//sets up player
function setupPlayer(player, playerHand, roles, turns, index) {
  return {
    ...player,
    turn: turns[index],
    event: playerHand.filter(card => card.type === 'event').length > 0,
    hand: playerHand,
    role: roles[index]
  }
}

//see who goes first
function findMaxPop(playerHands) {
  let playerPop = playerHands.map(hand =>
    hand.map(card => parseInt(card.population, 10))
  )
  let turns = playerPop.map(pop => Math.max(...pop))
  return [Math.max(...playerPop.map(pop => Math.max(...pop))), turns]
}

//set up roles and cards
function setupPlayerRoles(players, roleDeck) {
  let shuffledRoles = shuffle(roleDeck, {copy: true})
  return players.map(role => (role = shuffledRoles.shift()))
}

function setupPlayerCards(players, cardDeck) {
  let shuffledPlayerCardDeck = shuffle(cardDeck, {copy: true})
  return players.map(player => (player = shuffledPlayerCardDeck.splice(0, 2)))
}

module.exports = {
  randomNumGenerator,
  isCardEpidemic,
  setupPlayer,
  findMaxPop,
  setupPlayerCards,
  setupPlayerRoles
}
