# Misunderstanding of JavaScript

JavaScript has one very unique feature **it's the only language supported by Browsers**. It
means it's the only way to create applications that require zero-install and runs everywhere.

That feature had dramatic impact on the development of the language - it's the source of
its strengths and weaknesses.

## History

JavaScript has been created for couple of days as a quick prototype for Netscape browser, with
design goals "something similar to Java and Visual Basic" (it always makes me smile when someone
start talking about the "philosophy of JavaScript" - very deep philosophy indeed).

So Netscape added JavaScript to its browser and somehow Microsoft did the same (actually it
created its own clone called JScript).

For a couple of years JavaScript lived small unnoticeable life and used mostly for adding
simple visual effects on web pages and nobody really cared much about it.

Until the explosion of web and internet - when huge corporation suddenly realized how
vital and important that part of technology is. And that's when interesting things started to
happen.

At that time JavaScript was pretty weak language - with bugs, design flaws (after all it was just
a prototype), bad performance and development tools. What's worse - it was impossible to really
change it, even to fix bugs - because such fixes will break millions of already existing sites.

So, there was very interesting situation - JavaScript became the key technology, but still no
one can really change it, even to improve or fix bugs. All changes should be backward compatible.

But, money can make dreams real, especially if it's really big money. Huge companies invested tons
of time, research and development into Browsers - and miracle happen. Flawed and buggy prototype
became **one the best dynamic language** available.

## Strengths

Thankfully creator of JavaScript is a smart guy, and even with the given constraints "make it look
like Java and Visual Basic" he still managed to keep the core of the language clean and powerful.
The core of JavaScript looks more like a Lisp than Java or Basic.

So, JavaScript is a dynamic and functional language with closures and prototypes.

It's also
[the fastest interpreted language](http://benchmarksgame.alioth.debian.org/u32/which-programs-are-fastest.php) -
only two times slower than compiled Java, ten times faster than Ruby and fifteen times faster than Python.

## Flaws

Biggest flaw is that once some feature or bug is delivered, it's impossible to fix or alter it
if it's break backward compatibility.

It's still a prototype that never had a chance to fix bugs and early design mistakes. All those bugs
are still there, only now they called "features" (some developers even seriously believe
those unfixed bugs are "the JavaScript way").

## Summary

JavaScript is powerful language, and when used correctly can be as productive as Ruby or Python.
It also has very good and fast implementations, much faster than other interpreted languages.

Still, unlike other languages JavaScript doesn't have philosophy or design specification - it's a
set of evolved practices, tricks and hacks to make it work. It also makes it hard to learn - because
big part of its specification - is descriptions of bugs and flaws that cannot be fixed and shouldn't
be used.

By [Alex Craft](http://alex-craft.com)

- Date : 2012/10/1