
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.btc = require('./btc_tc_service');
exports.blockchain = require('./blockchain');
exports.bitcoincharts = require('./bitcoincharts');