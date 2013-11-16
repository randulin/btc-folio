
var https = require('https');

exports.query = function(request, response) {
	var data = "";

  var cachekey = 'cachekey'; //allways same, no parameter

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
	
	https.get('https://www.havelockinvestments.com/r/tickerfull', function(res) {
	
		res.on('data', function(d) {
			data += d; 
		});	  
			  
		res.on('end', function() {

      if (!data) {
        response.send(500, "no data");
        return;
      }

      try {

        var d = JSON.parse(data);

        if (data == "" || !d) {
          response.send(404, 'Not found');
          return;
        }

        if (d.status == "error") {
          response.send(404, d.message);
          return;
        }


        global.cache.btctco_ticker = global.cache.btctco_ticker || {};
        global.cache.btctco_ticker[cachekey] = {};
        global.cache.btctco_ticker[cachekey].data = JSON.stringify(d);
        global.cache.btctco_ticker[cachekey].expires = Date.now() + global.cache.expire;
        console.log('added havelock (' + cachekey + ') data to cache expires: ' + new Date(global.cache.btctco_ticker[cachekey].expires));
        response.send(global.cache.btctco_ticker[cachekey].data);

      } catch (e) {
        response.send(500, "Error");
        console.error(e);
      }
		});
	
	}).on('error', function(e) {
    response.send(500, "Error");
	  console.error(e);
	});
};
