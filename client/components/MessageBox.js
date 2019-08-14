import React from 'react'

class MessageBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {messages: props.messages}
  }
  render() {
    return (
      <div>
        {this.state.messages.length ? (
          this.state.messages.map(message => <h1 key={message}>{message}</h1>)
        ) : (
          <h1>No messages</h1>
        )}
      </div>
    )
  }
}

export default MessageBox
