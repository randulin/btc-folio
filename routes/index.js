
/*
 * GET home page.
 */

exports.index = function(req, res){
  var data = {};
  data.env = env;
  res.render('index', data);
};

exports.btc = require('./btc_tc_service');
exports.blockchain = require('./blockchain');
exports.bitcoincharts = require('./bitcoincharts');