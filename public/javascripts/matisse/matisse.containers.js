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
		currSelection: null,
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
			if (matisse.containerName !== 'empty') {
				this.containerName = matisse.containerName;
				this.setContainer(this.containerName, 'old');
				return;
			}
			var html = '<div id="containerlist" style="padding:15px"><p>Select a Device</p>';
			var containerHolder = "<select id='containers' >";
			var contName;
			for (contName in matisse.containers) {
				var containerObj = matisse.containers[contName];
				var container_DisplayName = containerObj.displayName;
				containerHolder += '<option value=' + contName + ' id=' + container_DisplayName + '>' + container_DisplayName;
			}
			html += containerHolder;
			onButtonClick = function () {
				thisRef.onOkClick();
			}
			$(document.getElementById('result')).append(html);
			var btndiv = "<div style='padding:15px'><br><input type='button' value='Ok' onclick=onButtonClick() /></div>"
			$(document.getElementById('result')).append(btndiv);
			popup('popUpDiv', 'closediv', 300, 300);
			$('#closediv').css('display', 'none');
		},
		onOkClick: function () {
			this.containerName = document.getElementById('containers').value;
			this.setContainer(this.containerName, 'new');
			var val = document.getElementById('layouts').value;
				if (val == "uploadLayout") {					
					$(document.getElementById("result")).append('<input id = "loadLayout" type="file" />');
				}
			matisse.comm.sendContainerInfo({
				action: "setContainer",
				containerName:this.containerName
			});
			$('#closediv').css('display', 'block');
		},
		setContainer: function (containerName, type) {			
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
			if (contObj.src) {
				var imagsrc = '/images/'+contObj.src;
				$('#containerBody').css('background-image', 'url(' + imagsrc + ')');
			}			
			$('#containerBody').css('position', 'relative');
			var cssObj = {
				'position': 'relative',
				'left' : contObj.xOffset,
				'top' : contObj.yOffset
			};
			$('#canvasId').css(cssObj);
			$('.canvas-container').css('width', contObj.canvasWidth);
			$('.canvas-container').css('height', contObj.canvasHeight);
			matisse.deviceOffsetX = contObj.xOffset;
			matisse.deviceOffsetY = contObj.yOffset;
			if (type === 'new') {
				closePopup('popUpDiv');
				closePopup('blanket');
				var val = document.getElementById('layouts').value;
				if (val == "uploadLayout") {					
					matisse.layoutURL = document.getElementById("loadLayout").files[0];					
				}
				layouts.setLayoutType(val);
			}	
		}
		 
	};
});


