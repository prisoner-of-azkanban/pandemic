import React from 'react'
import {Layer, Rect, Stage, Group} from 'react-konva'
import io from 'socket.io-client'

// function rect(props) {
//   const {ctx, x, y, width, height} = props;
//   ctx.fillRect(x, y, width, height);
// }

// class CanvasComponent extends React.Component {
//   constructor() {
//     super()
//     this.state = {
//       color: 'blue',
//     }
//   }

//   componentDidMount(){
//     this.updateCanvas()
//   }

//   componentDidUpdate() {
//     this.updateCanvas();
//   }

//   updateCanvas() {
//       const ctx = this.refs.canvas.getContext('2d');
//       ctx.clearRect(0,0, 300, 300);
//       // draw children “components”
//       rect({ctx, x: 10, y: 10, width: 50, height: 50});
//   }

//   render(){
//     return(
//     <>
//       <canvas
//         className = 'canvas'
//         ref = 'canvas'
//         width= '500'
//         height= '500'
//       />
//     </>
//     )
//   }

// }

// export default CanvasComponent

class MyRect extends React.Component {
  constructor(props) {
    super(props)
    console.log('where are the props', this.props)
    this.state = {
      color: 'green'
    }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    this.setState({
      color: Konva.Util.getRandomColor()
    })
    this.props.socket.emit('colorchange', this.state.color)
  }

  componentDidMount() {
    this.props.socket.on('setcolor', color => {
      this.setState({
        color: color
      })
    })
  }
  render() {
    return (
      <Rect
        x={10}
        y={10}
        width={50}
        height={50}
        fill={this.state.color}
        shadowBlur={10}
        onClick={this.handleClick}
      />
    )
  }
}
function CanvasComponent(props) {
  return (
    <Stage width={150} height={150}>
      <Layer>
        <MyRect socket={props.socket} />
      </Layer>
    </Stage>
  )
}

export default CanvasComponent
