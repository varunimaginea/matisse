/*matisse.events*/
matisse.events = {
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
     *  Handle MouseMove and MouseDown events - when user trying to draw a shape on canvas
     *  @method  handleMouseEvents
     *  @param none
     */
    handleMouseEvents: function () {
        $("#canvasId").mousedown(function (event) {
            if (!canvas.isDrawingMode && matisse.drawShape) {
                matisse.points.x = event.pageX + document.getElementById("canvasId").scrollLeft - matisse.xOffset; //offset
                matisse.points.y = event.pageY + document.getElementById("canvasId").scrollTop - matisse.yOffset; //offset
                matisse.shapeArgs[0].left = matisse.points.x;
                matisse.shapeArgs[0].top = matisse.points.y;
                matisse.shapeArgs[0].name = matisse.action;
                matisse.shapeArgs[0].palette = matisse.paletteName;
                matisse.palette[matisse.paletteName].shapes[matisse.action].toolAction.apply(this, matisse.shapeArgs);
                matisse.com.sendDrawMsg({
                    palette: matisse.paletteName,
                    action: matisse.action,
                    args: matisse.shapeArgs
                });

                canvas.isSelectMode = true;
                matisse.drawShape = false;
                matisse.main.resetIconSelection();
            }

            if (canvas.isDrawingMode) {
                matisse.xPoints = [];
                matisse.yPoints = [];
                matisse.xPoints.push(event.pageX + document.getElementById("canvasId").scrollLeft - matisse.xOffset);
                matisse.yPoints.push(event.pageY + document.getElementById("canvasId").scrollTop - matisse.yOffset);
            }
        });
        // drawingModeEl.innerHTML = 'Cancel drawing mode';
        $("#canvasId").mousemove(function (event) {
            if (canvas.isDrawingMode) {
                matisse.xPoints.push(event.pageX + document.getElementById("canvasId").scrollLeft - matisse.xOffset);
                matisse.yPoints.push(event.pageY + document.getElementById("canvasId").scrollTop - matisse.yOffset);
                // msg += event.pageX + ", " + event.pageY + "\n :";
            } else {
                var obj = canvas.getActiveObject();
                if (obj && matisse.associateText[obj.name]) {
                    matisse.associateText[obj.name].left = obj.left;
                    matisse.associateText[obj.name].top = obj.top;
                    matisse.associateText[obj.name].setAngle(obj.getAngle());
                }
            }

        });
    }
	
	
}