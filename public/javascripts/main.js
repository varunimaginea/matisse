/**
 * This is the main javascipt file to handle adding, editing, deleting all elements on canvas (text, rectangle, circle etc)
 * Uses 'Fabric.js' library for client side
 * Node.js and  Node Package Manager (NPM) for server side - JavaScript environment that uses an asynchronous event-driven model.
 */
var fillColor = "#AAAAAA";
var getRandomInt = fabric.util.getRandomInt;
var utilMin = fabric.util.array.min;
var utilMax = fabric.util.array.max;
var points = {};
var drawShape = false;
var action, shapeArgs;
var xPoints = [],
    yPoints = [];
var currTool;

/**
 *  Called when other users add, modify or delete any object
 *  data - shape(data.shape) and args array (data.args)
 * 
 */
matisse.onDraw = function (data) {
    //(document.getElementById("debug")).value = actions[data.action]+'\n'+data.args;
    //alert(data.args.join());
    if (data.action == "modified") {
        modifyObject(data.args[0])
    }
    if (data.action == "modifyColor") {
        modifyColorOnOther(data.args[0]);
    }
    if (data.action == "drawpath") {
        drawPath(data.args[0])
    }
    if (data.action == "chat") {
        var txt = document.createTextNode(data.args[0].text)
        $("#chattext").append(txt);
    }
    if (tools[data.action] != undefined) tools[data.action].toolAction.apply(this, data.args);

}


// get fabric canvas
var canvas = new fabric.Canvas('c', {
    backgroundColor: '#FFFFFF'
    //HOVER_CURSOR: 'pointer'
});

//
observe('object:modified');
canvas.observe('path:created', function () {
    //updateComplexity();
    //alert('path created');
    matisse.sendDrawMsg({
        action: "drawpath",
        args: [{
            _freeDrawingXPoints: xPoints,
            _freeDrawingYPoints: yPoints
        }]
    });
    xPoints = [];
    yPoints = [];
});
// observe('object:moved');  // not invoked when object is moved.
//observe('selection:cleared');
//observe('mouse:down') //observe('object:moved'); //observe('object:scaled'); 1/*observe('group:modified');observe('group:selected');observe('before:group:destroyed');observe('after:group:destroyed');*/
//observe('after:render');//observe('mouse:up');//observe('mouse:down');
// clear canvas
canvas.clear();

// remove currently selected object
canvas.remove(canvas.getActiveObject());
//addText();
/*canvas.add(new fabric.Path('M 0 100 a 100 100 0 1 1 200 0' , 
{ stroke: 'red', strokeWidth: 5, fill: "none", width: 200, height: 
100 })); */


function getObjectById(id) {
    var obj;
    var objs = canvas.getObjects();
    objs.forEach(function (object) {
        if (object.uid == id) {
            //alert((object.uid==id))
            obj = object;
        }
    });
    return obj;
}


function observe(eventName) {
    canvas.observe(eventName, function (e) {
        //alert(eventName);
        if (eventName == "object:modified") {
            var obj = e.memo.target;
            //alert(obj.angle);
            matisse.sendDrawMsg({
                action: "modified",
                args: [{
                    uid: obj.uid,
                    object: obj
                }] // When sent only 'object' for some reason object  'uid' is not available to the receiver method.
            })

        }
        if (eventName === "selection:cleared") {
            //var obj = e.memo.target;
            matisse.sendDrawMsg({
                action: "clearText",
                args: []
            })
            var textEl = document.getElementById('text');
            textEl.value = "";
            //(document.getElementById("debug")).value = "selection cleared";
        }
        if (eventName === "mouse:down") {
            //alert("mousedown"+canvas.isDrawingMode);
        }
    });

}


function modifyObject(args) {
    var obj = getObjectById(args.uid);
    var recObj = args.object;
    obj.set("left", recObj.left);
    obj.set("top", recObj.top);
    obj.set("scaleX", recObj.scaleX);
    obj.set("scaleY", recObj.scaleY);

    if (obj.type == "text") obj.text = recObj.text;
    obj.set("angle", recObj.angle);
    canvas.renderAll()
    canvas.setActiveObject(obj);
}


function clearText() {
    var textEl = document.getElementById('text');
    textEl.value = "";
}


/**
 * 
 * @property str, length
 * @type string
 */

function pad(str, length) {
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
};

/**
 * Returns color in RGB format
 * @property null
 * @type string
 */

