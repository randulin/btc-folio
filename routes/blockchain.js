
var http = require('http');

exports.query_address = function(request, response) {

	var data = "";

	var addresses = request.query.a;
  var cachekey = 'KEY:' + addresses;

  if (global.cache
      && global.cache.blockchain
      && global.cache.blockchain[cachekey]
      && global.cache.blockchain[cachekey].data
      && global.cache.blockchain[cachekey].expires
      && global.cache.blockchain[cachekey].expires > Date.now()
      ) {

    response.send(global.cache.blockchain[cachekey].data);
    return;
  }

	console.log('http://blockchain.info/multiaddr?active=' + addresses);
	
	http.get('http://blockchain.info/multiaddr?active=' + addresses, function(res) {
	
	  res.on('data', function(d) {
		 data += d; 
	  });	  
		  
	  res.on('end', function() {

      global.cache.blockchain = global.cache.blockchain || {};
      global.cache.blockchain[cachekey] = {};
      global.cache.blockchain[cachekey].data = JSON.stringify(JSON.parse(data));
      global.cache.blockchain[cachekey].expires = Date.now() + global.cache.expire;
      console.log('added blockchain (' + cachekey + ') data to cache expires: ' + new Date(global.cache.blockchain[cachekey].expires));

		  response.send(global.cache.blockchain[cachekey].data);
	  });
	
	}).on('error', function(e) {
	  console.error(e);
	});
};
