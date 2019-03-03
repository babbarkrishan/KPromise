var express = require('express');
var github = express.Router();
var request = require("request");
var KPromise = require('./kpromise.js');

function initialize() {
    // Setting URL and headers for request
    var options = {
        url: 'https://api.github.com/users/babbarkrishan',
        headers: {
            'User-Agent': 'request'
        }
    };
	//console.log("Creating KPromoise");
    // Return new promise 
    return new KPromise(function(resolve, reject) {
    	// Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
				console.log("Got the error response");
                reject(err);
            } else {
				console.log("Got the success response");
                resolve(JSON.parse(body));
            }
        })
    })
}

github.get('/', function(req, res){	
	console.log("Getting github user details");
	var initializePromise = initialize();
    initializePromise.then(function(result) {
        console.log("Initialized github user details");
		res.send(result);        
		//console.log("Successssssssssssss");
        console.log(result);
    }, function(err) {
		//console.log("Errorrrrrrrrr");
        console.log(err);
    })
});

github.get('*', function(req, res){
   res.send('Sorry, this is an invalid URL.');
});

module.exports = github;