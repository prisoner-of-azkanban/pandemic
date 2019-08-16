import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import {Homepage, NewSignup, NewLogin, NewChat, Gamepage} from './components'

/**
 * COMPONENT
 */
class Routes extends Component {
  render() {
    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route path="/login" component={NewLogin} />
        <Route path="/signup" component={NewSignup} />
        {/* Displays our Login component as a fallback */}
        <Route path="/chat" component={NewChat} />
        <Route path="/game" component={Gamepage} />
        <Route exact path="/" component={Homepage} />
        <Route component={NewLogin} />
      </Switch>
    )
  }
}

export default Routes
