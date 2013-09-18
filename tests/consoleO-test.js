/**
 * This file is part of "console-plus" application.
 * Author: Vincent Peybernes
 * Creation date: 18/09/13
 */

var consoleO = require(__dirname+'../libs/consoleO.js');

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
			console.log('listner1');
			test.ok(true);
		};
		var listener2 = function listener2(){
			console.log('listner2');
			test.ok(true);
		};

		var method = consoleO('method', function(){
			console.log('method');
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
};
