import React from 'react'
import {Button} from 'react-bootstrap'

const MainMoves = props => {
  return !props.showMoves ? (
    <div id="btn-menu">
      <Button
        variant="outline-dark"
        className="game-menu-btn"
        onClick={props.showMoveMenu}
      >
        Move
      </Button>
      <Button variant="outline-dark" className="game-menu-btn">
        Research
      </Button>
      <Button variant="outline-dark" className="game-menu-btn">
        Treat
      </Button>
      <Button variant="outline-dark" className="game-menu-btn">
        Knowledge
      </Button>
      <Button variant="outline-dark" className="game-menu-btn">
        Cure
      </Button>
    </div>
  ) : (
    <div id="btn-menu">
      <Button variant="outline-dark" className="game-menu-btn">
        Drive/Ferry
      </Button>
      <Button variant="outline-dark" className="game-menu-btn">
        Direct Flight
      </Button>
      <Button variant="outline-dark" className="game-menu-btn">
        Charter Flight
      </Button>
      <Button variant="outline-dark" className="game-menu-btn">
        Shuttle Flight
      </Button>
      <Button
        variant="outline-dark"
        className="game-menu-btn"
        onClick={props.showMoveMenu}
      >
        Back
      </Button>
    </div>
  )
}

export default MainMoves
