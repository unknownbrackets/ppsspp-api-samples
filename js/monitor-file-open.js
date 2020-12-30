// PPSSPP API sample - monitor file open
//
// This is a slightly more complicated sample, where we log every sceIoOpen call.
// To do this, we:
//  - Grab a list of known functions detected in the game code by PPSSPP.
//  - Search this list for the zz_sceIoOpen stub that games use to open files.
//  - Set a breakpoint at the zz_sceIoOpen stub (which we also remove on quit.)
//  - Wait for any breakpoint hits and check if they match our stub.
//  - Read the filename using the a0 register (first argument to sceIoOpen.)
//  - Resume emulation after the breakpoint so we don't stall the game.
//
// This shows how you can wait for events, read memory in loops, etc.
//
// See the PPSSPP source code, under Debugger/WebSocket, for details on API parameters.
const PPSSPP = require('./sdk');
const ppsspp = new PPSSPP();

// We'll keep track of the address we get from hle.func.list here.
let sceIoOpenAddr = null;

// The autoConnect() function tries to find a nearby PPSSPP instance.
// If you have multiple, it may be the wrong one.
ppsspp.autoConnect().then(() => {
	// Always introduce ourselves to PPSSPP first.
	return ppsspp.send({ event: 'version', name: 'ppsspp-api-samples', version: '1.0.0' });
}).then((result) => {
	console.log('Connected to', result.name, 'version', result.version);
	// Now, ask for a list of detected functions (the stubs will be in this list.)
	return ppsspp.send({ event: 'hle.func.list' });
}).then((result) => {
	if (!result.functions || !result.functions.length) {
		throw 'No functions, not playing any game?';
	}

	// Okay let's find our favored function.
	const func = result.functions.find(f => f.name === 'zz_sceIoOpen');
	if (!func) {
		throw 'Func stub for sceIoOpen not found... game never calls it?';
	}

	const prettyAddress = '0x' + ('00000000' + func.address.toString(16)).substr(-8);
	console.log('Found func stub for sceIoOpen at', prettyAddress);
	sceIoOpenAddr = func.address;
	// Now we set a breakpoint there.
	return ppsspp.send({ event: 'cpu.breakpoint.add', address: sceIoOpenAddr });
}).then((result) => {
	// Breakpoint set, it's time for a stakeout.
	// Whenever any breakpoint is hit, PPSSPP will broadcast 'cpu.stepping'.
	ppsspp.listen('cpu.stepping', (info) => {
		// The PC register tells us where the breakpoint was, and is sent automatically.
		// Just ignore if it's not ours.
		if (info.pc !== sceIoOpenAddr) {
			return;
		}

		// Okay, now grab a0.
		// Note that we keep the CPU paused while reading, so the path isn't corrupted in RAM.
		ppsspp.send({ event: 'cpu.getReg', name: 'a0' }).then((result) => {
			// Read the string value from RAM.
			return readStringAt(result.uintValue);
		}).then(str => {
			console.log('Opening', str + '...');
			// Don't forget to unbreak the CPU, we're done reading now.
			return ppsspp.send({ event: 'cpu.resume' });
		}).catch(err => {
			console.error('Failed to log open?', err);
		});
	});

	console.log('Waiting for sceIoOpen to be called, press Ctrl-C to stop...');
	// Note: since we still have the WebSocket open, the process will stay running.
}).catch((err) => {
	console.error('Something went wrong:', err);
});

// This is run when they press Ctrl-C.  Mainly we remove the breakpoint we added.
process.on('SIGINT', () => {
	console.log('Cleaning up...');

	// Use a resolved promise just to avoid duplicating code...
	let next = Promise.resolve(null);
	if (sceIoOpenAddr !== null) {
		// This means we added a breakpoint, so remove it.
		next = next.then(() => {
			return ppsspp.send({ event: 'cpu.breakpoint.remove', address: sceIoOpenAddr });
		});
	}

	// Once that's done (success or not), disconnect.  This'll end the process.
	next.finally(() => {
		ppsspp.disconnect();
	});
});

// This reads a string, assumed to be utf-8, from PSP memory.
function readStringAt(addr) {
	// Read the byte at that address...
	return ppsspp.send({ event: 'memory.readString', address: addr }).then(result => {
		return result.value;
	});
}
