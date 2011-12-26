// JavaScript Document
/**
 *
 *
 */

function registerpalette(paletteName, paletteDesc) {
    App.palette[paletteName] = paletteDesc;
}

/***********************************
// BASIC SHAPES
************************************/
registerpalette("basic_shapes", {
    collectionName: 'basic shapes',
    shapes: {
        rectangle: {
            displayName: "rectangle",
            displayIcon: "rect.png",
            displayIcon2: "norectangle.jpg",
            toolAction: function (args) {
                var rect = new fabric.Rect({
                    width: args.width,
                    height: args.height,
                    left: args.left,
                    top: args.top,
                    fill: args.fill,
                    stroke: args.stroke,
                    angle: args.angle,
                    scaleX: 1,
                    scaleY: 1
                });
                rect.uid = args.uid;
                rect.name = args.name;
                rect.pallette = args.pallette;
				rect.customName = "rectangle";
				//rect.selectable = false;
                canvas.add(rect);
               
            },
            properties: [{
                name: 'left',
                type: 'number',
                action: function (args) {
                    (args.obj).set("left", args.property);
                },
                defaultvalue: 100
            }, {
                name: 'top',
                type: 'number',
                action: function (args) {
                    (args.obj).set("top", args.property);
                },
                defaultvalue: 100
            }, {
                name: 'width',
                type: 'number',
                action: function (args) {
                    (args.obj).set("width", args.property / args.obj.scaleX);
                },
                defaultvalue: 200
            }, {
                name: 'height',
                type: 'number',
                action: function (args) {
                    (args.obj).set("height", args.property / args.obj.scaleY);
                },
                defaultvalue: 100
            }, {
                name: 'scaleX',
                type: 'number',
                action: function (args) {
                    (args.obj).set("scaleX", args.property);
                },
                defaultvalue: 200
            }, {
                name: 'scaleY',
                type: 'number',
                action: function (args) {
                    (args.obj).set("scaleY", args.property);
                },
                defaultvalue: 100
            }, {
                name: 'fill',
                type: 'string',
                action: function (args) {
                    (args.obj).set("fill", args.property);
                },
                defaultvalue: '#FF0000'
            }, {
                name: 'stroke',
                type: 'string',
                action: function (args) {
                    (args.obj).set("stroke", args.property);
                },
                defaultvalue: '#00FF00'
            }, {
                name: 'angle',
                type: 'number',
                action: function (args) {
                    (args.obj).set("angle", args.property);
                },
                defaultvalue: 0
            }]
        },
        circle: {
            displayName: "circle",
            displayIcon: "circle.png",
            displayIcon2: "nocircle.png",
            toolAction: function addCircle(args) {
                var cir = new fabric.Circle({
                    radius: args.radius,
                    left: args.left,
                    top: args.top,
                    fill: args.fill,
                    stroke: args.stroke,
                    opacity: args.opacity,
                    angle: args.angle
                });
                cir.uid = args.uid;
                cir.name = args.name;
                cir.pallette = args.pallette;
                canvas.add(cir);
            },
            properties: [{
                name: 'left',
                type: 'number',
                action: function (args) {
                    (args.obj).set("left", args.property);
                },
                defaultvalue: 100
            }, {
                name: 'top',
                type: 'number',
                action: function (args) {
                    (args.obj).set("top", args.property);
                },
                defaultvalue: 100
            }, {
                name: 'radius',
                type: 'number',
                action: function (args) {
                    (args.obj).set("radius", args.property / args.obj.scaleX);
                },
                defaultvalue: 20
            },

            {
                name: 'fill',
                type: 'string',
                action: function (args) {
                    (args.obj).set("fill", args.property);
                },
                defaultvalue: '#FF0000'
            }, {
                name: 'stroke',
                type: 'string',
                action: function (args) {
                    (args.obj).set("stroke", args.property);
                },
                defaultvalue: '#00FF00'
            }, {
                name: 'angle',
                type: 'number',
                action: function (args) {
                    (args.obj).set("angle", args.property);
                },
                defaultvalue: 0
            }]

        },
        // end of circle
        text: {
            displayName: "text",
            displayIcon: "text.png",
            displayIcon2: "notext.png",
            toolAction: function addText(args) {
				console.log("load text.....");
                var text = 'text text text...';
                var textSample = new fabric.Text(text, {
                    left: args.left,
                    top: args.top,
                    fontFamily: args.fontFamily,
                    angle: args.angle,
                    fill: args.fill,
                    stroke: args.stroke
                });
                //alert(textSample)
                textSample.uid = args.uid;
                textSample.name = args.name;
                textSample.pallette = args.pallette;
				canvas.add(textSample);
				
            },
            properties: [{
                name: 'left',
                type: 'number',
                action: function (args) {
                    (args.obj).set("left", args.property);
                },
                defaultvalue: 100
            }, {
                name: 'top',
                type: 'number',
                action: function (args) {
                    (args.obj).set("top", args.property);
                },
                defaultvalue: 100
            }, {
                name: 'fontFamily',
                type: 'string',
                action: function (args) {
                    (args.obj).set("fontFamily", args.property);
                },
                defaultvalue: 'delicious_500'
            },

            {
                name: 'fill',
                type: 'string',
                action: function (args) {
                    (args.obj).set("fill", args.property);
                },
                defaultvalue: '#FF0000'
            }, 
			
			{
                name: 'stroke',
                type: 'string',
                action: function (args) {
                    (args.obj).set("stroke", args.property);
                },
                defaultvalue: '#00FF00'
            }, 
			
			{
                name: 'angle',
                type: 'number',
                action: function (args) {
                    (args.obj).set("angle", args.property);
                },
                defaultvalue: 0
            }]
        },
        // end of text
        path: {
            displayName: "path",
            displayIcon: "brush.png",
            displayIcon2: "brush.png",
            toolAction: null

        } // end of path

    } // end of shapes
} // end of basic shapes
);