function getRandomColor() {
    return (
    pad(getRandomInt(0, 255).toString(16), 2) + pad(getRandomInt(0, 255).toString(16), 2) + pad(getRandomInt(0, 255).toString(16), 2));
}


// called when 'rectangle button' clicked

function handleClick(e) {
    resetCurrTool();
    currTool = e.target;
    currTool.setAttribute('width', "100%");
    currTool.setAttribute('height', "100%");
    currTool.setAttribute('border', "2px");
    document.getElementById("c").style.cursor = 'default'
    drawShape = true;
    //alert(e.target.id)
    switch (e.target.id) {
    case "Rectangle":
        action = "rect"
        shapeArgs = [{
            width: 100,
            height: 50,
            fillColor: fillColor,
            strokeColor: 0x000000,
            angle: 0,
            uid: uniqid()
        }];
        break;
    case "Circle":
        action = "circle"
        shapeArgs = [{
            radius: 20,
            width: 100,
            height: 50,
            fillColor: fillColor,
            angle: 0,
            uid: uniqid()
        }];
        break;
    case "Text":
        action = "text"
        shapeArgs = [{
            fontFamily: 'delicious_500',
            width: 100,
            height: 50,
            fillColor: fillColor,
            angle: 0,
            uid: uniqid()
        }];
        break;
    case "Draw":
        drawShape = false;
        //var drawingModeEl = document.getElementById('drawing-mode');
        canvas.isDrawingMode = !canvas.isDrawingMode;
        this.src = (!canvas.isDrawingMode) ? 'images/nobrush.png' : 'images/brush.png'

        if (canvas.isDrawingMode) {
            document.getElementById("c").style.cursor = 'crosshair'
            //drawingModeEl.className = 'is-drawing';
        } else {
            document.getElementById("c").style.cursor = 'default'
            // drawingModeEl.innerHTML = 'Enter drawing mode';
            //drawingModeEl.className = '';
        }
        break;
    }
}


//called when 'delete button' clicked

function deleteButtonListener(e) {
    deleteObjects();
}

function chatButtonListener(e) {
    var msg = $("#chat").val();
    msg = "from $:" + msg + "\n";
    //alert(msg);
    var txt = document.createTextNode(msg)
    $("#chattext").append(txt);
    matisse.sendDrawMsg({
        action: "chat",
        args: [{
            text: msg
        }]
    });
}
//called when 'drawing button' clicked and mode is triggered from drawing-mode to non drawing mode and vice-versa

function drawingButtonListener(e) {

}

// Listener for Color section - because canvas.observe does not trigger modify event when color is changed.

function colorSelectListener(e) {
    // Determine which option was selected
    var newColor = this.options[this.selectedIndex].value;
    // Locally, set the line color to the selected value
    fillColor = newColor;
    // check if any object is currently selected
    if (canvas.getActiveObject()) {
        // get currently selected object
        var obj = canvas.getActiveObject();
        // apply selected color for stroke
        obj.set("stroke", fillColor);
        modifyColor(obj, fillColor);
        canvas.renderAll();
        matisse.sendDrawMsg({
            action: "modifyColor",
            args: [obj.uid, fillColor]
        })
        //alert(obj.uid);
        //delete obj;
    }
}

function handleMouseEvents() {
    var msg = "";
    $("#canvasId").mousedown(function (event) {
        resetCurrTool();
        msg = "==================\n";
        if (drawShape) {
            points.x = event.pageX - 100; //offset
            points.y = event.pageY - 135; //offset
            shapeArgs[0].left = points.x;
            shapeArgs[0].top = points.y;

            tools[action].toolAction.apply(this, shapeArgs);
            matisse.sendDrawMsg({
                action: action,
                args: shapeArgs
            });
            drawShape = false;
        }
        if (canvas.isDrawingMode) {
            xPoints = [];
            yPoints = [];
            xPoints.push(event.pageX - 100);
            yPoints.push(event.pageY - 135);

        }
    });
    // drawingModeEl.innerHTML = 'Cancel drawing mode';
    $("#canvasId").mousemove(function (event) {
        if (canvas.isDrawingMode) {
            xPoints.push(event.pageX - 100);
            yPoints.push(event.pageY - 135);
            msg += event.pageX + ", " + event.pageY + "\n :";

        }
    });
    $("#canvasId").mouseup(function () {
        //alert(msg);
        //$("#chattext").value = msg;
        //var txt=document.createTextNode(msg)
        //$("#chattext").append(txt)
        //$("#righttd").append("<div>" + msg + "</div>");
    });
}

