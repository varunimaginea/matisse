
define(["matisse", "matisse.util"],function(matisse, util) {
	 var com = {
		connectHandler: function(data){
			this.onConnect(data);
		},
		drawHandler: function(data){
			this.onDraw(data);
		},
		sendDrawMsg: function(data){
			var loc = document.location.pathname;
			console.log("socket emit ");
			this.socket.emit("eventDraw",loc,data);
		},
		onDraw: function(data){
			//Dummy method must override
			console.log("DRAW from com.js");
			/**
			*  Called when other users add, modify or delete any object
			*  @method  matisse.onDraw
			*  @param data - shape(data.shape) and args array (data.args)
			*
			*/
			if (data && data.args) {
				if (data.action == undefined || data.action == null) {
					return;
				}
				if (data.action == "modified") {
					matisse.main.modifyObject(data.args)
				} else if (data.action == "modifiedbyvalue") {
					matisse.main.setObjectProperty(data.args[0]);
				} else if (data.action == "drawpath") {
					matisse.main.drawPath(data.args[0])
				} else if (data.action == "chat") {
					var txt = document.createTextNode(data.args[0].text)
					$("#chattext").append(txt);
				} else if (data.action == "delete") {
					var obj = util.getObjectById(data.args[0].uid);
					canvas.remove(obj);
					$('#prop').remove();
				} else if (data.action == "importimage") {
					matisse.main.loadImage(data.args[0]);
				} else {
					if (matisse.palette[data.palette] != undefined) {
						matisse.palette[data.palette].shapes[data.action].toolAction.apply(this, data.args);
					}
				}
			}
		},
		onConnect: function(data){
			var loc = document.location.pathname;
			this.socket.emit("setUrl",loc,data);
		},
		init: function(){
			var socket = io.connect('http://localhost'); //change it to server ip or local ip for testing from other machines
			socket.on("eventDraw", function(data){
				com.drawHandler(data);
			});
			socket.on('eventConnect', function (data) {
				console.log("We are now connected");
				com.connectHandler(data);	
			});
			this.socket = socket;
		}
	};
	com.init();
	return com;
});
