/* eslint-disable complexity */
import React from 'react'
import {Button, Dropdown} from 'react-bootstrap'
import {connectedCities} from '../../game/connectedCities'

class MainMoves extends React.Component {
  constructor() {
    super()
    this.state = {
      drive: 'Drive/ferry To',
      directFlight: 'Take direct flight to',
      charterFlightTo: 'Take charter flight to',
      shuttleFlightTo: 'Take shuttle flight to'
    }
  }

  handleDriveSelect = (eventKey, event) => {
    this.setState({
      drive: eventKey
    })
  }
  handleDirectFlightSelect = (eventKey, event) => {
    this.setState({
      directFlight: eventKey
    })
  }
  handleCharterFlightTo = (eventKey, event) => {
    this.setState({
      charterFlightTo: eventKey
    })
  }
  handleShuttleFlightTo = (eventKey, event) => {
    this.setState({
      shuttleFlightTo: eventKey
    })
  }

  render() {
    let currentUser = this.props.currentUser
    let allCities = Object.keys(connectedCities).filter(
      cityName => cityName !== currentUser.location
    )
    let connectedCityDrive = connectedCities[this.props.currentUser.location]
    let connectedCityDirectFlight = currentUser.hand.filter(
      card => card.type === 'city' && card.title !== currentUser.location
    )
    let canTakeCharter = currentUser.hand.filter(
      card => card.title === currentUser.location
    ).length
    let currentCity = this.props.cities[currentUser.location]
    let researchCities = []
    let allCityArray = Object.keys(this.props.cities)
    allCityArray.forEach(city => {
      if (this.props.cities[city].research)
        researchCities.push(this.props.cities[city])
    })
    let canTakeShuttle = researchCities.length > 1 && currentCity.research
    const colors = ['red', 'blue', 'yellow', 'black']
    let canTreat =
      colors.map(color => currentCity[color]).reduce((a, b) => a + b) > 0
    let menuReturn = ''
    switch (this.props.showMenu) {
      case 'default':
        menuReturn = (
          <div id="btn-menu">
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={() => this.props.showMenuToggle('moves')}
            >
              Move
            </Button>
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={() => this.props.showMenuToggle('research')}
              disabled={!canTakeCharter}
            >
              Research
            </Button>
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={() => this.props.showMenuToggle('treat')}
              disabled={!canTreat}
            >
              Treat
            </Button>
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={() => this.props.showMenuToggle('knowledge')}
            >
              Knowledge
            </Button>
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={() => this.props.showMenuToggle('cure')}
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
              onClick={() => this.props.showMenuToggle('drive')}
            >
              Drive/Ferry
            </Button>
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={() => this.props.showMenuToggle('direct flight')}
            >
              Direct Flight
            </Button>
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={() => this.props.showMenuToggle('charter flight')}
              disabled={!canTakeCharter}
            >
              Charter Flight
            </Button>
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={() => this.props.showMenuToggle('shuttle flight')}
              disabled={!canTakeShuttle}
            >
              Shuttle Flight
            </Button>
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={this.props.resetMenu}
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
            <Dropdown onSelect={this.handleDriveSelect}>
              <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                {this.state.drive}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {connectedCityDrive.map(city => (
                  <Dropdown.Item key={city} eventKey={city}>
                    {city}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="outline-dark" className="game-menu-btn">
              Submit
            </Button>
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={this.props.resetMenu}
            >
              Back
            </Button>
          </div>
        )
        break
      case 'direct flight':
        menuReturn = (
          <div id="btn-menu">
            <Dropdown onSelect={this.handleDirectFlightSelect}>
              <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                {this.state.directFlight}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {connectedCityDirectFlight.map(card => (
                  <Dropdown.Item key={card.title} eventKey={card.title}>
                    {card.title}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="outline-dark" className="game-menu-btn">
              Submit
            </Button>
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={this.props.resetMenu}
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
                <Dropdown onSelect={this.handleCharterFlightTo}>
                  <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                    {this.state.charterFlightTo}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {allCities.map(city => (
                      <Dropdown.Item key={city} eventKey={city}>
                        {city}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <Button variant="outline-dark" className="game-menu-btn">
                  Submit
                </Button>
              </div>
            ) : (
              <p>You cannot take a charter flight</p>
            )}
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={this.props.resetMenu}
            >
              Back
            </Button>
          </div>
        )
        break
      case 'shuttle flight':
        menuReturn = (
          <div id="btn-menu">
            {canTakeShuttle ? (
              <div>
                Discard {currentUser.location} and
                <Dropdown onSelect={this.handleShuttleFlightTo}>
                  <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                    {this.state.shuttleFlightTo}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {researchCities
                      .filter(city => currentUser.location !== city.name)
                      .map(city => (
                        <Dropdown.Item key={city.name} eventKey={city.name}>
                          {city.name}
                        </Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
                </Dropdown>
                <Button variant="outline-dark" className="game-menu-btn">
                  Submit
                </Button>
              </div>
            ) : (
              <p>You cannot take a shuttle flight</p>
            )}
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={this.props.resetMenu}
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
              onClick={this.props.resetMenu}
            >
              Back
            </Button>
          </div>
        )
        break
      case 'treat':
        menuReturn = (
          <div id="btn-menu">
            {colors.map(color => {
              if (currentCity[color]) {
                return (
                  <Button variant="outline-dark" className="game-menu-btn">
                    Treat {color}
                  </Button>
                )
              }
            })}
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={this.props.resetMenu}
            >
              Back
            </Button>
          </div>
        )
        break
      case 'give knowledge':
        menuReturn = (
          <div id="btn-menu">
            Give BLANK TO BLANK
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={this.props.resetMenu}
            >
              Back
            </Button>
          </div>
        )
        break
      case 'take knowledge':
        menuReturn = (
          <div id="btn-menu">
            Take BLANK FROM BLANK
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={this.props.resetMenu}
            >
              Back
            </Button>
          </div>
        )
        break
      case 'knowledge':
        menuReturn = (
          <div id="btn-menu">
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={() => this.props.showMenuToggle('give knowledge')}
            >
              Give Knowledge
            </Button>
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={() => this.props.showMenuToggle('take knowledge')}
            >
              Take Knowledge
            </Button>
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={this.props.resetMenu}
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
              onClick={this.props.resetMenu}
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
              onClick={() => this.props.showMenuToggle('moves')}
            >
              Move
            </Button>
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={() => this.props.showMenuToggle('research')}
            >
              Research
            </Button>
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={() => this.props.showMenuToggle('treat')}
            >
              Treat
            </Button>
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={() => this.props.showMenuToggle('knowledge')}
            >
              Knowledge
            </Button>
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={() => this.props.showMenuToggle('cure')}
            >
              Cure
            </Button>
          </div>
        )
    }
    return menuReturn
  }
}

export default MainMoves
