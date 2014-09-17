# Escape from Callback Hell

You probably heard about asynchronous code and that it is hard to work with. In this 
article I'll share simple approach that makes working with asynchronous code easier.

Let's take a look at sample case - we need to authenticate user on the remote service, 
get list of his comments and render it in HTML. 

There are three **asynchronous** functions - `authenticateUser`, `getComments(userId)` 
and `renderComments(user, comments)`.

``` JavaScript
var authenticateUser = function(login, password, cb){setTimeout(function(){
  var user = {id: '1', name: 'admin'}
  cb(null, user)
})}
var getComments = function(userId, cb){setTimeout(function(){
  var comments = [{text: 'some comment...'}]
  cb(null, comments)
})}
var renderComments = function(user, comments, cb){
  setTimeout(function(){
    var html = user.name + ' wrote ' + comments[0].text
    cb(null, html)
  })
}
```

Now let's write code that uses these functions and **handles errors** properly. 

``` JavaScript
var renderCommentsForUser = function(login, password, cb){
  authenticateUser(login, password, function(err, user){
    if(err) return cb(err)
    getComments(user.id, function(err, comments){
      if(err) return cb(err)
      renderComments(user, comments, cb)
    })
  })
}
renderCommentsForUser('admin', 'admin', function(err, comments){
  if(err) return console.error(err)
  console.log(comments)
})
```

As you can see, such a trivial task as calling three functions sequentially ends up in a 
pretty bloat code. Let's explore approaches we can use to make it simpler.

<!--
To make it clear - let's compare it to the plain synchronous version 
(it wouldn't work, I put it here for illustrational purposes only).

``` JavaScript
var renderCommentsForUser = function(login, password){
  var user = authenticateUser(login, password)
  var comments = getComments()
  return renderComments(user, comments)
}

try{
  console.log(renderCommentsForUser('admin', 'admin'))
}catch(err){
  console.log(errors)
}
```
-->

# Forking callbacks

As you may notice we spend lot of time explicitly checking for the error. Let's
see how we can mitigate it and define special `fork` helper.

It accepts two functions - one for error and another for success, and depending
on the result of the call calls the according one.

``` JavaScript
var fork = function(callbackForError, callbackForSuccess){
  return function(){
    var err = arguments[0]
    var argsWithoutError = [].slice.call(arguments, 1) || []
    if(err) return callbackForError(err)
    if(callbackForSuccess) callbackForSuccess.apply(null, argsWithoutError)
  }
}
```

Printing code using `fork`, as you can see - code became simpler, there's no more
explicit checks for the errors.

``` JavaScript
var renderCommentsForUserWithFork = function(login, password, cb){
  authenticateUser(login, password, fork(cb, function(user){    
    getComments(user.id, fork(cb, function(comments){
      renderComments(user, comments, cb)
    }))
  }))
}
renderCommentsForUserWithFork('admin', 'admin', fork(console.error, console.log))
```

# Using two callbacks

We can also explicitly split the callback into two - one for error and another
for the success.

To do so we need to make our existing functions to be able to accept two callbacks, and 
we also need to keep it backward compatible.

``` JavaScript
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
```

Making existing functions being able to accept two callbacks.

``` JavaScript
authenticateUser = twilify(authenticateUser)
getComments = twilify(getComments)
renderComments = twilify(renderComments)
```

Printing code using two callbacks, as you can see - code became even simpler than with `fork`.

``` JavaScript
var renderCommentsForUserWithTwoCallbacks = function(login, password, ecb, cb){
  authenticateUser(login, password, ecb, function(user){    
    getComments(user.id, ecb, function(comments){
      renderComments(user, comments, ecb, cb)
    })
  })
}
renderCommentsForUserWithTwoCallbacks('admin', 'admin', console.error, console.log)
```

# Notes

Download [the code](escape-from-callback-hell/sequential.js) it and run it `node sample.js`.

## About Promises and Async helpers

Yes, there are lots of other ways to simplify it - like promises and async helpers, and you 
may find it also useful. As for me - I tried it but didn't like it very much, because the 
code became complex and it doesn't provide much better results anyway. 
But it's just my personal opinion, I know that many developers use it.

## About the Named Functions

One of readers (thanks to him for that) wrote code showcasing the classical approach with Named 
Functions.

``` JavaScript
var renderCommentsForUser = function(login, password, cb) { 
  var state = {}
  authenticateUser(login, password, authenticated) 

  function authenticated(err, user) { 
    if(err) return cb(err)
    state.user = user
    getComments(user.id, gotComments) 
  } 

  function gotComments(err, comments) { 
    if(err) return cb(err)
    renderComments(state.user, comments, cb) 
  } 
}
```

> Instead of nesting functions within function, use a state object and named 
> functions.
> Reads much nicer even if it is more lines of code.

Let's compare it with the two callbacks (or fork) version.

``` JavaScript
var renderCommentsForUser = function(login, password, ecb, cb){
  authenticateUser(login, password, ecb, function(user){    
    getComments(user.id, ecb, function(comments){
      renderComments(user, comments, ecb, cb)
    })
  })
}
```

I'm not sure about which version is *nicer* but it seems that the version with two
callbacks (or fork) is simpler. But, it is also only my personal opinion, the 
approach with named functions is perfectly valid and widely used, choose whatever 
you prefer.

By [Alex Craft](http://alex-craft.com)

- Tags : JavaScript, Node.js
- Date : 2014/9/16