import React from 'react'
import {app, db, config} from '../../firebase-server/firebase'
import {Form, Button} from 'react-bootstrap'
import firebase from 'firebase'
import {randomNumGenerator} from './utils'

class Chatroom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {message: '', username: this.props.username, messages: []}
    this.chatroom = db
      .collection('games')
      .doc(this.props.gamename)
      .collection('chatroom')

    this.chatroom.onSnapshot(this.listenMessages)
  }

  componentDidMount() {
    db
      .collection('games')
      .doc('game1')
      .collection('participants')
      .doc(this.props.username)
      .set({username: this.props.username})
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  componentWillUnmount() {
    const unsubscribe = this.chatroom.onSnapshot(this.listenMessages)
    unsubscribe()
    db
      .collection('games')
      .doc('game1')
      .collection('participants')
      .doc(this.props.username)
      .delete()
      .then(function() {
        console.log('doc successfully deleted')
      })
  }

  handleChange = event => {
    this.setState({
      message: event.target.value
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    if (this.state.username && this.state.message) {
      this.chatroom
        .add({
          username: this.props.username,
          message: this.state.message,
          createdAt: firebase.firestore.Timestamp.fromDate(new Date())
        })
        .then(
          this.setState({
            message: ''
          })
        )
    }
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({behavior: 'smooth'})
  }

  listenMessages = () => {
    let messages = []
    this.chatroom
      .orderBy('createdAt', 'asc')
      .get()
      .then(doc => {
        doc.forEach(function(msg) {
          messages.push(msg.data())
        })
        this.setState({
          messages: messages
        })
      })
  }

  render() {
    return (
      <React.Fragment>
        <div className="chatBox">
          {this.state.messages.length ? (
            this.state.messages.map((message, index) => (
              <p key={index}>
                {message.username} : {message.message}
              </p>
            ))
          ) : (
            <p>No messages</p>
          )}
          <div
            style={{float: 'left', clear: 'both'}}
            ref={el => {
              this.messagesEnd = el
            }}
          />
        </div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Control
            type="text"
            placeholder="enter message here"
            name="message"
            value={this.state.message}
            onChange={this.handleChange}
          />
          <Button type="submit">Send</Button>
        </Form>
      </React.Fragment>
    )
  }
}

export default Chatroom
