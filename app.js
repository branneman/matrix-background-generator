'use strict';

var fs = require('fs');
var express = require('express');

// Setup Express.js
var app = express();
app.get('/', function(req, res) {
    fs.readFile('index.html', 'utf8', function(err, text) { res.send(text); });
});
app.get('/audio-test.html', function(req, res) {
    fs.readFile('audio-test.html', 'utf8', function(err, text) { res.send(text); });
});
app.use(express.favicon('favicon.ico'));
app.use('/static', express.static('static/'));

// Start server
var port = 1337;
app.listen(port);
console.log('Listening on port ' + port);
console.log('Use Ctrl+C or SIGINT to exit.');
