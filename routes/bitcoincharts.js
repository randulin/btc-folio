
var http = require('http');

exports.query_weighted = function(request, response) {

	var data = "";
	
	http.get('http://api.bitcoincharts.com/v1/weighted_prices.json', function(res) {
	
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