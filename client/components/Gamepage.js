import React from 'react'
import Chatroom from './Chatroom'
import CanvasComponent from './canvas-component'

class Gamepage extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div id="gamepage">
        <CanvasComponent />
        <Chatroom />
      </div>
    )
  }
}

export default Gamepage
