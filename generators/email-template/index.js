'use strict';

var util = require('util'),
	path = require('path'),
	yeoman = require('yeoman-generator'),

	RhythmEmailTemplateGenerator = function (args, options) {
		yeoman.generators.Base.apply(this, arguments);

		this.options = options;
	};

util.inherits(RhythmEmailTemplateGenerator, yeoman.generators.Base);

RhythmEmailTemplateGenerator.prototype.install = function () {
	this.dest.mkdir(path.join(this.options.projectDomain, 'trunk', this.options.projectName + '.EmailTemplate'));
};

RhythmEmailTemplateGenerator.prototype.installDependencies = function () {
	this.on('end', function () {
		this.installDependencies();
	});
};

module.exports = RhythmEmailTemplateGenerator;