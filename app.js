/**
 * Module dependencies.
 */
var express = require('express'),
    Resource = require('express-resource'),
    routes = require('./routes'),
    everyauth = require('everyauth'),
    conf = require('./conf');

var Nohm = require('nohm').Nohm;
var BoardModel = require(__dirname + '/models/BoardModel.js');
var ShapesModel = require(__dirname + '/models/ShapesModel.js');
var UserModel = require(__dirname + '/models/UserModel.js');
var redis = require("redis"),
    redisClient = redis.createClient(); //go thru redis readme for anyother config other than default: localhost 6379
redisClient.select(4);
Nohm.setPrefix('matisse'); //setting up app prefix for redis
Nohm.setClient(redisClient);

//-------------------- EveryAuth START---------------------------------//
var usersById = {};
var nextUserId = 0;
var usersByTwitId = {};
var usersByFBId = {};
var usersByGoogleId = {};
var userInfo = {};

everyauth.twitter.consumerKey(conf.twit.consumerKey).consumerSecret(conf.twit.consumerSecret).findOrCreateUser(function (sess, accessToken, accessSecret, twitUser) {
    var userDetails = usersByTwitId[twitUser.id] || (usersByTwitId[twitUser.id] = addUser('twitter', twitUser));
    userInfo = userDetails;

    var data = {
        userID: "twitter-" + userDetails.twitter.id
    };
    var newUser = new UserModel();
    newUser.store(data, function (err) {
        if (!err) console.log("saved new user to DB");
        else console.log("Could not Save user, possibly exist in DB");
    });
    return userDetails;
}).redirectPath('/');


everyauth.facebook.appId(conf.fb.appId).appSecret(conf.fb.appSecret).scope('email,user_status').findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadata) {
	var userDetails = usersByFBId[fbUserMetadata.id] || (usersByFBId[fbUserMetadata.id] = addUser('facebook', fbUserMetadata));
	userInfo = userDetails;
	//console.log(userDetails);
	
    var data = {
        userID: "fb-" + userDetails.facebook.id
    };
	
    var newUser = new UserModel();
    newUser.store(data, function (err) {
        if (!err) console.log("saved new user to DB");
        else console.log("Could not Save user, possibly exist in DB");
    });
	
	return userDetails;
  })
  .redirectPath('/');



everyauth.google.appId(conf.google.clientId).appSecret(conf.google.clientSecret).scope('https://www.googleapis.com/auth/userinfo.profile').findOrCreateUser( function (session, accessToken, accessTokExtra, googleUserMetadata) {
	var userDetails = usersByGoogleId[googleUserMetadata.id] || (usersByGoogleId[googleUserMetadata.id] = addUser('google', googleUserMetadata));
	userInfo = userDetails;
	
    var data = {
        userID: "google-" + userDetails.google.id
    };
	
    var newUser = new UserModel();
    newUser.store(data, function (err) {
        if (!err) console.log("saved new user to DB");
        else console.log("Could not Save user, possibly exist in DB");
    });
	
	return userDetails;
  })
  .redirectPath('/');
  

function addUser(source, sourceUser) {
    var user;
    if (arguments.length === 1) { // password-based
        user = sourceUser = source;
        user.id = ++nextUserId;
        return usersById[nextUserId] = user;
    } else { // non-password-based
        user = usersById[++nextUserId] = {
            id: nextUserId
        };
        user[source] = sourceUser;
    }
    return user;
}

everyauth.debug = true;

//-------------------- EveryAuth END---------------------------------//
//logging
Nohm.logError = function (err) {
    console.log("===============");
    console.log(err);
    console.log("===============");
};

redisClient.on("error", function (err) {
    console.log("Error %s", err);
});

var app = module.exports = express.createServer(),
    io = require('socket.io').listen(app);


// Configuration
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'foobar'
    }));
    app.use(express.bodyParser());
    app.use(everyauth.middleware());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    everyauth.helpExpress(app);
});

