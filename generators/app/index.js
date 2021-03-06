'use strict';

var util = require('util'),
	path = require('path'),
	yeoman = require('yeoman-generator'),
	yosay = require('yosay'),
	_ = require('lodash'),
	Q = require('q'),
	utils = require('../../lib/utils'),

	RhythmGenerator = function (args, options) {
		yeoman.generators.Base.apply(this, arguments);

		this.options = options;
	};

util.inherits(RhythmGenerator, yeoman.generators.Base);

RhythmGenerator.prototype.promptUser = function () {
	var done = this.async(),
		self = this;

	var prompts = [
		{
			'type': 'input',
			'name': 'firstName',
			'message': 'Enter your first name:',
			'when': function () {
				var name = self.config.get('firstName');
				return !name;
			}
		},
		{
			'type': 'input',
			'name': 'lastName',
			'message': 'Enter your last name:',
			'when': function () {
				var name = self.config.get('lastName');
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
					'value': 'email-template'
				},
				{
					'name': 'Umbraco',
					'value': 'umbraco'
				},
				{
					'name': 'Keystone.js',
					'value': 'keystone'
				}
			]
		},
		{
			'type': 'confirm',
			'name': 'createPrototype',
			'message': 'Create a frontend prototype?',
			'default': false,
			'when': function (response) {
				return _.contains(response.projectTypes, 'frontend');
			}
		},
		{
			'type': 'confirm',
			'name': 'installDependencies',
			'message': 'Would you like to install the node dependencies?',
			'default': true
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
			'name': 'bitbucketAccount',
			'message': 'Enter your BitBucket account name (ie. rhythminteractive):',
			'default': 'rhythminteractive',
			'when': function (response) {
				var bitbucketAccount = self.config.get('bitbucketAccount');

				return response.useBitbucket && !bitbucketAccount;
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
		self.options = _.merge(self.options || {}, props, true);
		self.options.firstName = self.options.firstName || self.config.get('firstName');
		self.options.lastName = self.options.lastName || self.config.get('lastName');
		self.options.fullName = self.options.firstName + ' ' + self.options.lastName || self.config.get('fullName');
		self.options.email = self.options.email || self.config.get('email');
		self.options.bitbucketUser = self.options.bitbucketUser || self.config.get('bitbucketUser');
		self.options.bitbucketPass = self.options.bitbucketPass || self.config.get('bitbucketPass');
		self.options.bitbucketAccount = self.options.bitbucketAccount || self.config.get('bitbucketAccount');

		self.config.set('firstName', self.options.firstName);
		self.config.set('lastName', self.options.lastName);
		self.config.set('fullName', self.options.fullName);
		self.config.set('email', self.options.email);
		self.config.set('bitbucketUser', self.options.bitbucketUser);
		self.config.set('bitbucketPass', self.options.bitbucketPass);
		self.config.set('bitbucketAccount', self.options.bitbucketAccount);

		done();
	}.bind(this));
};

RhythmGenerator.prototype.setupProjectStructure = function () {
	this.log('Creating initial project structure...');

	this.dest.mkdir(this.options.projectDomain);
	this.directory('docs', path.join(this.options.projectDomain, 'docs'));
	this.dest.mkdir(path.join(this.options.projectDomain, 'trunk'));
};

RhythmGenerator.prototype.invokeSubGenerators = function () {
	this.log('Invoking subgenerators...');

	var self = this,
		done = this.async(),
		fnInvokeGenerator = function (projectType) {
			var deferred = Q.defer(),
				generator = self.invoke('rhythm:' + projectType, {'options': self.options});

			generator.on('complete', function () {
				deferred.resolve();
			});

			return deferred.promise;
		},
		promises = _.map(self.options.projectTypes, function (projectType) {
			return fnInvokeGenerator(projectType);
		});

	Q.all(promises)
		.fail(function (err) {
			self._logError(null, err);
		})
		.fin(function () {
			done();
		});
};

RhythmGenerator.prototype.invokeGit = function () {
	if (this.options.useGit) {
		this.log('Setting up git repository...');

		var done = this.async(),
			generator = this.invoke('rhythm:git', {'options': this.options});

		generator.on('complete', function () {
			done();
		});
	}
};

RhythmGenerator.prototype.invokeBitbucket = function () {
	if (this.options.useBitbucket) {
		this.log('Setting up bitbucket remote repository...');

		this.invoke('rhythm:bitbucket', {'options': this.options});
	}
};

RhythmGenerator.prototype.bingo = function () {
	this.log(yosay('Bingo! Dino DNA!'));
};

RhythmGenerator.prototype._logError = utils.logError;

module.exports = RhythmGenerator;
