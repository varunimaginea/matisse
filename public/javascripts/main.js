/**
 * This is the main javascipt file to handle adding, editing, deleting all elements on canvas (text, rectangle, circle etc)
 * Uses 'Fabric.js' library for client side
 * Node.js and  Node Package Manager (NPM) for server side - JavaScript environment that uses an asynchronous event-driven model.
 */
var actions = {};
var fillColor = "#AAAAAA";
var getRandomInt = fabric.util.getRandomInt;

// Add Event listeners for all toolbar icons
document.getElementById("color").onchange = colorSelectListener;
document.getElementById("rectangleicon").onclick = rectButtonListener;
document.getElementById("circleicon").onclick = circleButtonListener;
document.getElementById("deleteicon").onclick = deleteButtonListener;
document.getElementById("drawing-mode").onclick = drawingButtonListener;
document.getElementById("texticon").onclick = textButtonListener;

/**
*
*
*/
function registerAction(action, drawCommand) {
	actions[action] = drawCommand;
}


/**
 *  Called when other users add, modify or delete any object
 *  data - shape(data.shape) and args array (data.args)
 * 
 */
matisse.onDraw = function (data) {
	(document.getElementById("debug")).value = actions[data.action]+'\n'+data.args;
	actions[data.action].apply(this, data.args);
}


// get fabric canvas
var canvas = new fabric.Canvas('c', {
    backgroundColor: '#FFFFFF'
    //HOVER_CURSOR: 'pointer'
});

//
observe('object:modified');
//observe('selection:cleared'); //observe('object:moved'); //observe('object:scaled'); 1/*observe('group:modified');observe('group:selected');observe('before:group:destroyed');observe('after:group:destroyed');*/
//observe('after:render');//observe('mouse:up');//observe('mouse:down');

// clear canvas
canvas.clear();

// remove currently selected object
canvas.remove(canvas.getActiveObject());
addText();
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
        if (eventName == "object:modified") {
            var obj = e.memo.target;
           	matisse.sendDrawMsg(
       			{action:"modified", 
				args:[obj.uid, 
				obj.getLeft(), 
				obj.getTop(), 
				obj.getScaleX(), 
				obj.getScaleY(), 
				obj.getAngle(), 
				obj.text] }
				)}
    });
	
}


function modifyObject(uid, left, top, scaleX, scaleY, angle, text) {
	 var obj = getObjectById(uid);
        obj.set("left", left);
        obj.set("top", top);
        obj.set("scaleX", scaleX);
        obj.set("scaleY", scaleY);
        obj.set("angle", angle);
		if(obj.type == "text")
		obj.text = text;
        canvas.setActiveObject(obj);
		canvas.renderAll()
}
registerAction("modified", modifyObject);

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
 * @property str, length
 * @type string
 */

function getRandomColor() {
    return (
    pad(getRandomInt(0, 255).toString(16), 2) + pad(getRandomInt(0, 255).toString(16), 2) + pad(getRandomInt(0, 255).toString(16), 2));
}



// called when 'rectangle button' clicked
//addRectangle(_width, _height, _left, _top, _fill, _angle, _uid)
function rectButtonListener(e) {
    var uid = uniqid();
    addRectangle(100, 50, 0, 0, fillColor, 0, uid);
	matisse.sendDrawMsg(
       {action:"rect", args:[ 100, 50, 0, 0, fillColor, 0, uid] }
        
    )
}

//called when 'circle button' clicked

function circleButtonListener(e) {
    var uid = uniqid();
    addCircle(20, 100, 100, fillColor, 1, 0, uid);
	matisse.sendDrawMsg(
       {action:"circle", args:[ 20, 100, 100, fillColor, 1, 0, uid] })
}

//called when 'text button' clicked

function textButtonListener(e) {
	addText(uid);
	matisse.sendDrawMsg({action:"text", args:[uid] })
}

//called when 'delete button' clicked

function deleteButtonListener(e) {
    deleteObjects();
}

//called when 'drawing button' clicked and mode is triggered from drawing-mode to non drawing mode and vice-versa

function drawingButtonListener(e) {
    swapBold(this)
    var drawingModeEl = document.getElementById('drawing-mode');
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
        // drawingModeEl.innerHTML = 'Cancel drawing mode';
        drawingModeEl.className = 'is-drawing';
    } else {
        // drawingModeEl.innerHTML = 'Enter drawing mode';
        drawingModeEl.className = '';
    }
}

// Listener for Color section

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
        if (obj.type != "path") obj.set("fill", fillColor);
        canvas.renderAll();
        matisse.sendDrawMsg({
            shape: "modifyColor",
            uid: obj.uid,
            fillClr: fillColor
        })
        //alert(obj.uid);
        //delete obj;
    }
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

function uniqid() {
    var newDate = new Date;
    //  alert(newDate.getTime());
    return newDate.getTime();
}



var drawingmode = false; 
function swapBold(x) {
    drawingmode = !drawingmode;
    x.src = (!drawingmode) ? 'images/nobrush.png' : 'images/brush.png'
}

function unhide(divID, className) {
    var item = document.getElementById(divID);
    if (item) {
        item.value = canvas.getActiveObject().text;
        item.className = className
    }
}
