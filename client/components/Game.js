import React from 'react'
import {Button} from 'react-bootstrap'
import {app, db} from '../../firebase-server/firebase'
import firebase from 'firebase'
import {MainGame, PandemicMap} from './index'

const MAXPLAYERS = 4

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      players: [],
      username: this.props.username,
      isFull: false,
      started: false
    }
    this._isMounted = false
    this.game = db.collection('games').doc(this.props.gamename)
    this.game.onSnapshot(this.listenPlayers)
    this.game.onSnapshot(this.listenStart)
  }

  async componentDidMount() {
    this._isMounted = true
    let players = []
    let isFull = false
    let started = false
    await this.game
      .get()
      .then(doc => {
        players = doc.data().players
        isFull = doc.data().isFull
        started = doc.data().started
      })
      .then(() => {
        if (this._isMounted) {
          this.setState({players: players, isFull: isFull, started: started})
        }
      })
  }

  componentWillUnmount() {
    this._isMounted = false
    const unsubscribePlayer = this.game.onSnapshot(this.listenPlayers)
    const unsubscribeStart = this.game.onSnapshot(this.listenStart)
    unsubscribePlayer()
    unsubscribeStart()
  }

  handleClick = () => {
    this.game.set(
      {
        players: [...this.state.players, this.state.username]
      },
      {merge: true}
    )
    this.game.collection('chatroom').add({
      username: 'Admin',
      message: this.state.username + ' has joined the game',
      createdAt: firebase.firestore.Timestamp.fromDate(new Date())
    })
  }

  handleStart = () => {
    this.game.set(
      {
        started: true
      },
      {merge: true}
    )
  }

  listenStart = () => {
    let started = false
    this.game
      .get()
      .then(doc => {
        started = doc.data().started
      })
      .then(() => {
        if (this._isMounted) {
          this.setState({started: started})
        }
      })
  }

  listenPlayers = () => {
    let players = []
    this.game
      .get()
      .then(doc => {
        players = doc.data().players
      })
      .then(() => {
        if (this._isMounted) {
          this.setState({players: players})
        }
      })
      .then(() => {
        if (this.state.players.length === MAXPLAYERS) {
          this.game.set({isFull: true}, {merge: true}).then(() => {
            if (this._isMounted) {
              this.setState({
                isFull: true
              })
            }
          })
        }
      })
  }

  render() {
    return (
      <div className="game-container">
        {this.state.started ? (
          <MainGame
            players={this.state.players}
            game={this.game}
            username={this.props.username}
          />
        ) : this.state.isFull ? (
          <p>The room is full, start the game</p>
        ) : (
          <p>{MAXPLAYERS - this.state.players.length} may join the game</p>
        )}
        {this.state.started ? (
          <div />
        ) : (
          <div>
            <h4>Current players:</h4>
            <ul>
              {this.state.players.map(player => <li key={player}>{player}</li>)}
            </ul>
            {this.state.isFull ? (
              <Button variant="outline-dark" onClick={this.handleStart}>
                Start the Game
              </Button>
            ) : (
              <Button
                variant="outline-dark"
                onClick={this.handleClick}
                disabled={this.state.players.includes(this.state.username)}
              >
                Join the Game
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }
}

export default Game
