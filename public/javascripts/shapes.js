// JavaScript Document
/**
 *
 *
 */

var tools = {};
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
            fill: args.fillColor
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
 * Grabs all the shape elements and creates a tool icon for each shape to add in the toolbar
 *
 */
function addTools()
{
	var toolsDiv = document.getElementById('toolsdiv')
	for (i in tools)
	{
		var el = document.createElement('div');
		var img = document.createElement('img');
		img.setAttribute('src', 'images/'+tools[i].displayIcon);
		img.setAttribute('id', tools[i].displayName);
		img.setAttribute('class', "swapImage {src: \'images/"+tools[i].displayIcon2+"\'}");
		img.onclick = handleClick;
		//alert(img.src)
		el.appendChild(img);
		toolsDiv.appendChild(el);
	}
	
	document.getElementById("drawing-mode").onclick = drawingButtonListener;
	handleMouseEvents()
}

$(document).ready(addTools());

