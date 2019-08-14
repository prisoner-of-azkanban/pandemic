import React from 'react'

const MessageBox = props => {
  return (
    <div className="chatBox">
      {props.messages.length ? (
        props.messages.map((message, index) => <p key={index}>{message}</p>)
      ) : (
        <p>No messages</p>
      )}
    </div>
  )
}

export default MessageBox
