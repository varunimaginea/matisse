
/**
 * Module dependencies.
 */

var express = require('express')
, Resource = require('express-resource')
, routes = require('./routes');

var Nohm = require('nohm').Nohm;
var BoardModel = require(__dirname+'/BoardModel.js');
var redis = require("redis")
, redisClient = redis.createClient(); //go thru redis readme for anyother config other than default: localhost 6379

Nohm.setPrefix('matisse'); //setting up app prefix for redis
Nohm.setClient(redisClient);

//logging
Nohm.logError = function (err) {
    console.log("===============");
    console.log(err);
    console.log("===============");
};

redisClient.on("error", function (err) {

});

var app = module.exports = express.createServer()
, io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});

// Routes

//app.get('/', routes.index);
app.get('/favicon', function (req, res, next) {
    console.log("fafafaf");
});

app.get('/html', function (req, res, next) {
    var chars = "0123456789abcdefghiklmnopqrstuvwxyz";
    var string_length = 8;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
	var rnum = Math.floor(Math.random() * chars.length);
	randomstring += chars.substring(rnum,rnum+1);
    }
    var data = {
	url: randomstring
    };
    var whiteBoard = new BoardModel();
    whiteBoard.store(data, function(err){
	if (err === 'invalid') {
	    next(whiteBoard.errors);
	} else if (err) {
		next(err);
	} else {
	    res.writeHead(302, {
		'Location': randomstring
	    });
	    res.end();	    
	    //res.json({result: 'success', data: whiteBoard.allProperties()});
	    //       		res.sendfile(__dirname + '/index.html');
	}
    });
 });

app.resource({
    index: function(req, res, next){
	BoardModel.find(function (err, ids) {
	    if (err) {
		return next(err);
	    }
	    var boards = [];
	    var len = ids.length;
	    var count = 0;
	    if (len === 0) {
		return res.json(boards);
	    }
	    console.log(ids);
	    ids.forEach(function (id) {
	    var board = new BoardModel();
		board.load(id, function (err, props) {
		    if (err) {
			return next(err);
		    }
		    boards.push({id: this.id, url: props.url});
		    if (++count === len) {
			res.json(boards);
		    }
		});
	    });
	}); 
    },
    show: function(req, res, next){
	if (req.params.id != "favicon") {
       	    res.sendfile(__dirname + '/index.html');
	}
    }
});
	

app.use(function (err, req, res, next) {
  if (err instanceof Error) {
    err = err.message;
  }
  res.json({result: 'error', data: err});
});

app.listen(8000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

io.sockets.on('connection', function (socket) {
    socket.emit('eventConnect',{message:'welcome'});
    socket.on("setUrl",function(location,data){
	var wb_url = location.replace("/", "");
	socket.join(wb_url);
	BoardModel.find({url: wb_url}, function (err, ids) {
	    if (err) {
		return next(err);
	    }
	    var boards = [];
	    var len = ids.length;
	    var count = 0;
	    if (len === 0) {
		console.log("No white board exists length is 0");
//		return res.json(boards);
	    }
	    console.log(ids);
	    ids.forEach(function (id) {
	    var board = new BoardModel();
		board.load(id, function (err, props) {
		    if (err) {
			console.log(err);
//			return next(err);
		    }
//		    boards.push({id: this.id, url: props.url});
//		    if (++count === len) {
//			res.json(boards);
//		    }
		});
	    });
	});
    });
    socket.on('eventDraw',function(location,data){
	var url = location.replace("/", "");
	ko = new Date();
	ji = ko.getTime();
	socket.broadcast.to(url).emit('eventDraw',data);
    });
});