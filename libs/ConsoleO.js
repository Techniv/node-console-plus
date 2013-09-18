/*
 * This file is part of "console-plus" application.
 * Author: Vincent Peybernes
 * Creation date: 17/09/13
 */

/*
 * This module is an AOP implementation for console output.
 */

var EventEmitter = require('events').EventEmitter;


module.exports = function consoleO(name, action, emitter){
	var format = undefined;
	emitter = (emitter instanceof EventEmitter) ? emitter : new EventEmitter;

	var method = function(){
		var args = arguments;
		if(typeof format == 'function') args = format.apply(method, args);
		if( typeof args.callee == 'undefined' && ! Array.isArray(args)) args = (typeof args == 'undefined') ? [] : [args];
		var returnValue = action.apply(this, args);

		emitter.emit.apply(emitter, [name, args]);
		return returnValue;
	};
	Object.defineProperties(method, {
		format: {
			configurable: false,
			enumerable: true,
			set: function(value){ if(typeof value == 'function') format = value; },
			get: function(){ return format; }
		}
		, actionName: {
			configurable: false,
			enumerable: true,
			writable: false,
			value: name
		}
		, addListener: {
			configurable: false,
			enumerable: false,
			writable: false,
			value: function(listener){
				emitter.on(name, listener);
			}
		}
		, removeListener: {
			configurable: false,
			enumerable: false,
			writable: false,
			value: function(listener){
				emitter.removeListener(name, listener);
			}
		}
	});

	return method;
}
