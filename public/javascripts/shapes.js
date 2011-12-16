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
                canvas.add(rect);
                canvas.setActiveObject(rect);
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
                canvas.setActiveObject(cir);
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
        // end of text
        path: {
            displayName: "path",
            displayIcon: "nobrush.png",
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
            displayIcon: "svg.gif",
            displayIcon2: "svg2.jpg",
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
            displayIcon: "svg2.png",
            displayIcon2: "svg2.jpg",
            toolAction: function (args) {
                args.svg = 'drawing.svg';
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