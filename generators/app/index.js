'use strict';

var util = require('util'),
	path = require('path'),
	yeoman = require('yeoman-generator'),
	yosay = require('yosay'),
	_ = require('lodash'),

	RhythmGenerator = function (args, options) {
		yeoman.generators.Base.apply(this, arguments);

		this.options = options;
	};

util.inherits(RhythmGenerator, yeoman.generators.Base);

RhythmGenerator.prototype.promptUser = function () {
	var done = this.async(),
		self = this;

	this.log(yosay('Welcome to the marvelous Rhythm generator!'));

	var prompts = [
		{
			'type': 'input',
			'name': 'fullName',
			'message': 'Enter your full name:',
			'when': function () {
				var name = self.config.get('fullName');
				return !name;
			}
		},
		{
			'type': 'input',
			'name': 'email',
			'message': 'Enter your email address:',
			'when': function () {
				var email = self.config.get('email');
				return !email;
			}
		},
		{
			'type': 'input',
			'name': 'projectName',
			'message': 'Enter the name of the project:'
		},
		{
			'type': 'input',
			'name': 'projectDomain',
			'message': 'Enter the website\'s domain:'
		},
		{
			'type': 'checkbox',
			'name': 'projectTypes',
			'message': 'Select the project types you want to create:',
			'choices': [
				{
					'name': 'Frontend',
					'value': 'frontend',
					'checked': true
				},
				{
					'name': 'Email Template',
					'value': 'email-template',
					'disabled': true
				},
				{
					'name': 'Umbraco',
					'value': 'umbraco'
				},
				{
					'name': 'Keystone.js',
					'value': 'keystone',
					'disabled': true
				}
			]
		},
		{
			'type': 'confirm',
			'name': 'useGit',
			'message': 'Create a Git repository?',
			'default': true
		},
		{
			'type': 'confirm',
			'name': 'useBitbucket',
			'message': 'Push to BitBucket?',
			'default': true,
			'when': function (response) {
				return response.useGit;
			}
		},
		{
			'type': 'input',
			'name': 'bitbucketUser',
			'message': 'Enter your BitBucket user name:',
			'when': function (response) {
				var bitbucketUser = self.config.get('bitbucketUser');

				return response.useBitbucket && !bitbucketUser;
			}
		},
		{
			'type': 'password',
			'name': 'bitbucketPass',
			'message': 'Enter your BitBucket password:',
			'when': function (response) {
				var bitbucketPass = self.config.get('bitbucketPass');

				return response.useBitbucket && !bitbucketPass;
			}
		}
	];

	this.prompt(prompts, function (props) {
		this.props = props;
		this.fullName = props.fullName || self.config.get('fullName');
		this.email = props.email || self.config.get('email');
		this.projectName = props.projectName;
		this.projectDomain = props.projectDomain;
		this.projectTypes = props.projectTypes;
		this.useGit = props.useGit;
		this.useBitbucket = props.useBitbucket;
		this.bitbucketUser = props.bitbucketUser || self.config.get('bitbucketUser');
		this.bitbucketPass = props.bitbucketPass || self.config.get('bitbucketPass');

		self.config.set('fullName', this.fullName);
		self.config.set('email', this.email);
		self.config.set('bitbucketUser', this.bitbucketUser);
		self.config.set('bitbucketPass', this.bitbucketPass);

		done();
	}.bind(this));
};

RhythmGenerator.prototype.setupProjectStructure = function () {
	this.dest.mkdir(this.projectDomain);
	this.directory('docs', path.join(this.projectDomain, 'docs'));
	this.dest.mkdir(path.join(this.projectDomain, 'trunk'));
};

RhythmGenerator.prototype.invokeGenerators = function () {
	_.each(this.projectTypes, _.bind(function (projectType) {
		this.invoke('rhythm:' + projectType, {'options': this.props});
	}, this));
};

RhythmGenerator.prototype.installDependencies = function () {
	this.on('end', function () {
		if (!this.options['skip-install']) {
			this.installDependencies();
		}
	});
};

module.exports = RhythmGenerator;
