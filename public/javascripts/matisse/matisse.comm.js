/**
 * Comm: Client side socket connection and communicaiton handler
 * 
 * 
*/
define(function () {
   	"use strict";
	/*constructor*/
	function Comm(url) {
		// create socket connection object
		this.socket = io.connect(url);
		// variable to hold reference of this object(Comm)
		var objRef = this;
		// Invoked when containerDraw method called on the server side
		this.socket.on("containerDraw", function (data) {
			objRef.drawContainerHandler(data);
		});
		// Invoked when userInfo method called on the server side
		this.socket.on("userInfo", function (data) {
			objRef.userInfoHandler(data);
		});
		// Invoked when eventDraw method called on the server side
		this.socket.on("eventDraw", function (data) {
			objRef.drawHandler(data);
		});
		// Invoked when eventConnect method called on the server side
		this.socket.on('eventConnect', function (data) {
			objRef.connectHandler(data);
		});
	}
	(function () {
		// Handler functions
		this.connectHandler = function (data) {
			this.onConnect(data);
		};
		this.userInfoHandler = function (data) {
			this.onUserInfo(data);
		};
		this.drawHandler = function (data) {
			this.onDraw(data);
		};
		this.drawContainerHandler = function (data) {
			this.onContainerDraw(data);
		};
		this.sendContainerInfo = function(data) {
			var loc = document.location.pathname;
			this.socket.emit("setContainer", loc, data);
		};
		this.sendDrawMsg = function (data) {
			var loc = document.location.pathname;
			this.socket.emit("eventDraw", loc, data);
		};
		this.onDraw = function (data) {
			//Dummy method must override
		};
		this.onConnect =  function (data) {
			var loc = document.location.pathname;
			this.socket.emit("setUrl", loc, data);
		};
	}).call(Comm.prototype);
	return Comm;
});
