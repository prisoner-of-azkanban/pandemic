import React from 'react'
import {Button, Form, Col, Row} from 'react-bootstrap'
import {app, db} from '../../firebase-server/firebase'
import {Link} from 'react-router-dom'

class WaitingRoom extends React.Component {
  constructor() {
    super()
    this.state = {
      gamename: '',
      games: []
    }
    this.games = db.collection('games')
  }

  async componentDidMount() {
    const games = []
    await this.games
      .get()
      .then(function(doc) {
        doc.forEach(game => games.push(game.data()))
      })
      .then(() => this.setState({games: games}))
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
        isFull: false
      })
      .then(() => this.props.history.push(`/game/${this.state.gamename}`))
  }

  render() {
    return (
      <div className="waiting-room-page">
        <Row className="waiting-room-list">
          {this.state.games.map(game => (
            <Col key={game.name} md="3" className="waiting-room-game">
              <h1 className="game-name">{game.name}</h1>
              <Link to={`/game/${game.name}`} className="game-join-link">
                Join Game
              </Link>
            </Col>
          ))}
        </Row>
        <Form onSubmit={this.handleSubmit}>
          <Form.Label>Game Name</Form.Label>
          <Form.Control
            name="gamename"
            type="text"
            onChange={this.handleChange}
          />
          <Button type="submit" variant="outline-dark" className="main-btn">
            Create a new game
          </Button>
        </Form>
      </div>
    )
  }
}

export default WaitingRoom
