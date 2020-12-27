JavaScript
==========

The samples here are meant to be used with [Node.js]() and utilize Promises, fetch, and other modern JavaScript features.

It's possible to use these within browsers too.  Consider leveraging something like [Babel]() if needed to adjust the JavaScript syntax for more outdated browsers.


Usage
-----

To run these samples, the following steps are required:

 - Make sure "Allow remote debugger" is enabled in PPSSPP, under Settings -> Tools -> Developer tools.
 - Install [Node.js]() (on many platforms, just from the installer on the website.)
 - Clone this repo.
 - Open a terminal and run `npm install` in this folder to install dependencies.
 - Run `node hello.js`


Promises
--------

The PPSSPP API is asynchronous.  You might send a request, like "game.status", and an event like a breakpoint might occur before PPSSPP responds, in theory.

To simplify working with the API, promises are used to turn asynchronous operations into step-by-step ones.

To learn more about promises, see:

[Mozilla Developer Network - Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
[OpenJS - Promises walkthrough](https://nodejs.dev/learn/understanding-javascript-promises)


[Node.js]: https://nodejs.org/
[Babel]: https://babeljs.io/
