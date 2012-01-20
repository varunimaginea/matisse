/**
* About this : Client side socket connection and communicaiton handler
 * 
 * 
*/
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
			this.socket.emit("eventDraw",loc,data);
		},
		onDraw: function(data){
			//Dummy method must override
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
