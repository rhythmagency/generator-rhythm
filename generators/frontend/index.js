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
	this.log('Processing frontend directory...');
	this._processDirectory('frontend', this.workingDirectory);

	if (this.options.createPrototype) {
		this.log('Processing frontend prototype directory...');

		this._processDirectory('frontend', this.prototypeWorkingDirectory);
	}
};

RhythmFrontendGenerator.prototype.installFrontendDeps = function () {
	this.log('Installing frontend dependencies...');

	process.chdir(this.workingDirectory);
	this.installDependencies({'bower': false, 'npm': true, 'skipInstall': !this.options.installDependencies});
};

RhythmFrontendGenerator.prototype.installFrontendPrototypeDeps = function () {
	if (this.options.createPrototype) {
		this.log('Installing frontend prototype dependencies...');

		process.chdir(this.prototypeWorkingDirectory);
		this.installDependencies({'bower': false, 'npm': true, 'skipInstall': !this.options.installDependencies});
	}
};

RhythmFrontendGenerator.prototype.emitComplete = function () {
	if (!this.options.installDependencies) {
		this.emit('complete');
	}
};

RhythmFrontendGenerator.prototype._processDirectory = utils.processDirectory;
RhythmFrontendGenerator.prototype._logError = utils.logError;

module.exports = RhythmFrontendGenerator;