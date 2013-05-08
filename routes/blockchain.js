
var http = require('http');

exports.query_address = function(request, response) {

	var data = "";

	var addresses = request.query.a;
	console.log('http://blockchain.info/multiaddr?active=' + addresses);
	
	http.get('http://blockchain.info/multiaddr?active=' + addresses, function(res) {
	
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
