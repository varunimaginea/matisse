App.Templates.TxtButton = {
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
};
