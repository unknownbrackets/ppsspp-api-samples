// PPSSPP API sample - async hello
//
// In this sample, we simply connect to the API and check what game is running.
// This demonstrates how to use async/await with the library.
//
// See the PPSSPP source code, under Debugger/WebSocket, for details on API parameters.
const PPSSPP = require('./sdk');
const ppsspp = new PPSSPP();

main();

async function main() {
	try {
		// The autoConnect() function tries to find a nearby PPSSPP instance.
		// If you have multiple, it may be the wrong one.
		await ppsspp.autoConnect();

		// Introduce ourselves to PPSSPP.  Here, '1.0.0' should be the version of your script.
		const handshake = await ppsspp.send({ event: 'version', name: 'ppsspp-api-samples', version: '1.0.0' });
		// In response, PPSSPP tells us its version too.  Well met.
		console.log('Connected to', handshake.name, 'version', handshake.version);

		// So - what game's running?
		const gameResult = await ppsspp.send({ event: 'game.status' });
		if (gameResult.game === null) {
			console.log('You aren\'t playing any game yet?  Boring.');
			return;
		}

		console.log('Playing', gameResult.game.title, '(' + gameResult.game.id, 'version', gameResult.game.version + ')');
	} catch (err) {
		console.error('Something went wrong:', err);
	} finally {
		ppsspp.disconnect();
	}
}
