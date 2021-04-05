// PPSSPP API sample - simple hello
//
// In this sample, we simply connect to the API and check what game is running.
// This shows a simple use case for the API.
//
// See the PPSSPP source code, under Debugger/WebSocket, for details on API parameters.
const PPSSPP = require('./sdk');
const ppsspp = new PPSSPP();

// The autoConnect() function tries to find a nearby PPSSPP instance.
// If you have multiple, it may be the wrong one.
// You can also use: ppsspp.connect('ws://127.0.0.1:12345/debugger').then(() => {
ppsspp.autoConnect().then(() => {
	// Introduce ourselves to PPSSPP.  Here, '1.0.0' should be the version of your script.
	return ppsspp.send({ event: 'version', name: 'ppsspp-api-samples', version: '1.0.0' });
}).then((result) => {
	// In response, PPSSPP tells us its version too.  Well met.
	console.log('Connected to', result.name, 'version', result.version);

	// So - what game's running?
	return ppsspp.send({ event: 'game.status' });
}).then((result) => {
	if (result.game === null) {
		console.log('You aren\'t playing any game yet?  Boring.');
		return;
	}

	console.log('Playing', result.game.title, '(' + result.game.id, 'version', result.game.version + ')');
}).catch((err) => {
	console.error('Something went wrong:', err);
}).finally(() => {
	ppsspp.disconnect();
});
