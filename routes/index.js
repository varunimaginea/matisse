var BoardModel = require(__dirname + '/../models/BoardModel.js');
var ShapesModel = require(__dirname + '/../models/ShapesModel.js');
var UserModel = require(__dirname + '/../models/UserModel.js');

/*
 * GET home page.
 */

exports.index = function (req, res) {
    var session_data = req.session.auth;
    var createdNum;
    if (session_data) {
	if (typeof(session_data.twitter) != "undefined") {
	    userID = session_data.twitter.user.id;
	}
	else if (session_data.facebook) {
	    userID = session_data.facebook.user.id;
	}
	else if (session_data.google) {
	    userID = session_data.google.user.id;
	}
	if (typeof(userID) != "undefined") {
	    dbUserID = "google- "+userID;
	    var loggedInUser = new UserModel();
	    loggedInUser.find({userID:dbUserID}, function(err,ids) {
		if (err){
		}
		else{
		    loggedInUser.load(ids[0], function (err, props) {
			if (err) {
			    console.log(":::" + err);

			} else {                         
			    
			    console.log(":::" + props);
			}
			
			loggedInUser.numLinks('Board', 'ownedBoard', function (err, num) {
			    if (err) {
				console.log(err);
			    }
			    else {
				loggedInUser.createdNum = num;
				if (typeof(loggedInUser.createdNum) == "undefined") loggedInUser.createdNum = 0;
				loggedInUser.getAll('Board', 'ownedBoard', function (err, boardIds) {
				    if (err) {
					console.log(err);
				    }
				    else {
					var boards = [];
					var len = boardIds.length;
					var count = 0;
					if (len === 0) {} else {
					    boardIds.forEach(function (id) {
						var board = new BoardModel();
						board.load(id, function (err, props) {
						    if (err) {
							console.log(err);
						    }
						    boards.push({
							id: this.id,
							url: props.url,
							name: props.name,
							container: props.container,
							canvasWidth: props.canvasWidth,
							canvasHeight: props.canvasHeight
						    });
						});
					    });
					}
					loggedInUser.ownedBoards = boards;
					loggedInUser.numLinks('Board', 'sharedBoard', function (err, num) {
					    if (err) {
						console.log(err);
					    }
					    else {
						loggedInUser.sharedNum = num;
						if (typeof(loggedInUser.sharedNum) == "undefined") loggedInUser.sharedNum = 0;
						loggedInUser.getAll('Board', 'sharedBoard', function (err, boardIds) {
						    if (err) {
							console.log(err);
						    }
						    else {
							var sharedboards = [];
							var len = boardIds.length;
							var count = 0;
							if (len === 0) {} else {
							    boardIds.forEach(function (id) {
								var board = new BoardModel();
								board.load(id, function (err, props) {
								    if (err) {
									console.log(err);
								    }
								    sharedboards.push({
									id: this.id,
									url: props.url,
									name: props.name,
									container: props.container,
									canvasWidth: props.canvasWidth,
									canvasHeight: props.canvasHeight
								    });
								    loggedInUser.sharedBoards = sharedboards;
								});
								console.log(loggedInUser);
							    });
							    console.log(loggedInUser.sharedboards);
							    res.render('index', { title:'Matisse', createdNum: loggedInUser.createdNum, sharedNum: loggedInUser.sharedNum, ownedBoards:  loggedInUser.ownedBoards, sharedBoards: loggedInUser.sharedBoards})

							}
						    }
						});
					    }
					});
				    }
				});
			    }
			});
		    });
		}
	    });  
	}
	
    }
    
    else {
	res.render('index', { title:'Matisse'  })
    }
};

exports.favicon = function (req, res, next) {
    
}

/*
 * The function for boards
 */

exports.boards = {
    index:function (req, res, next) {
	var chars = "0123456789abcdefghiklmnopqrstuvwxyz";
        var string_length = 8;
        randomstring = '';

        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
        var data = {
            url:randomstring,
	    container: req.body.container,
	    canvasWidth: req.body.canvasWidth,
	    canvasHeight: req.body.canvasHeight,
	    name: req.body.whiteboardName
        };
        var whiteBoard = new BoardModel();
        whiteBoard.store(data, function (err) {
            if (err === 'invalid') {
		next(whiteBoard.errors);
	    } else if (err) {
		next(err);
	    } else {
		var session_data = req.session.auth;
		if (session_data.twitter) {
		    var userID = session_data.twitter.user.id;
		}
		else if (session_data.facebook) {
		    var userID = session_data.facebook.user.id;
		}
		else if (session_data.google) {
		    var userID = session_data.google.user.id;
		}
		dbUserID = "google- "+userID;
		UserModel.find({userID:dbUserID}, function(err,ids) {
		    if (err){
		    }
		    else{
			var user = new UserModel;
			user.load(ids[0], function (err, props) {
			    if (err) {
				return err;
			    } else {                         
				
				console.log(":::" + props);
			    }
			    whiteBoard.load(whiteBoard.id, function(id) {
			    });
			    user.link(whiteBoard, 'ownedBoard');
			    user.save(function(err) {
				if (err) {
				    console.log(err);
				}
				else {
				    console.log("relation is saved");
				}				    
			    });
			});  
		    }
		});
		res.writeHead(302, {
		    'Location':randomstring
		});
		res.end();

	    }
	});
    }
}

/*
 * For exposing things as aan API
 */
exports.api = {
    index:function (req, res, next) {
        ShapesModel.find(function (err, ids) {
            if (err) {
                return next(err);
            }
            var shapes = [];
            var len = ids.length;
            var count = 0;
            if (len === 0) {
                return res.json(shapes);
            }
            ids.forEach(function (id) {
                var shape = new ShapesModel();
                shape.load(id, function (err, props) {
                    if (err) {
                        return next(err);
                    }
                    shapes.push({
                        id:this.id,
                        palette:props.palette,
                        action:props.action,
                        args:props.args,
                        board_url:props.board_url
                    });
                    if (++count === len) {
                        res.json(shapes);
                    }
                });
            });
        });
    }
}