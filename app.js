
/**
 * Module dependencies.
 */

var redis = require("redis")
, redis_client = redis.createClient(); //go thru redis readme for anyother config other than default: localhost 6379

redis_client.on("error", function (err) {
    console.log("Error %s", err);
});


var express = require('express')
, Resource = require('express-resource')
, routes = require('./routes')

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

app.get('/', routes.index);

app.get('/html', function (req, res) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 8;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
	var rnum = Math.floor(Math.random() * chars.length);
	randomstring += chars.substring(rnum,rnum+1);
    }
    res.writeHead(302, {
	'Location': randomstring
    });
    res.end();
});

app.resource({
    show: function(req, res){
	res.sendfile(__dirname + '/index.html');
    }
});

app.listen(8000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

io.sockets.on('connection', function (socket) {
    socket.emit('eventConnect',{message:'welcome'});
 
//    console.log("====================");
//    console.log(socket);
//    console.log("====================");
socket.emit('eventConnect',{message:'welcome'});
socket.on("setUrl",function(location,data){
   var url = location.replace("/", "");
  //  ko = new Date();
  //  ji = ko.getTime();
//    socket.broadcast.emit("eventDraw",data);
//    redis_client.hset([url, socket.id+"#"+ji, data], redis.print);

    //     console.log("++++++++------------");
    //     console.log(data);
    //     console.log(location);
    //    console.log("++++++++-----------");
    //     console.log("++++++++++++++++++++");
    //     console.log(url);
    //     console.log("++++++++++++++++++++");
    //     console.log("----------------------");
    //     console.log(data);
    //     console.log("----------------------");
    
    socket.join(url);
    redis_client.hkeys(url, function (err, replies) {

	console.log("++++++++++++++++++++");
        console.log(replies.length + " replies:");
	console.log("++++++++++++++++++++");
        replies.forEach(function (reply, i) {

//socket.emit("eventDraw",reply.data);
	    console.log("    " + i + ": " + reply);
redis_client.hgetall(reply, function (err, obj) {
    console.dir(obj);
    socket.emit("eventDraw",obj);
    console.dir(obj);
});
        });
//	redis_client.quit();
    });
});

socket.on('eventDraw',function(location,data){
    //     console.log("@@@@@@@@@@@@@@@@@@@@@");
    //     console.log(location);
    var url = location.replace("/", "");
    //     console.log(url);
    //     console.log("@@@@@@@@@@@@@@@@@@@@@");
    //     console.log("%%%%%%%%%%%%%%%%%%%%%");
    //     console.log(data);
    //     console.log("%%%%%%%%%%%%%%%%%%%%%");
    //	console.log("%%%%%%%%%%%%%%%%%%%%%");
    //	console.log(io.sockets);
    //	console.log("%%%%%%%%%%%%%%%%%%%%%");
    //	console.log("@@@@@@@@@@@@@@@@@@@@@");
    //	console.log(socket);
    //	console.log("@@@@@@@@@@@@@@@@@@@@@");
    //	delete io.sockets(socket.id);
    ko = new Date();
    ji = ko.getTime();
//    socket.broadcast.emit("eventDraw",data);
    redis_client.hset([url, socket.id+"#"+ji, "test value"], redis.print);
    redis_client.hmset(socket.id+"#"+ji, data,redis.print);

    //     console.log("++++++++------------");
    //     console.log(data);
    //     console.log(location);
    //    console.log("++++++++-----------");
    //     console.log("++++++++++++++++++++");
    //     console.log(url);
    //     console.log("++++++++++++++++++++");
    //     console.log("----------------------");
    //     console.log(data);
    //     console.log("----------------------");
    
    socket.broadcast.to(url).emit('eventDraw',data);
    //io.sockets.in(url).emit("eventDraw",data);
});
});


//io.sockets.on('connection', function (socket) {
//  socket.emit('eventConnect',{message:'welcome'});
//socket.on('eventDraw',function(data){
//      socket.join();
//        socket.broadcast.emit("eventDraw",data);
//  });
//});