var restify = require('restify');
var request = require('request');


var server = restify.createServer();

server.use(restify.queryParser());
server.use(restify.authorizationParser());

server.use(restify.bodyParser());

server.listen(8080, function() {
	console.log('incoming request being handled');
    
    server.get(/^\/items\.(json|xml)/, function(req, res, next) {
        console.log('auth: '+JSON.stringify(req.authorization))
        var data = req.authorization;
        var data = ['bread', 'butter', 'jam']; 
        console.log('format: '+req.params[0]);
        
        if (req.query.start && req.query.end) {        
            console.log('start: '+req.query.start);
            console.log('end: '+req.query.end);
        }
        
        if (req.headers['if-modified-since']) {
            var last = new Date(req.headers['if-modified-since']);
            var now = new Date();
            if (last < now) {
                console.log('update available');
                res.status(201);
                res.send({data: 'new data'});
            } else {
                console.log('no update');
                res.status(304);
            }
        }

       res.send(data);
       res.end();
   });
    server.post(/^\/items.(json|xml)/, function(req, res, next) {
        if (req.headers['content-type'] != 'application/json') {
            return next(new restify.UnsupportedMediaTypeError("content-type not application/json"));
        }
        var data = req.body;
        // add the data to the database
        res.status(201);
        res.setHeader('Location', '/items/2.json');
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
        res.end();
    });

});
