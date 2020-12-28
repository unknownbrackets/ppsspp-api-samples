// PPSSPP API sample - simple hello
//
// In this sample, we read a chunk of memory from the running game.
//
// See the PPSSPP source code, under Debugger/WebSocket, for details on API parameters.
const PPSSPP = require('./sdk');
const ppsspp = new PPSSPP();

// The autoConnect() function tries to find a nearby PPSSPP instance.
// If you have multiple, it may be the wrong one.
ppsspp.autoConnect().then(() => {
	// Introduce ourselves to PPSSPP.  Here, '1.0.0' should be the version of your script.
	return ppsspp.send({ event: 'version', name: 'ppsspp-api-samples', version: '1.0.0' });
}).then((result) => {
	// In response, PPSSPP tells us its version too.  Well met.
	console.log('Connected to', result.name, 'version', result.version);

	// Grab some memory.
	return ppsspp.send({ event: 'memory.read', address: 0x08000000, size: 1024 });
}).then((result) => {
	console.log(Buffer.from(result.base64, 'base64').length);
}).catch((err) => {
	console.error('Something went wrong:', err);
}).finally(() => {
	ppsspp.disconnect();
});
