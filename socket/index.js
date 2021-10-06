module.exports = function (io) {
    io.on('connection', function(socket) {
      console.log('connection has been established');
  
      socket.on('posts/subscribe', function(meetupId) {
        console.log('joining meetup testing1234', `meetup-${meetupId}`);
        socket.join(`meetup-${meetupId}`);
      })
  
      socket.on('posts/unsubscribe', function(meetupId) {
        console.log('leaving meetup ', `meetup-${meetupId}`);
        socket.leave(`meetup-${meetupId}`);
      })
      //comming from client
      socket.on('posts/commentSaved', function(post) {
        console.log('emitting to meetup', `meetup-${post._id}`)
        //going to client
        socket.to(`meetup-${post._id}`).emit('posts/commentPublished', post)
      })

      socket.on('messages/subscribe', function(Id) {
        console.log('joining messages ', `message-${Id}`);
        socket.join(`message-${Id}`);
      })
      socket.on('messages/unsubscribe', function(Id) {
        console.log('leaving message ', `message-${Id}`);
        socket.leave(`message-${Id}`);
      })
      socket.on('messages/messageSaved', function() {
        console.log('emitting to message', `message`)
        //going to client
        socket.to(`message-6024feb0e4e953d6304b67eb`).emit('messages/messagePublished')
      })
    })
  }