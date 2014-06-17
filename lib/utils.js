var path = require('path'),
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

module.exports = Utils;