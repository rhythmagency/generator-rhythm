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

	this.on('npmInstall:end', function () {
		this.emit('complete');
	}.bind(this));
};

util.inherits(RhythmKeystoneGenerator, yeoman.generators.Base);

RhythmKeystoneGenerator.prototype.install = function () {
	this.log('Processing keystone directory...');

	this._processDirectory('keystone', this.workingDirectory);
};

RhythmKeystoneGenerator.prototype.installDeps = function () {
	this.on('end', function () {
		this.log('Installing keystone dependencies...');

		process.chdir(this.workingDirectory);
		this.installDependencies({'bower': false, 'npm': true});
	});
};

RhythmKeystoneGenerator.prototype._processDirectory = utils.processDirectory;
RhythmKeystoneGenerator.prototype._logError = utils.logError;

module.exports = RhythmKeystoneGenerator;