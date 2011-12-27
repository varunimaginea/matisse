App.Templates.Rectangle = {
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
                scaleX: args.scaleX,
                scaleY: args.scaleY
            });
            rect.uid = args.uid;
            rect.name = args.name;
            rect.pallette = args.pallette;
            rect.customName = "rectangle";
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
};