function resetCurrTool() {
    if (currTool) {
        currTool.setAttribute('width', "80%");
        currTool.setAttribute('height', "80%");
        currTool.setAttribute('border', "0");
    }
}


/**
 *  change the color of an object
 *  @property obj - object of which color needs to be changed, 
 *            fColor - fillcolor
 *   
 */

function modifyColor(obj, fillColor) {
if(obj == undefined) return;
    if (obj.type != "path") obj.set("fill", fillColor);
}

function modifyColorOnOther(args) {
	var obj = getObjectById(args.uid);
    if (obj.type != "path") obj.set("fill", args.fillColor);
	canvas.renderAll();
}
/*(function() {
  var s = document.createElement('script'), t = document.getElementsByTagName('script')[0];
  s.async = true;
  s.src = 'http://api.flattr.com/js/0.6/load.js?mode=auto';
  t.parentNode.insertBefore(s, t);
})();*/



function deleteObjects() {
    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();
    matisse.sendDrawMsg({
        shape: "delete",
        uid: activeObject.uid

    })
    if (activeObject) {
        canvas.remove(activeObject);
    } else if (activeGroup) {
        var objectsInGroup = activeGroup.getObjects();
        canvas.discardActiveGroup();
        objectsInGroup.forEach(function (object) {
            canvas.remove(object);
        });
    }
}

var textEl = document.getElementById('text');
if (textEl) {
    textEl.onfocus = function () {
        var activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'text') {
            this.value = activeObject.text;
        }
    };
    textEl.onkeyup = function (e) {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
            if (!this.value) {
                canvas.discardActiveObject();
            } else {
                activeObject.text = this.value;
            }
            canvas.renderAll();
        }
    };
}


/**
 * Returns unique id to attach to an object
 * @property null
 * @type string
 */

function uniqid() {
    var newDate = new Date;
    //  alert(newDate.getTime());
    return newDate.getTime();
}

function unhide(divID, className) {
    var item = document.getElementById(divID);
    if (item) {
        item.value = canvas.getActiveObject().text;
        item.className = className
    }
}

function drawPath(args) {

    // canvas.contextTop.closePath();
    canvas._isCurrentlyDrawing = false;

    var minX = utilMin(args._freeDrawingXPoints),
        minY = utilMin(args._freeDrawingYPoints),
        maxX = utilMax(args._freeDrawingXPoints),
        maxY = utilMax(args._freeDrawingYPoints),
        ctx = canvas.contextTop,
        path = [],
        xPoint, yPoint, xPoints = args._freeDrawingXPoints,
        yPoints = args._freeDrawingYPoints;

    path.push('M ', xPoints[0] - minX, ' ', yPoints[0] - minY, ' ');

    for (var i = 1; xPoint = xPoints[i], yPoint = yPoints[i]; i++) {
        path.push('L ', xPoint - minX, ' ', yPoint - minY, ' ');
    }

    // TODO (kangax): maybe remove Path creation from here, to decouple fabric.Canvas from fabric.Path, 
    // and instead fire something like "drawing:completed" event with path string
    path = path.join('');

    if (path === "M 0 0 L 0 0 ") {
        // do not create 0 width/height paths, as they are rendered inconsistently across browsers
        // Firefox 4, for example, renders a dot, whereas Chrome 10 renders nothing
        return;
    }

    var p = new fabric.Path(path);

    p.fill = null;
    p.stroke = fillColor;
    p.strokeWidth = 1;
    canvas.add(p);
    p.set("left", minX + (maxX - minX) / 2).set("top", minY + (maxY - minY) / 2).setCoords();
    canvas.renderAll();
    //this.fire('path:created', { path: p });
}

function colorHandler() {
    $("#colors").on("click", "td", function () {
        //alert($(this).attr('bgcolor'));//.toggleClass("chosen");
        fillColor = $(this).attr('bgcolor');
        $("#fColor").attr("bgcolor", fillColor);
        if (canvas.getActiveObject()) {
            // get currently selected object
            var obj = canvas.getActiveObject();
            // apply selected color for stroke
            obj.set("stroke", fillColor);
            modifyColor(obj, fillColor);
            canvas.renderAll();
            // TODO - send data to server
			matisse.sendDrawMsg({
            action: "modifyColor",
            args: [{uid: obj.uid, fillColor:fillColor}]
			})
            //alert(obj.uid);
            //delete obj;
        }
    });
}
colorHandler();