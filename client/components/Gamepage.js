import React from 'react'
import Chatroom from './Chatroom'
import CanvasComponent from './canvas-component'

class Gamepage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id="gamepage">
        <CanvasComponent gamename={this.props.match.params.gamename} />
        <Chatroom gamename={this.props.match.params.gamename} />
      </div>
    )
  }
}

export default Gamepage
