
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , socket_io = require('socket.io')
  , sharedlibrary = require('./lib/sharedlibrary');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// maps components folder through /js/vendor
app.use('/js/vendor/', express.static(path.join(__dirname, 'components')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app);

// starts socket.io and configures it to use long polling (for Heroku)
var io = socket_io.listen(server, { log: false });
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

// calls setup on sharedlibrary (incl. SharedObject)
sharedlibrary.setup(io);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

