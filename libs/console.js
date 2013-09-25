
var util, consoleO, backup, stdin, stdout, stderr, tty, keypress, EventEmitter, events;

	tty 			= require('tty');
	util			= require('util');
	keypress 		= require('keypress');
	consoleO		= require(__dirname+'/consoleO.js');
	EventEmitter	= require('events').EventEmitter;
	events			= new EventEmitter;
	stdin 			= process.stdin;
	stdout 			= process.stdout;
	stderr			= process.stderr;

	backup = {
		console: global.console
	};

function ConsolePlus(stdin, stdout, stderr){

	if(!stdin) stdin	= process.stdin;
	if(!stdout) stdout	= process.stdout;
	if(!stderr) stderr	= stdout;

	Object.defineProperties(this, {
		_stdin:{
			configurable: true,
			enumerable: false,
			writable: true,
			value: stdin
		}
		, _stdout:{
			configurable: true,
			enumerable: false,
			writable: true,
			value: stdout
		}
		, _stderr:{
			configurable: true,
			enumerable: false,
			writable: true,
			value: stderr
		}
		, _time:{
			configurable: true,
			enumerable: false,
			writable: true,
			value: {}
		}
	});
}

ConsolePlus.prototype = Object.create(backup.console,{
	constructor: {
		configurable: false,
		enumerable: false,
		writable: false,
		value: ConsolePlus
	}

	, log:{
		configurable: false,
		enumerable: true,
		writable: false,
		value: consoleO('log', function(){
			this._stdout.write(util.format.apply(this, arguments) + '\n');
		})
	}

	, info:{
		configurable: false,
		enumerable: true,
		writable: false,
		value: consoleO('info', function(){
			this._stdout.write(util.format.apply(this, arguments) + '\n');
		})
	}

	, warn:{
		configurable: false,
		enumerable: true,
		writable: false,
		value: consoleO('warn', function(){
			this._stderr.write(util.format.apply(this, arguments) + '\n');
		})
	}

	, error:{
		configurable: false,
		enumerable: true,
		writable: false,
		value: consoleO('error', function(){
			this._stderr.write(util.format.apply(this, arguments) + '\n');
		})
	}

	, time:{
		configurable: false,
		enumerable: true,
		writable: false,
		value: consoleO('time', function(label){
			this._time[label] = Date.now();
		})
	}

	, timeEnd:{
		configurable: false,
		enumerable: true,
		writable: false,
		value: consoleO('timeEnd', function(label){
			var time = Date.now();
			var oldTime = this._time[label];
			if(!oldTime){
				throw new Error('No such label: '+label);
			}

			var duration = time - oldTime;
			this.log('%s: %dms', label, duration);
		})
	}

	, trace:{
		configurable: false,
		enumerable: true,
		writable: false,
		value: consoleO('trace', function(){
			var err = new Error;
			err.name = 'Trace';
			err.message = util.format.apply(this, arguments);
			Error.captureStackTrace(err, arguments.callee);
			this.error(err.stack);
		})
	}

	, assert:{
		configurable: false,
		enumerable: true,
		writable: false,
		value: consoleO('timeEnd', function(expression){
			if(!expression){
				var arr = Array.prototype.slice.call(arguments, 1);
				require('assert').ok(false, util.format.apply(this, arr));
			}
		})
	}
});

module.exports = new ConsolePlus(stdin, stdout, stderr);