app.configure('development', function () {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/favicon', exports.favicon);

app.get('/boards', routes.boards);

app.resource('api', routes.api);
app.resource('boards', {
    show: function (req, res, next) {
        console.log("------------------ Opening a board ------------------");
        if (req.params.id != "favicon") {
            res.sendfile(__dirname + '/board.html');
        }
    }
});


app.use(function (err, req, res, next) {
    if (err instanceof Error) {
        err = err.message;
    }
    res.json({
        result: 'error',
        data: err
    });
});

app.listen(8000);
console.log("Matisse server listening on port %d in %s mode", app.address().port, app.settings.env);

io.sockets.on('connection', function (socket) {
    socket.emit('eventConnect', {
        message: 'welcome'
    });
    socket.emit('userInfo', userInfo);
    socket.on("setUrl", function (location, data) {		
        var wb_url = location.replace("/", "");
        var randomnString = wb_url.substr(wb_url.indexOf('/') + 1);
        socket.join(wb_url);

        BoardModel.find({url:randomnString},function (err, ids) {
            if (err) {
                console.log(err);
            } else {
                ids.forEach(function (id) {
                    var board = new BoardModel();
                    board.load(id, function (err, props) {
                        if (err) {
                            return next(err);
                        } else {                         
							console.log(":::" + props.container);
							if (props.container == undefined || props.container == "") {
								socket.emit('containerDraw', "empty");
							} else {
								socket.emit('containerDraw', props);
							}
                        }
                    });
                });
            }
        });


        ShapesModel.find({board_url: wb_url}, function (err, ids) {
            if (err) {
                console.log(err);
            }
            var boards = [];
            var len = ids.length;
            var count = 0;
            if (len === 0) {} else {
                ids.forEach(function (id) {
                    var board = new ShapesModel();
                    board.load(id, function (err, props) {
                        if (err) {
                            return next(err);
                        }
                        boards.push({
                            id: this.id,
                            palette: props.palette,
                            action: props.action,
                            args: props.args
                        });

                        if (++count === len) {
                            //socket.emit('eventDraw',boards);
                        }
                        socket.emit('eventDraw', eval({
                            palette: props.palette,
                            action: props.action,
                            args: [props.args]
                        }));

                    });
                });
            }
        });
    });

    socket.on("setContainer", function (location, data) {
		console.log("location: "+location);
        var wb_url = location.replace("/", "");
		console.log("wb_url: "+wb_url);
        var randomnString = wb_url.substr(wb_url.indexOf('/') + 1);
		console.log("randomnString: "+randomnString);
        BoardModel.find({url:randomnString},function (err, ids) {
            if (err) {
                console.log(err);
            } else {
                ids.forEach(function (id) {
                    var board = new BoardModel();
                    board.load(id, function (err, props) {
                        if (err) {
                            return next(err);
                        } else {
                                console.log("updating");
                                props.container = data.containerName;
								props.canvasWidth = data.canvasWidth;
								props.canvasHeight = data.canvasHeight;
                                board.store(props, function (err) {
									console.log("Added container to your board successfully!");
									if(err)
									{
										console.log("***** Error in updating container for URL:"+wb_url+" Err:"+err);
									}	
                                });
                        }
                    });
                });
            }
        });
    });

    socket.on('eventDraw', function (location, data) {
        console.log(data);
        var url = location.replace("/", "");
        ko = new Date();
        ji = ko.getTime();

        if (data.action != "clearText") {
            var newShape = new ShapesModel();
            socket.broadcast.to(url).emit('eventDraw', data);
            data.args = data.args[0];
            data.shapeId = data.args.uid;
            data.board_url = url;

            if (data.action == "modified" || data.action == "zindexchange") {
                data.args = data.args.object;
                ShapesModel.find({
                    shapeId: data.shapeId
                }, function (err, id) {
                    if (err) {
                        console.log(err);
                    }
                    var shape = new ShapesModel();
                    shape.load(id, function (err, props) {
                        if (err) {
                            //return next(err);
                        }

                        data.args.name = props.args.name;
                        data.args.uid = props.shapeId;
                        data.args.palette = props.palette;
                        data.palette = props.palette;
                        data.action = props.action;
                        shape.store(data, function (err) {
                            //console.log("***** Error in URL:"+url+" Err:"+err);
                        });
                        socket.broadcast.to(url).emit('eventDraw', shape);
                    });
                });
            } else if (data.action == "delete") {
                ShapesModel.find({
                    shapeId: data.shapeId
                }, function (err, id) {
                    if (err) {
                        console.log(err);
                    }
                    var shape = new ShapesModel();
                    shape.load(id, function (err, props) {
                        if (err) {
                            //return next(err);
                        }

                        shape.delete(data, function (err) {
                            console.log("***** Error while deleting ID:" + id + " errr:" + err);
                        });

                    });
                });

            } else {
                newShape.store(data, function (err) {});
                socket.broadcast.to(url).emit('eventDraw', newShape);
            }
        }
    });

});