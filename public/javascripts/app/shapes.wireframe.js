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
		displayIcon: "label.png",
		displayIcon2: "label.png",
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
		displayIcon: "txt_button.png",
		displayIcon2: "txt_button.png",
		toolAction: function (args) {
			var objects = [],
				txt = "click me";
			args.width = App.Main.getStringWidth(txt) + 5;
			args.height = App.Main.getStringHeight(txt) + 5;			
				
			var border = new fabric.Polygon([{x:-args.width/2,y:args.height/2 - 5},
											 {x:-args.width/2 + 5, y: args.height/2},
											 {x:args.width/2 - 5, y: args.height/2},
											 {x:args.width/2, y:args.height/2 - 5},
											 {x:args.width/2,y: -args.height/2 + 5},
											 {x:args.width/2 - 5, y: -args.height/2},
											 {x: -args.width/2 + 5, y:-args.height/2},
											 {x: -args.width/2, y: -args.height/2 + 5}],											 
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
		displayIcon: "textbox.png",
		displayIcon2: "textbox.png",
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
		displayIcon: "checkbox.png",
		displayIcon2: "checkbox.png",
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
            displayIcon: "radio.png",
            displayIcon2: "radio.png",
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
        }
		
	} // end of shapes
} // end of wireframe
);