'use strict';

var util = require('util'),
	path = require('path'),
	yeoman = require('yeoman-generator'),

	RhythmKeystoneGenerator = function (args, options) {
		yeoman.generators.Base.apply(this, arguments);

		this.options = options;
	};

util.inherits(RhythmKeystoneGenerator, yeoman.generators.Base);

RhythmKeystoneGenerator.prototype.install = function () {
	this.dest.mkdir(path.join(this.options.projectDomain, 'trunk', this.options.projectName + '.Keystone'));
};

RhythmKeystoneGenerator.prototype.installDependencies = function () {
	this.on('end', function () {
		this.installDependencies();
	});
};

module.exports = RhythmKeystoneGenerator;