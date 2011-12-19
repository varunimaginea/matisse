/**
 * This is the main javascipt file to handle adding, editing, deleting all elements on canvas (text, rectangle, circle etc)
 * Uses 'Fabric.js' library for client side
 * Node.js and  Node Package Manager (NPM) for server side - JavaScript environment that uses an asynchronous event-driven model.
 */
 
var App = {}; // global Object cointainer
App.fillColor = "#AAAAAA";
App.points = {};
App.palette = {};
App.textEl; 
App.drawShape = false;
App.action; 
App.shapeArgs;
App.currTool;
App.xPoints = [],
App.yPoints = [];
App.xOffset
App.yOffset;
App.palletteName;
App.associateText = {};
// create canvas object
var canvas = new fabric.Canvas('c', {
    backgroundColor: '#FFFFFF'
    //HOVER_CURSOR: 'pointer'
	
}); 
canvas.isSelectMode = false;
$(document).ready(init);


function init() {
/*	 $("#c").gridBuilder({
    color:          '#eee',    // color of the primary gridlines
    secondaryColor: '#f9f9f9', // color of the secondary gridlines
    vertical:       18,        // height of the vertical rhythm
    horizontal:     18       // width of horizontal strokes
			// width of the gutter between strokes
  });*/
   setCanvasSize();
   App.xOffset = getOffset(document.getElementById('canvasId')).left;
   App.yOffset = getOffset(document.getElementById('canvasId')).top;

    addTools();
    colorHandler();
    
    document.onkeydown = keyDown;
    $('#chaticon').click(openChatBox);
    $('#propicon').click(openProp)
    //loadSVG()
    initTextEditWindow();
    initChatWindow();
	initPropWindow();
    addObservers();
}

function setCanvasSize() {
	var wid = $(document).width()-204; // width of left panels
	var ht =  $(document).height()// footer height
	$('#c').attr('width', "'"+wid+"'"); 
	$('#c').attr('height', "'"+ht+"'");
	canvas.setDimensions({width:wid, height:ht});
}
	
function initPropWindow() {
    $('#propdiv').dialog();
    $('#propdiv').dialog({
        resizable: false
    });
    $('#propdiv').dialog('close');
}

function initChatWindow() {
    $('#chatdialog').dialog();
    $('#chatdialog').dialog('close');
}

function initTextEditWindow() {
    $('#texteditdiv').dialog();
    $('#texteditdiv').dialog('close');
}

function addObservers() {
    observe('object:modified');
    observe('path:created');
    observe('selection:cleared');
    observe('object:moved');
    observe('object:selected');
}

function openChatBox() {
    var dialog_width = $("#chatdialog").dialog("option", "width");
    var win_width = $(window).width();
    $('#chatdialog').dialog({
        position: [win_width - dialog_width, 100]
    })
    $('#chatdialog').dialog('open')
    $('#chatdialog').dialog({
        resizable: false
    });
    $("#chatdialog").dialog("option", "show", 'slide');

}

function openProp() {
    if (canvas.getActiveObject() == undefined) return;
    var dialog_width = $("#chatdialog").dialog("option", "width");
    var win_width = $(window).width();
    $('#propdiv').dialog({
        position: [win_width - dialog_width, 300]
    })
    $('#propdiv').dialog('open')
}

/**
 *  Called when other users add, modify or delete any object
 *  data - shape(data.shape) and args array (data.args)
 * 
 */
matisse.onDraw = function (data) {
    console.log(data.action + "\n");
    if (data.action == undefined) {
		return;
	}
    if (data.action == "modified") {
        modifyObject(data.args[0])
    } else if (data.action == "modifyColor") {
        modifyColorOnOther(data.args[0]);
    } else if (data.action == "drawpath") {
        drawPath(data.args[0])
    } else if (data.action == "chat") {
        var txt = document.createTextNode(data.args[0].text)
        $("#chattext").append(txt);
    } else if (data.action == "delete") {
        var obj = getObjectById(data.args[0].uid);
        canvas.remove(obj);
        $('#prop').remove();
    } else {
        if (App.palette[data.pallette].shapes[data.action] != undefined) App.palette[data.pallette].shapes[data.action].toolAction.apply(this, data.args);
    }
}

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

