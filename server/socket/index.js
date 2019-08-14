module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })

    socket.on('message', data => {
      //Here we broadcast it out to all other sockets EXCLUDING the socket which sent us the data
      console.log(data)
      io.emit('outgoing data', data)
    })
  })
}
