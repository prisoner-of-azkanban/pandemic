import React from 'react'
import {Button, Dropdown, Collapse, Accordion, Card} from 'react-bootstrap'
import MainMoves from './MainMoves'
import HelpModal from './HelpModal'

class GameMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      showMoves: false,
      showMenu: 'default'
    }
  }

  showMenuToggle = menu => {
    this.setState({showMenu: menu})
  }

  resetMenu = () => {
    this.setState({showMenu: 'default'})
  }

  toggleModal = () => {
    this.setState({showModal: !this.state.showModal})
  }

  render() {
    console.log(this.props)
    const currentUser = this.props.players.filter(
      player => player.name === this.props.username
    )[0]
    const otherUsers = this.props.players.filter(
      player => player.name !== this.props.username
    )
    const userCanMakeMove = this.props.players.filter(player => player.turn)
    let canMakeMove
    if (userCanMakeMove.length) {
      canMakeMove = userCanMakeMove[0].name === this.props.username
      console.log(canMakeMove)
    }

    return (
      <div id="game-menu">
        <h3>{this.props.username}</h3>
        <h3 className="menu-header-1">
          Current Turn: {this.props.players[this.props.turn].name}
        </h3>
        <h3 className="menu-header-1">Moves</h3>
        {canMakeMove ? (
          <MainMoves
            canMakeMove={canMakeMove}
            showMenu={this.state.showMenu}
            showMenuToggle={this.showMenuToggle}
            resetMenu={this.resetMenu}
            currentUser={currentUser}
            otherUsers={otherUsers}
            cities={this.props.cities}
            handleBasicTravel={this.props.handleBasicTravel}
            handleResearchSubmit={this.props.handleResearchSubmit}
            handleOtherFlightSubmit={this.props.handleOtherFlightSubmit}
            handleTreatSubmit={this.props.handleTreatSubmit}
            handleKnowledgeSubmit={this.props.handleKnowledgeSubmit}
            handleCureSubmit={this.props.handleCureSubmit}
          />
        ) : (
          <p>It is not your turn</p>
        )}

        {/* <h3 className="menu-header-1">Special</h3>
        <div id="btn-menu">
          <Button variant="outline-dark" className="game-menu-btn">
            Event
          </Button>
          <Button variant="outline-dark" className="game-menu-btn">
            Role
          </Button>
        </div> */}
        <div id="btn-menu">
          {this.props.gameStart ? (
            <div />
          ) : (
            <Button
              variant="outline-dark"
              className="game-menu-btn"
              onClick={this.props.startGame}
              disabled={this.props.gameStart}
            >
              Start Game
            </Button>
          )}
        </div>
        <h3 className="menu-header-1">Cards</h3>
        <div id="card-container">
          <div id="your-cards">
            <h4 className="card-container-header">Your hand:</h4>
            {currentUser ? (
              <ul id="your-cards-container">
                {currentUser.hand.map(card => {
                  return (
                    <p key={card.title} className={card.color}>
                      {card.title}
                    </p>
                  )
                })}
              </ul>
            ) : (
              <div />
            )}
          </div>
          <div id="others-cards">
            <h4 className="card-container-header" />
            {otherUsers ? (
              <div id="other-cards-container">
                <Accordion className="other-cards-header">
                  {otherUsers.map(user => {
                    return (
                      <Card key={user.name} className="other-cards-header">
                        <Card.Header className="other-cards-header">
                          <Accordion.Toggle
                            as={Button}
                            eventKey={user.name}
                            variant="outline-dark"
                          >
                            {user.name}'s hand
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={user.name}>
                          <Card.Body>
                            {user.hand.map(card => {
                              return (
                                <p key={card.title} className={card.color}>
                                  {card.title}
                                </p>
                              )
                            })}
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    )
                  })}
                  <Card className="other-cards-header">
                    <Card.Header className="other-cards-header">
                      <Accordion.Toggle
                        as={Button}
                        eventKey="infectDeck"
                        variant="outline-dark"
                      >
                        Infect discard
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="infectDeck">
                      <Card.Body>
                        {this.props.infectionCardDiscard.map(card => {
                          return (
                            <p key={card.city} className={card.color}>
                              {card.city}
                            </p>
                          )
                        })}
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </div>
            ) : (
              <div />
            )}
          </div>
        </div>
        <Button
          variant="outline-dark"
          className="game-menu-btn"
          onClick={this.toggleModal}
        >
          Help
        </Button>
        <HelpModal
          showModal={this.state.showModal}
          toggleModal={this.toggleModal}
          currentUser={currentUser}
        />
      </div>
    )
  }
}

export default GameMenu