function updatePropertyPanel(obj) {
    if (obj.type = "path") return;
    properties = getDefaultDataFromArray(App.palette["basic_shapes"].shapes[obj.name].properties);
    jQuery.each(properties, function (i, val) {
        $('#' + i).val(obj[i]);
    })
}

function observe(eventName) {
    canvas.observe(eventName, function (e) {
        // alert(eventName);
        switch (eventName) {
        case "object:modified":
            var obj = e.memo.target;
            //if(obj.type == "path-group") 	return;
            //alert(obj.angle);
            matisse.sendDrawMsg({
                action: "modified",
                args: [{
                    uid: obj.uid,
                    object: obj
                }] // When sent only 'object' for some reason object  'uid' is not available to the receiver method.
            })
			if(App.associateText[obj.name]) {
				App.associateText[obj.name].left = obj.left;
				App.associateText[obj.name].top = obj.top;
				App.associateText[obj.name].setAngle(obj.getAngle());
			}
            updatePropertyPanel(obj);
        break;

        case "selection:cleared":
            $('#prop').remove();
            $('#propdiv').dialog('close');
            $('#texteditdiv').dialog('close');
            //var obj = e.memo.target;
            matisse.sendDrawMsg({
                action: "clearText",
                args: []
            })
		break;
        case 'path:created':
            //alert("mousedown"+canvas.isDrawingMode);
            matisse.sendDrawMsg({
                action: 'drawpath',
                args: [{
                    _freeDrawingXPoints: App.xPoints,
                    _freeDrawingYPoints: App.yPoints
                }]
            });
            App.xPoints = [];
            App.yPoints = [];
        break;
        case 'object:selected':
            var obj = e.memo.target;
            //	if(obj.type == "path-group") 	return;
            //alert('selected')
			console.log("customName ="+e.memo.target.customName);
            if (e.memo.target.type == "text") showTextEditor();
            createPropertiesPanel(e.memo.target);
        break;
        }

    })
}


function modifyObject(args) {
    var obj = getObjectById(args.uid);
    //canvas.setActiveObject(obj);
    var recvdObj = args.object;
    obj.set("left", recvdObj.left);
    obj.set("top", recvdObj.top);
    obj.set("scaleX", recvdObj.scaleX);
    obj.set("scaleY", recvdObj.scaleY);
    if (obj.type == "text") obj.text = recvdObj.text;
    obj.setAngle(recvdObj.angle)
    //  obj.set("angle", recvdObj.angle);
    canvas.setActiveObject(obj)
    updatePropertyPanel(obj)
    obj.setCoords(); // without this object selection pointers remain at orginal postion(beofore modified)
    /*======================================================================================================*/
	/*** for some reason below code not working for circle modification, hence commented and using above code
	/*======================================================================================================
	 for (var prop in recvdObj) {
			  obj.set(prop, recvdObj[prop]);
			  $("#chattext").append(prop);
			}
    obj.setCoords();**/
    canvas.renderAll();
}


function clearText() {
    var textEl = document.getElementById('textarea');
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
    var getRandomInt = fabric.util.getRandomInt;
    return (
    pad(getRandomInt(0, 255).toString(16), 2) + pad(getRandomInt(0, 255).toString(16), 2) + pad(getRandomInt(0, 255).toString(16), 2));
}


// called when 'rectangle button' clicked

