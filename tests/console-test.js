/*
 * This file is part of "console-plus" application.
 * Author: Vincent Peybernes
 * Creation date: 23/09/13
 */

var consolePlus = require(__dirname+'/../libs/console.js');

module.exports = {
	test: function(test){
		console.log(console);
		test.done();
	}
};