/***********************************
// SVG IMAGES
************************************/

registerpalette("svg", {
    collectionName: 'svg',
    shapes: {
        pathgroup1: {
            displayName: "pathgroup1",
            displayIcon: "anchor.png",
            displayIcon2: "anchor.png",
            toolAction: function (args) {
                args.svg = '36.svg'
                args.name = 'pathgroup1';
                loadSVG(args);
            },

            properties: [{
                name: 'left',
                type: 'number',
                action: function (args) {
                    (args.obj).set("left", args.property);
                },
                defaultvalue: 100
            }, {
                name: 'top',
                type: 'number',
                action: function (args) {
                    (args.obj).set("top", args.property);
                },
                defaultvalue: 100
            }, {
                name: 'width',
                type: 'number',
                action: function (args) {
                    (args.obj).set("width", args.property / args.obj.scaleX);
                },
                defaultvalue: 200
            }, {
                name: 'height',
                type: 'number',
                action: function (args) {
                    (args.obj).set("height", args.property / args.obj.scaleY);
                },
                defaultvalue: 100
            }, {
                name: 'scaleX',
                type: 'number',
                action: function (args) {
                    (args.obj).set("scaleX", args.property);
                },
                defaultvalue: 200
            }, {
                name: 'scaleY',
                type: 'number',
                action: function (args) {
                    (args.obj).set("scaleY", args.property);
                },
                defaultvalue: 100
            },

            {
                name: 'angle',
                type: 'number',
                action: function (args) {
                    (args.obj).set("angle", args.property);
                },
                defaultvalue: 0
            }]
        },
        pathgroup2: {
            displayName: "pathgroup2",
            displayIcon: "thumb.png",
            displayIcon2: "thumb.png",
            toolAction: function (args) {
                args.svg = '17.svg';
                args.name = 'pathgroup2';
                loadSVG(args);
            },

            properties: [{
                name: 'left',
                type: 'number',
                action: function (args) {
                    (args.obj).set("left", args.property);
                },
                defaultvalue: 100
            }, {
                name: 'top',
                type: 'number',
                action: function (args) {
                    (args.obj).set("top", args.property);
                },
                defaultvalue: 100
            }, {
                name: 'width',
                type: 'number',
                action: function (args) {
                    (args.obj).set("width", args.property / args.obj.scaleX);
                },
                defaultvalue: 200
            }, {
                name: 'height',
                type: 'number',
                action: function (args) {
                    (args.obj).set("height", args.property / args.obj.scaleY);
                },
                defaultvalue: 100
            }, {
                name: 'scaleX',
                type: 'number',
                action: function (args) {
                    (args.obj).set("scaleX", args.property);
                },
                defaultvalue: 200
            }, {
                name: 'scaleY',
                type: 'number',
                action: function (args) {
                    (args.obj).set("scaleY", args.property);
                },
                defaultvalue: 100
            },

            {
                name: 'angle',
                type: 'number',
                action: function (args) {
                    (args.obj).set("angle", args.property);
                },
                defaultvalue: 0
            }]
        },
		button: {
            displayName: "button",
            displayIcon: "button.png",
            displayIcon2: "svg2.jpg",
            toolAction: function (args) {
                args.svg = 'button.svg';
                args.name = 'pathgroup2';
                loadSVG(args);
            },

            properties: [{
                name: 'left',
                type: 'number',
                action: function (args) {
                    (args.obj).set("left", args.property);
                },
                defaultvalue: 100
            }, {
                name: 'top',
                type: 'number',
                action: function (args) {
                    (args.obj).set("top", args.property);
                },
                defaultvalue: 100
            }, {
                name: 'width',
                type: 'number',
                action: function (args) {
                    (args.obj).set("width", args.property / args.obj.scaleX);
                },
                defaultvalue: 200
            }, {
                name: 'height',
                type: 'number',
                action: function (args) {
                    (args.obj).set("height", args.property / args.obj.scaleY);
                },
                defaultvalue: 100
            }, {
                name: 'scaleX',
                type: 'number',
                action: function (args) {
                    (args.obj).set("scaleX", args.property);
                },
                defaultvalue: 200
            }, {
                name: 'scaleY',
                type: 'number',
                action: function (args) {
                    (args.obj).set("scaleY", args.property);
                },
                defaultvalue: 100
            },

            {
                name: 'angle',
                type: 'number',
                action: function (args) {
                    (args.obj).set("angle", args.property);
                },
                defaultvalue: 0
            }]
        }

    } //end of shapes
} // end of svg
);