function handleClick(e) {
	canvas.isSelectMode = false;
    resetCurrTool();
    App.currTool = e.target;
    App.currTool.setAttribute('border', "2px");
    document.getElementById("c").style.cursor = 'default'
    App.drawShape = true;
    App.action = e.target.id;
    App.palletteName = $(e.target).parent().attr('id');
    console.log("pallette ==============" + App.palletteName);
	document.getElementById("c").style.cursor = (canvas.isSelectMode) ? 'default' :'crosshair' ; 
    var obj = getDefaultDataFromArray(App.palette[App.palletteName].shapes[e.target.id].properties);
    //alert(e.target.id)
    if (App.action != "path") {
        canvas.isDrawingMode = false;
        //document.getElementById("path").src =  'images/nobrush.png' 
    } else {
         canvas.isDrawingMode = !canvas.isDrawingMode;
		 return;
    }
	
    
    obj.uid = uniqid();
    App.shapeArgs = [obj];

}

function getDefaultDataFromArray(arr) {
    if (arr == undefined) return "undefined";
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i].name] = arr[i].defaultvalue;
    }
    //alert(obj);
    return obj;
}


function applyProperty(objName, prop, val) {
	if(prop == "fill" || prop == "stroke") val = "#"+val;
	console.log('apply App.palletteName '+App.palletteName+'   '+val);
    var arr = [{
        obj: canvas.getActiveObject(),
        property: val
    }]
    for (var i = 0; i < App.palette[App.palletteName].shapes[objName].properties.length; i++) {
        if (App.palette[App.palletteName].shapes[objName].properties[i].name == prop) {
            App.palette[App.palletteName].shapes[objName].properties[i].action.apply(this, arr);
            canvas.renderAll();
            canvas.getActiveObject().setCoords();
        }
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
         if (!canvas.isDrawingMode && App.drawShape) {
            App.points.x = event.pageX - App.xOffset; //offset
            App.points.y = event.pageY - App.yOffset; //offset
            App.shapeArgs[0].left = App.points.x;
            App.shapeArgs[0].top = App.points.y;
            App.shapeArgs[0].name = App.action;
            App.shapeArgs[0].pallette = App.palletteName;
            App.palette[App.palletteName].shapes[App.action].toolAction.apply(this, App.shapeArgs);
            matisse.sendDrawMsg({
                pallette: App.palletteName,
                action: App.action,
                args: App.shapeArgs
            });
       

        }
        if (canvas.isDrawingMode) {
            App.xPoints = [];
            App.yPoints = [];
            App.xPoints.push(event.pageX - App.xOffset);
            App.yPoints.push(event.pageY - App.yOffset);

        }
    });
    // drawingModeEl.innerHTML = 'Cancel drawing mode';
    $("#canvasId").mousemove(function (event) {
        if (canvas.isDrawingMode) {
            App.xPoints.push(event.pageX - App.xOffset);
            App.yPoints.push(event.pageY - App.yOffset);
           // msg += event.pageX + ", " + event.pageY + "\n :";

        }
    });

}

function resetCurrTool() {
    if (App.currTool) {
        App.currTool.setAttribute('border', "0");
    }
}


/**
 *  change the color of an object
 *  @property obj - object of which color needs to be changed, 
 *            fColor - fillcolor
 *   
 */

function modifyColor(obj, fillColor) {
    if (obj == undefined) return;
    if (obj.type != "path") obj.set("fill", fillColor);
}

function modifyColorOnOther(args) {
    var obj = getObjectById(args.uid);
    if (obj.type != "path") obj.set("fill", args.fillColor);
    canvas.renderAll();
}


function deleteObjects() {
    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();

    if (activeObject) {
        canvas.remove(activeObject);
        matisse.sendDrawMsg({
            action: "delete",
            args: [{
                uid: activeObject.uid
            }]
        })
        $('#prop').remove();
    } else if (activeGroup) {
        var objectsInGroup = activeGroup.getObjects();
        canvas.discardActiveGroup();
        objectsInGroup.forEach(function (object) {
            canvas.remove(object);
        });
    }
}

