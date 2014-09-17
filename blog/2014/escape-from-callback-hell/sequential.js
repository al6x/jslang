// # Plain callbacks.

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
var renderCommentsForUser = function(login, password, cb){
  authenticateUser(login, password, function(err, user){
    if(err) return cb(err)
    getComments(user.id, function(err, comments){
      if(err) return cb(err)
      renderComments(user, comments, cb)
    })
  })
}
renderCommentsForUser('admin', 'admin', function(err, html){
  if(err) return console.error(err)
  console.log(html)
})

// # Callbacks with `fork` helper.

// Asynchronous `fork` helper.
var fork = function(callbackForError, callbackForSuccess){
  return function(){    
    var err = arguments[0]
    var argsWithoutError = [].slice.call(arguments, 1) || []
    if(err) return callbackForError(err)
    if(callbackForSuccess) callbackForSuccess.apply(null, argsWithoutError)
  }
}

// Getting current user and his comments using `fork` helper.
var renderCommentsForUserWithFork = function(login, password, cb){
  authenticateUser(login, password, fork(cb, function(user){    
    getComments(user.id, fork(cb, function(comments){
      renderComments(user, comments, cb)
    }))
  }))
}
renderCommentsForUserWithFork('admin', 'admin', fork(console.error, console.log))

// # Using two callbacks.

// Most of existing functions use node.js convention for passing only one callback, if
// we want to use two callbacks we need to convert it.
var twilify = function(fn){
  return function(){
    var last = arguments[arguments.length - 1]
    var beforeLast = arguments[arguments.length - 2]
    if((arguments.length > 1) && (typeof(last) == "function") && (typeof(beforeLast) == "function")){
      var argsWithOneCallback = [].slice.call(arguments, 0, arguments.length - 2) || []
      argsWithOneCallback.push(fork(beforeLast, last))
      fn.apply(this, argsWithOneCallback)
    }else fn.apply(this, arguments)
  }
}

// Converting our existing functions to accept two callbacks. It also stays backward compatible
// and can accept single callbac.
authenticateUser = twilify(authenticateUser)
getComments = twilify(getComments)
renderComments = twilify(renderComments)

// Getting current user and his comments using two callbacks.
var renderCommentsForUserWithTwoCallbacks = function(login, password, ecb, cb){
  authenticateUser(login, password, ecb, function(user){    
    getComments(user.id, ecb, function(comments){
      renderComments(user, comments, ecb, cb)
    })
  })
}
renderCommentsForUserWithTwoCallbacks('admin', 'admin', console.error, console.log)