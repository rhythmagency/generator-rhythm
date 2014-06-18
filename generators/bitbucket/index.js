'use strict';

var RhythmBitbucketGenerator,
	util = require('util'),
	path = require('path'),
	yeoman = require('yeoman-generator'),
	git = require('gift'),
	utils = require('../../lib/utils'),
	request = require('request');

/**
 * Generator for initializing and pushing to a Bitbucket repository.
 *
 * @param args The command line arguments passed to the generator.
 * @param options The options passed to the generator.
 * @constructor
 */
RhythmBitbucketGenerator = function (args, options) {
	yeoman.generators.Base.apply(this, arguments);

	this.options = options;
	this.workingDirectory = path.join(process.cwd(), this.options.projectDomain);
	this.bitbucketUrl = util.format('https://bitbucket.org/api/2.0/repositories/%s/%s', this.options.bitbucketAccount, this.options.projectName.toLowerCase());
	this.bitbucketGitRepo = util.format('ssh://git@bitbucket.org/%s/%s.git', this.options.bitbucketAccount, this.options.projectName.toLowerCase());
	this.bitbucketCreateBody = util.format('name=%s&description=This+is+a+website+for+%s&is_private=1&scm=git&fork_policy=allow_forks', this.options.projectDomain.toLowerCase(), this.options.projectDomain.toLowerCase());
	this.repo = git(this.workingDirectory);
};

util.inherits(RhythmBitbucketGenerator, yeoman.generators.Base);

RhythmBitbucketGenerator.prototype.createRepository = function () {
	this.log('Creating Bitbucket repository.');

	var done = this.async();

	request({
		'uri': this.bitbucketUrl,
		'method': 'POST',
		'auth': {
			'user': this.options.bitbucketUser,
			'pass': this.options.bitbucketPass
		},
		'body': this.bitbucketCreateBody
	}, function (err, res, body) {
		this._logError('bitbucket:create', err);

		this.log('Completed creating Bitbucket repository.');

		done();
	}.bind(this));
};

RhythmBitbucketGenerator.prototype.addRemote = function () {
	this.log('Adding remote.');
	var done = this.async();

	this.repo.remote_add('origin', this.bitbucketGitRepo, function (err) {
		this._logError('bitbucket:addRemote', err);

		this.log('Completed adding remote.');

		done();
	}.bind(this));
};

RhythmBitbucketGenerator.prototype.pushMaster = utils.pushBranch('master');

RhythmBitbucketGenerator.prototype.pushDevelop = utils.pushBranch('develop');

RhythmBitbucketGenerator.prototype.pushFrontend = utils.pushBranch('feature/frontend');

RhythmBitbucketGenerator.prototype.emitComplete = function () {
	this.emit('complete');
};

RhythmBitbucketGenerator.prototype._logError = utils.logError;

module.exports = RhythmBitbucketGenerator;