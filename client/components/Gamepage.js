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
  }

  async componentDidMount() {
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
          .then(() => this.setState({username: username}))
      }
    })
  }

  render() {
    return this.state.username ? (
      <div id="gamepage">
        <GamePlay
          gamename={this.props.match.params.gamename}
          username={this.state.username}
        />
        <Chatroom
          gamename={this.props.match.params.gamename}
          username={this.state.username}
        />

        {/* <Test /> */}
      </div>
    ) : (
      <div />
    )
  }
}

export default Gamepage