function textHandler() {
    App.palette = document.getElementById('textarea');
    if (App.palette) {
        App.palette.onfocus = function () {
            var activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.type === 'text') {
                this.value = activeObject.text;
            }
        };
        App.palette.onkeyup = function (e) {
            var activeObject = canvas.getActiveObject();
            if (activeObject) {
                if (!this.value) {
                    canvas.discardActiveObject();
                } else {
                    activeObject.text = this.value;
                }
                canvas.renderAll();
                matisse.sendDrawMsg({
                    action: "modified",
                    args: [{
                        uid: activeObject.uid,
                        object: activeObject
                    }]
                });
            }
        };
    }
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
    var utilMin = fabric.util.array.min;
    var utilMax = fabric.util.array.max;
    var minX = utilMin(args._freeDrawingXPoints),
        minY = utilMin(args._freeDrawingYPoints),
        maxX = utilMax(args._freeDrawingXPoints),
        maxY = utilMax(args._freeDrawingYPoints),
        ctx = canvas.contextTop,
        path = [],
		xPoint, yPoint,	xPoints = args._freeDrawingXPoints,
		yPoints = args._freeDrawingYPoints;
   console.log('xPoints '+xPoints);
	path.push('M ',xPoints[0] - minX, ' ', yPoints[0] - minY, ' ');

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
    p.stroke = App.fillColor;
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
            // send data to server
            matisse.sendDrawMsg({
                action: "modifyColor",
                args: [{
                    uid: obj.uid,
                    fillColor: fillColor
                }]
            })
            //alert(obj.uid);
            //delete obj;
        }
    });
}

function createPropertiesPanel(obj) { /*$('#propdiv').dialog();*/
    $('#prop').remove();
  //  console.log(palletteName + "     " + obj.name)
    objName = obj.name;
    App.palletteName = obj.pallette;
    if (objName == undefined) return;
    properties = getDefaultDataFromArray(App.palette[App.palletteName].shapes[objName].properties);
    var props = {};
    //alert(obj.width);
    $('#propdiv').append('<div id="prop"><table id="proptable"></table></div>');
    jQuery.each(properties, function (i, val) {
        if (i === "fill" || i === "stroke") var inputTag = "<input  style='width:70px' onKeyPress='return letternumber(event)' class= 'color' id='" + i + "' value='" + obj[i] + "'><br>";
        else var inputTag = "<input type='text' style='width:70px' onKeyPress='return numbersonly(this, event)' id='" + i + "' value='" + obj[i] + "'></input><br>";
        var propDiv = $("#proptable");
        propDiv.append("<tr><td width='200px'><label for='" + i + "'>" + i + " </label>" + inputTag + "</td></tr>"); //(" - " + val));
        var inBox = $("#" + i);
        // inBox.addClass('inbox');
        inBox.keyup(function () {
            if (!canvas.getActiveObject()) return;
            applyProperty(objName, i, $("#" + i).val());
            matisse.sendDrawMsg({
                action: "modifiedbyvalue",
                args: [{
                    uid: obj.uid,
                    object: obj
                }]
            });
        });
        // getDataFromArray(panel[obj].properties)[i].action.apply(this, $("#"+i).val())
    });
	$('.color').jPicker();
}

/**
 * Grabs all the shape elements and creates a tool icon for each shape, to add in the toolbar
 *
 */

