import React from 'react'
import {Button, Form, Col, Row} from 'react-bootstrap'
import {app, db} from '../../firebase-server/firebase'
import {Link} from 'react-router-dom'
import firebase from 'firebase'

class WaitingRoom extends React.Component {
  constructor() {
    super()
    this.state = {
      gamename: '',
      games: [],
      username: ''
    }
    this._isMounted = false
    this.games = db.collection('games')
    this.games.onSnapshot(this.listenGames)
  }

  async componentDidMount() {
    this._isMounted = true
    let games = []
    // let userId = ''
    // let username = ''

    // await firebase.auth().onAuthStateChanged(loggedinUser => {
    //   if (loggedinUser) {
    //     userId = loggedinUser.uid
    //     db
    //       .collection('users')
    //       .doc(userId)
    //       .get()
    //       .then(doc => {
    //         if (doc.exists) {
    //           username = doc.data().username
    //         }
    //       })
    //       .then(() => {
    //         if (this._isMounted) {
    //           this.setState({username: username})
    //         }
    //       })
    //       .then(() =>
    await this.games
      .get()
      .then(function(doc) {
        doc.forEach(game => games.push(game.data()))
      })
      .then(() => {
        if (this._isMounted) {
          this.setState({games: games})
        }
      })
      .catch(error => console.log(error))
    //    )
    // } else {
    //   this.props.history.push('/')
    // }
    //})
  }

  componentWillUnmount() {
    this._isMounted = false
    const unsubscribe = this.games.onSnapshot(this.listenGames)
    unsubscribe()
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = () => {
    event.preventDefault()
    db
      .collection('games')
      .doc(this.state.gamename)
      .set({
        name: this.state.gamename,
        isFull: false,
        started: false,
        players: [],
        currentTurn: 0,
        win: 0,
        lose: 0,
        actionCount: 0,
        infectionRate: 0,
        outbreaks: 0,
        redCure: 0,
        blueCure: 0,
        blackCure: 0,
        yellowCure: 0,
        gameStart: 0
      })
      .then(() =>
        db
          .collection('games')
          .doc(this.state.gamename)
          .collection('gamestate')
          .doc('decks')
          .set({
            playerCardDeck: [],
            playerCardDiscard: [],
            infectionCardDeck: [],
            infectionCardDiscard: []
          })
      )
      .then(() =>
        db
          .collection('games')
          .doc(this.state.gamename)
          .collection('gamestate')
          .doc('cities')
          .set({
            cities: {}
          })
      )
      .then(() =>
        db
          .collection('games')
          .doc(this.state.gamename)
          .collection('gamestate')
          .doc('playerList')
          .set({
            playerList: [],
            actionCount: 0
          })
      )
      .then(() =>
        db
          .collection('games')
          .doc(this.state.gamename)
          .collection('gamestate')
          .doc('cubes')
          .set({
            blueCubes: 24,
            redCubes: 24,
            blackCubes: 24,
            yellowCubes: 24
          })
      )
      .then(() => this.props.history.push(`/game/${this.state.gamename}`))
      .catch(error => console.log(error))
  }

  handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log('user signed out'))
      .then(() => this.props.history.push('/login'))
      .catch(err => console.log(err))
  }

  listenGames = () => {
    let games = []
    this.games.get().then(doc => {
      doc.forEach(function(game) {
        games.push(game.data())
      })
      if (this._isMounted) {
        this.setState({
          games: games
        })
      }
    })
  }

  render() {
    console.log('waiting room props', this.state)
    return (
      <div className="waiting-room-page">
        <h3 className="waiting-room-header">
          Welcome back, {this.props.username}
        </h3>
        <Row className="waiting-room-list">
          {this.state.games.filter(game => !game.isFull).map(game => (
            <Col
              key={game.name}
              md="4"
              lg="2"
              sm="12"
              className="waiting-room-game"
            >
              <Link to={`/game/${game.name}`} className="game-join-link">
                <h1 className="game-name">{game.name}</h1>
                Join Game
              </Link>
            </Col>
          ))}
        </Row>
        <Form onSubmit={this.handleSubmit} className="waiting-make-game">
          <h1 className="game-name">New Game</h1>
          <Form.Control
            name="gamename"
            type="text"
            onChange={this.handleChange}
          />
          <Button
            type="submit"
            variant="outline-dark"
            className="main-btn"
            disabled={!this.state.gamename.length}
          >
            Create a new game
          </Button>
        </Form>
        <Button
          variant="outline-dark"
          className="main-btn"
          onClick={this.handleLogout}
        >
          Log out of your account
        </Button>
      </div>
    )
  }
}

export default WaitingRoom
