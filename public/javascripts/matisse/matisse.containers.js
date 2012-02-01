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
			console.log('contname ='+containerName);
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
			for (var contName in matisse.containers) {
				console.log('containerName===='+contName);//alert('clicked'+e)
				var containerObj = matisse.containers[contName];
				var container_DisplayName = containerObj.displayName;
				var src = '/images/' + containerObj.src;
				
				var containerHolder = '<div style="padding:15px" class = "container-holder" id="container-holder-' + container_DisplayName + '">';
				containerHolder += '<div class="container_image"><img id="' + container_DisplayName + '" src="' + src + '" width="64" height="64" /></div><div id="container-label">' + container_DisplayName + '</div></div>';
				html += containerHolder;
			}
			onButtonClick = function() {
				if(thisRef.containerName)
				thisRef.onOkClick();
			}
			html+="<input type='button' value='Ok' onclick=onButtonClick() />"
			$(document.getElementById('result')).append(html);
			popup('popUpDiv', 'closediv', 300, 600);
			$('#closediv').css('display', 'none');
			
			$('.container-holder').click(function(e) {
				if(thisRef.currSelection)
				$('#'+thisRef.currSelection).css('background-color', 'transparent');
				$(this).css('background-color', '#ff0');
				thisRef.currSelection = this.id;
				console.log('>>>'+thisRef.currSelection)
				thisRef.containerName = e.target.id.toLowerCase();
				
			});
					
		},
		onOkClick: function() {
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
			console.log(containerName);//alert('clicked'+e)
			if(type == 'new') {
				closePopup('popUpDiv');
				closePopup('blanket');
				var val = document.getElementById('layouts').value;
				layouts.setLayoutType(val);
			}	
		}
		 
	};
});


