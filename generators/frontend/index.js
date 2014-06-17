'use strict';

var RhythmFrontendGenerator,
	util = require('util'),
	path = require('path'),
	yeoman = require('yeoman-generator'),
	utils = require('../../lib/utils');

/**
 * Generator for creating an Frontend project.
 *
 * @param args The command line arguments passed to the generator.
 * @param options The options passed to the generator.
 * @constructor
 */
RhythmFrontendGenerator = function (args, options) {
	yeoman.generators.Base.apply(this, arguments);

	this.options = options;

	this.workingDirectory = path.join(process.cwd(), this.options.projectDomain, 'trunk', this.options.projectName + '.Frontend');
	this.prototypeWorkingDirectory = path.join(process.cwd(), this.options.projectDomain, 'trunk', this.options.projectName + '.FrontendPrototype');

	this.on('npmInstall:end', function () {
		this.emit('complete');
	}.bind(this));
};

util.inherits(RhythmFrontendGenerator, yeoman.generators.Base);

RhythmFrontendGenerator.prototype.install = function () {
	this._processDirectory('frontend', this.workingDirectory);

	if (this.options.createPrototype) {
		this._processDirectory('frontend', this.prototypeWorkingDirectory);
	}
};

RhythmFrontendGenerator.prototype.installFrontendDeps = function () {
	process.chdir(this.workingDirectory);
	this.installDependencies({'bower': false, 'npm': true});
};

RhythmFrontendGenerator.prototype.installFrontendPrototypeDeps = function () {
	if (this.options.createPrototype) {
		process.chdir(this.prototypeWorkingDirectory);
		this.installDependencies({'bower': false, 'npm': true});
	}
};

RhythmFrontendGenerator.prototype._processDirectory = utils.processDirectory;
RhythmFrontendGenerator.prototype._logError = utils.logError;

module.exports = RhythmFrontendGenerator;