import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import {
  Homepage,
  NewSignup,
  NewLogin,
  NewChat,
  Gamepage,
  WaitingRoom,
  PandemicMap,
  Lose,
  Win
} from './components'
import firebase from 'firebase'
import {app, db, config} from '../firebase-server/firebase'

/**
 * COMPONENT
 */
class Routes extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      loggedIn: false
    }
    this._isMounted = false
  }

  async componentDidMount() {
    this._isMounted = true
    let userId = ''
    let username = 'Guest'
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
              this.setState({username: username, loggedIn: true})
            }
          })
      }
    })
  }
  render() {
    return (
      <Switch>
        <Route path="/login" render={props => <NewLogin {...props} />} />
        <Route path="/signup" render={props => <NewSignup {...props} />} />
        {this.state.loggedIn && (
          <Switch>
            <Route
              exact
              path="/game/:gamename"
              render={props => (
                <Gamepage {...props} username={this.state.username} />
              )}
            />
            {/* <Route path="/chat" component={NewChat} /> */}
            {/* <Route path="/game" component={Gamepage} /> */}
            {/* <Route path="/test" component={Win} /> */}
            <Route
              path="/waitingroom"
              render={props => (
                <WaitingRoom {...props} username={this.state.username} />
              )}
            />
          </Switch>
        )}

        <Route exact path="/" render={props => <Homepage {...props} />} />
        <Route component={NewLogin} />
      </Switch>
    )
  }
}

export default Routes
