
/**
 * Module dependencies.
 */

var express = require('express')
, Resource = require('express-resource')
, routes = require('./routes');

var Nohm = require('nohm').Nohm;
var BoardModel = require(__dirname+'/BoardModel.js');
var ShapesModel = require(__dirname+'/ShapesModel.js');
var redis = require("redis")
, redisClient = redis.createClient(); //go thru redis readme for anyother config other than default: localhost 6379
redisClient.select(4);
Nohm.setPrefix('matisse'); //setting up app prefix for redis
Nohm.setClient(redisClient);

//logging
Nohm.logError = function (err) {
    console.log("===============");
    console.log(err);
    console.log("===============");
};

redisClient.on("error", function (err) {
    console.log("Error %s", err);
});

var app = module.exports = express.createServer()
, io = require('socket.io').listen(app);

var ddd = '{"id":1,"pallette":"basic_shapes","action":"rectangle","args":"[{\"left\":194,\"top\":168,\"width\":200,\"height\":100,\"scaleX\":200,\"scaleY\":100,\"fill\":\"#FF0000\",\"stroke\":\"#00FF00\",\"angle\":0,\"uid\":1324292323410,\"name\":\"rectangle\",\"pallette\":\"basic_shapes\"}]"}';

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
	
	ShapesModel.find(function (err, ids) {
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
	    var board = new ShapesModel();
		board.load(id, function (err, props) {
		    if (err) {
			return next(err);
		    }
		    boards.push({id: this.id, pallette: props.pallette, action: props.action, args: props.args, board_url: props.board_url});
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
		ShapesModel.find({board_url:wb_url}, function (err, ids) {
			if (err) {
				console.log(err);
			}
			var boards = [];
			var len = ids.length;
			var count = 0;
			if (len === 0) {
			console.log("::::::: "+boards);
			}
			console.log(ids);
			ids.forEach(function (id) {
			var board = new ShapesModel();
			board.load(id, function (err, props) {
				if (err) {
				return next(err);
				}
				boards.push({id: this.id, pallette: props.pallette, action: props.action, args: props.args});
			
				if (++count === len) 
				{
					//res.json(boards);
					console.log("::::::: ");
					//socket.emit('eventDraw',boards);
				}
				socket.emit('eventDraw',eval({pallette: props.pallette, action: props.action, args: [props.args]}));

			});
			});
		}); 	
    });
    
	
	socket.on('eventDraw',function(location,data){
	//console.log(data);
	var url = location.replace("/", "");
	ko = new Date();
	ji = ko.getTime();
	
	socket.broadcast.to(url).emit('eventDraw',data);	
	
	var newShape = new ShapesModel();
	
	data.args = data.args[0];	
	data.shapeId = data.args.uid;
	data.board_url = url;
	
	
	
	//console.log("===================");
	//console.log(data.args.uid);
	//console.log("===================");
	
	newShape.store(data,function(err){
		//console.log("***** Error in URL:"+url+" Err:"+err);
    });
    });
});
