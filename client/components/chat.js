import React from 'react'
import MessageBox from './MessageBox'
import io from 'socket.io-client'
const socket = process.env.PORT
  ? io('http://onlinepandemicgame.herokuapp.com')
  : io('http://localhost:8080')

class Chatroom extends React.Component {
  constructor() {
    super()
    this.state = {message: '', username: '', messages: []}
    this.socket = socket
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleName = this.handleName.bind(this)
  }

  componentDidMount() {
    socket.on('connect', () => {
      console.log('client side socket works!')
    })
    socket.on('outgoing data', data => console.log(data))
  }

  nameClick = () => {
    socket.emit('adduser', this.state.username)
  }

  handleName(event) {
    this.setState({
      username: event.target.value
    })
  }

  handleChange(event) {
    this.setState({
      message: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    socket.emit('message', {message: this.state.message})
    this.setState({
      message: ''
    })
  }

  render() {
    return (
      <React.Fragment>
        <MessageBox messages={this.state.messages} />
        <form onSubmit={this.handleSubmit}>
          Name:
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.handleName}
          />
          <button onClick={this.nameClick}>Send Name</button>
          <br />
          Message:
          <input
            type="text"
            name="message"
            value={this.state.message}
            onChange={this.handleChange}
          />
          <button type="submit">Submit Chat</button>
        </form>
      </React.Fragment>
    )
  }
}

export default Chatroom
