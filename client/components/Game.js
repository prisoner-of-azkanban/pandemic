import React from 'react'
import {Button} from 'react-bootstrap'
import {app, db} from '../../firebase-server/firebase'
import firebase from 'firebase'
import {MainGame} from './index'

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
      .catch(err => {
        console.log('an error has occurred with firebase', err.message)
        alert(err.message)
      })
  }

  componentWillUnmount() {
    this._isMounted = false
    const unsubscribePlayer = this.game.onSnapshot(this.listenPlayers)
    const unsubscribeStart = this.game.onSnapshot(this.listenStart)
    unsubscribePlayer()
    unsubscribeStart()
  }

  handleBack = () => {
    this.props.history.push('/waitingroom')
  }

  handleClick = () => {
    if (!this.state.players.includes(this.state.username)) {
      this.game.set(
        {
          players: [...this.state.players, this.state.username]
        },
        {merge: true}
      )
      this.game
        .collection('chatroom')
        .add({
          username: 'Admin',
          message: this.state.username + ' has joined the game',
          createdAt: firebase.firestore.Timestamp.fromDate(new Date())
        })
        .catch(err => {
          console.log('an error has occurred with the chatroom', err.message)
          alert(err.message)
        })
    } else {
      let newPlayersArray = this.state.players.filter(
        name => name !== this.state.username
      )
      this.game.set(
        {
          players: [...newPlayersArray]
        },
        {merge: true}
      )
      this.game
        .collection('chatroom')
        .add({
          username: 'Admin',
          message: this.state.username + ' has left the game',
          createdAt: firebase.firestore.Timestamp.fromDate(new Date())
        })
        .catch(err => {
          console.log('an error has occurred with the chatroom', err.message)
          alert(err.message)
        })
    }
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
    if (this._isMounted) {
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
        .catch(err => {
          console.log('an error has occurred with firebase', err.message)
          alert(err.message)
        })
    }
  }

  listenPlayers = () => {
    let players = []
    if (this._isMounted) {
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
        .then(() => {
          if (this.state.players.length !== MAXPLAYERS) {
            this.game.set({isFull: false}, {merge: true}).then(() => {
              if (this._isMounted) {
                this.setState({
                  isFull: false
                })
              }
            })
          }
        })
        .catch(err => {
          console.log('an error has occurred with firebase', err.message)
          alert(err.message)
        })
    }
  }

  render() {
    return (
      <div className="game-container">
        <div>
          {this.state.started ? (
            <MainGame
              players={this.state.players}
              game={this.game}
              username={this.props.username}
            />
          ) : this.state.isFull ? (
            <p>The room is full, start the game</p>
          ) : (
            <h4>Waiting for 4 players</h4>
          )}
          {this.state.started ? (
            <div />
          ) : (
            <div>
              <h4>Current players:</h4>
              {this.state.players.map(player => <p key={player}>{player}</p>)}
              {this.state.isFull ? (
                <div>
                  <Button variant="outline-dark" onClick={this.handleStart}>
                    Start the Game
                  </Button>
                  <div>
                    <Button
                      variant="outline-dark"
                      onClick={this.handleClick}
                      disabled={
                        !this.state.players.includes(this.state.username)
                      }
                    >
                      Leave the Game
                    </Button>
                    <Button
                      variant="outline-dark"
                      onClick={this.handleBack}
                      disabled={this.state.players.includes(
                        this.state.username
                      )}
                    >
                      Leave the Room
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div>
                    <Button
                      variant="outline-dark"
                      onClick={this.handleClick}
                      disabled={this.state.players.includes(
                        this.state.username
                      )}
                    >
                      Join the Game
                    </Button>
                    <Button
                      variant="outline-dark"
                      onClick={this.handleClick}
                      disabled={
                        !this.state.players.includes(this.state.username)
                      }
                    >
                      Leave the Game
                    </Button>
                  </div>
                  <div>
                    <Button
                      variant="outline-dark"
                      onClick={this.handleBack}
                      disabled={this.state.players.includes(
                        this.state.username
                      )}
                    >
                      Leave the Room
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default Game
