import React from 'react'
import {Layer, Rect, Stage, Group} from 'react-konva'
import {db} from '../../firebase-server/firebase'
import firebase from 'firebase'

class MyRect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      color: 'green'
    }
    this.color = db
      .collection('games')
      .doc(this.props.gamename)
      .collection('colors')
    this.color.onSnapshot(this.listenColors)
  }

  async componentDidMount() {
    const gamename = this.props.gamename
    const color = this.state.color
    await db
      .collection('games')
      .doc(this.props.gamename)
      .collection('colors')
      .doc('color')
      .get()
      .then(function(doc) {
        if (!doc.exists) {
          db
            .collection('games')
            .doc(gamename)
            .collection('colors')
            .doc('color')
            .set({color: color})
        }
      })
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
    console.log('rect.js props', this.props)
    // console.log('what is a color', this.state.color)
    // console.log('cahtroom', this.chatroom)
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
