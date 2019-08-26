import React from 'react'
import {Chatroom, GamePlay} from './index'

class Gamepage extends React.Component {
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
