App.Templates.Circle = {
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
            scaleX: args.scaleX,
            scaleY: args.scaleY
        });
        cir.setAngle(args.angle)
        cir.uid = args.uid;
        cir.name = args.name;
        cir.pallette = args.pallette;
        cir.customName = "circle";
        canvas.add(cir);
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
};
