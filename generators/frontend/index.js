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
};

util.inherits(RhythmFrontendGenerator, yeoman.generators.Base);

RhythmFrontendGenerator.prototype.promptUser = function () {
	var done = this.async(),
		prompts = [
			{
				'type': 'confirm',
				'name': 'createPrototype',
				'message': 'Create a frontend prototype?',
				'default': false
			}
		];

	this.prompt(prompts, (function (props) {
		this.options.createPrototype = props.createPrototype;

		done();
	}).bind(this));
};

RhythmFrontendGenerator.prototype.install = function () {
	this._processDirectory('frontend', this.workingDirectory);

	if (this.options.createPrototype) {
		this._processDirectory('frontend', this.prototypeWorkingDirectory);
	}
};

RhythmFrontendGenerator.prototype.installDeps = function () {
	this.on('end', function () {
		process.chdir(this.workingDirectory);
		this.installDependencies();

		if (this.options.createPrototype) {
			process.chdir(this.prototypeWorkingDirectory);
			this.installDependencies();
		}
	});
};

RhythmFrontendGenerator.prototype._processDirectory = utils.processDirectory;

module.exports = RhythmFrontendGenerator;