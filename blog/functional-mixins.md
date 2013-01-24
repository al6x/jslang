# Functional Mixins in JavaScript

Functional Mixins is a **flexible way to share functionality between objects**.

From my experience it's more powerful than Class or Prototype based Inheritance, Mixins and
even complex machinery like Ruby Object Model. But I believe the biggest advantage of it
isn't the power but the **simplicity**, it's so simple that I wonder why it's so rarely used.

In this example we create Game Unit and add some basic functionality to it
([source](functional-mixins/functional-mixins.js)).

## Creating simple Model

Defining Model that have only two methods - `set` to set attributes, and `initialize` - a
constructor supporting setting attributes.

``` JavaScript
var Model = function(klass){
  var proto = klass.prototype

  proto.initialize = function(attributes){this.set(attributes)}

  proto.set = function(attributes){
    if(attributes)
      for(var name in attributes) this[name] = attributes[name]
  }
}
```

Now we can create Unit and add the Model functionality to it.

The only difference of the Unit from the empty function is a call to constructor. It isn't
really necessary, an empty function also can be used, but I frequently use it and believe
constructor showcase would be a good example.

``` JavaScript
var Unit = function(){this.initialize.apply(this, arguments)}
Model(Unit)

var zeratul = new Unit({name: 'Zeratul'})
// => {name: 'Zeratul'}
zeratul.set({life: 100})
// => {name: 'Zeratul', life: 100}
```

## Making Unit movable

So far Unit only has functionality for setting attributes, let's making it move. To do so we need
to add `move` method and set a spawn location.

The `move` method set `x` and `y` attributes of the Unit, spawn location should be the same for
all Units, so we implement it as a class method.

We also need to set default values for `x` and `y` so, we override and extend constructor so it
will set coordinates according to spawn location.

``` JavaScript
var Movable = function(klass){
  var proto = klass.prototype

  proto.move = function(x, y){this.x = x; this.y = y}

  klass.spawnLocation = {x: 0, y: 0}
  klass.setSpawnLocation = function(x, y){
    this.spawnLocation.x = x
    this.spawnLocation.y = y
  }

  proto.initializeWithoutUnit = proto.initialize
  proto.initialize = function(attributes){
    this.move(klass.spawnLocation.x, klass.spawnLocation.y)
    this.initializeWithoutUnit(attributes)
  }
}
```

Now we can make our Unit movable, set spawn location as `x: 10, y: 10` and spawn it.
We can also provide spawn location it explicitly.

``` JavaScript
Movable(Unit)

Unit.setSpawnLocation(10, 10)
var zeratul = new Unit({name: 'Zeratul'})
// => {x: 10, y: 10, name: 'Zeratul'}

var zeratul = new Unit({name: 'Zeratul', x: 20, y: 20})
// => {x: 20, y: 20, name: 'Zeratul'}
```

## Mixing functionalities

As I told before Functional Mixins is very simple, we already covered almost all use cases,
and the best part of it - simplicity and flexibility.

You can compose and mix simple things to provide more complicated functionality, let's
create model of Protoss that has functionality of both Model and Movable and also adds
its own method.

``` JavaScript
var Protoss = function(klass){
  Model(klass)
  Movable(klass)
  klass.prototype.say = function(){return "My life for Aiur!"}
}
```

Now the Protoss hides (encapsulates) details of implementation, we don't need to know about Model
and Movable to be able to use it.

``` JavaScript
Protoss(Unit)

Unit.setSpawnLocation(10, 10)
var zeratul = new Unit({name: 'Zeratul'})
// => {x: 10, y: 10, name: 'Zeratul'}

zeratul.say()
// => My life for Aiur!
```

## Conclusion

- Simplicity
- Flexibility
- Performance (no prototype chain)

Supports all well known things such as: Object Oriented Programming, Encapsulation, Polymorphism,
Inheritance, Calling Super, Instance Method Inheritance, Class Method Inheritance,
Method Overloading.

By [Alexey Petrushin](http://petrush.in)

Tags: OOP, Inheritance, Learning
Date: 2012/12/10