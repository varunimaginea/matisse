/**
 * User: Bahvani Shankar,Pradeep
 * Date: 12/28/11
 * Time: 11:16 AM
 * About this : Define all wireframes here
 */


require(["app","app/shapes","app/main"],function(App,Shapes,Main){

     Shapes.registerpallette("wireframe", {
            collectionName: 'wireframe',
            shapes: {
                label:{
                    displayName: "label",
                    activeIcon: "label_w.png",
                    inactiveIcon: "label_g.png",
                    toolAction: function (args) {
                        var objects = [],
                            txt = args.paths ? args.paths[0].text : "label me";
                        args.width = args.paths ? args.paths[0].width : Main.getStringWidth(txt) + 20;
                        args.height = args.paths ? args.paths[0].height : Main.getStringHeight(txt) + 20;
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
                        Main.loadWireframe(args, objects);
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
                    },{
                        name: 'scaleX',
                        type: 'number',
                        action: function (args) {
                            (args.obj).set("angle", args.property);
                        },
                        defaultvalue: 1
                    },{
                        name: 'scaleY',
                        type: 'number',
                        action: function (args) {
                            (args.obj).set("angle", args.property);
                        },
                        defaultvalue: 1
                    }]
                },
                txt_button:{
                    displayName: "txt_button",
                    activeIcon: "button_w.png",
                    inactiveIcon: "button_g.png",
                    toolAction: function (args) {
                        var objects = [],
                            txt = args.paths ? args.paths[1].text : "click me";
                        args.width = Main.getStringWidth(txt)+1 ;
                        args.height = Main.getStringHeight(txt)+4;

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
                                left :1,
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
                        Main.loadWireframe(args, objects);
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
                    },{
                        name: 'scaleX',
                        type: 'number',
                        action: function (args) {
                            (args.obj).set("angle", args.property);
                        },
                        defaultvalue: 1
                    },{
                        name: 'scaleY',
                        type: 'number',
                        action: function (args) {
                            (args.obj).set("angle", args.property);
                        },
                        defaultvalue: 1
                    }]
                },

                textbox:{
                    displayName: "textbox",
                    activeIcon: "input_w.png",
                    inactiveIcon: "input_g.png",
                    toolAction: function (args) {
                        var objects = [],
                            txt = args.paths ? args.paths[1].text : "abc...";
                        args.width = args.paths ? args.paths[0].width : 150;
                        args.height = args.paths ? args.paths[0].height : 25;
                        var border = new fabric.Rect({
                            width: args.width,
                            height: args.height,
                            left: args.left,
                            top: args.top,
                            fill: '#fcfcfc',
                            stroke: '#dfdfdf',
                            angle: args.angle,
                            scaleX: 1,
                            scaleY: 1
                        });
                        var text = new fabric.Text(txt,
                            {
                                fontSize : 18,
                                fontFamily : "delicious_500",
                                fontWeight : 20,
                                left : args.paths ? args.paths[1].left : -45,
                                top : args.paths ? args.paths[1].top : 0,
                                stroke: '#000000'
                            });
                        objects.push(border);
                        objects.push(text);
                        Main.loadWireframe(args, objects);
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
                    },{
                        name: 'scaleX',
                        type: 'number',
                        action: function (args) {
                            (args.obj).set("angle", args.property);
                        },
                        defaultvalue: 1
                    },{
                        name: 'scaleY',
                        type: 'number',
                        action: function (args) {
                            (args.obj).set("angle", args.property);
                        },
                        defaultvalue: 1
                    }]
                },
                checkbox:{
                    displayName: "checkbox",
                    activeIcon: "checkbox_w.png",
                    inactiveIcon: "checkbox_g.png",
                    toolAction: function (args) {
                        var objects = [],
                            text = args.paths ? args.paths[1].text : "check",
                            margin = 15,
                            space = 15,
                            side = 14,
                            _stroke =  args.paths ? args.paths[2].stroke : "#000000",
                            _fill = "#000000";
                        args.width = args.width ? args.width : Main.getStringWidth(text) + side + (2 * margin) + space;
                        args.height = 30;
                        var checkbox_left = -(args.width / 2) + margin;
                        var checkbox = new fabric.Polygon(
                            [{x: checkbox_left,y:side/2},{x:checkbox_left + side, y:side/2},{x:checkbox_left + side, y:-side/2},{x:checkbox_left, y:-side/2}],
                            {
                                fill: '#eee',
                                stroke:'#000000'
                            }
                        );
                        var text_left = checkbox_left + side + space;
                        var text = new fabric.Text(text,
                            {
                                fontSize : 20,
                                fontFamily : "delicious_500",
                                fontWeight : 20,
                                left : args.paths ? args.paths[1].left : -(-(Main.getStringWidth(text))/2 - text_left),
                                top : 0,
                                fill: _fill,
                                stroke: _stroke
                            });
                        var tick = new fabric.Polyline([{x: checkbox_left+3,y:1},{x:checkbox_left+6,y:5},{x:checkbox_left+11,y:-5}],
                            {fill: '#ffffff',stroke: _stroke});
                        objects.push(checkbox);
                        objects.push(text);
                        objects.push(tick);
                        Main.loadWireframe(args, objects);
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
                    },
                        {
                            name: 'scaleX',
                            type: 'number',
                            action: function (args) {
                                (args.obj).set("angle", args.property);
                            },
                            defaultvalue: 1
                        },
                        {
                            name: 'scaleY',
                            type: 'number',
                            action: function (args) {
                                (args.obj).set("angle", args.property);
                            },
                            defaultvalue: 1
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
                            text = args.paths ? args.paths[2].text : "radio",
                            width = 0;
                        var outer_circle = new fabric.Circle({
                            radius: _radius,
                            left: -30,
                            top: 0,
                            fill: '#eee',
                            stroke: _stroke,
                            opacity: _opacity,
                            angle: args.angle
                        });
                        var inner_circle = new fabric.Circle({
                            radius: _radius/2,
                            left: -30,
                            top: 0,
                            fill: args.paths ? args.paths[1].fill : '#555555',
                            opacity: _opacity,
                            angle: args.angle
                        });

                        var txt = new fabric.Text(
                            text,{
                                left: args.paths ? args.paths[2].left : 10,
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
                        var txt_width = Main.getStringWidth(text);
                        width = txt_width + (2 * _radius) + 30;// 10 for space between circle and radius and 30 (15 + 15) margins
                        outer_circle.left = - ((width/2) - 15);
                        inner_circle.left = outer_circle.left;
                        var text_left = outer_circle.left + (2 * _radius) + 5;
                        txt.left = -(-(txt_width)/2 - text_left);
                        args.width = width;
                        args.height = 30;
                        Main.loadWireframe(args, objects);
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
                        },
                        {
                            name: 'scaleX',
                            type: 'number',
                            action: function (args) {
                                (args.obj).set("angle", args.property);
                            },
                            defaultvalue: 1
                        },
                        {
                            name: 'scaleY',
                            type: 'number',
                            action: function (args) {
                                (args.obj).set("angle", args.property);
                            },
                            defaultvalue: 1
                        }]
                },
                combo:	{
                    displayName: "combo",
                    activeIcon: "combobox_w.png",
                    inactiveIcon: "combobox_g.png",
                    toolAction: function (args) {
                        var objects = [],
                            text = args.paths ? args.paths[3].text : "Edit me",
                            margin = 15,
                            space = 5,
                            side = 25;
                        args.width = args.width ? args.width : Main.getStringWidth(text) + side + (2 * margin);
                        args.height = 20;
                        var outerRect = new fabric.Rect(
                            {
                                width: args.width,
                                height: args.height,
                                fill: '#fdfdfd',
                                stroke: '#ddd'
                            }
                        );

                        var innerRect = new fabric.Polygon(
                            [{x: args.width/2 - 22,y:args.height/2 },{x:args.width/2 , y:args.height/2},{x:args.width/2 , y:-args.height/2},{x:args.width/2 - 22, y:-args.height/2}],
                            {
                                fill: '#dfdfdf',
                                stroke:'#dfdfdf'
                            }
                        );
                        var triangle = new fabric.Polygon([{x: args.width/2 - 15.5,y: -2.5},{x:args.width/2 - 6.5,y:-2.5},{x:args.width/2 - 10.5 ,y:2.5}],
                            {fill:'#000000',stroke:'#000000'});
                        var text = new fabric.Text(text,
                            {
                                fontSize : 16,
                                fontFamily : "delicious_500",
                                fontWeight : 20,
                                left : args.paths ? args.paths[3].left : -4,
                                top : 0
                            });

                        objects.push(outerRect);
                        objects.push(innerRect);
                        objects.push(triangle);
                        objects.push(text);
                        Main.loadWireframe(args, objects);
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
                        }]
                },
                progressbar: {
                    displayName: "progressbar",
                    activeIcon: "progressbar_w.png",
                    inactiveIcon: "progressbar_g.png",
                    toolAction: function (args) {
                        var objects = [];
                        args.width = args.width ? args.width : 150;
                        args.height = args.height ? args.height : 20;
                        console.log("scaleX: "+args.scaleX + " scaleY: "+args.scaleY);
                        var outerRect = new fabric.Rect(
                            {
                                width: args.width,
                                height: args.height,
                                fill: '#ffffff',
                                stroke: '#8f8f8f'
                            }
                        );

                        var innerRect = new fabric.Polygon(
                            args.paths ? args.paths[1].points : [{x: -args.width/2,y:args.height/2 },{x:-args.width/4 , y:args.height/2},{x:-args.width/4 , y:-args.height/2},{x:-args.width/2, y:-args.height/2}],
                            {
                                fill: '#9f9f9f',
                                stroke:'#8f8f8f'
                            }
                        );
                        objects.push(outerRect);
                        objects.push(innerRect);
                        Main.loadWireframe(args, objects);
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
                        },{
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
                                fill: '#dfdfdf',
                                stroke: '#8f8f8f'
                            }
                        );

                        var innerRect = new fabric.Rect(
                            {
                                width: 10,
                                height: 15,
                                fill: '#8f8f8f',
                                stroke: '#9f9f9f'
                            }
                        );
                        var leftLine1 = new fabric.Polygon(
                            [{x: -60,y:2.5 },{x:-59.95 , y:2.5},{x:-59.95 , y:10},{x:-60, y:10}],
                            {
                                fill: '#AAAAAA',
                                stroke:'#AAAAAA'
                            }
                        );
                        var leftLine2 = new fabric.Polygon(
                            [{x: -40,y:2.5 },{x:-39.95 , y:2.5},{x:-39.95 , y:7},{x:-40, y:7}],
                            {
                                fill: '#AAAAAA',
                                stroke:'#AAAAAA'
                            }
                        );
                        var rightLine1 = new fabric.Polygon(
                            [{x: 60,y:2.5 },{x:59.95 , y:2.5},{x:59.95 , y:10},{x:60, y:10}],
                            {
                                fill: '#AAAAAA',
                                stroke:'#AAAAAA'
                            }
                        );
                        var rightLine2 = new fabric.Polygon(
                            [{x: 40,y:2.5 },{x:39.95 , y:2.5},{x:39.95 , y:7},{x:40, y:7}],
                            {
                                fill: '#AAAAAA',
                                stroke:'#AAAAAA	'
                            }
                        );
                        objects.push(outerRect);
                        objects.push(innerRect);
                        objects.push(leftLine1);
                        objects.push(rightLine1);
                        objects.push(leftLine2);
                        objects.push(rightLine2);
                        Main.loadWireframe(args, objects);
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
                        },{
                            name: 'scaleX',
                            type: 'number',
                            action: function (args) {
                                (args.obj).set("angle", args.property);
                            },
                            defaultvalue: 1
                        },{
                            name: 'scaleY',
                            type: 'number',
                            action: function (args) {
                                (args.obj).set("angle", args.property);
                            },
                            defaultvalue: 1
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
                                fill: '#fcfcfc',
                                stroke:'#6f6f6f'
                            }
                        );
                        var diagonal1 = new fabric.Polyline([{x: -args.width/2,y:args.height/2},{x:args.width/2,y:-args.height/2}],
                            {fill:'#ffffff',stroke:'#6f6f6f'});
                        var diagonal2 = new fabric.Polyline([{x: args.width/2,y:args.height/2},{x:-args.width/2,y:-args.height/2}],
                            {fill:'#ffffff',stroke:'#6f6f6f'});
                        var rect = new fabric.Rect({
                            width: 20,
                            height: 20,
                            left: 0,
                            top: 0,
                            fill: '#fcfcfc',
                            stroke: '#fcfcfc'
                        });
                        var textobj = new fabric.Text('w x h', {
                            left: 0,
                            top: 0,
                            fontFamily: 'delicious_500',
                            angle: 0,
                            fill: '#000000',
                            stroke: '#000000',
                            fontSize: 9
                        });
                        objects.push(border);
                        objects.push(diagonal1);
                        objects.push(diagonal2);
                        objects.push(rect);
                        objects.push(textobj);
                        Main.loadWireframe(args, objects);
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
                    },{
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
                }, // end of image
                password:{
                    displayName: "password",
                    activeIcon: "password_w.png",
                    inactiveIcon: "password_g.png",
                    toolAction: function (args) {
                        var objects = [],
                            txt = args.paths ? args.paths[1].text : "************";
                        args.width = Main.getStringWidth(txt) + 30;
                        args.height = Main.getStringHeight(txt);
                        var rect = new fabric.Rect(
                            {left: args.left,
                                top: args.top,
                                width: args.width,
                                height: args.height,
                                fill: '#fcfcfc',
                                stroke: '#dfdfdf'});
                        var text = new fabric.Text(txt,
                            {
                                fontSize : 20,
                                fontFamily : "delicious_500",
                                fontWeight : 20,
                                stroke: '#000000',
                                top: 4,
                                left: 4
                            });
                        objects.push(rect);
                        objects.push(text);
                        Main.loadWireframe(args, objects);
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
                    },{
                        name: 'scaleX',
                        type: 'number',
                        action: function (args) {
                            (args.obj).set("angle", args.property);
                        },
                        defaultvalue: 1
                    },{
                        name: 'scaleY',
                        type: 'number',
                        action: function (args) {
                            (args.obj).set("angle", args.property);
                        },
                        defaultvalue: 1
                    }]
                },
                div: {
                    displayName: "div",
                    activeIcon: "rectangle_w.png",
                    inactiveIcon: "rectangle_g.png",
                    toolAction: function (args) {
                        var rect = new fabric.Rect({
                            width: args.width,
                            height: args.height,
                            left: args.left,
                            top: args.top,
                            fill: null,
                            stroke: args.stroke,
                            scaleX: args.scaleX,
                            scaleY: args.scaleY
                        });
                        rect.uid = args.uid;
                        rect.name = 'div';
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
                    },  {
                        name: 'stroke',
                        type: 'string',
                        action: function (args) {
                            (args.obj).set("stroke", args.property);
                        },
                        defaultvalue: '#ccc'
                    }, {
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

});
