collaboration = module.exports = {
	boardModel: require(__dirname + '/../models/BoardModel.js'),
	shapesModel: require(__dirname + '/../models/ShapesModel.js'),
	events: {		
		setUrl: function (location, data) {	
			var socket = this;
			var wb_url = location.replace("/", "");
			var randomnString = wb_url.substr(wb_url.indexOf('/') + 1);
			socket.join(wb_url);
			findInBoardModel(randomnString, socket);
			findInShapesModel(wb_url, socket);
		},
		setContainer: function (location, data) {
			console.log("location: "+location);
			var wb_url = location.replace("/", "");
			console.log("wb_url: "+wb_url);
			var randomnString = wb_url.substr(wb_url.indexOf('/') + 1);
			console.log("randomnString: "+randomnString);
			findInBoardModelforSetContainer(randomnString, wb_url, data);				
		},
		eventDraw: function (location, data) {
			var socket = this;
			var url = location.replace("/", "");
			drawOnBoard(url, data, socket);			
		}
	},
	collaborate: function (io, getUserInfo) {
		var thisObj = this;
		io.sockets.on('connection', function (socket) {
			var userInfo = getUserInfo.call(this);
			//var setUrl = thisObj.events["setUrl"];
			socket.emit('eventConnect', {
				message: 'welcome'
			});
			socket.emit('userInfo', userInfo);

			socket.on("setUrl", thisObj.events["setUrl"]);
			socket.on("setContainer", thisObj.events["setContainer"]);
			socket.on('eventDraw', thisObj.events["eventDraw"]);
		});
	}
}

var findInBoardModel = function(randomStr, socket) {
	var BoardModel = collaboration.boardModel;
	BoardModel.find({url:randomStr},function (err, ids) {
		if (err) {
			console.log(err);
		} else {
			ids.forEach(function (id) {
				var board = new BoardModel();
				board.load(id, function (err, props) {
					if (err) {
						return next(err);
					} else {                         
						//console.log(":::" + props.container);
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
};

var findInShapesModel = function(boardUrl, socket) {
	var ShapesModel = collaboration.shapesModel;
	ShapesModel.find({board_url: boardUrl}, function (err, ids) {
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
};

var findInBoardModelforSetContainer = function (randomnString, wb_url, data) {
	var BoardModel = collaboration.boardModel;
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
}

var drawOnBoard = function (url, data, socket) {
	if (data.action != "clearText") {
		var ShapesModel = collaboration.shapesModel;
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
}