/**
 * User: Pradeep
 * Date: 12/27/11
 * Time: 11:16 AM
 * About this :This file contains data needed to create button.
 */
App.Data.Button =  {
    displayName: "button",
    displayIcon: "button.png",
    displayIcon2: "svg2.jpg",
    toolAction: function (args) {
        args.svg = 'button.svg';
        args.name = 'pathgroup2';
        App.Main.loadSVG(args);
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
        defaultvalue: 200
    }, {
        name: 'scaleY',
        type: 'number',
        action: function (args) {
            (args.obj).set("scaleY", args.property);
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
};
