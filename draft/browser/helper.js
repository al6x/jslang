window.global = window

// Globals
global.expect = chai.expect
global.p      = function(){console.log.apply(console, arguments)}

 // Extending Chai
chai.Assertion.addMethod('element', function(query){
  this.assert(this._obj.find(query).size() > 0,
    "expected HTML to have element '" + query + "'",
    "expected HTML not to have element '" + query + "'")

  // TODO enable it, it provides more strict check, but right now causes errors in tests.
  // @assert @_obj.find(query).size() > 1,
  //  "found multiple elements '#{query}'",
  //  "found multiple elements '#{query}'"
})

chai.Assertion.addMethod('text', function(exp){
  var text = this._obj.text()
  var result
  if(exp instanceof RegExp) result = exp.test(text)
  else result = text.indexOf(exp) >= 0
  this.assert(result,
    "expected '" + text + "' to have text '" + exp + "'",
    "expected '" + text + "' not to have text '" + exp + "'"
  )
})

// # Extending Browser.
// global.Browser = require './helper/browser'
//
// # Extending browser with application-specific helpers.
// require './browserHelpers'
// sync Browser.prototype, 'call', 'callWithoutBase'
//
// # Helper for declaring synchronous tests.
// global.async = sync.asyncIt
//
// # Prototype.
// proto = require '../proto'
// _(proto).extend
//   environment : 'test'
//   port        : 3001
//   clear       : (args...) -> proto.db.reset args...
//
// # Wait until function called without exception.
// waitTimeout  = 3000
// waitInterval = 5
// wait = (arg) ->
//   if _(arg).isFunction()
//     func = arg
//     startTime = moment().valueOf()
//     while true
//       try
//         return func()
//       catch err
//         currentTime = moment().valueOf()
//         if (currentTime - startTime) < waitTimeout
//           setTimeout sync.defer(), waitInterval
//           sync.await()
//         else throw err
//   else
//     time = arg
//     setTimeout sync.defer(), time
//     sync.await()
//
// # Making wait global.
// global.wait = wait
//
// global.required = _.required
//
// # Initialization helpers.
// before ->
//   # Start prototype if not started.
//   @startProto = (options) ->
//     return proto.clear(options) if proto.started
//     proto.log = null unless options?.silent == false
//     proto.started = true
//     proto.run()
//     @proto = proto
//
//   # Starting browser.
//   @startBrowser = sync (options..., callback) ->
//     Browser.open "http://localhost:#{proto.port}/test", options..., (err, browser) =>
//       return callback err if err
//       @browser = browser
//       callback()