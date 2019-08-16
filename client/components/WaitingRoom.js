import React from 'react'
import {Button, Form} from 'react-bootstrap'
import {app, db} from '../../firebase-server/firebase'

class WaitingRoom extends React.Component {
  constructor() {
    super()
    this.state = {
      gamename: ''
    }
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
      <div className="home-page">
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