function addTools() {
    //$('#leftdiv').draggable()
    $('#leftdiv').css('zIndex', '100')
	$('#toolsdiv').append("<div><img id='selecttool' src='images/select_arrow.gif'></img>");
	$('#selecttool').click( function() {
		resetCurrTool();
		App.currTool = this;
		App.currTool.setAttribute('border', "2px");		
	    App.drawShape = false;
		canvas.isSelectMode = true;
		canvas.isDrawingMode = false;
	});
    for (var i in App.palette["basic_shapes"].shapes) {
        $('#toolsdiv').append("<div id='basic_shapes' ></div>")
        var dispName = App.palette["basic_shapes"].shapes[i].displayName;
        var src = 'images/' + App.palette["basic_shapes"].shapes[i].displayIcon;
        $('#basic_shapes').append("<img id='" + dispName + "' src='" + src + "'/><br>");
        $('#' + dispName).click(handleClick);
    }
    for (var i in App.palette["svg"].shapes) {
        $('#svgdiv').append("<div id='svg'></div>")
        var dispName = App.palette["svg"].shapes[i].displayName;
        var src = 'images/' + App.palette["svg"].shapes[i].displayIcon;
        $('#svg').append("<img id='" + dispName + "' src='" + src + "'/><br>");
        $('#' + dispName).click(handleClick);
    }
	$('#toolsdiv').append("<div><img id='deletetool' src='images/delete.png'></img>");
	$('#deletetool').click( function() {
		 deleteObjects();
	});
    $("#accordion").accordion();
    //document.getElementById("drawing-mode").onclick = drawingButtonListener;
    $('#chatbutton').click(chatButtonListener);
    handleMouseEvents()
}

function keyDown(e) {
    var evt = (e) ? e : (window.event) ? window.event : null;
    if (evt) {
        var key = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
        if (key == "46" && key == "17") {
            deleteObjects();
        }
    }
}

function getOffset(el) {
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return {
        top: _y,
        left: _x
    };
}

function loadSVG(args) {
    
	fabric.loadSVGFromURL('images/svg/' + args.svg, function (objects, options) {
        //   console.log("OBJECTS LENGTH :::"+objects.length)	
        var loadedObject;
        if (objects.length > 1) {
            loadedObject = new fabric.PathGroup(objects, options);
        } else {
            loadedObject = objects[0];
        }

        loadedObject.set({
            left: args.left,
            top: args.top,
            angle: 0
        });
        loadedObject.name = args.name;
        loadedObject.pallette = args.pallette;
        loadedObject.scaleToWidth(300).setCoords();
        canvas.add(loadedObject);	
		var tempx = App.shapeArgs[0].left;
		var tempy = App.shapeArgs[0].top;
		//var obj = {};
		var obj = getDefaultDataFromArray(App.palette["basic_shapes"].shapes["text"].properties);
		obj.uid = uniqid();
		App.shapeArgs[0]=obj;
		App.shapeArgs[0].left = tempx;
		App.shapeArgs[0].top = tempy;
		App.shapeArgs[0].name = 'text';
		App.shapeArgs[0].pallette = 'basic_shapes';
		App.shapeArgs[0].selectable = false;
		App.shapeArgs[0].parentname = loadedObject.name;
		App.palette["basic_shapes"].shapes["text"].toolAction.apply(this, App.shapeArgs);
    });
	

}

function showTextEditor() {
    $('#texteditdiv').dialog();
    $('#texteditdiv').dialog('open');
    textHandler();
}

function numbersonly(myfield, e, dec) {
    var key;
    var keychar;

    if (window.event) key = window.event.keyCode;
    else if (e) key = e.which;
    else return true;
    keychar = String.fromCharCode(key);

    // control keys
    if ((key == null) || (key == 0) || (key == 8) || (key == 9) || (key == 13) || (key == 27)) return true;

    // numbers
    else if ((("0123456789").indexOf(keychar) > -1)) return true;

    // decimal point jump
    else if (dec && (keychar == ".")) {
        myfield.form.elements[dec].focus();
        return false;
    } else return false;
}


function letternumber(e) {
    var key;
    var keychar;

    if (window.event) key = window.event.keyCode;
    else if (e) key = e.which;
    else return true;
    keychar = String.fromCharCode(key);
    keychar = keychar.toLowerCase();

    // control keys
    if ((key == null) || (key == 0) || (key == 8) || (key == 9) || (key == 13) || (key == 27)) return true;

    // alphas and numbers
    else if ((("abcdefghijklmnopqrstuvwxyz0123456789").indexOf(keychar) > -1)) return true;
    else return false;
}
