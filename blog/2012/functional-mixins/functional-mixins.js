// # Simple inheritance, defining simple model.
//
// Defining abstract model.
var Model = function(klass){
  var proto = klass.prototype

  // Adding method for setting attributes of model.
  proto.set = function(attributes){
    if(attributes)
      for(var name in attributes) this[name] = attributes[name]
  }

  // Adding another method - `constructor`, allowing model to be
  // initialized with a hash of attributes.
  proto.initialize = function(attributes){this.set(attributes)}
}

// Defining game `Unit`, it's just an empty function.
var Unit = function(){this.initialize.apply(this, arguments)}

// Adding functionality of `Model` to `Unit`.
Model(Unit)

// Now the `Unit` has ability to be initialized from a set of
// attributes inherited from the `Model`.
var zeratul = new Unit({name: 'Zeratul'})
console.log(zeratul)
zeratul.set({life: 100})
console.log(zeratul)

// # Adding new functionality, overriding method and calling super.
//
// Defining game Unit.
var Movable = function(klass){
  var proto = klass.prototype

  // Adding new method.
  proto.move = function(x, y){this.x = x; this.y = y}

  // Adding new static methods.
  klass.spawnLocation = {x: 0, y: 0}
  klass.setSpawnLocation = function(x, y){
    this.spawnLocation.x = x
    this.spawnLocation.y = y
  }

  // Overriding constructor to add properties specific to game unit.
  proto.initializeWithoutUnit = proto.initialize
  proto.initialize = function(attributes){
    // Setting default spawn location, can be overriden with
    // attributes.
    this.move(klass.spawnLocation.x, klass.spawnLocation.y)

    // Calling previous constructor (in other languages it also
    // called the `superclass method`).
    this.initializeWithoutUnit(attributes)
  }
}

// Making unit movable.
Movable(Unit)

// Changing spawn location.
Unit.setSpawnLocation(10, 10)

// Spawning unit.
var zeratul = new Unit({name: 'Zeratul'})
console.log(zeratul)

// Overriding spawn location from constructor.
var zeratul = new Unit({name: 'Zeratul', x: 20, y: 20})
console.log(zeratul)

// # Mixing functionalities.
//
// Defining Protoss race.
var Protoss = function(klass){
  Model(klass)
  Movable(klass)
  klass.prototype.say = function(){return "My life for Aiur!"}
}

Protoss(Unit)

Unit.setSpawnLocation(10, 10)
var zeratul = new Unit({name: 'Zeratul'})
console.log(zeratul)
console.log(zeratul.say())