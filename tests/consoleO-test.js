/**
 * This file is part of "console-plus" application.
 * Author: Vincent Peybernes
 * Creation date: 18/09/13
 */

var consoleO = require(__dirname+'/../libs/consoleO.js');

var format = function(){
	var r = 'Format: ';
	for(var i in arguments){
		r += i==0 ? arguments[i] : ', '+arguments[i];
	}
	return r;
}

module.exports = {
	actionExecution: function(test){
		test.expect(2);

		var arg = 2;
		var method = consoleO('method', function(){
			test.ok(true);
			return arguments[0];
		});

		test.strictEqual(method(arg), arg);
		test.done();
	}

	, format: function(test){

		var expected = '';
		var method = consoleO('method', function(){
			test.equal(arguments.length, 1);
			test.equal(arguments[0], expected);
		});
		method.format = format;

		expected = format(1,2,3,'test');
		method(1,2,3,'test');

		test.done();
	}

	, listenersExecution: function(test){
		var listener1 = function listener1(){
			test.ok(true);
		};
		var listener2 = function listener2(){
			test.ok(true);
		};

		var method = consoleO('method', function(){
			test.ok(true);
		});


		test.expect(2);

		method.addListener(listener1);
		method.addListener(listener2);
		method.removeListener(listener2);

		method();

		test.done();
	}

	, listnersArgs: function(test){
		var expected;
		var listner = function(args){
			test.equal(args.length, expected.length);
			test.equal(args[0], expected[0]);
			test.equal(args[args.length], expected[expected.length]);
		};

		var method = consoleO('method', function(){
			expected = arguments;
		});
		method.addListener(listner);

		method(1,2,3,'test');

		method.format = format;
		method(1,2,3,'test');

		test.done();
	}

	, filters: function(test){
		var expectedArgs = [1,2,3,'toto'];
		var filter = function(args){
			test.ok(Array.isArray(args));
			for( var i in args ){
				test.equal(args[i], expectedArgs[i]);
			}
		}

		var method = consoleO('name', function(){});

		test.expect(expectedArgs.length+1);

		method.addFilter(filter);
		method.addFilter(filter);
		method.removeFilter(filter);
		method.apply(this,expectedArgs);

		test.done();
	}

	, filterArgOperation: function(test){
		var args = [1,2,3,'toto'];
		var expectedArgs = [2,4,6,'toto'];
		var filter = function(args){
			for( var i in args ){
				args[i] = Number.isFinite(args[i]) ? args[i]*2 : args[i];
			}
		}

		var method = consoleO('method', function(){
			for( var i in arguments ){
				test.equal(arguments[i], expectedArgs[i]);
			}
		});

		test.expect(expectedArgs.length);

		method.addFilter(filter);
		method.apply(this, args);

		test.done();
	}

	, filterInteruption: function(test){
		var filter = function(){
			test.ok(true);
			return false;
		}
		var method = consoleO('method', function(){
			test.ok(true);
		});

		test.expect(1);

		method.addFilter(filter);
		method.addFilter(filter);
		method.addListener(filter);

		method();
		test.done();
	}
};
