'use strict';

var RhythmKeystoneGenerator,
	util = require('util'),
	path = require('path'),
	yeoman = require('yeoman-generator'),
	utils = require('../../lib/utils');

/**
 * Generator for creating an Keystone.js project.
 *
 * @param args The command line arguments passed to the generator.
 * @param options The options passed to the generator.
 * @constructor
 */
RhythmKeystoneGenerator = function (args, options) {
	yeoman.generators.Base.apply(this, arguments);

	this.options = options;

	this.workingDirectory = path.join(process.cwd(), this.options.projectDomain, 'trunk', this.options.projectName + '.Keystone');
};

util.inherits(RhythmKeystoneGenerator, yeoman.generators.Base);

RhythmKeystoneGenerator.prototype.install = function () {
	this._processDirectory('keystone', this.workingDirectory);
};

RhythmKeystoneGenerator.prototype.installDeps = function () {
	this.on('end', function () {
		process.chdir(this.workingDirectory);
		this.installDependencies();
	});
};

RhythmKeystoneGenerator.prototype._processDirectory = utils.processDirectory;

module.exports = RhythmKeystoneGenerator;