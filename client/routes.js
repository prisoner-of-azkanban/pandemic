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

/**
 * COMPONENT
 */
class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/login" render={props => <NewLogin {...props} />} />
        <Route path="/signup" render={props => <NewSignup {...props} />} />
        <Route
          exact
          path="/game/:gamename"
          render={props => <Gamepage {...props} />}
        />
        <Route path="/chat" component={NewChat} />
        <Route path="/game" component={Gamepage} />
        <Route path="/test" component={Win} />
        <Route
          path="/waitingroom"
          render={props => <WaitingRoom {...props} />}
        />
        <Route exact path="/" render={props => <Homepage {...props} />} />
        <Route component={NewLogin} />
      </Switch>
    )
  }
}

export default Routes
