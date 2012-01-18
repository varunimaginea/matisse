/*matisse.events*/
define(["matisse", "matisse.com", "matisse.ui" ], function(matisse, com, ui) {
return {
	/**
	 * Listen for keyboard events and do necessary action
	 * @method keyDown 
	 * @param e keyevent
	 */
	keyDown: function (e) {
		var evt = (e) ? e : (window.event) ? window.event : null;
		if (evt) {
			var key = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
			if (key == "46" && evt.altKey) {
				matisse.main.deleteObjects();
			} else if (key == "38" && evt.ctrlKey) {
				var obj = canvas.getActiveObject();
				if (obj) canvas.bringForward(obj);
			} else if (key == "40" && evt.ctrlKey) {
				var obj = canvas.getActiveObject();
				if (obj) canvas.sendBackwards(obj);
			}
		}
	},
	
	/**
	 * Listen for mouse down event and do necessary action
	 * @method mouseDown 
	 * @param e mouseevent
	 */
	mouseDown: function(event){		
		if (!canvas.isDrawingMode && matisse.drawShape) {
			matisse.points.x = event.pageX + document.getElementById("canvasId").scrollLeft - matisse.xOffset; //offset
			matisse.points.y = event.pageY + document.getElementById("canvasId").scrollTop - matisse.yOffset; //offset
			matisse.shapeArgs[0].left = matisse.points.x;
			matisse.shapeArgs[0].top = matisse.points.y;
			matisse.shapeArgs[0].name = matisse.action;
			matisse.shapeArgs[0].palette = matisse.paletteName;
			matisse.palette[matisse.paletteName].shapes[matisse.action].toolAction.apply(this, matisse.shapeArgs);
			com.sendDrawMsg({
				palette: matisse.paletteName,
				action: matisse.action,
				args: matisse.shapeArgs
			});
			canvas.isSelectMode = true;
			matisse.drawShape = false;
			ui.resetIconSelection();
		}
		if (canvas.isDrawingMode) {
			matisse.xPoints = [];
			matisse.yPoints = [];	
			matisse.xPoints.push(event.pageX + document.getElementById("canvasId").scrollLeft - matisse.xOffset);
			matisse.yPoints.push(event.pageY + document.getElementById("canvasId").scrollTop - matisse.yOffset);
		}
	},
	
	/**
	 * Listen for mouse move event and do necessary action
	 * @method mouseMove 
	 * @param e mouseevent
	 */
	mouseMove: function(event){
		if (canvas.isDrawingMode) {
			matisse.xPoints.push(event.pageX + document.getElementById("canvasId").scrollLeft - matisse.xOffset);
			matisse.yPoints.push(event.pageY + document.getElementById("canvasId").scrollTop - matisse.yOffset);
		}
	}
}
});