import React from 'react'
import {Chatroom, CanvasComponent, Test} from './index'

class Gamepage extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div id="gamepage">
        <CanvasComponent />
        <Chatroom />
        <Test />
      </div>
    )
  }
}

export default Gamepage
