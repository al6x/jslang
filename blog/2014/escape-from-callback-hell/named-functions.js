// # Approach with named functions.

// Asynchronous functions.
var authenticateUser = function(login, password, cb){
  setTimeout(function(){
    var user = {id: '1', name: 'admin'}
    cb(null, user)
  })
}
var getComments = function(userId, cb){
  setTimeout(function(){
    var comments = [{text: 'some comment...'}]
    cb(null, comments)
  })
}
var renderComments = function(user, comments, cb){
  setTimeout(function(){
    var html = user.name + ' wrote ' + comments[0].text
    cb(null, html)
  })
}

// Getting current user and his comments.
var renderCommentsForUser = function(login, password, cb) { 
  var state = {}
  authenticateUser(login, password, authenticated) 

  function authenticated(err, user) { 
    if(err) return cb(err)
    state.user = user
    getComments(user.id, gotComments) 
  } 

  function gotComments(err, comments) { 
    if(err) return done(err)
    renderComments(state.user, comments, cb) 
  } 
}
renderCommentsForUser('admin', 'admin', function(err, html){
  if(err) return console.error(err)
  console.log(html)
})