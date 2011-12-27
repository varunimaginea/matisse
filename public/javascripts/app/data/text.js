/**
 * User: Pradeep
 * Date: 12/27/11
 * Time: 11:16 AM
 * About this :This file contains data needed to create text.
 */
App.Data.Text = {
    displayName: "text",
    displayIcon: "text.png",
    displayIcon2: "notext.png",
    toolAction: function addText(args) {
        console.log("load text.....");
        var text = 'text text text...';
        var textSample = new fabric.Text(text, {
            left: args.left,
            top: args.top,
            fontFamily: args.fontFamily,
            angle: args.angle,
            fill: args.fill,
            stroke: args.stroke
        });
        //alert(textSample)
        textSample.uid = args.uid;
        textSample.name = args.name;
        textSample.pallette = args.pallette;
        textSample.customName = "text";
        canvas.add(textSample);

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
            defaultvalue: '#FF0000'
        },

        {
            name: 'stroke',
            type: 'string',
            action: function (args) {
                (args.obj).set("stroke", args.property);
            },
            defaultvalue: '#00FF00'
        },

        {
            name: 'angle',
            type: 'number',
            action: function (args) {
                (args.obj).set("angle", args.property);
            },
            defaultvalue: 0
        }]
};
