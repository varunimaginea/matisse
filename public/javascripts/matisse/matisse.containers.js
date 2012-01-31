/**
 * User: Bhavani Shankar
 * Date: 01/19/12
 * Time: 11:16 AM
 * About this : Utility to Create all the shapes, based on the type specified
 *
 */
define(["matisse", "matisse.main", "matisse.ui", "matisse.util"], function (matisse, main, ui, util) {
    "use strict";
	return {
		registercontainer : function (containerName, containerDesc) {
			console.log('contname ='+containerName);
			matisse.containers[containerName] = containerDesc;
		},
		
		/**
		 * Create a  palette for each type of palette and add it in toolbar
		 * @method createPallette
		 * @param paletteName
		 */
		createContainerList: function () {
			var containerName;
			if(matisse.containerName != 'empty')  {
				containerName = matisse.containerName;
				this.setContainer(containerName, 'old');
				return;
			}
			var html = '<div id="containerlist" style="padding:15px"><p>Select a Device</p>';
			for (containerName in matisse.containers) {
				console.log('containerName===='+containerName);//alert('clicked'+e)
				var containerObj = matisse.containers[containerName];
				var container_DisplayName = containerObj.displayName;
				var src = '/images/' + containerObj.src;
				var containerHolder = '<div style="padding:15px" class = "container-holder" id="container-holder-' + container_DisplayName + '">';
				containerHolder += '<div class="container_image"><img id="' + container_DisplayName + '" src="' + src + '" width="64" height="64" /></div><div id="container-label">' + container_DisplayName + '</div></div>';
				html += containerHolder;
			}
			$(document.getElementById('result')).append(html);
			popup('popUpDiv', 'blank', 300, 600);
			var thisRef = this;
			$('.container-holder').click(function(e) {
				var containerName = e.target.id.toLowerCase();
				thisRef.setContainer(containerName, 'new');
				matisse.comm.sendContainerInfo({
						action: "setContainer",
						containerName:containerName
				});
			});
					
		},
		setContainer: function(containerName, type) {
			if(type == 'new') {
				closePopup('popUpDiv');
				closePopup('blanket');
			}
			var contObj = matisse.containers[containerName];
			ui.deviceHeight = contObj.height;
			ui.deviceWidth = contObj.width;
			ui.canvasWidth = contObj.canvasWidth;
			ui.canvasHeight = contObj.canvasHeight;
			matisse.xOffset = contObj.xOffset;
			matisse.yOffset = contObj.yOffset;
			matisse.main.init();
			var imagsrc = '/images/'+contObj.src;
			console.log('src ='+imagsrc);
			$('#containerBody').css('background-image', 'url(' + imagsrc + ')');
			$('#containerBody').css('position', 'relative');
				var cssObj = {
							  'position': 'relative',
							  'left' : contObj.xOffset,
							  'top' : contObj.yOffset
							}
			$('#canvasId').css(cssObj);
			$('.canvas-container').css('width', contObj.canvasWidth);
			$('.canvas-container').css('height', contObj.canvasHeight);
			matisse.deviceOffsetX = contObj.xOffset;
			matisse.deviceOffsetY = contObj.yOffset;
		}
		 
	};
});


