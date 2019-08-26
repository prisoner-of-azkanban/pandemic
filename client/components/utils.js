function randomNumGenerator() {
  return Math.floor(Math.random() * 1000000000 + 1)
}

function isCardEpidemic(card) {
  return card.type === 'epidemic'
}

module.exports = {randomNumGenerator, isCardEpidemic}

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
