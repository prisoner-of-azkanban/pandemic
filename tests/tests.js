'use strict'

const chai = require('chai')
const expect = chai.expect
// const chaiThings = require('chai-things')
// chai.use(chaiThings)
const {
  isCardEpidemic,
  setupPlayer,
  findMaxPop,
  setupPlayerCards
} = require('../client/components/utils')

// isCardEpidemic
describe('`isCardEpidemic` utility method', () => {
  const epidemicCard = {
    title: 'Epidemic',
    type: 'epidemic',
    color: null,
    description: ''
  }
  const bogota = {
    title: 'Bogotá',
    type: 'city',
    color: 'yellow',
    description: null,
    population: 8702000
  }
  const khartoum = {
    title: 'Khartoum',
    type: 'city',
    color: 'yellow',
    description: null,
    population: 4887000
  }

  it('returns true if card is an epidemic card', () => {
    const card = isCardEpidemic(epidemicCard)
    expect(card).to.equal(true)
  })

  it('returns false if card is not an epidemic card', () => {
    const bogotaCard = isCardEpidemic(bogota)
    expect(bogotaCard).to.equal(false)
    const khartoumCard = isCardEpidemic(khartoum)
    expect(khartoumCard).to.equal(false)
  })
})

// setupPlayer
describe('`setupPlayer` utility method', () => {
  const {roleCards} = require('../game/roleCards')
  it('returns player information', () => {
    const player = {
      color: 'aqua',
      event: false,
      hand: [],
      id: 1,
      location: 'Atlanta',
      name: 'Jo',
      role: '',
      turn: false
    }
    const playerHand = []
    const role = roleCards
    console.log('loggin', roleCards)
    const turn = [false, false, true, false]
    const index = 0

    const playerSetup = setupPlayer(player, playerHand, role, turn, index)
    expect(playerSetup).to.deep.equal({
      color: 'aqua',
      event: false,
      hand: [],
      id: 1,
      location: 'Atlanta',
      name: 'Jo',
      role: {
        actionOne: 'Remove all cubes of one color when doing Treat Disease.',
        actionTwo:
          'Automatically remove cubes of cured diseases from the city you are in (and prevent them from being placed there).',
        title: 'Medic'
      },
      turn: false
    })
  })
})

// findMaxPop
describe('`findMaxPop` utility method', () => {
  const playerHands = [
    [
      {
        title: 'Buenos Aires',
        type: 'city',
        color: 'yellow',
        description: null,
        population: 13639000
      }
    ],
    [
      {
        title: 'Johannesburg',
        type: 'city',
        color: 'yellow',
        description: null,
        population: 3888000
      }
    ],
    [
      {
        title: 'Kinshasa',
        type: 'city',
        color: 'yellow',
        description: null,
        population: 9046000
      }
    ],
    [
      {
        title: 'Lagos',
        type: 'city',
        color: 'yellow',
        description: null,
        population: 11547000
      }
    ]
  ]

  it('returns player with the highest population card', () => {
    const player = findMaxPop(playerHands)
    expect(player).to.deep.equal([
      13639000,
      [13639000, 3888000, 9046000, 11547000]
    ])
  })
})
