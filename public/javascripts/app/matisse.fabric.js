/* fabric related methods */

matisse.fabric = {

	/**
     *  Check for the event fired by fabric when any of the canvas objects modified and apply update properites panel accordingly
     *  @method  observe
     *  @param eventName
     */
    observe: function (eventName) {
        canvas.observe(eventName, function (e) {
            switch (eventName) {
            case "object:modified":
                if (canvas.getActiveGroup()) {
                    notifyServerGroupMoved();
                    return;
                }
                var obj = e.memo.target;
                matisse.com.sendDrawMsg({
                    action: "modified",
                    name: obj.name,
                    pallette: obj.pallette,
                    args: [{
                        uid: obj.uid,
                        object: obj
                    }] // When sent only 'object' for some reason object  'uid' is not available to the receiver method.
                })
                matisse.main.updatePropertyPanel(obj);
                break;
            case "selection:cleared":
                $('#prop').remove();
                $('#propdiv').dialog('close');

                break;
            case 'path:created':
                canvas.isSelectMode = true;
                canvas.isDrawingMode = false;
                matisse.main.resetIconSelection();
                matisse.drawShape = false;
                document.getElementById("c").style.cursor = 'default';
                var obj = e.memo.path;
                obj.uid = matisse.util.uniqid();
                obj.name = "drawingpath";
                obj.pallette = matisse.palletteName;
                matisse.com.sendDrawMsg({
                    action: 'drawpath',
                    pallette: matisse.palletteName,
                    args: [{
                        uid: obj.uid,
                        left: obj.left,
                        top: obj.top,
                        width: obj.width,
                        height: obj.height,
                        path: obj.path,
                        name: obj.name,
                        pallete: matisse.palletteName
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
                matisse.main.createPropertiesPanel(obj);
                break;
            }

        })
    },
	
	/**
     * Draw free-hand drawing path when notification received from server
     * @method drawPath
     * @param args
     */
    drawPath: function (args) {
        var p = new fabric.Path(args.path);
        p.fill = null;
        p.stroke = '#FF000';
        p.strokeWidth = 1;
        p.uid = args.uid;
        p.name = "drawingpath";
        p.scaleX = 1;
        p.scaleY = 1;
        p.pallete = "basic";
        p.set("left", args.left);
        p.set("top", args.top);
        p.set("width", args.width);
        p.set("height", args.height);
        canvas.add(p);
        canvas.renderAll();
        p.setCoords();


    }



}