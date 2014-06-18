var path = require('path'),
	fs = require('fs'),
	Utils = {};

/**
 * Process the specified directory and replaces variables in the file/directory name and contents with values from the generator's options object.
 *
 * @param source The source folder relative to the generator's templates directory.
 * @param destination The directory you would like to copy the contents of the source to.
 */
Utils.processDirectory = function (source, destination) {
	var self = this,
		root = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source),
		files = this.expandFiles('**', { 'dot': true, 'cwd': root }),
		data = this.options;

	for (var i = 0; i < files.length; i++) {
		var f = files[i],
			src = path.join(root, f),
			dest = this._.map(
				path.join(
					destination,
					path.dirname(f),
					path.basename(f)
				).split(path.sep),
				function (o) {
					return self.engine(
						o
							.replace(/^_/, '')
							.replace(/\(\(/gim, '<%=')
							.replace(/\)\)/gim, '%>'),
						data
					);
				}).join(path.sep);

		this.template(src, dest);
	}
};

Utils.logError = function (msg, err) {
	if (err) {
		if (msg) {
			this.log(msg);
		}

		this.log(err.message);
		this.log(err.stack);
	}
};

Utils.pushBranch = function (branch) {
	return function () {
		this.log('Pushing branch ' + branch);

		var done = this.async();

		this.repo.remote_push('origin', branch, function (err) {
			this._logError('bitbucket:pushMaster', err);

			this.log('Completed pushing branch ' + branch);

			done();
		}.bind(this));
	};
};

Utils.createBranch = function (branch) {
	return function () {
		this.log('Creating branch ' + branch + '...');

		var done = this.async();

		this.repo.create_branch(branch, function (err) {
			this._logError('git:create_branch:' + branch + ':error', err);

			done();
		}.bind(this));
	};
};

Utils.replaceLineEndings = function (file) {
	if (fs.existsSync(file)) {
		this.log('Replacing Umbraco solution line endings in ' + file + '...');

		var encoding = 'utf8',
			contents = fs.readFileSync(file, encoding).replace(/\r\n|\n/gim, '\r\n');

		fs.writeFileSync(file, contents, encoding);
	}
};

module.exports = Utils;