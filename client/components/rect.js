import React from 'react'
import {Layer, Rect, Stage, Group} from 'react-konva'
import {db} from '../../firebase-server/firebase'
import firebase from 'firebase'

class MyRect extends React.Component {
  constructor() {
    super()
    this.state = {
      color: 'green'
    }
    this.color = db
      .collection('games')
      .doc('game1')
      .collection('colors')
    this.color.onSnapshot(this.listenColors)
  }

  handleClick = () => {
    let color = Konva.Util.getRandomColor()
    this.color.doc('color').update({color: color})
  }

  listenColors = () => {
    let color = ''
    this.color.get().then(doc => {
      doc.forEach(clr => {
        color = clr.data()
      })
      this.setState({color: color.color})
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

export default MyRect
