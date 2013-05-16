
/**
 * Module dependencies.
 */

global.cache = {};
global.cache.expire = 4 * 60 * 1000;

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , pkg = require('./package.json');


env = {};
env.version = pkg.version;
env.serial = env.version.replace(/\D/g, '');
env.debug = false;


var app = express();

// all environments

app.use(express.favicon(path.join(__dirname, '/public/img/favicon.ico')));
app.use(express.compress());
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

//caching header:
var oneDay = 86400000;
app.use(express.static(path.join(__dirname, 'public'), { maxAge: oneDay }));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  app.locals.pretty = true;
  env.debug = true;
}


app.get('/', routes.index);

app.get('/blockchain_address', routes.blockchain.query_address);
app.get('/bitcoincharts_weighted', routes.bitcoincharts.query_weighted);
app.get('/btc_tc_act', routes.btc.query_act);
app.get('/btc_tc_ticker', routes.btc.query_ticker);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


