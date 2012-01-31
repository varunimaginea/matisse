/**
 * User: Bahvani Shankar,Pradeep
 * Date: 12/26/11
 * Time: 11:16 AM
 * About this :Entry Point File, All Dom Ready functions need to be defined here
 */

define( ["matisse", "matisse.fabric", "matisse.comm", "matisse.main", "matisse.containers", "matisse.containers.devices", "matisse.palettes", "matisse.palettes.basicshapes", "matisse.palettes.wireframe", "matisse.events", "../javascripts/thirdparty/csspopup.js", "matisse.help"] , function (matisse, mfabric, Comm, main, containers, palettes) {
    //Dom Ready function
    "use strict";
	$(function () {
		var serverURL = 'http://localhost';//change it to server ip or local ip for testing from other machines
		var comm = new Comm(serverURL);
		comm.onContainerDraw = function(data) {
			console.log('container ==>>>>>'+data)
			matisse.containerName = data;
			containers.createContainerList();
		}
		
		matisse.comm = comm;
		matisse.main = main;
        //call all the functions, that are to be called on document ready here;
		//main.init();
	});
});
