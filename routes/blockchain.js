

var blockchain = require('blockchain.info')
  , blockexplorer = blockchain.blockexplorer;

exports.query_address = function(request, response) {

	var data = "";

	var addresses = request.query.a.split("|");
  var cachekey = 'KEY:' + addresses.join("|");

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

	console.log('http://blockchain.info/multiaddr?active=' + JSON.stringify(addresses));

  blockexplorer.getMultiAddress(addresses, function(error, d) {
    if (error){
      console.error(error);
      response.send(500, "Error");
      return;
    }
    
    try {
		global.cache.blockchain = global.cache.blockchain || {};
		global.cache.blockchain[cachekey] = {};
		global.cache.blockchain[cachekey].data = d;
		global.cache.blockchain[cachekey].expires = Date.now() + global.cache.expire;
		console.log('added blockchain (' + cachekey + ') data to cache expires: ' + new Date(global.cache.blockchain[cachekey].expires));

		response.send(global.cache.blockchain[cachekey].data);
	} catch(e) {
        console.error(e);
        response.send(500, "Error");
	}
  });
	

};
