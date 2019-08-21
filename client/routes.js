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
        {/* Routes placed here are available to all visitors */}
        <Route path="/login" render={props => <NewLogin {...props} />} />
        <Route path="/signup" render={props => <NewSignup {...props} />} />
        {/* Displays our Login component as a fallback */}
        <Route
          exact
          path="/game/:gamename"
          render={props => <Gamepage {...props} />}
        />
        <Route path="/chat" component={NewChat} />
        <Route path="/game" component={Gamepage} />
        {/* <Route path="/test" component={PandemicMap} /> */}
        <Route path="/test" component={Win} />
        <Route
          path="/waitingroom"
          render={props => <WaitingRoom {...props} />}
        />
        <Route exact path="/" component={Homepage} />
        <Route component={NewLogin} />
      </Switch>
    )
  }
}

export default Routes
