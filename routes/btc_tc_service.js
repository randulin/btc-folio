
var https = require('https');

exports.query_ticker = function(request, response) {
	var data = "";

	var ticker = request.query.t;
  var cachekey = 'KEY:' + ticker;

  if (global.cache
      && global.cache.btctco_ticker
      && global.cache.btctco_ticker[cachekey]
      && global.cache.btctco_ticker[cachekey].data
      && global.cache.btctco_ticker[cachekey].expires
      && global.cache.btctco_ticker[cachekey].expires > Date.now()
      ) {

    response.send(global.cache.btctco_ticker[cachekey].data);
    return;
  }
	
	https.get('https://btct.co/api/ticker/' + ticker, function(res) {
	
		res.on('data', function(d) {
			data += d; 
		});	  
			  
		res.on('end', function() {

      global.cache.btctco_ticker = global.cache.btctco_ticker || {};
      global.cache.btctco_ticker[cachekey] = {};
      global.cache.btctco_ticker[cachekey].data = JSON.stringify(JSON.parse(data));
      global.cache.btctco_ticker[cachekey].expires = Date.now() + global.cache.expire;
      console.log('added blockchain (' + cachekey + ') data to cache expires: ' + new Date(global.cache.btctco_ticker[cachekey].expires));

			response.send(global.cache.btctco_ticker[cachekey].data);
		});
	
	}).on('error', function(e) {
	  console.error(e);
	});
};


exports.query_act = function(request, response) {
	var data = "";
	var api_key = request.query.key;
  var cachekey = 'KEY:' + api_key;

  if (global.cache
      && global.cache.btctco_portfolio
      && global.cache.btctco_portfolio[cachekey]
      && global.cache.btctco_portfolio[cachekey].data
      && global.cache.btctco_portfolio[cachekey].expires
      && global.cache.btctco_portfolio[cachekey].expires > Date.now()
      ) {

    response.send(global.cache.btctco_portfolio[cachekey].data);
    return;
  }
	
	https.get('https://btct.co/api/act?key=' + api_key, function(res) {
	
		res.on('data', function(d) {
			data += d; 
		});	  
			  
		res.on('end', function() {
      global.cache.btctco_portfolio = global.cache.btctco_portfolio || {};
      global.cache.btctco_portfolio[cachekey] = {};
      global.cache.btctco_portfolio[cachekey].data = JSON.stringify(JSON.parse(data));
      global.cache.btctco_portfolio[cachekey].expires = Date.now() + global.cache.expire;
      console.log('added blockchain (' + cachekey + ') data to cache expires: ' + new Date(global.cache.btctco_portfolio[cachekey].expires));

      response.send(global.cache.btctco_portfolio[cachekey].data);
		});
	
	}).on('error', function(e) {
	  console.error(e);
	});
};