/* eslint-disable complexity */
import React from 'react'
import {Button, Dropdown} from 'react-bootstrap'
import {connectedCities} from '../../game/connectedCities'

const MainMoves = props => {
  let currentUser = props.currentUser
  let allCities = Object.keys(connectedCities).filter(
    cityName => cityName !== currentUser.location
  )
  let connectedCityDrive = connectedCities[props.currentUser.location]
  let connectedCityDirectFlight = currentUser.hand.filter(
    card => card.type === 'city'
  )
  let canTakeCharter = currentUser.hand.filter(
    card => card.title === currentUser.location
  ).length
  let menuReturn = ''
  switch (props.showMenu) {
    case 'default':
      menuReturn = (
        <div id="btn-menu">
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={() => props.showMenuToggle('moves')}
          >
            Move
          </Button>
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={() => props.showMenuToggle('research')}
            disabled={!canTakeCharter}
          >
            Research
          </Button>
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={() => props.showMenuToggle('treat')}
          >
            Treat
          </Button>
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={() => props.showMenuToggle('knowledge')}
          >
            Knowledge
          </Button>
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={() => props.showMenuToggle('cure')}
          >
            Cure
          </Button>
        </div>
      )
      break
    case 'moves':
      menuReturn = (
        <div id="btn-menu">
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={() => props.showMenuToggle('drive')}
          >
            Drive/Ferry
          </Button>
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={() => props.showMenuToggle('direct flight')}
          >
            Direct Flight
          </Button>
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={() => props.showMenuToggle('charter flight')}
            disabled={!canTakeCharter}
          >
            Charter Flight
          </Button>
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={() => props.showMenuToggle('shuttle flight')}
          >
            Shuttle Flight
          </Button>
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={props.resetMenu}
          >
            Back
          </Button>
        </div>
      )
      break
    case 'drive':
      menuReturn = (
        <div id="btn-menu">
          You are in {currentUser.location}.<br />
          <Dropdown>
            <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
              Drive/Ferry to
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {connectedCityDrive.map(city => (
                <Dropdown.Item key={city}>{city}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={props.resetMenu}
          >
            Back
          </Button>
        </div>
      )
      break
    case 'direct flight':
      menuReturn = (
        <div id="btn-menu">
          <Dropdown>
            <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
              Take direct flight to
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {connectedCityDirectFlight.map(card => (
                <Dropdown.Item key={card.title}>{card.title}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={props.resetMenu}
          >
            Back
          </Button>
        </div>
      )
      break
    case 'charter flight':
      menuReturn = (
        <div id="btn-menu">
          {canTakeCharter ? (
            <div>
              Discard {currentUser.location} and
              <Dropdown>
                <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                  Take charter flight to
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {allCities.map(city => (
                    <Dropdown.Item key={city}>{city}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : (
            <p>You cannot take a charter flight</p>
          )}
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={props.resetMenu}
          >
            Back
          </Button>
        </div>
      )
      break
    case 'shuttle flight':
      menuReturn = (
        <div id="btn-menu">
          Shuttle flight
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={props.resetMenu}
          >
            Back
          </Button>
        </div>
      )
      break
    case 'research':
      menuReturn = (
        <div id="btn-menu">
          <Button variant="outline-dark" className="game-menu-btn">
            Build research center
          </Button>
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={props.resetMenu}
          >
            Back
          </Button>
        </div>
      )
      break
    case 'treat':
      menuReturn = (
        <div id="btn-menu">
          Treat disease
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={props.resetMenu}
          >
            Back
          </Button>
        </div>
      )
      break
    case 'knowledge':
      menuReturn = (
        <div id="btn-menu">
          Share Knowledge
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={props.resetMenu}
          >
            Back
          </Button>
        </div>
      )
      break
    case 'cure':
      menuReturn = (
        <div id="btn-menu">
          Discover Cure
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={props.resetMenu}
          >
            Back
          </Button>
        </div>
      )
      break
    default:
      menuReturn = (
        <div id="btn-menu">
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={() => props.showMenuToggle('moves')}
          >
            Move
          </Button>
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={() => props.showMenuToggle('research')}
          >
            Research
          </Button>
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={() => props.showMenuToggle('treat')}
          >
            Treat
          </Button>
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={() => props.showMenuToggle('knowledge')}
          >
            Knowledge
          </Button>
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={() => props.showMenuToggle('cure')}
          >
            Cure
          </Button>
        </div>
      )
  }
  return menuReturn
}

export default MainMoves
