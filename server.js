var restify = require('restify');
var request = require('request');
var rand = require('csprng');
var sha1 = require('sha1');

var server = restify.createServer();

server.use(restify.bodyParser());
server.use(restify.authorizationParser());

server.listen(8080, function() {
	console.log('incoming request being handled');
	server.get(/^\/books\/([a-z]+)$/, function(req, res, next) {
		console.log('GET ' + req.params[0]);
		var host = 'http://liberal-button.codio.io',
			url = host + ':5984/books/' + req.params[0];
		request.get(url, function(err, response, body) {
			if (response.statusCode == 200) {
				var bodyObject = JSON.parse(body),
					data = {
					title: bodyObject['title'],
					description: bodyObject['description'],
					author: bodyObject['author'],
					selfLink: host + ':8080/books/' + bodyObject['_id']
				};
				res.send(data);
				res.end();
			}
		});
	});
	server.get(/^\/books\q=/, function(req, res, next) {
		console.log('GET ' + req.params[0]);
		var host = 'http://liberal-button.codio.io',
			url = host + ':5984/books/' + req.params[0];
		request.get(url, function(err, response, body) {
			res.send(body);
			res.end();
		});
	});
	server.put(/^\/books\/([a-z]+)$/, function(req, res, next) {
		console.log('PUT '+req.params[0]);
		console.log('auth: '+JSON.stringify(req.authorization));
		if (req.headers['content-type'] != 'application/json') {
			return next(new restify.UnsupportedMediaTypeError('bad Content-Type'));
		}
		if (req.authorization.scheme != 'Basic') {
			return next(new restify.UnauthorizedError('Basic HTTP auth required'));
		}
		console.log('parameters supplied');
		var url = 'http://liberal-button.codio.io:5984/books/'+req.params[0];
		var book = req.params['book'];
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
					title: book['title'],
					description: book['description'],
					author: book['author']
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
	server.get(/^\/reviews\/([a-z]+)$/, function(req, res, next) {
		console.log('GET ' + req.params[0]);
		var host = 'http://liberal-button.codio.io',
			url = host + ':5984/reviews/' + req.params[0];
		request.get(url, function(err, response, body) {
			if (response.statusCode == 200) {
				var bodyObject = JSON.parse(body),
					data = {
					username: bodyObject['username'],
					book: bodyObject['bookID'],
					rating: bodyObject['rating'],
					content: bodyObject['content'],
					selfLink: host + ':8080/books/' + bodyObject['_id']
				};
				res.send(data);
				res.end();
			}
		});
	});
	server.put(/^\/reviews\/([a-z]+)$/, function(req, res, next) {
		console.log('PUT '+req.params[0]);
		console.log('user: '+JSON.stringify(req.authorization));
		console.log(req.params[0]);
		if (req.headers['content-type'] != 'application/json') {
			return next(new restify.UnsupportedMediaTypeError('bad Content-Type'));
		}
		if (req.authorization.scheme != 'Basic') {
			return next(new restify.UnauthorizedError('Basic HTTP auth required'));
		}
		console.log('parameters supplied');
		var url = 'http://liberal-button.codio.io:5984/reviews/'+req.params[0];
		var review = req.params['review'];
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
					username: review['username'],
					bookID: review['bookID'],
					rating: review['rating'],
					content: review['content']
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
					res.send({reviews: req.params['reviews']});
					res.end();
				});
				console.log('document not found');
			}
			if (response.statusCode == 200) {
				console.log('existing document');
				body = JSON.parse(body);
				var pwd = sha1(req.authorization.basic.password+body.salt);
				if (pwd != body.password) {
					return next(new restify.ForbiddenError('invalid username/password'));
				}
				console.log('passwords match!');
				var d = new Date();
				var date = d.toUTCString();
				body.last_modified = date;
				body.reviews = reviews;
				console.log(body);
				var params = {uri:url, body: JSON.stringify(doc)};
				request.put(params, function(err, response, body) {
					if (err) {
						return next(new restify.InternalServerError('Cannot create document'));
					}
					// document has been inserted into database
					res.setHeader('Location', 'http://'+req.headers.host+req.url);
					res.setHeader('ETag', body.rev);
					res.setHeader('Last-Modified', date);
					res.setHeader('Content-Type', 'application/json');
					res.send({reviews: req.params['reviews']});
					res.end();
				});
			}
		});
	res.end();
	});
});