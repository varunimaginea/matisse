/**
 * User: Bahvani Shankar,Pradeep
 * Date: 12/28/11
 * Time: 11:16 AM
 * About this : Define all Basic Shape.s here
 */

App.Shapes.registerpallette("basic_shapes", {
    collectionName: 'basic_shapes',
    shapes: {
        rectangle: {
            displayName: "rectangle",
            activeIcon: "rectangle_w.png",
            inactiveIcon: "rectangle_g.png",
            toolAction: function (args) {
                var rect = new fabric.Rect({
                    width: args.width,
                    height: args.height,
                    left: args.left,
                    top: args.top,
                    fill: args.fill,
                    stroke: args.stroke,
                    scaleX: args.scaleX,
                    scaleY: args.scaleY
                });
                rect.uid = args.uid;
				rect.name = 'rectangle';
                rect.pallette = args.pallette;
				rect.setAngle(args.angle)
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
                defaultvalue: 1
            }, {
                name: 'scaleY',
                type: 'number',
                action: function (args) {
                    (args.obj).set("scaleY", args.property);
                },
                defaultvalue: 1
            }, {
                name: 'fill',
                type: 'string',
                action: function (args) {
                    (args.obj).set("fill", args.property);
                },
                defaultvalue: '#166bca'
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
            activeIcon: "circle_w.png",
            inactiveIcon: "circle_g.png",
            toolAction: function addCircle(args) {
                var cir = new fabric.Circle({
                    radius: args.radius,
                    left: args.left,
                    top: args.top,
                    fill: args.fill,
                    stroke: args.stroke,
                    opacity: 1,
                    scaleX: args.scaleX,
                    scaleY: args.scaleY
                });
				cir.setAngle(args.angle)
                cir.uid = args.uid;
                cir.name = "circle";
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
                name: 'scaleX',
                type: 'number',
                action: function (args) {
                    (args.obj).set("scaleX", args.property);
                },
                defaultvalue: 1
            }, {
                name: 'scaleY',
                type: 'number',
                action: function (args) {
                    (args.obj).set("scaleY", args.property);
                },
                defaultvalue: 1
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
		/*triangle: {
            displayName: "triangle",
            activeIcon: "triangle.png",
            inactiveIcon: "nocircle.png",
            toolAction: function addCircle(args) {
                var tri = new fabric.Triangle({
                    width: args.width,
                    height: args.height,
                    left: args.left,
                    top: args.top,
                    fill: args.fill,
                    stroke: args.stroke,
                    scaleX: args.scaleX,
                    scaleY: args.scaleY
                });
				tri.setAngle(args.angle)
                tri.uid = args.uid;
                tri.name = "triangle";
                tri.pallette = args.pallette;
				
				canvas.add(tri);
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
                name: 'scaleX',
                type: 'number',
                action: function (args) {
                    (args.obj).set("scaleX", args.property);
                },
                defaultvalue: 1
            }, {
                name: 'scaleY',
                type: 'number',
                action: function (args) {
                    (args.obj).set("scaleY", args.property);
                },
                defaultvalue: 1
            },
            {
                name: 'fill',
                type: 'string',
                action: function (args) {
                    (args.obj).set("fill", args.property);
                },
                defaultvalue: '#0099FF'
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

        },*/
        // end of triangle
        text: {
            displayName: "text",
            activeIcon: "text_w.png",
            inactiveIcon: "text_g.png",
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
                textSample.name = "text";
                textSample.pallette = args.pallette;
				textSample.customName = "text";
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
        path: {
            displayName: "path",
            activeIcon: "brush_w.png",
            inactiveIcon: "brush_g.png",
            toolAction: null
			
        } // end of path

    } // end of shapes
} // end of basic shapes
);