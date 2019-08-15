import React from 'react'
import {app, db, config} from '../../firebase-server/firebase'
import {Form, Button} from 'react-bootstrap'
import firebase from 'firebase'

class Chatroom extends React.Component {
  constructor() {
    super()
    this.state = {message: '', username: '', messages: []}
    this.chatroom = firebase.database().ref('messages')
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
    this.chatroom.on('value', this.listenMessages)
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  componentWillUnmount() {
    this.chatroom.off('value', this.listenMessages)
  }

  handleChange = event => {
    this.setState({
      message: event.target.value
    })
  }

  handleSubmit = event => {
    if (this.state.username && this.state.message) {
      this.chatroom.push({
        username: this.state.username,
        message: this.state.message
      })
      this.setState({
        message: ''
      })
    }
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({behavior: 'smooth'})
  }

  listenMessages = () => {
    this.chatroom.limitToLast(10).on('value', message => {
      this.setState({
        messages: Object.values(message.val())
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
