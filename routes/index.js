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
          var loggedInUser = new UserModel();
          loggedInUser.find({userID:userID}, function(err,ids) {
            if (err){
              console.log(":" + err);
              res.render('index', { title:'Matisse'  })
            }
            else{
              loggedInUser.load(ids[0], function (err, props) {
                if (err) {
                  console.log("::" + err);
                  res.render('index', { title:'Matisse', createdNum: 0, sharedNum: 0, ownedBoards:  [], sharedBoards: []  })
                } else {                         
                  loggedInUser.numLinks('Board', 'ownedBoard', function (err, num) {
                    if (err) {
                      console.log("::::" + err);
                      res.render('index', { title:'Matisse' , createdNum: 0, sharedNum: 0, ownedBoards:  [], sharedBoards: []  })
                    }
                    else {
                      loggedInUser.createdNum = num;
                        if (typeof(loggedInUser.createdNum) == "undefined") loggedInUser.createdNum = 0;
                          loggedInUser.getAll('Board', 'ownedBoard', function (err, boardIds) {
                            if (err) {
                              console.log("::::" + err);
                              res.render('index', { title:'Matisse'  , createdNum: loggedInUser.createdNum, sharedNum: 0, ownedBoards:  [], sharedBoards: [] }) 
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
                                      console.log("::::::" + err);
                                      res.render('index', { title:'Matisse'  , createdNum: 0, sharedNum: 0, ownedBoards:  [], sharedBoards: [] })
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
	  			                          res.render('index', { title:'Matisse' , createdNum: 0, sharedNum: 0, ownedBoards:  [], sharedBoards: []  })
						                      }
						                      else {
   				                          loggedInUser.sharedNum = num;
	 				                          if (typeof(loggedInUser.sharedNum) == "undefined") loggedInUser.sharedNum = 0;
                                      loggedInUser.getAll('Board', 'sharedBoard', function (err, boardIds) {
  					                            if (err) {
  				                                console.log(err);
						                              res.render('index', { title:'Matisse' , createdNum: 0, sharedNum: 0, ownedBoards:  [], sharedBoards: []  })
   							                       }
	   						                       else {
		   					                         var sb_len = boardIds.length;
			   				                         var sb_count = 0;
				   			                         if (sb_len === 0) {
					   			                         if (typeof(sharedboards) == "undefined")  {
						   		                           sharedboards = []; 
							   	                         } else {
                                             sharedboards = sharedboards;
								                            }
                                            res.render('index', { title:'Matisse', createdNum: loggedInUser.createdNum, sharedNum: loggedInUser.sharedNum, ownedBoards:  loggedInUser.ownedBoards, sharedBoards: sharedboards});
							                              } else {
								                            var sharedboards = [];
								                            boardIds.forEach(function (id) {
  						                              var board = new BoardModel();
	   						                           board.load(id, function (err, props) {
		   					                             if (err) {
	                                              console.log(err);
	                                              res.render('index', { title:'Matisse' , createdNum: 0, sharedNum: 0, ownedBoards:  [], sharedBoards: []  })
						   			                         }
  						   	                           else {
								   	                           sharedboards.push({
									   	                           id: this.id,
										                              url: props.url,
										                              name: props.name,
										                              container: props.container,
										                              canvasWidth: props.canvasWidth,
										                              canvasHeight: props.canvasHeight,
										                              createdBy: props.createdBy
									                              });
									                              loggedInUser.sharedBoards = sharedboards;
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
          res.render('index', { title:'Matisse'})
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
        
        var session_data = req.session.auth;
		var userObj = new UserModel();
		var userID = userObj.getUserID(session_data);
		
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
        var data = {
            url:randomstring,
	    container: req.body.container,
	    canvasWidth: req.body.canvasWidth,
	    canvasHeight: req.body.canvasHeight,
	    name: req.body.whiteboardName,
	    createdBy: userID
        };
        var whiteBoard = new BoardModel();
        console.log("created by: " + data.createdBy);
        whiteBoard.store(data, function (err) {
            if (err === 'invalid') {
		next(whiteBoard.errors);
	    } else if (err) {
		next(err);
	    } else {
		
		userObj.linkBoard(whiteBoard, userID);
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
