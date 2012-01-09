var matisse = {
	connectHandler: function(data){
		this.onConnect(data);
	},
	drawHandler: function(data){
		this.onDraw(data);
	},
	sendDrawMsg: function(data){
	        var loc = document.location.pathname;
	        socket.emit("eventDraw",loc,data);
	},
	onDraw: function(data){
		//Dummy method must override
		console.log(data);
	},
	onConnect: function(data){
	        var loc = document.location.pathname;
	        socket.emit("setUrl",loc,data);
	        //Dummy method must override
	        console.log(data);
 	        console.log(loc);
	},
	saveImage: function(data) {
		var img = data;
		console.log("new draw event received--");
		// strip off the data: url prefix to get just the base64-encoded bytes
		var data = img.replace(/^data:image\/\w+;base64,/, "");
		var loc = document.location.pathname;
		//var buf = new Buffer(data, 'base64');
		socket.emit("saveImage",loc,data);
	}
};
var socket = io.connect('http://localhost'); //change it to server ip or local ip for testing from other machines
socket.on("eventDraw", function(data){
	console.log("new draw event received--");
	matisse.drawHandler(data);
});
socket.on('eventConnect', function (data) {
	console.log("We are now connected");
	matisse.connectHandler(data);	
});
