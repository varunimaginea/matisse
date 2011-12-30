/**
 * User: Bahvani Shankar,Pradeep
 * Date: 12/28/11
 * Time: 11:16 AM
 * About this : Define all wireframes here
 */



App.Shapes.registerpallette("wireframe", {
    collectionName: 'wireframe',
    shapes: {	
	label:{
		displayName: "label",
		activeIcon: "label_w.png",
		inactiveIcon: "label_g.png",
		toolAction: function (args) {
			var objects = [],
				txt = "label";
			args.width = App.Main.getStringWidth(txt) + 20;
			args.height = App.Main.getStringHeight(txt) + 20;		
			var text = new fabric.Text(txt, 
						{	
							fontSize : 20, 
							fontFamily : "delicious_500", 
							fontWeight : 20,
							left :0,
							top : 0,
							stroke: '#000000'							
						});			
			objects.push(text);
			App.Main.loadWireframe(args, objects);			
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
            },{
                name: 'angle',
                type: 'number',
                action: function (args) {
                    (args.obj).set("angle", args.property);
                },
                defaultvalue: 0
            }]
	},
	txt_button:{
		displayName: "txt_button",
		activeIcon: "button_w.png",
		inactiveIcon: "button_g.png",
		toolAction: function (args) {
			var objects = [],
				txt = "click me";
			args.width = App.Main.getStringWidth(txt) ;
			args.height = App.Main.getStringHeight(txt) - 2;			
				
			var border = new fabric.Polygon([{x:-args.width/2,y:args.height/2 - 2},
											 {x:-args.width/2 + 2, y: args.height/2},
											 {x:args.width/2 - 2, y: args.height/2},
											 {x:args.width/2, y:args.height/2 - 2},
											 {x:args.width/2,y: -args.height/2 + 2},
											 {x:args.width/2 - 2, y: -args.height/2},
											 {x: -args.width/2 + 2, y:-args.height/2},
											 {x: -args.width/2, y: -args.height/2 + 2}],											 
											 {
												fill:'#ffffff',
												stroke:'#000000'
											 });			
			var text = new fabric.Text(txt, 
						{	
							fontSize : 15, 
							fontFamily : "delicious_500", 
							fontWeight : 20,
							left :0,
							top : 0,
							stroke: '#000000'							
						});		
			border.setGradientFill(canvas.getContext(), {
							x1: 0,
							y1: args.height,
							x2: 0,
							y2: 0,
							colorStops: {
								0: '#fff',
								1: '#555'
							}
			});						
			objects.push(border);
			objects.push(text);
			App.Main.loadWireframe(args, objects);			
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
            },{
                name: 'angle',
                type: 'number',
                action: function (args) {
                    (args.obj).set("angle", args.property);
                },
                defaultvalue: 0
            }]
	},
	
	textbox:{
		displayName: "textbox",
		activeIcon: "input_w.png",
		inactiveIcon: "input_g.png",
		toolAction: function (args) {
			var objects = [],
				txt = "Hello !!!...";
			args.width = App.Main.getStringWidth(txt) + 20;
			args.height = App.Main.getStringHeight(txt) + 20;		
			var border = new fabric.Rect({
                    width: args.width,
                    height: args.height,
                    left: args.left,
                    top: args.top,
                    fill: '#FFFFFF',
                    stroke: '#000000',
                    angle: args.angle,
                    scaleX: 1,
                    scaleY: 1
                });
			var text = new fabric.Text(txt, 
						{	
							fontSize : 20, 
							fontFamily : "delicious_500", 
							fontWeight : 20,
							left :0,
							top : 0,
							stroke: '#000000'							
						});					
			objects.push(border);
			objects.push(text);
			App.Main.loadWireframe(args, objects);			
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
            },{
                name: 'angle',
                type: 'number',
                action: function (args) {
                    (args.obj).set("angle", args.property);
                },
                defaultvalue: 0
            }]
	},
	checkbox:{
		displayName: "checkbox",
		activeIcon: "checkbox_w.png",
		inactiveIcon: "checkbox_g.png",
		toolAction: function (args) {
			var objects = [],
				text = "check",
				margin = 15,
				space = 15;
			args.width = App.Main.getStringWidth(text) + args.side + (2 * margin) + space;
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
							left : -(-(App.Main.getStringWidth(text))/2 - text_left),
							top : 0
						});
			var tick = new fabric.Polyline([{x: checkbox_left+2,y:0},{x:checkbox_left+6,y:6},{x:checkbox_left+12,y:-6}],
					{fill:'#ffffff',stroke:'#000000'});
			objects.push(checkbox);
			objects.push(text);
			objects.push(tick);
			App.Main.loadWireframe(args, objects);			
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
            activeIcon: "radiobutton_w.png",
            inactiveIcon: "radiobutton_g.png",
            toolAction: function (args) {
				var fillColor = '#000000', _stroke = '#000000', _radius = 8, _opacity = 0.8,
					_fontfamily = 'delicious_500', _fontSize = 20
                var objects = [],
					text = "radio",
					width = 0;
				var outer_circle = new fabric.Circle({
                    radius: _radius,
                    left: -30,
                    top: 0,  
					fill: '#FFFFFF',
                    stroke: _stroke,
                    opacity: _opacity,
                    angle: args.angle
                });
				var inner_circle = new fabric.Circle({
                    radius: _radius/4,
                    left: -30,
                    top: 0,
                    fill: fillColor,                    
                    opacity: _opacity,
                    angle: args.angle
                });
				
				var txt = new fabric.Text(
					text,{
					left: 10,
                    top: 0,
                    fontFamily: _fontfamily,
					fontSize:_fontSize,
					fontWeight:20,
					textAlign:'right',
                    angle: args.angle,
                    fill: fillColor,
                    stroke: _stroke
				});
				objects.push(outer_circle);
				objects.push(inner_circle);
				objects.push(txt);
				var txt_width = App.Main.getStringWidth(text);
				width = txt_width + (2 * _radius) + 10 + 30;// 10 for space between circle and radius and 30 (15 + 15) margins
				outer_circle.left = - ((width/2) - 15);
				inner_circle.left = outer_circle.left;
				var text_left = outer_circle.left + (2 * _radius) + 10;
				txt.left = -(-(txt_width)/2 - text_left);
				args.width = width;		
				args.height = 50;
				App.Main.loadWireframe(args, objects);
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
            }]
        },
		combo:	{
		displayName: "combo",
		activeIcon: "combobox_w.png",
		inactiveIcon: "combobox_g.png",
		toolAction: function (args) {
			var objects = [],
				text = "Edit me",
				margin = 15,
				space = 5;
			args.width = App.Main.getStringWidth(text) + args.side + (2 * margin);
			args.height = 30;
			var outerRect = new fabric.Rect(
						{
							width: args.width,
							height: args.height,
							fill: '#ffffff',
							stroke: '#000000'
						}
					);
			
			var innerRect = new fabric.Polygon(      
                    [{x: args.width/2 - 25,y:args.height/2 },{x:args.width/2 , y:args.height/2},{x:args.width/2 , y:-args.height/2},{x:args.width/2 - 25, y:-args.height/2}],
					{
						fill: '#FFFFFF', 
						stroke:'#000000'						
					}
					);	
			var triangle = new fabric.Polygon([{x: args.width/2 - 17.5,y: -5},{x:args.width/2 - 7.5,y:-5},{x:args.width/2 - 12.5 ,y:5}],
					{fill:'#000000',stroke:'#000000'});				
			var text = new fabric.Text(text, 
						{	
							fontSize : 18, 
							fontFamily : "delicious_500", 
							fontWeight : 20,
							left : -4,
							top : 0
						});
			
			objects.push(outerRect);
			objects.push(innerRect);
			objects.push(triangle);
			objects.push(text);
			App.Main.loadWireframe(args, objects);			
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
                defaultvalue: 25
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
	progressbar: {
		displayName: "progressbar",
		activeIcon: "progressbar_w.png",
		inactiveIcon: "progressbar_g.png",
		toolAction: function (args) {
			var objects = [];				
			args.width = 150;
			args.height = 20;
			var outerRect = new fabric.Rect(
						{
							width: args.width,
							height: args.height,
							fill: '#ffffff',
							stroke: '#000000'
						}
					);
			
			var innerRect = new fabric.Polygon(      
                    [{x: -args.width/2,y:args.height/2 },{x:-args.width/4 , y:args.height/2},{x:-args.width/4 , y:-args.height/2},{x:-args.width/2, y:-args.height/2}],
					{
						fill: '#1c8e2a', 
						stroke:'#1c8e2a'						
					}
					);				
			objects.push(outerRect);
			objects.push(innerRect);			
			App.Main.loadWireframe(args, objects);			
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
                name: 'angle',
                type: 'number',
                action: function (args) {
                    (args.obj).set("angle", args.property);
                },
                defaultvalue: 0
            }]
	},
	slider:{
		displayName: "slider",
		activeIcon: "slider_w.png",
		inactiveIcon: "slider_g.png",
		toolAction: function (args) {
			var objects = [];				
			args.width = 200;
			args.height = 5;
			var outerRect = new fabric.Rect(
						{
							width: args.width,
							height: args.height,
							fill: '#aaaaaa',
							stroke: '#000000'
						}
					);
			
			var innerRect = new fabric.Rect(
						{
							width: 10,
							height: 15,
							fill: '#cccccc',
							stroke: '#000000'
						}
					);	
			var leftLine1 = new fabric.Polygon(      
                    [{x: -60,y:2.5 },{x:-59.95 , y:2.5},{x:-59.95 , y:10},{x:-60, y:10}],
					{
						fill: '#000000', 
						stroke:'#000000'						
					}
					);	
			var leftLine2 = new fabric.Polygon(      
                    [{x: -40,y:2.5 },{x:-39.95 , y:2.5},{x:-39.95 , y:7},{x:-40, y:7}],
					{
						fill: '#000000', 
						stroke:'#000000'						
					}
					);						
			var rightLine1 = new fabric.Polygon(      
                    [{x: 60,y:2.5 },{x:59.95 , y:2.5},{x:59.95 , y:10},{x:60, y:10}],
					{
						fill: '#000000', 
						stroke:'#000000'						
					}
					);
			var rightLine2 = new fabric.Polygon(      
                    [{x: 40,y:2.5 },{x:39.95 , y:2.5},{x:39.95 , y:7},{x:40, y:7}],
					{
						fill: '#000000', 
						stroke:'#000000'						
					}
					);	
			objects.push(outerRect);
			objects.push(innerRect);	
			objects.push(leftLine1);
			objects.push(rightLine1);
			objects.push(leftLine2);
			objects.push(rightLine2);
			App.Main.loadWireframe(args, objects);			
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
                name: 'angle',
                type: 'number',
                action: function (args) {
                    (args.obj).set("angle", args.property);
                },
                defaultvalue: 0
            }]
	},
	
	image:{
		displayName: "image",
		activeIcon: "image_w.png",
		inactiveIcon: "image_g.png",
		toolAction: function(args){
			var objects = [],
			text = "check";				
			args.width = 100;
			args.height = 75;			
			var border = new fabric.Polygon(      
                    [{x: -args.width/2,y:args.height/2},{x:args.width/2, y:args.height/2},{x:args.width/2, y:-args.height/2},{x:-args.width/2, y:-args.height/2}],
					{
						fill: '#FFFFFF', 
						stroke:'#000000'						
					}
					);				
			var diagonal1 = new fabric.Polyline([{x: -args.width/2,y:args.height/2},{x:args.width/2,y:-args.height/2}],
					{fill:'#ffffff',stroke:'#000000'});
			var diagonal2 = new fabric.Polyline([{x: args.width/2,y:args.height/2},{x:-args.width/2,y:-args.height/2}],
					{fill:'#ffffff',stroke:'#000000'});
			objects.push(border);
			objects.push(diagonal1);
			objects.push(diagonal2);			
			App.Main.loadWireframe(args, objects);	
		},
		properties:[{
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
            },{
                name: 'angle',
                type: 'number',
                action: function (args) {
                    (args.obj).set("angle", args.property);
                },
                defaultvalue: 0
            }]
	}, // end of image
	password:{
		displayName: "password",
		activeIcon: "password_w.png",
		inactiveIcon: "password_g.png",
		toolAction: function (args) {
			var objects = [],
				txt = "************";
			args.width = App.Main.getStringWidth(txt) + 30;
			args.height = App.Main.getStringHeight(txt);	
			var rect = new fabric.Rect(
							{left: args.left,
							top: args.top,
							width: args.width,
							height: args.height,
							fill: '#ffffff',
							stroke: '#000000'});
			var text = new fabric.Text(txt, 
						{	
							fontSize : 20, 
							fontFamily : "delicious_500", 
							fontWeight : 20,							
							stroke: '#000000',
							top: 3,
							left: 4
						});	
			objects.push(rect);						
			objects.push(text);
			App.Main.loadWireframe(args, objects);			
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
            },{
                name: 'angle',
                type: 'number',
                action: function (args) {
                    (args.obj).set("angle", args.property);
                },
                defaultvalue: 0
            }]
	}	
	} // end of shapes
} // end of wireframe
);