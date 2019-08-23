import React from 'react'
import {Button, Modal} from 'react-bootstrap'
import MainMoves from './MainMoves'
import HelpModal from './HelpModal'
import CardHand from './CardHand'

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
    // console.log(this.props)
    const currentUser = this.props.players.filter(
      player => player.name === this.props.username
    )[0]
    const otherUsers = this.props.players.filter(
      player => player.name !== this.props.username
    )
    const userCanMakeMove = this.props.players.filter(player => player.turn)

    const canMakeMove = userCanMakeMove.name === this.props.username

    return (
      <div id="game-menu">
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
        <h3 className="menu-header-1">Test</h3>
        <div id="btn-menu">
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={this.props.startGame}
          >
            SHUFFLE
          </Button>
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={this.props.testOutbreak}
          >
            OUTBREAK
          </Button>
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={this.props.testPlayerTurn}
          >
            PLAYER TURN
          </Button>
          <Button
            variant="outline-dark"
            className="game-menu-btn"
            onClick={this.props.reset}
          >
            RESET
          </Button>
        </div>
        <h3 className="menu-header-1">Cards</h3>
        <div id="card-container">
          <div id="your-cards">
            <h4 className="card-container-header">Yours</h4>
            {currentUser ? (
              <ul id="your-cards-container">
                <CardHand hand={currentUser.hand} />
              </ul>
            ) : (
              <div />
            )}
          </div>
          <div id="others-cards">
            <h4 className="card-container-header">Others</h4>
            {otherUsers ? (
              <div id="other-cards-container">
                {otherUsers.map(user => {
                  return (
                    <div key={user.name}>
                      <h5>{user.name}</h5>
                      <CardHand hand={user.hand} />
                    </div>
                  )
                })}
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
