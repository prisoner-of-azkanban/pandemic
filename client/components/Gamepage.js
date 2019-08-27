import React from 'react'
import {Chatroom, GamePlay} from './index'

const Gamepage = props => {
  return props.username ? (
    <div id="gamepage">
      <GamePlay
        gamename={props.match.params.gamename}
        username={props.username}
        history={props.history}
      />
      <Chatroom
        gamename={props.match.params.gamename}
        username={props.username}
        className="chat-container"
      />

      {/* <Test /> */}
    </div>
  ) : (
    <div />
  )
}

export default Gamepage
