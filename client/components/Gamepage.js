import React from 'react'
import Chatroom from './Chatroom'

class Gamepage extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div id="gamepage">
        <div id="game-placeholder">
          <h1>Placeholder for graphics</h1>
        </div>
        <Chatroom />
      </div>
    )
  }
}

export default Gamepage
