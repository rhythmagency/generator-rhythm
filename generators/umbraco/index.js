'use strict';

var RhythmUmbracoGenerator,
	util = require('util'),
	path = require('path'),
	uuid = require('node-uuid'),
	yeoman = require('yeoman-generator'),
	utils = require('../../lib/utils'),
	decompress = require('decompress'),
	fs = require('fs'),
	os = require('os');

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
	this.options.port = 9000;
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
	// Append '&filename=/umbraco.zip' so that we can have the file named umbraco.zip instead of 'ReleaseDownload?id=125627'. Kind of a hack, but it works.
	this.umbracoFileName = 'umbraco-' + this.umbracoVersion + '.zip';
	this.umbracoDownloadLocation = 'http://our.umbraco.org/ReleaseDownload?id=125627&filename=/' + this.umbracoFileName;
	this.workingDirectory = path.join(process.cwd(), this.options.projectDomain, 'trunk', this.options.projectName + '.Umbraco');
	this.umbracoWebsiteWorkingDirectory = path.join(this.workingDirectory, this.options.projectName + '.Website');
	this.temporaryDirectory = os.tmpdir();
	this.umbracoDownloadLocationFile = path.join(this.temporaryDirectory, this.umbracoFileName);
	this.umbracoSolutionFile = path.join(this.workingDirectory, this.options.projectName + '.Website.sln');
	this.umbracoExtensionsProjectFile = path.join(this.workingDirectory, this.options.projectName + '.Extensions', this.options.projectName + '.Extensions.csproj');
	this.umbracoExtensionsAssembylyInfoFile = path.join(this.workingDirectory, this.options.projectName + '.Extensions', 'Properties', 'AssembyInfo.cs');
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
				'default': true,
				'when': function (response) {
					return !fs.existsSync(self.umbracoDownloadLocationFile);
				}
			}
		];

	self.prompt(prompts, function (props) {
		self.downloadUmbraco = props.downloadUmbraco;

		done();
	});
};

RhythmUmbracoGenerator.prototype._replaceLineEndings = utils.replaceLineEndings;

RhythmUmbracoGenerator.prototype.replaceLineEndingsInFiles = function () {
	this._replaceLineEndings(this.umbracoSolutionFile);
	this._replaceLineEndings(this.umbracoExtensionsProjectFile);
	this._replaceLineEndings(this.umbracoExtensionsAssembylyInfoFile);
};

RhythmUmbracoGenerator.prototype.downloadUmbracoFile = function () {
	if (this.downloadUmbraco) {
		var done = this.async(),
			self = this;

		self.log('Downloading Umbraco v' + this.umbracoVersion + '...');

		self.fetch(self.umbracoDownloadLocation, self.temporaryDirectory, function (err) {
			if (err) {
				self._logError('Error downloading ' + self.umbracoDownloadLocation, err);
			}

			done();
		});
	}
};

RhythmUmbracoGenerator.prototype.extractUmbracoFile = function () {
	if (fs.existsSync(this.umbracoDownloadLocationFile)) {
		var done = this.async(),
			self = this;

		self.log('Extracting ' + self.umbracoDownloadLocationFile + '...');

		fs
			.createReadStream(self.umbracoDownloadLocationFile)
			.pipe(decompress({
				'ext': 'application/zip',
				'path': self.umbracoWebsiteWorkingDirectory
			}))
			.on('close', function () {
				done();
			});
	}
};

RhythmUmbracoGenerator.prototype.emitComplete = function () {
	this.emit('complete');
};

RhythmUmbracoGenerator.prototype._processDirectory = utils.processDirectory;
RhythmUmbracoGenerator.prototype._logError = utils.logError;

module.exports = RhythmUmbracoGenerator;