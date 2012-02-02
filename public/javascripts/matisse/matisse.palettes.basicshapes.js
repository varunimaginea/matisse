/**
 * User: Bhavani Shankar,Pradeep
 * Date: 12/28/11
 * Time: 11:16 AM
 * About this : To set the properties of the object with the received object
 */

require(["matisse", "matisse.main", "matisse.palettes", "matisse.palettes.properties", "matisse.util"], function (matisse, main, palettes, objproperties, util) {
	"use strict";
	var updateProperties = function (obj, recvdObj) {
		obj.left = recvdObj.left;
		obj.top = recvdObj.top;
		obj.scaleX = recvdObj.scaleX;
		obj.scaleY = recvdObj.scaleY;
		obj.setAngle(recvdObj.angle);
		if (recvdObj.fill) {
			obj.set("fill", recvdObj.fill);
		}
		if (recvdObj.stroke) {
			obj.set("stroke", recvdObj.stroke);
		}
		if (obj.text) {
			obj.text = recvdObj.text;
		}
		if(recvdObj.path)
		obj.path = recvdObj.path;
	};
	palettes.registerpalette("basic", {
		collectionName: 'basic',
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
					rect.palette = args.palette;
					rect.setAngle(args.angle);
					//rect.selectable = false;
					canvas.add(rect);
				},
				modifyAction: function (args) {
					var obj = util.getObjectById(args.uid);
					var recvdObj = args.object;
					updateProperties(obj, recvdObj);
				},
				applyProperties: function (props) {
					objproperties._applyProperties(props);
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
					defaultvalue: '#D3DAE5'
				}, {
					name: 'stroke',
					type: 'string',
					action: function (args) {
						(args.obj).set("stroke", args.property);
					},
					defaultvalue: '#000000'
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
					cir.setAngle(args.angle);
					cir.uid = args.uid;
					cir.name = "circle";
					cir.palette = args.palette;
					canvas.add(cir);
				},
				modifyAction: function (args) {
					var obj = util.getObjectById(args.uid);
					var recvdObj = args.object;
					updateProperties(obj, recvdObj);
				},
				applyProperties: function (props) {
					objproperties._applyProperties(props);
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
					defaultvalue: '#D3DAE5'
				}, {
					name: 'stroke',
					type: 'string',
					action: function (args) {
						(args.obj).set("stroke", args.property);
					},
					defaultvalue: '#000000'
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
					tri.palette = args.palette;
					
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
					var textVal;
					if (args.text) {
						textVal = args.text;
					} else {
						textVal = 'sample';
					}
					var textSample = new fabric.Text(textVal, {
						left: args.left,
						top: args.top,
						fontFamily: 'delicious_500',
						angle: args.angle,
						fill: args.fill,
						scaleX: args.scaleX,
						scaleY: args.scaleY,
						stroke: args.stroke
					});
					//alert(textSample)
					textSample.uid = args.uid;
					textSample.name = "text";
					textSample.palette = args.palette;
					textSample.customName = "text";
					canvas.add(textSample);
				},
				modifyAction: function (args) {
					var obj = util.getObjectById(args.uid);
					var recvdObj = args.object;
					updateProperties(obj, recvdObj);
				},
				applyProperties: function (props) {
					objproperties._applyProperties(props);
					$("#proptable").append("<tr id = 'txtrow'><td id= 'txttd' valign='top'><label style = 'text-align:right; vertical-align:top' id='labl' for='txtarea'>text:</label></td><td><textarea id='txtarea' cols= '10' style='height:75px'>hello</textarea> </td></tr>");
					var txt_area = document.getElementById("txtarea");
					txt_area.innerHTML = canvas.getActiveObject().text;
					txt_area.onkeyup = function (e) {
						canvas.getActiveObject().text = this.value;
						matisse.comm.sendDrawMsg({
							action: "modified",
							args: [{
								uid: canvas.getActiveObject().uid,
								object: canvas.getActiveObject(),
								text: canvas.getActiveObject().text
							}]
						});
						canvas.getActiveObject().setCoords();
						canvas.renderAll();
					};
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
					defaultvalue: '#222222'
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
			
			importimage: {
				displayName: "importimage",
				activeIcon: "rectangle_w.png",
				inactiveIcon: "rectangle_g.png",
				toolAction: null,/*function (args) {
					var rect = new fabric.Rect({
						width: args.width,
						height: args.height,
						left: args.left,
						top: args.top
						
					});
					rect.uid = args.uid;
					rect.name = 'myimage';
					rect.palette = args.palette;
					
					//rect.selectable = false;
					canvas.add(rect);
				},*/
				modifyAction: function (args) {
					var obj = util.getObjectById(args.uid);
					var recvdObj = args.object;
					updateProperties(obj, recvdObj);
				},
				applyProperties: function (props) {
					objproperties._applyProperties(props);
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
					name: 'angle',
					type: 'number',
					action: function (args) {
						(args.obj).set("angle", args.property);
					},
					defaultvalue: 0
				}]
			},
			drawingpath: {
				displayName: "path",
				activeIcon: "brush_w.png",
				inactiveIcon: "brush_g.png",
				toolAction: null,
				modifyAction: function (args) {
					var obj = util.getObjectById(args.uid);
					var recvdObj = args.object;
					updateProperties(obj, recvdObj);
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
				},	{
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
				}]
			}, // end of path
		} // end of shapes
	}); // end of basic shapes
});