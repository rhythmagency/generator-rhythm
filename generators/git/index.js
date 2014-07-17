'use strict';

var RhythmGitGenerator,
	util = require('util'),
	path = require('path'),
	yeoman = require('yeoman-generator'),
	git = require('rhythm.gift'),
	utils = require('../../lib/utils');

/**
 * Generator for initializing a Git repository.
 *
 * @param args The command line arguments passed to the generator.
 * @param options The options passed to the generator.
 * @constructor
 */
RhythmGitGenerator = function (args, options) {
	yeoman.generators.Base.apply(this, arguments);

	this.options = options;
	this.workingDirectory = path.join(process.cwd(), this.options.projectDomain);
};

util.inherits(RhythmGitGenerator, yeoman.generators.Base);

RhythmGitGenerator.prototype.gitInit = function () {
	this.log('Initializing git repository...');

	var done = this.async();

	git.init(this.workingDirectory, function (err, repo) {
		this._logError('git:init:error', err);

		if (!err) {
			this.repo = repo;
		}

		done();
	}.bind(this));
};

RhythmGitGenerator.prototype.gitAdd = function () {
	this.log('Adding files to git repository...');

	var done = this.async();

	this.repo.add('.', function (err) {
		this._logError('git:add:error', err);

		done();
	}.bind(this));
};

RhythmGitGenerator.prototype.gitCommit = function () {
	this.log('Committing files to git repository...');

	/*
	 * This is going to error out: Error: stdout maxBuffer exceeded.
	 * node_modules/gift/lib/git.js : line 34
	 * add 'maxBuffer: 5000 * 1024' to fix, however it should be done with a pull request first.
	 */

	var done = this.async();

	this.repo.commit('Initial commit', {'all': true}, function (err) {
		this._logError('git:commit:error', err);

		done();
	}.bind(this));
};

RhythmGitGenerator.prototype.gitCreateBranchDevelop = utils.createBranch('develop');

RhythmGitGenerator.prototype.gitCreateBranchFrontend = utils.createBranch('feature/frontend');

RhythmGitGenerator.prototype.gitCheckoutDevelop = function () {
	this.log('Checking out develop branch from git repository...');

	var done = this.async();

	this.repo.checkout('develop', function (err) {
		this._logError('git:checkout:develop:error', err);

		done();
	}.bind(this));
};

RhythmGitGenerator.prototype.emitComplete = function () {
	this.emit('complete');
};

RhythmGitGenerator.prototype._logError = utils.logError;

module.exports = RhythmGitGenerator;