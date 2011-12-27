/**
 * User: Pradeep
 * Date: 12/27/11
 * Time: 11:16 AM
 * About this :This file contains data needed to create label.
 */
App.Data.Label = {
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
};
