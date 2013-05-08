
var https = require('https');

exports.query_ticker = function(request, response) {
	var data = "";

	var ticker = request.query.t;
	
	https.get('https://btct.co/api/ticker/' + ticker, function(res) {
	
		res.on('data', function(d) {
			data += d; 
		});	  
			  
		res.on('end', function() {	 	 
			response.send(JSON.stringify(JSON.parse(data)));
		});
	
	}).on('error', function(e) {
	  console.error(e);
	});
};


exports.query_act = function(request, response) {
	var data = "";
	var api_key = request.query.key;
	
	https.get('https://btct.co/api/act?key=' + api_key, function(res) {
	
		res.on('data', function(d) {
			data += d; 
		});	  
			  
		res.on('end', function() {	 	 
			response.send(JSON.stringify(JSON.parse(data)));
		});
	
	}).on('error', function(e) {
	  console.error(e);
	});
};