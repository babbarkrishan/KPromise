var express = require('Express');
var app = express();

var github = require('./github.js');
app.use('/github', github);

var server = app.listen(8000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})