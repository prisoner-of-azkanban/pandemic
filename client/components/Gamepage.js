import React from 'react'
import {Chatroom, CanvasComponent, Test, GamePlay} from './index'
import firebase from 'firebase'
import {randomNumGenerator} from './utils'
import {app, db, config} from '../../firebase-server/firebase'

class Gamepage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: ''
    }
    this._isMounted = false
  }

  async componentDidMount() {
    this._isMounted = true
    let userId = ''
    let username = 'Guest' + randomNumGenerator()

    await firebase.auth().onAuthStateChanged(loggedinUser => {
      if (loggedinUser) {
        userId = loggedinUser.uid
        db
          .collection('users')
          .doc(userId)
          .get()
          .then(doc => {
            if (doc.exists) {
              username = doc.data().username
            }
          })
          .then(() => {
            if (this._isMounted) {
              this.setState({username: username})
            }
          })
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    return this.props.username ? (
      <div id="gamepage">
        <GamePlay
          gamename={this.props.match.params.gamename}
          username={this.props.username}
        />
        <Chatroom
          gamename={this.props.match.params.gamename}
          username={this.props.username}
          className="chat-container"
        />

        {/* <Test /> */}
      </div>
    ) : (
      <div />
    )
  }
}

export default Gamepage
