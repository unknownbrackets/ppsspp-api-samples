PPSSPP API Samples
==================

In this repository, folders with sample API usage in different languages are available.  Browse
into one for more detail on that implementation.


Usage
-----

To run these samples, you'll always need to enable debugging in PPSSPP:

 - Select Settings from the main screen.
 - Navigate to Tools -> Developer tools.
 - Enable the "Allow remote debugger" setting.

The remote debugger shares a port with the remote disc streaming.  Currently, its port can be
explicitly set there.


Documentation
-------------

The [web debugger]() is implemented in JavaScript too, using React.  Its source code may be helpful
for understanding the API and its usage too.

Actual API parameters and responses are documented in the [PPSSPP source code for the API]().


Contributing
------------

Whether you're interested in contributing better documentation, better samples, or better APIs -
contributions are always welcome.

Feel free to open an issue or pull request in this repo.  You can also visit [our Discord]() in
the #coding_development channel.


[web debugger]: https://github.com/unknownbrackets/ppsspp-debugger
[PPSSPP source code for the API]: https://github.com/hrydgard/ppsspp/tree/master/Core/Debugger/WebSocket
[our Discord]: https://discord.gg/5NJB6dD
