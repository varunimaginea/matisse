var matisse = {
    connectHandler: function(data){
	this.onConnect(data);
    },
    drawHandler: function(data){
	this.onDraw(data);
    },
    sendDrawMsg: function(data){
	var loc = document.location;
	socket.emit("eventDraw",loc,data);
    },
    onDraw: function(data){
	//Dummy method must override
	console.log(data);
    },
    onConnect: function(data){
	var loc = document.location;
	socket.emit("setUrl",loc,data);
	//Dummy method must override
	console.log(data);
	console.log(loc);
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

function get_url_loc() {
    return document.location;
}
