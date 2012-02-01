/**
 * User: Bhavani Shankar,Pradeep
 * Date: 12/28/11
 * Time: 11:16 AM
 * About this : To set the properties of the object with the received object
 */

require(["matisse", "matisse.main", "matisse.containers", "matisse.palettes.properties", "matisse.util"], function (matisse, main, containers, objproperties, util) {
	"use strict";
	containers.registercontainer( 'desktop-1024x768' , {
			 	displayName: "desktop-1024x768",
				src: "",
				width: 1024,
				height: 768,
				innerWidth:1024,
				innerHeight:768,
				xOffset: 0,
				yOffset: 0,
				canvasWidth: 1024,
				canvasHeight: 768
			});
	containers.registercontainer( 'iphone' , {
			 	displayName: "iPhone",
				src: "iphone_overlay.png",
				width: 420,
				height: 740,
				innerWidth:330,
				innerHeight:500,
				xOffset: 53,
				yOffset: 134,
				canvasWidth: 330,
				canvasHeight: 800
			});
	containers.registercontainer( 'ipad' , {		
				displayName: "iPad",
				src: "ipad_overlay.png",
				width: 564,
				height: 723,
				innerHeight:606,
				innerWidth:467,
				xOffset: 60,
				yOffset: 70,
				canvasWidth: 467,
				canvasHeight: 606
			});
			
	
});