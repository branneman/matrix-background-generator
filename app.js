'use strict';

var fs = require('fs');
var express = require('express');

// Setup Express.js
var app = express();
app.get('/', function(req, res) {
    fs.readFile('index.html', 'utf8', function(err, text){
        res.send(text);
    });
});
app.use(express.favicon('favicon.ico'));
app.use('/static', express.static('static/'));

// Start server
app.listen(80);
console.log('Listening on port 80');
console.log('Use Ctrl+C or SIGINT to exit.');
