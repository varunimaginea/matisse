/* fabric related methods */
define(["matisse", "matisse.util", "matisse.comm", "matisse.palettes.properties", "matisse.ui", "matisse.events"], function(matisse, util, comm, properties, ui, events) {
	
	/**
     *  Check for the event fired by fabric when any of the canvas objects modified and apply update properites panel accordingly
     *  @method  observe
     *  @param eventName
     */
	return { 
    observe: function (eventName) {
        canvas.observe(eventName, function (e) {
            switch (eventName) {
            case "object:modified":
                if (canvas.getActiveGroup()) {
                    events.notifyServerGroupMoved();
                    return;
                }
                var obj = e.memo.target;
                comm.sendDrawMsg({
                    action: "modified",
                    name: obj.name,
                    palette: obj.palette,
                    args: [{
                        uid: obj.uid,
                        object: obj
                    }] // When sent only 'object' for some reason object  'uid' is not available to the receiver method.
                })
                properties.updatePropertyPanel(obj);
                break;
            case "selection:cleared":
                $('#prop').remove();
                $('#propdiv').dialog('close');
                break;
            case 'path:created':
                canvas.isSelectMode = true;
                canvas.isDrawingMode = false;
                ui.resetIconSelection();
                matisse.drawShape = false;
                document.getElementById("c").style.cursor = 'default';
                var obj = e.memo.path;
                obj.uid = util.uniqid();
                obj.name = "drawingpath";
                obj.palette = matisse.paletteName;
                comm.sendDrawMsg({
                    action: 'drawpath',
                    palette: matisse.paletteName,
                    args: [{
                        uid: obj.uid,
                        left: obj.left,
                        top: obj.top,
                        width: obj.width,
                        height: obj.height,
                        path: obj.path,
                        name: obj.name,
                        palette: matisse.paletteName
                    }]
                });
                matisse.xPoints = [];
                matisse.yPoints = [];
                break;
            case 'object:selected':
                var obj = e.memo.target;
                if (canvas.getActiveGroup()) {
                    return;
                }				
                properties.createPropertiesPanel(obj);
                break;
            }

        })
    }
} 

});