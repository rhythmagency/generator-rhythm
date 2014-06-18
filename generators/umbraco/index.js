'use strict';

var RhythmUmbracoGenerator,
	util = require('util'),
	path = require('path'),
	uuid = require('node-uuid'),
	yeoman = require('yeoman-generator'),
	utils = require('../../lib/utils'),
	decompress = require('decompress'),
	fs = require('fs');

/**
 * Generator for creating an Umbraco project.
 *
 * @param args The command line arguments passed to the generator.
 * @param options The options passed to the generator.
 * @constructor
 */
RhythmUmbracoGenerator = function (args, options) {
	yeoman.generators.Base.apply(this, arguments);

	this.options = options;
	this.options.port = 90000;
	this.options.uuids = {
		'website': {
			'solution': uuid.v4(),
			'project': uuid.v4()
		},
		'extensions': {
			'solution': uuid.v4(),
			'project': uuid.v4(),
			'typelib': uuid.v4()
		}
	};

	this.umbracoVersion = '7.1.4';
	this.umbracoDownloadLocation = 'http://our.umbraco.org/ReleaseDownload?id=125627';
	this.workingDirectory = path.join(process.cwd(), this.options.projectDomain, 'trunk', this.options.projectName + '.Umbraco');
	this.umbracoWebsiteWorkingDirectory = path.join(this.workingDirectory, this.options.projectName + '.Website');
	this.umbracoDownloadLocationFile = path.join(this.umbracoWebsiteWorkingDirectory, path.basename(this.umbracoDownloadLocation));
};

util.inherits(RhythmUmbracoGenerator, yeoman.generators.Base);

RhythmUmbracoGenerator.prototype.install = function () {
	this._processDirectory('umbraco', this.workingDirectory);
};

RhythmUmbracoGenerator.prototype.promptUser = function () {
	var done = this.async(),
		self = this,
		prompts = [
			{
				'type': 'confirm',
				'name': 'downloadUmbraco',
				'message': 'Would you like to download and extract Umbraco v' + this.umbracoVersion + '?',
				'default': true
			}
		];

	self.prompt(prompts, function (props) {
		self.downloadUmbraco = props.downloadUmbraco;

		done();
	});
};

RhythmUmbracoGenerator.prototype.downloadAndExtractUmbraco = function () {
	var done = this.async(),
		self = this;

	if (self.downloadUmbraco) {
		this.log('Downloading Umbraco v' + this.umbracoVersion + '...');

		self.fetch(self.umbracoDownloadLocation, self.umbracoWebsiteWorkingDirectory, function (err) {
			if (err) {
				self._logError('Error downloading ' + self.umbracoDownloadLocation, err);
				done();
			} else {
				this.log('Extracting ' + self.umbracoDownloadLocationFile + '...');

				fs
					.createReadStream(self.umbracoDownloadLocationFile)
					.pipe(decompress({
						'ext': 'application/zip',
						'path': self.umbracoWebsiteWorkingDirectory
					}))
					.on('close', function () {
						self.dest.delete(self.umbracoDownloadLocationFile);
						done();
					});
			}
		});
	}
};

RhythmUmbracoGenerator.prototype.emitComplete = function () {
	this.emit('complete');
};

RhythmUmbracoGenerator.prototype._processDirectory = utils.processDirectory;
RhythmUmbracoGenerator.prototype._logError = utils.logError;

module.exports = RhythmUmbracoGenerator;