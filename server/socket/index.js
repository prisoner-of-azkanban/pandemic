let usernames = {}

module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })

    socket.on('message', data => {
      const message = socket.username + `: ${data.message}`
      io.emit('updatechat', message)
    })

    socket.on('adduser', username => {
      socket.username = username
      usernames[username] = username
      io.emit('updatechat', username + ' has connected')
      // io.sockets.emit('updateusers', usernames)
    })
  })
}
