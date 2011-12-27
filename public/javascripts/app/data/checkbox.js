/**
 * User: Pradeep
 * Date: 12/27/11
 * Time: 11:16 AM
 * About this :This file contains data needed to create checkbox.
 */
App.Data.CheckBox = {
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
};
