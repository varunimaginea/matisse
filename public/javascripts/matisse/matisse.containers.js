/**
 * User: Bhavani Shankar
 * Date: 01/19/12
 * Time: 11:16 AM
 * About this : Creates all the device containers list and adds functionality for selection
 *
 */
define(["matisse", "matisse.main", "matisse.ui", "matisse.util", "matisse.layouts"], function (matisse, main, ui, util, layouts) {
   
	return {
		containerName: null,
		currSelection:null,
		registercontainer : function (containerName, containerDesc) {
			matisse.containers[containerName] = containerDesc;
		},
		
		/**
		 * Create a  palette for each type of palette and add it in toolbar
		 * @method createPallette
		 * @param paletteName
		 */
		createContainerList: function () {
			var thisRef = this;
			if(matisse.containerName != 'empty')  {
				this.containerName = matisse.containerName;
				this.setContainer(this.containerName, 'old');
				return;
			}
			var html = '<div id="containerlist" style="padding:15px"><p>Select a Device</p>';
			var containerHolder = "<select id='containers' >"
			for (var contName in matisse.containers) {
				var containerObj = matisse.containers[contName];
				var container_DisplayName = containerObj.displayName;
				console.log('contName ='+contName);
				console.log('container_DisplayName ='+container_DisplayName);
				containerHolder += '<option value='+contName+ ' id='+container_DisplayName+'>'+container_DisplayName;
				//var src = '/images/' + containerObj.src;
				//containerHolder += '<div style="padding:15px" class = "container-holder" id="containerholder_' + container_DisplayName + '">';
				//containerHolder += '<div class="container_image"><img id="' + container_DisplayName + '" src="' + src + '" width="64" height="64" /></div><div id="container-label">' + container_DisplayName + '</div></div>';
				
			}
			html += containerHolder;
			onButtonClick = function() {
				//if(thisRef.containerName)
				thisRef.onOkClick();
			}
			$(document.getElementById('result')).append(html);
			var btndiv ="<div style='padding:15px'><br><input type='button' value='Ok' onclick=onButtonClick() /></div>"
			$(document.getElementById('result')).append(btndiv);
			popup('popUpDiv', 'closediv', 300, 600);
			$('#closediv').css('display', 'none');
		},
		onOkClick: function() {
			this.containerName = document.getElementById('containers').value;
			console.log('...'+this.containerName);
			this.setContainer(this.containerName, 'new');
			matisse.comm.sendContainerInfo({
					action: "setContainer",
					containerName:this.containerName
			});
			$('#closediv').css('display', 'block');
		},
		setContainer: function(containerName, type) {
			var contObj = matisse.containers[containerName];
			ui.deviceHeight = contObj.height;
			ui.deviceWidth = contObj.width;
			ui.canvasWidth = contObj.canvasWidth;
			ui.canvasHeight = contObj.canvasHeight;
			ui.deviceInnerHeight = contObj.innerHeight;
			ui.deviceInnerWidth = contObj.innerWidth;
			matisse.xOffset = contObj.xOffset;
			matisse.yOffset = contObj.yOffset;
			matisse.main.init();
			var imagsrc = '/images/'+contObj.src;
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
			if(type == 'new') {
				closePopup('popUpDiv');
				closePopup('blanket');
				var val = document.getElementById('layouts').value;
				layouts.setLayoutType(val);
			}	
		}
		 
	};
});


