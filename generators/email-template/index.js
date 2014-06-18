'use strict';

var RhythmEmailTemplateGenerator,
	util = require('util'),
	path = require('path'),
	yeoman = require('yeoman-generator'),
	utils = require('../../lib/utils');

/**
 * Generator for creating an Email Template project.
 *
 * @param args The command line arguments passed to the generator.
 * @param options The options passed to the generator.
 * @constructor
 */
RhythmEmailTemplateGenerator = function (args, options) {
	yeoman.generators.Base.apply(this, arguments);

	this.options = options;

	this.workingDirectory = path.join(process.cwd(), this.options.projectDomain, 'trunk', this.options.projectName + '.EmailTemplate');

	this.on('npmInstall:end', function () {
		this.emit('complete');
	});
};

util.inherits(RhythmEmailTemplateGenerator, yeoman.generators.Base);

RhythmEmailTemplateGenerator.prototype.promptUser = function () {
	var self = this,
		done = this.async(),
		prompts = [
			{
				'type': 'input',
				'name': 'awsAccessKeyId',
				'message': 'Enter your Amazon SES IAM user Access Key ID:',
				'when': function (response) {
					var awsAccessKeyId = self.config.get('awsAccessKeyId');

					return !awsAccessKeyId;
				}
			},
			{
				'type': 'input',
				'name': 'awsSecretKey',
				'message': 'Enter your Amazon SES IAM user Secret Key:',
				'when': function (response) {
					var awsSecretKey = self.config.get('awsSecretKey');

					return !awsSecretKey;
				}
			}
		];

	this.prompt(prompts, (function (props) {
		self.options.awsAccessKeyId = props.awsAccessKeyId || self.config.get('awsAccessKeyId');
		self.options.awsSecretKey = props.awsSecretKey || self.config.get('awsSecretKey');

		self.config.set('awsAccessKeyId', self.options.awsAccessKeyId);
		self.config.set('awsSecretKey', self.options.awsSecretKey);

		done();
	}).bind(this));
};

RhythmEmailTemplateGenerator.prototype.install = function () {
	this.log('Processing email template directory...');

	this._processDirectory('email-template', this.workingDirectory);
};

RhythmEmailTemplateGenerator.prototype.installDeps = function () {
	this.on('end', function () {
		this.log('Installing email template dependencies...');
		process.chdir(this.workingDirectory);
		this.installDependencies();
	});
};

RhythmEmailTemplateGenerator.prototype._processDirectory = utils.processDirectory;
RhythmEmailTemplateGenerator.prototype._logError = utils.logError;

module.exports = RhythmEmailTemplateGenerator;