var keystone = require('keystone');

exports.initErrorHandlers = function (req, res, next) {
	res.err = function (err, title, message) {
		res.status(500).render('errors/500', {
			err: err,
			errorTitle: title,
			errorMsg: message
		});
	};

	res.notfound = function (title, message) {
		res.status(404).render('errors/404', {
			errorTitle: title,
			errorMsg: message
		});
	};

	next();
};

exports.initLocals = function (req, res, next) {
	var locals = res.locals;

	locals.user = req.user;

	next();
};