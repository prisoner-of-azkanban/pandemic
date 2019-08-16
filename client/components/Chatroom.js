import React from 'react'
import {app, db, config} from '../../firebase-server/firebase'
import {Form, Button} from 'react-bootstrap'
import firebase from 'firebase'

class Chatroom extends React.Component {
  constructor() {
    super()
    this.state = {message: '', username: '', messages: []}
    // this.chatroom = firebase.database().ref('messages')
    this.chatroom = db
      .collection('games')
      .doc('game1')
      .collection('chatroom')

    this.chatroom.onSnapshot(this.listenMessages)
  }

  async componentDidMount() {
    let user = firebase.auth().currentUser
    let username = 'Guest'
    if (user) {
      await db
        .collection('users')
        .doc(user.uid)
        .get()
        .then(function(doc) {
          if (doc.exists) {
            console.log('document data obtained')
            username = doc.data().username
          } else {
            console.log('document does not exist')
          }
        })
    }
    this.setState({username: username})
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  componentWillUnmount() {
    const unsubscribe = this.chatroom.onSnapshot(this.listenMessages)
    unsubscribe()
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
          username: this.state.username,
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
        <Form>
          Message:
          <Form.Control
            type="text"
            name="message"
            value={this.state.message}
            onChange={this.handleChange}
          />
          <Button onClick={this.handleSubmit}>Send</Button>
        </Form>
      </React.Fragment>
    )
  }
}

export default Chatroom
