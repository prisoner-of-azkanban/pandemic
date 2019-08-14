import React from 'react'
import MessageBox from './MessageBox'
import io from 'socket.io-client'

const socket =
  window.location.hostname !== 'localhost'
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
    socket.on('updatechat', data => {
      console.log('update chat with new username', data)
      this.setState({messages: [...this.state.messages, data]})
      console.log(this.state)
    })
    // socket.on('outgoing data', data => console.log(data))
  }

  nameClick = event => {
    event.preventDefault()
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
        <form>
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
          <button onClick={this.handleSubmit}>Submit Chat</button>
        </form>
      </React.Fragment>
    )
  }
}

export default Chatroom
