var express = require('express');
var app = express();
var fs = require('fs');
var http = require('http');
var https = require('https');
var path = require('path');
var privateKey  = fs.readFileSync('/Users/yangxu/cerfolder/private.pem', 'utf8');
var certificate = fs.readFileSync('/Users/yangxu/cerfolder/file.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
var PORT = 18080;
var SSLPORT = 18081;

httpServer.listen(PORT, function() {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});
httpsServer.listen(SSLPORT, function() {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});

// Welcome
// app.get('/', function(req, res) {
//     if(req.protocol === 'https') {
//         res.status(200).send('Welcome to Safety Land!');
//     }
//     else {
//         res.status(200).send('Welcome!');
//     }
// });


app.get('/', function (req, res) {
  res.sendFile('index.html', {
    root: path.resolve(__dirname, '../content/')
  });
});

app.get('/wheelprize', function (req, res) {
  res.sendFile('index.html', {
    root: path.resolve(__dirname, '../content/')
  });
});


app.use('/content/static', express.static(path.resolve(__dirname, '../content/static')));
// app.use('/static/static', express.static(path.resolve(__dirname, '../content/static')));
app.use('/static', express.static(path.resolve(__dirname, '../content/static')));
