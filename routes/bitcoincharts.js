
var http = require('http');

exports.query_weighted = function(request, response) {

	var data = "";

  if (global.cache
      && global.cache.bitcoincharts
      && global.cache.bitcoincharts.data
      && global.cache.bitcoincharts.expires
      && global.cache.bitcoincharts.expires > Date.now()
      ) {

    response.send(global.cache.bitcoincharts.data);
    return;
  }

	http.get('http://api.bitcoincharts.com/v1/weighted_prices.json', function(res) {
	
	  res.on('data', function(d) {
		 data += d; 
	  });	  
		  
	  res.on('end', function() {
      global.cache.bitcoincharts = global.cache.bitcoincharts || {};
      global.cache.bitcoincharts.data = JSON.stringify(JSON.parse(data));
      global.cache.bitcoincharts.expires = Date.now() + global.cache.expire;
      console.log('added bitcoincharts data to cache expires: ' + new Date(global.cache.bitcoincharts.expires));

      response.send(global.cache.bitcoincharts.data);
	  });
	
	}).on('error', function(e) {
	  console.error(e);
	});
};