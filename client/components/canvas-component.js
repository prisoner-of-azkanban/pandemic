import React from 'react'
import {Layer, Rect, Stage, Group} from 'react-konva'
import MyRect from './rect'

function CanvasComponent(props) {
  return (
    <Stage width={150} height={150}>
      <Layer>
        <MyRect />
      </Layer>
    </Stage>
  )
}

export default CanvasComponent
