App.Templates.TextBox = {
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
};
