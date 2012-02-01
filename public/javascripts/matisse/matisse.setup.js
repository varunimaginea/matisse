/**
 * User: Bahvani Shankar,Pradeep
 * Date: 12/26/11
 * Time: 11:16 AM
 * About this :Entry Point File, All Dom Ready functions need to be defined here
 */

define(["matisse", "matisse.fabric", "matisse.comm", "matisse.main", "matisse.containers", "matisse.containers.devices", "matisse.layouts", "matisse.layouts.content", "matisse.palettes", "matisse.palettes.basicshapes", "matisse.palettes.wireframe", "matisse.events", "../javascripts/thirdparty/csspopup.js", "matisse.help"], function (matisse, mfabric, Comm, main, containers, palettes, layouts) {
    //Dom Ready function
    "use strict";
	$(function () {
		var serverURL = 'http://localhost',//change it to server ip or local ip for testing from other machines
			comm = new Comm(serverURL);
		comm.onContainerDraw = function (data) {
			matisse.containerName = data;
			layouts.createLayoutsList();
			containers.createContainerList();
		}
		matisse.comm = comm;
		matisse.main = main;
	});
});
