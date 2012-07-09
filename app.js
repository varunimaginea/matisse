/**
 * Module dependencies.
 */
application = (function () {
    var express = require('express');
    var Resource = require('express-resource');
    var routes = require('./routes');
    var everyauth = require('everyauth');
    var collaboration = require('./server/collaboration');
    var login = require('./server/login');
    //compress the static content
    var gzippo = require('gzippo');

    var Nohm = require('nohm').Nohm;
    var BoardModel = require(__dirname + '/models/BoardModel.js');
    var ShapesModel = require(__dirname + '/models/ShapesModel.js');
    var UserModel = require(__dirname + '/models/UserModel.js');
    var redis = require("redis");
    var redisClient = redis.createClient(); //go thru redis readme for anyother config other than default: localhost 6379
    var userInfo = {};
    redisClient.select(4);
    Nohm.setPrefix('matisse'); //setting up app prefix for redis
    Nohm.setClient(redisClient);

    var setUserDetails = function (details) {    // set the user details once the user logs in
        userInfo = details;
    };
    var getUserDetails = function () {  // get the user details
        return userInfo;
    };
    login.authenticate(setUserDetails);
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

    var configure = function () {
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.cookieParser());
        app.use(express.session({
            secret:'foobar'
        }));
        app.use(express.bodyParser());
        app.use(everyauth.middleware());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(gzippo.staticGzip(__dirname + '/public'));
        everyauth.helpExpress(app);
    };

    var development = function () {
        app.use(express.errorHandler({
            dumpExceptions:true,
            showStack:true
        }));
    };

    var production = function () {
        app.use(express.errorHandler());
    }

    var use = function (err, req, res, next) {
        if (err instanceof Error) {
            err = err.message;
        }
        res.json({
            result:'error',
            data:err
        });
    }
    // Configuration
    app.configure(configure);
    app.configure('development', development);
    app.configure('production', production);

    // Routes
    app.get('/', routes.index);
    app.get('/favicon', exports.favicon);
    app.get('/boards', routes.boards.index);
    app.resource('api', routes.api);
    app.post('/boards', routes.boards.index);
    app.get('/about', function (req, res, next) {
	res.sendfile(__dirname + '/about.html');
    });

    app.resource('boards', {
        show:function (req, res, next) {
          if (req.loggedIn) {
            if (req.params.id != "favicon") {
              var whiteBoard = new BoardModel();
                whiteBoard.find({url: req.params.board.replace(/[^a-zA-Z 0-9]+/g,'')}, function (err, ids) {
                if (err) {
                    console.log(err);
                    res.writeHead(302, {
                      'Location': 'http://'+req.headers.host
                    });
                    res.end();
                }
                else {
                  if (ids.length != 0) {
                  var session_data = req.session.auth;
                  var userObj = new UserModel();
                  var userID = userObj.getUserID(session_data);
                  whiteBoard.load(ids[0], function(id) {
                  });
                  UserModel.find({userID:userID}, function(err,ids) {
                    if (err){
                    }
                    else{
                      var user = new UserModel;
                        user.load(ids[0], function (err, props) {
                        if (err) {
                          return err;
                        } else {
                        }
                        user.belongsTo(whiteBoard, 'ownedBoard', function(err, relExists) {
                          if (relExists) {
                          }
                          else {
                            user.link(whiteBoard, 'sharedBoard');
                            user.save(function(err) {
                              if (err) {
                                console.log(err);
                              }
                              else {
                                console.log("relation is saved");
                              }
                            });
                          }
                        });
                        });
                    }
                  });
                  var session_user = userObj.getUserFromSession(session_data);
                  setUserDetails(session_user);
                  res.sendfile(__dirname + '/board2.html');
                  }
                  else {
                    res.writeHead(302, {
                      'Location': 'http://'+req.headers.host
                    });
                    res.end();
                  }
                }
                });
            }
          }
          else {
            res.writeHead(302, {
                'Location': 'http://'+req.headers.host
            });
            req.session.redirectPath = req.url;
            res.end();
          }
        }
    });
    
    app.use(use);
    app.listen(8000);
    io.configure('production', function(){
      io.set('transports', ['xhr-polling']);
    });
    console.log("Matisse server listening on port %d in %s mode", app.address().port, app.settings.env);

    collaboration.collaborate(io, getUserDetails);
}).call(this);
