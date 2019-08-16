import React from 'react'
import {Chatroom, CanvasComponent, Test} from './index'

class Gamepage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id="gamepage">
        <CanvasComponent gamename={this.props.match.params.gamename} />
        <Chatroom gamename={this.props.match.params.gamename} />

        <Test />
      </div>
    )
  }
}

export default Gamepage
