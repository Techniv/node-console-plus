/*
 * This file is part of "console-plus" application.
 * Author: Vincent Peybernes
 * Creation date: 17/09/13
 */

/*
 * This module is an AOP implementation for console output.
 */

var EventEmitter = require('events').EventEmitter;
var console = global.console;


module.exports = function consoleO(name, action, emitter){
	var format = undefined;
	var filters = [];
	emitter = (emitter instanceof EventEmitter) ? emitter : new EventEmitter;

	var method = function(){
		var returnValue, args, filterSuccess;

		// Prepare arguments
		args = convertArguments(arguments);
		if(typeof format == 'function') args = format.apply(method, args);
		if( typeof args.callee == 'undefined' && ! Array.isArray(args)) args = (typeof args == 'undefined') ? [] : [args];

		// Execute filter.
		for( var i in filters ){
			filterSuccess = false;
			try{
				filterSuccess = filters[i](args);
				if( typeof filterSuccess == 'undefined') filterSuccess = true;
			} catch (e){
				console.error(e);
				filterSuccess = false;
			}

			if(filterSuccess == false) return false;
		}

		// Execute action
		returnValue = action.apply(this, args);

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
		, addFilter: {
			configurable: false,
			enumerable: false,
			writable: false,
			value: function(filter){
				if(typeof filter == 'function') filters.push(filter);
			}
		}
		, removeFilter: {
			configurable: false,
			enumerable: false,
			writable: false,
			value: function(filter){
				var filterIndex = filters.indexOf(filter);
				if(filterIndex > -1) filters.splice(filterIndex, 1);
			}
		}
	});

	return method;
};


function convertArguments(args){
	var returnArgs = [];
	for(var i in args){
		returnArgs.push(args[i]);
	}

	Object.defineProperty(returnArgs, 'callee', {
		configurable: false,
		writable: false,
		enumerable: false,
		value: args.callee
	});

	return returnArgs;
}
