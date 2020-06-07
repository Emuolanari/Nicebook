var frisby = require('frisby');

frisby.create('testing nicebook API')
	.get('http://halt-rubber.codio.io:8080/')
	.expectStatus(200)
    .expectHeader('Content-Type', 'application/json')
    .expectJSONTypes({
        message: String
    })
    .expectJSON({
        message: 'Hello World!'
    })
.toss();

