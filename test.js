var restify = require('restify');
var request = require('request');
var rand = require('csprng');
var sha1 = require('sha1');

var server = restify.createServer();

server.use(restify.bodyParser());
server.use(restify.authorizationParser());

server.listen(8080, function() {
	console.log('incoming request being handled');
	server.put(/^\/books\/([a-z]+)$/, function(req, res, next) {
		console.log('PUT '+req.params[0]);
		if (req.params[0] != req.authorization.basic.username) {
			return next(new restify.ForbiddenError('mismatched username and url'));
		}
		if (req.headers['content-type'] != 'application/json') {
			return next(new restify.UnsupportedMediaTypeError('bad Content-Type'));
		}
		if (req.authorization.scheme != 'Basic') {
			return next(new restify.UnauthorizedError('Basic HTTP auth required'));
		}
		console.log('parameters supplied');
		var url = 'http://liberal-button.codio.io:5984/books/'+req.params[0];
		var items = req.params['books'];
		request.get(url, function(err, response, body) {
			if (response.statusCode == 404) {
				var salt = rand(160, 36);
				console.log(req.authorization.basic.password+salt);
				var password = sha1(req.authorization.basic.password+salt);
				console.log(password);
				var d = new Date();
				var date = d.toUTCString();
				console.log(date);
				var doc = {
					last_modified: date,
					password: password,
					salt: salt,
					items: items
				};
				var docStr = JSON.stringify(doc);
				var params = {uri:url, body: JSON.stringify(doc)};
				request.put(params, function(err, response, body) {
					if (err) {
						return next(new restify.InternalServerError('Cant create document'));
					}
					body = JSON.parse(body);
					res.setHeader('Location', 'http://'+req.headers.host+req.url);
					res.setHeader('ETag', body.rev);
					res.setHeader('Last-Modified', date);
					res.setHeader('Content-Type', 'application/json');
					res.setHeader('Accepts', 'PUT');
					res.send({books: req.params['books']});
					res.end();
				});
				console.log('document not found');
			}
			if (response.statusCode == 200) {
				console.log('existing document');
			}
		});
		res.end();
	});
});