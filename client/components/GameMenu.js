import React from 'react'
import {Button, Dropdown, Collapse, Accordion, Card} from 'react-bootstrap'
import MainMoves from './MainMoves'
import HelpModal from './HelpModal'
import InstructionModal from './InstructionModal'

class GameMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showHelpModal: false,
      showInstructionModal: true,
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

  toggleHelpModal = () => {
    this.setState({showHelpModal: !this.state.showHelpModal})
  }

  toggleInstructionModal = () => {
    this.setState({showInstructionModal: !this.state.showInstructionModal})
  }

  render() {
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
    }

    const color = this.props.players.filter(
      player => player.name === this.props.username
    )[0].color
    return (
      <div id="game-menu">
        <div id="game-menu-you">
          <h3 className={`menu-header-1 ${color}`}>{this.props.username}</h3>
          <h4>Currently in {currentUser.location}</h4>
        </div>
        <div id="game-menu-current">
          <h3 className="menu-header-1">
            Current Turn:{' '}
            <span>{this.props.players[this.props.turn].name}</span>
          </h3>
          ({4 - this.props.actionCount} moves left)
        </div>
        <div id="game-menu-move">
          <h3 className="menu-header-1">Available Moves</h3>
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
              blackCure={this.props.blackCure}
              redCure={this.props.redCure}
              yellowCure={this.props.yellowCure}
              blueCure={this.props.blueCure}
            />
          ) : (
            <p>It is not your turn</p>
          )}
          <div id="btn-menu">
            {this.props.gameStart ? (
              <div />
            ) : (
              <Button
                variant="outline-dark"
                className="start-game-btn"
                onClick={this.props.startGame}
                disabled={this.props.gameStart}
              >
                Deal Cards
              </Button>
            )}
          </div>
        </div>
        <div id="game-menu-status">
          <h3 className="menu-header-1">Game Status</h3>
          <div id="card-container">
            <div id="your-cards">
              <h4 className="card-container-header">You:</h4>
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
              <h4 className="card-container-header">Other: </h4>
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
                              className={`${user.color}-btn`}
                            >
                              {user.name}
                            </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey={user.name}>
                            <Card.Body>
                              <p>
                                <span className="card-container-header">
                                  Location:
                                </span>
                                <br />
                                {user.location}
                              </p>
                              <span className="card-container-header">
                                Hand:
                              </span>
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
                    <Card className="other-cards-header">
                      <Card.Header className="other-cards-header">
                        <Accordion.Toggle
                          as={Button}
                          eventKey="epidemicList"
                          variant="outline-dark"
                        >
                          Epidemic List
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="epidemicList">
                        <Card.Body>
                          {this.props.epidemicList.map(card => {
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
        </div>
        <Button
          variant="outline-dark"
          className="game-menu-btn"
          onClick={this.toggleInstructionModal}
        >
          Instructions
        </Button>
        <Button
          variant="outline-dark"
          className="game-menu-btn"
          onClick={this.toggleHelpModal}
        >
          Help
        </Button>
        <HelpModal
          showHelpModal={this.state.showHelpModal}
          toggleHelpModal={this.toggleHelpModal}
          currentUser={currentUser}
        />
        <InstructionModal
          showInstructionModal={this.state.showInstructionModal}
          toggleInstructionModal={this.toggleInstructionModal}
        />
      </div>
    )
  }
}

export default GameMenu
