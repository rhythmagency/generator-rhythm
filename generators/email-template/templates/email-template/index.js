var server, transport,
	config = require('./config.json'),
	path = require('path'),
	express = require('express'),
	bodyParser = require('body-parser'),
	emailTemplates = require('email-templates'),
	nodemailer = require('nodemailer'),
	app = express(),
	templatesDir = path.join(__dirname, 'templates'),
	allowCrossDomain = function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		next();
	},
	fnErrorToJSON = function (err) {
		return {
			'stack': err.stack,
			'severity': err.severity,
			'message': err.message,
			'code': err.code
		};
	},
	fnRenderTemplate = function (tpl, locals, callback) {
		emailTemplates(templatesDir, function (err, template) {
			template(tpl, locals, function (err, html, text) {
				if (err) {
					callback(err);
				} else {
					callback(null, html, text);
				}
			});
		});
	},
	fnRenderEmail = function (req, res, locals, useText) {
		fnRenderTemplate(req.params.template, locals, function (err, html, text) {
			if (err) {
				console.log(err);
				res.json({'success': false, 'error': fnErrorToJSON(err)});
			} else {
				res.send(useText ? text : html);
			}
		});
	},
	fnSendEmail = function (req, res, locals, useText) {
		fnRenderTemplate(req.params.template, locals, function (err, html, text) {
			if (err) {
				console.log(err);
				res.json({'status': false, 'error': err});
			} else {
				transport.sendMail({
					'from': config.email.from,
					'to': config.email.to,
					'subject': config.email.subject,
					'secureConnection': true,
					'html': html,
					'text': text
				}, function (err, status) {
					if (err) {
						console.log(err);
						res.json({'success': false, 'error': fnErrorToJSON(err)});
					} else {
						res.json({'success': true});
					}
				});
			}
		});
	};

transport = nodemailer.createTransport('SES', {
	'AWSAccessKeyID': config.aws.accessKeyId,
	'AWSSecretKey': config.aws.secretKey
});

app.use(allowCrossDomain);
app.use(bodyParser());

/* Render emails to the browser */

app.get('/:template', function (req, res) {
	fnRenderEmail(req, res, config.locals.normal, false);
});

app.get('/:template/text', function (req, res) {
	fnRenderEmail(req, res, config.locals.normal, true);
});

app.get('/:template/et', function (req, res) {
	fnRenderEmail(req, res, config.locals.exacttarget, false);
});

app.get('/:template/et/text', function (req, res) {
	fnRenderEmail(req, res, config.locals.exacttarget, true);
});

/* Send emails */

app.get('/:template/send', function (req, res) {
	fnSendEmail(req, res, config.locals.normal, false);
});

app.get('/:template/send/text', function (req, res) {
	fnSendEmail(req, res, config.locals.normal, true);
});

app.get('/:template/send/et', function (req, res) {
	fnSendEmail(req, res, config.locals.exacttarget, false);
});

app.get('/:template/send/et/text', function (req, res) {
	fnSendEmail(req, res, config.locals.exacttarget, true);
});

/* Start Server */

server = app.listen(config.port, function () {
	console.log('Listening on port %d', server.address().port);
});