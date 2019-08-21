import React from 'react'
import {Button, Modal} from 'react-bootstrap'
import MainMoves from './MainMoves'
import HelpModal from './HelpModal'

class GameMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {showMoves: false, showModal: false}
  }

  showMoveMenu = () => {
    this.setState({showMoves: !this.state.showMoves})
  }

  toggleModal = () => {
    this.setState({showModal: !this.state.showModal})
  }

  render() {
    const currentUser = this.props.players.filter(
      player => player.name === this.props.username
    )[0]
    const otherUsers = this.props.players.filter(
      player => player.name !== this.props.username
    )
    return (
      <div id="game-menu">
        <h3 className="menu-header-1">Current Turn: {this.props.turn}</h3>
        <h3 className="menu-header-1">Moves</h3>
        <MainMoves
          showMoveMenu={this.showMoveMenu}
          showMoves={this.state.showMoves}
        />
        <h3 className="menu-header-1">Special</h3>
        <div id="btn-menu">
          <Button variant="outline-dark" className="game-menu-btn">
            Event
          </Button>
          <Button variant="outline-dark" className="game-menu-btn">
            Role
          </Button>
        </div>
        <h3 className="menu-header-1">Cards</h3>
        <div id="card-container">
          <div id="your-cards">
            <h4 className="card-container-header">Yours</h4>
            {currentUser ? (
              <ul id="your-cards-container">
                {currentUser.hand.map(card => (
                  <li key={card.title} className={card.color}>
                    {card.title}
                  </li>
                ))}
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
                      {user.hand.map(card => (
                        <li key={card.title} className={card.color}>
                          {card.title}
                        </li>
                      ))}
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
        />
      </div>
    )
  }
}

export default GameMenu
