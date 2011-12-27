App.Templates.Radio = {
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
};