/***********************************
// WIREFRAME TOOLS
************************************/
registerpalette("wireframe", {
    collectionName: 'wireframe',
    shapes: {
	checkbox:{
		displayName: "checkbox",
		displayIcon: "checkbox.png",
		displayIcon2: "checkbox.png",
		toolAction: function (args) {
			var objects = [],
				text = "check",
				margin = 15,
				space = 15;
			args.width = getStringWidth(text) + args.side + (2 * margin) + space;
			args.height = 40;
			var checkbox_left = -(args.width / 2) + margin;
			var checkbox = new fabric.Polygon(      
                    [{x: checkbox_left,y:args.side/2},{x:checkbox_left + args.side, y:args.side/2},{x:checkbox_left + args.side, y:-args.side/2},{x:checkbox_left, y:-args.side/2}],
					{
						fill: '#FFFFFF', 
						stroke:'#000000'						
					}
					);
			var text_left = checkbox_left + args.side + space;
			var text = new fabric.Text("check", 
						{	
							fontSize : args.fontSize, 
							fontFamily : args.fontFamily, 
							fontWeight : 20,
							left : -(-(getStringWidth(text))/2 - text_left),
							top : 0
						});
			var tick = new fabric.Polyline([{x: checkbox_left+2,y:0},{x:checkbox_left+6,y:-6},{x:checkbox_left+12,y:6}],{stroke:'#000000'});
			objects.push(checkbox);
			objects.push(text);
			loadWireframe(args, objects);			
		},
		properties: [{
                name: 'left',
                type: 'number',
                action: function (args) {
                    (args.obj).set("left", args.property);
                },
                defaultvalue: 100
            }, {
                name: 'top',
                type: 'number',
                action: function (args) {
                    (args.obj).set("top", args.property);
                },
                defaultvalue: 100
            },
			{
                name: 'side',
                type: 'number',
                action: function (args) {
                    (args.obj).set("side", args.property);
                },
                defaultvalue: 16
            },
			{
                name: 'fontFamily',
                type: 'string',
                action: function (args) {
                    (args.obj).set("fontFamily", args.property);
                },
                defaultvalue: 'delicious_500'
            },
            {
                name: 'fill',
                type: 'string',
                action: function (args) {
                    (args.obj).set("fill", args.property);
                },
                defaultvalue: '#FFFFFF'
            }, {
                name: 'stroke',
                type: 'string',
                action: function (args) {
                    (args.obj).set("stroke", args.property);
                },
                defaultvalue: '#000000'
            }, 
			{
                name: 'opacity',
                type: 'number',
                action: function (args) {
                    (args.obj).set("opacity", args.property);
                },
                defaultvalue: 0.6
            },{
                name: 'angle',
                type: 'number',
                action: function (args) {
                    (args.obj).set("angle", args.property);
                },
                defaultvalue: 0
            },{
                name: 'fontSize',
                type: 'number',
                action: function (args) {
                    (args.obj).set("angle", args.property);
                },
                defaultvalue: 20
            }]
	},
	
	radio: {
			displayName: "radio",
            displayIcon: "radio.png",
            displayIcon2: "radio.png",
            toolAction: function (args) {
                var objects = [],
					text = "radio",
					width = 0;
				var outer_circle = new fabric.Circle({
                    radius: args.radius,
                    left: -30,
                    top: 0,  
					fill: '#FFFFFF',
                    stroke: args.stroke,
                    opacity: args.opacity,
                    angle: args.angle
                });
				var inner_circle = new fabric.Circle({
                    radius: args.radius/4,
                    left: -30,
                    top: 0,
                    fill: args.fill,                    
                    opacity: args.opacity,
                    angle: args.angle
                });
				
				var txt = new fabric.Text(
					text,{
					left: 10,
                    top: 0,
                    fontFamily: args.fontFamily,
					fontSize:args.fontSize,
					fontWeight:20,
					textAlign:'right',
                    angle: args.angle,
                    fill: '#000000',
                    stroke: args.stroke
				});
				objects.push(inner_circle);
				objects.push(outer_circle);
				objects.push(txt);
				var txt_width = getStringWidth(text);
				width = txt_width + (2 * args.radius) + 10 + 30;// 10 for space between circle and radius and 30 (15 + 15) margins
				outer_circle.left = - ((width/2) - 15);
				inner_circle.left = outer_circle.left;
				var text_left = outer_circle.left + (2 * args.radius) + 10;
				txt.left = -(-(txt_width)/2 - text_left);
				args.width = width;		
				args.height = 50;
				loadWireframe(args, objects);
            },

            properties: [{
                name: 'left',
                type: 'number',
                action: function (args) {
                    (args.obj).set("left", args.property);
                },
                defaultvalue: 100
            }, {
                name: 'top',
                type: 'number',
                action: function (args) {
                    (args.obj).set("top", args.property);
                },
                defaultvalue: 100
            }, {
                name: 'radius',
                type: 'number',
                action: function (args) {
                    (args.obj).set("radius", args.property / args.obj.scaleX);
                },
                defaultvalue: 8
            },
			{
                name: 'fontFamily',
                type: 'string',
                action: function (args) {
                    (args.obj).set("fontFamily", args.property);
                },
                defaultvalue: 'delicious_500'
            },
            {
                name: 'fill',
                type: 'string',
                action: function (args) {
                    (args.obj).set("fill", args.property);
                },
                defaultvalue: '#000000'
            }, {
                name: 'stroke',
                type: 'string',
                action: function (args) {
                    (args.obj).set("stroke", args.property);
                },
                defaultvalue: '#000000'
            }, 
			{
                name: 'opacity',
                type: 'number',
                action: function (args) {
                    (args.obj).set("opacity", args.property);
                },
                defaultvalue: 0.6
            },{
                name: 'angle',
                type: 'number',
                action: function (args) {
                    (args.obj).set("angle", args.property);
                },
                defaultvalue: 0
            },{
                name: 'fontSize',
                type: 'number',
                action: function (args) {
                    (args.obj).set("angle", args.property);
                },
                defaultvalue: 20
            }]
        }
		
	} // end of shapes
} // end of wireframe
);