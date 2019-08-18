import React from 'react'
import {Button} from 'react-bootstrap'
import {app, db} from '../../firebase-server/firebase'

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      players: [],
      playerCount: 0,
      username: ''
    }
    this.game = db.collection('games').doc(this.props.gamename)
  }
}

export default Game
