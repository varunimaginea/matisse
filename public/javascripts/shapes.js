// JavaScript Document
/**
 *
 *
 */


function registerTool(toolname, tooldesc) {
    tools[toolname] = tooldesc;
}

/**
 * Adds Rectangle to canvas
 * @property args
 * @type null
 */
registerTool("rect", {
    displayName: "Rectangle",
    displayIcon: "rect.png",
	displayIcon2: "norectangle.jpg",
    toolAction: function (args) {
        var rect = new fabric.Rect({
            width: args.width,
            height: args.height,
            left: args.left,
            top: args.top,
            fill: args.fillColor,
			stroke:args.strokeColor
        });
        rect.uid = args.uid;
        canvas.add(rect);
        canvas.setActiveObject(rect);
    }
});

/**
 * Adds Circle to canvas
 * @property args
 * @type null
 */
registerTool("circle", {
    displayName: "Circle",
    displayIcon: "circle.png",
	displayIcon2: "nocircle.png",
    toolAction: function addCircle(args) {
        var cir = new fabric.Circle({
            radius: args.radius,
            left: args.left,
            top: args.top,
            fill: args.fillColor,
            opacity: args.opacity,
            angle: args.angle
        });
        cir.uid = args.uid;
        canvas.add(cir);
        canvas.setActiveObject(cir);
    }

});


/**
 * Adds Text to canvas
 * @property args
 * @type null
 */
registerTool("text", {
    displayName: "Text",
    displayIcon: "text.png",
	displayIcon2: "notext.png",
    toolAction: function addText(args) {
        var text = 'HTML5 IS FUN...';
        var textSample = new fabric.Text(text, {
            left: args.left,
            top: args.top,
            fontFamily: args.fontFamily,
            angle: args.angle,
            fill: args.fillColor,
        });
        //alert(textSample)
        textSample.uid = args.uid;
        canvas.add(textSample);
    }
});



/**
 * Adds Drawing to canvas
 * @property args
 * @type null
 */
registerTool("draw", {
    displayName: "Draw",
    displayIcon: "nobrush.png",
	displayIcon2: "brush.png",
    toolAction: null
    
});





