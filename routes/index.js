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
	var userObj = new UserModel();
	var userID = userObj.getUserID(session_data);
	if (typeof(userID) != "undefined") {
	    console.log("step1");
	    dbUserID = "google- "+userID;
	    var loggedInUser = new UserModel();
	    loggedInUser.find({userID:dbUserID}, function(err,ids) {
		if (err){
		    console.log(":" + err);
		    res.render('index', { title:'Matisse'  })
		}
		else{
		    
		    loggedInUser.load(ids[0], function (err, props) {
			if (err) {
			    console.log("step2");
			    console.log("::" + err);
			    res.render('index', { title:'Matisse'  })
			    
			} else {                         
			    console.log("step2");
			    console.log(":::" + props);			
			    loggedInUser.numLinks('Board', 'ownedBoard', function (err, num) {
				if (err) {
				    console.log("::::" + err);
				    console.log("step3");
				    res.render('index', { title:'Matisse'  })
				}
				else {
				    console.log("step3");
				    loggedInUser.createdNum = num;
				    if (typeof(loggedInUser.createdNum) == "undefined") loggedInUser.createdNum = 0;
				    loggedInUser.getAll('Board', 'ownedBoard', function (err, boardIds) {
					if (err) {
					    console.log("step4");
					    console.log("::::" + err);
					    res.render('index', { title:'Matisse'  })
					}
					else {
					    console.log("step4");
					    var boards = [];
					    var len = boardIds.length;
					    var count = 0;
					    if (len === 0) {} else {
						boardIds.forEach(function (id) {
						    var board = new BoardModel();
						    board.load(id, function (err, props) {
							if (err) {
							    console.log("::::::" + err);
							    res.render('index', { title:'Matisse'  })
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
						    console.log(":::||||" + err);
						    res.render('index', { title:'Matisse'  })
						}
						else {
						    console.log("step5");
						    loggedInUser.sharedNum = num;
						    if (typeof(loggedInUser.sharedNum) == "undefined") loggedInUser.sharedNum = 0;

						    
						    

						    loggedInUser.getAll('Board', 'sharedBoard', function (err, boardIds) {
							if (err) {
							    console.log(err);
							    res.render('index', { title:'Matisse'  })
							}
							else {
							    console.log("step6");
							    var sb_len = boardIds.length;
							    var sb_count = 0;
							    if (sb_len === 0) {
								console.log("========================");
								if (typeof(sharedboards) == "undefined")  {
								    sharedboards = []; 
								} else {
								    sharedboards = sharedboards;
								}

								res.render('index', { title:'Matisse', createdNum: loggedInUser.createdNum, sharedNum: loggedInUser.sharedNum, ownedBoards:  loggedInUser.ownedBoards, sharedBoards: sharedboards});
								console.log("========================");
							    } else {
								var sharedboards = [];
								boardIds.forEach(function (id) {
								    console.log("step7");
								    console.log(id);
								    var board = new BoardModel();
								    board.load(id, function (err, props) {
									if (err) {
									    console.log(err);
									    res.render('index', { title:'Matisse'  })
									}
									else {
									    sharedboards.push({
										id: this.id,
										url: props.url,
										name: props.name,
										container: props.container,
										canvasWidth: props.canvasWidth,
										canvasHeight: props.canvasHeight
									    });
									    console.log(sharedboards);
									    loggedInUser.sharedBoards = sharedboards;
									    console.log(loggedInUser.sharedBoards);
									    if (sharedboards.length == boardIds.length) {
										var sharedBoard;
										if (typeof(sharedboards) == "undefined")  {
										    sharedboards = []; 
										} else {
										    sharedboards = sharedboards;
										}
										res.render('index', { title:'Matisse', createdNum: loggedInUser.createdNum, sharedNum: loggedInUser.sharedNum, ownedBoards:  loggedInUser.ownedBoards, sharedBoards: sharedboards});
									    }
									}
								    });
								    
								});
							    }
							}
						    });
						}		   
					    });
					}
				    });
				}
			    });
			}
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
		var userObj = new UserModel();
		var userID = userObj.getUserID(session_data);
		dbUserID = "google- "+userID;
		userObj.linkBoard(whiteBoard, dbUserID);
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