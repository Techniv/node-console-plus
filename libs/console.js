
var consolePlus, backup, stdin, stdout, stderr, tty, keypress, EventEmitter, events;

	tty 			= require('tty');
	keypress 		= require('keypress');
	EventEmitter	= require('events').EventEmitter;
	events			= new EventEmitter;
	stdin 			= process.stdin;
	stdout 			= process.stdout;
	stderr			= process.stderr;

	backup = {
		console: global.console
	};

function ConsolePlus(stdin, stdout, stderr){

}

