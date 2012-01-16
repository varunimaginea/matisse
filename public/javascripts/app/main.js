/**
 * User: Bahvani Shankar
 * Date: 01/13/12
 * Time: 11:16 AM
 * About this : This is the main javascipt file to handle adding, editing, deleting all elements on canvas (text, rectangle, circle etc)
 * Uses 'Fabric.js' library for client side
 * Node.js and  Node Package Manager (NPM) for server side - JavaScript environment that uses an asynchronous event-driven model.
 */ (function ($) {
    var currentTool = "";
    /**
     * @namespace
     */
    matisse.main = {};

    // create canvas object
    window.canvas = new fabric.Canvas('c', {
        backgroundColor: '#FFFFFF'
    });


    /**
     * current active reference
     */
    var $currActiveIcon;

    /**
     * by default selection mode is false 
     */
    canvas.isSelectMode = false;

    /**
     * Initializes the application
     * @method matisse.main.init
     * @param none
     *
     */

    matisse.main.init = function () {
        matisse.ui.initWidthAndHeightOfPanels();
        matisse.ui.resizeWindow();
        matisse.ui.setCanvasSize();
        matisse.ui.bindResizeWindow();
        canvas.isSelectMode = true;
        matisse.xOffset = matisse.util.getOffset(document.getElementById('canvasId')).left;
        matisse.yOffset = matisse.util.getOffset(document.getElementById('canvasId')).top;

        addTools();

        document.onkeydown = keyDown;
        $('#chaticon').click(openChatWindow);
        $('#propicon').click(openPropertiesPanel);

        initChatWindow();
        initPropWindow();
        addObservers();
        saveButtonClickHandler();
        newButtonClickHanlder();
    }


    /**
     * Initializes the Properties Window, hide it initially
     * @method initPropWindow
     * @param none
     *
     */
    function initPropWindow() {
        $('#propdiv').dialog();
        $('#propdiv').dialog({
            width: 'auto',
            height: 'auto',
            resizable: false
        });
        $('#propdiv').dialog('close');
    }
    /**
     * Initializes the Chat Window, hide it initially
     * @method initChatWindow
     * @param none
     *
     */
    function initChatWindow() {
        $('#chatdialog').dialog();
        $('#chatdialog').dialog('close');
    }

    /**
     * Regiser observers to observe any object changes like resize, rotate, move etc
     * @method addObservers
     * @param none
     *
     */
    function addObservers() {
        matisse.fabric.observe('object:modified');
        matisse.fabric.observe('path:created');
        matisse.fabric.observe('selection:cleared');
        matisse.fabric.observe('object:moved');
        matisse.fabric.observe('object:selected');
    }
    /**
     * Open Chat Window when user clicks on chat icon
     * @method openChatWindow
     * @param none
     *
     */
    function openChatWindow() {
        $('#chatdialog').dialog({
            width: 200
        });
        var dialog_width = $("#chatdialog").dialog("option", "width");
        var win_width = $(window).width();
        $('#chatdialog').dialog({
            position: [win_width - dialog_width, 100]
        })

        $('#chatdialog').dialog('open')
        $('#chatdialog').dialog({
            resizable: false
        });

    }

    /**
     * Open a Properties panel for currently selected object
     * @method openPropertiesPanel
     * @param none
     */
    function openPropertiesPanel() {
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
     *  @method  matisse.onDraw
     *  @param data - shape(data.shape) and args array (data.args)
     *
     */

    matisse.com.onDraw = function (data) {
        if (data && data.args) {
            if (data.action == undefined || data.action == null) {
                return;
            }
            if (data.action == "modified") {
                modifyObject(data.args[0])
            } else if (data.action == "modifiedbyvalue") {
                setObjectProperty(data.args[0]);
            } else if (data.action == "drawpath") {
                drawPath(data.args[0])
            } else if (data.action == "chat") {
                var txt = document.createTextNode(data.args[0].text)
                $("#chattext").append(txt);
            } else if (data.action == "delete") {
                var obj = getObjectById(data.args[0].uid);
                canvas.remove(obj);
                $('#prop').remove();
            } else if (data.action == "importimage") {
                loadImage(data.args[0]);
            } else {
                if (matisse.pallette[data.pallette] != undefined) {
                    matisse.pallette[data.pallette].shapes[data.action].toolAction.apply(this, data.args);
                }
            }
        }
    }

    /**
     * Searches for the object with the given id and returns that object
     * @property id
     * @type object
     */

    function getObjectById(id) {
        var obj;
        var objs = canvas.getObjects();
        objs.forEach(function (object) {
            if (object.uid == id) {
                obj = object;
            }
        });
        return obj;
    }

    /**
     *  Updates proeperties panel with current selected object properites
     *  @method  updatePropertyPanel
     *  @param obj - Object
     *
     */
     matisse.main.updatePropertyPanel = function(obj) {
        if (matisse.pallette[matisse.palletteName] == null) return;
        if (canvas.getActiveGroup()) return;
        if (obj && obj.name && obj.pallette) {
            properties = getDefaultDataFromArray(matisse.pallette[matisse.palletteName].shapes[obj.name].properties);
            jQuery.each(properties, function (i, value) {
                $('#' + i).val(obj[i]);
            })
            if (obj.getAngle()) {
                $('#angle').val(obj.getAngle());
            }
        }
    }
    /**
     *  Notify Server about Group Moved
     *  @method  notifyServerGroupMoved
     *  @param none
     */
    function notifyServerGroupMoved() {
        activeGroup = canvas.getActiveGroup();
        var objectsInGroup = activeGroup.getObjects();
        canvas.discardActiveGroup();
        objectsInGroup.forEach(function (obj) {
            matisse.com.sendDrawMsg({
                action: "modified",
                name: obj.name,
                pallette: obj.pallette,
                args: [{
                    uid: obj.uid,
                    object: obj
                }] // When sent only 'object' for some reason object  'uid' is not available to the receiver method.
            })
        });

    }

    
    /**
     *  Modify object when receive a notification from server 
     *  @method  modifyObject
     *  @param args - args array/object
     */
    function modifyObject(args) {
        var obj = getObjectById(args.uid);

        if (obj) {
            var recvdObj = args.object;
            console.log("recvdObj pallette = " + recvdObj.pallette + " recvdObj name =" + recvdObj.name);
            obj.set("left", recvdObj.left);
            obj.set("top", recvdObj.top);
            obj.set("scaleX", recvdObj.scaleX);
            obj.set("scaleY", recvdObj.scaleY);
            if (recvdObj.fill) obj.set("fill", recvdObj.fill);
            if (recvdObj.stroke) obj.set("stroke", recvdObj.stroke);
            if (obj.name == "text") obj.text = recvdObj.text;
            obj.setAngle(recvdObj.angle)
            //  obj.set("angle", recvdObj.angle);
            if (obj.pallette == "wireframe") {
                switch (obj.name) {
                case "radio":
                    obj.paths[0].fill = recvdObj.paths[0].fill;
                    obj.paths[0].left = recvdObj.paths[0].left;
                    obj.paths[1].left = recvdObj.paths[1].left;
                    obj.paths[2].left = recvdObj.paths[2].left;
                    obj.paths[2].text = recvdObj.paths[2].text;
                    obj.width = recvdObj.width;
                    break;

                case "checkbox":

                    obj.paths[0].points[0].x = recvdObj.paths[0].points[0].x;
                    obj.paths[0].points[1].x = recvdObj.paths[0].points[1].x;
                    obj.paths[0].points[2].x = recvdObj.paths[0].points[2].x;
                    obj.paths[0].points[3].x = recvdObj.paths[0].points[3].x;
                    obj.paths[1].left = recvdObj.paths[1].left;
                    obj.paths[1].text = recvdObj.paths[1].text;
                    obj.paths[2].stroke = recvdObj.paths[2].stroke;
                    obj.paths[2].points[0].x = recvdObj.paths[2].points[0].x;
                    obj.paths[2].points[1].x = recvdObj.paths[2].points[1].x;
                    obj.paths[2].points[2].x = recvdObj.paths[2].points[2].x;
                    obj.width = recvdObj.width;
                    break;
                case "password":
                case "textbox":
                    obj.left = recvdObj.left;
                    obj.top = recvdObj.top;
                    obj.width = recvdObj.width;
                    obj.height = recvdObj.height;
                    obj.paths[0].width = recvdObj.paths[0].width;
                    obj.paths[0].height = recvdObj.paths[0].height;
                    obj.paths[1].text = recvdObj.paths[1].text;
                    break;

                case "label":
                    obj.left = recvdObj.left;
                    obj.top = recvdObj.top;
                    obj.width = recvdObj.width;
                    obj.height = recvdObj.height;
                    obj.paths[0].width = recvdObj.paths[0].width;
                    obj.paths[0].height = recvdObj.paths[0].height;
                    obj.paths[0].text = recvdObj.paths[0].text;
                    break;

                case "txt_button":
                    obj.left = recvdObj.left;
                    obj.width = recvdObj.width;
                    obj.paths[0].points[0].x = recvdObj.paths[0].points[0].x;
                    obj.paths[0].points[1].x = recvdObj.paths[0].points[1].x;
                    obj.paths[0].points[2].x = recvdObj.paths[0].points[2].x;
                    obj.paths[0].points[3].x = recvdObj.paths[0].points[3].x;
                    obj.paths[0].points[4].x = recvdObj.paths[0].points[4].x;
                    obj.paths[0].points[5].x = recvdObj.paths[0].points[5].x;
                    obj.paths[0].points[6].x = recvdObj.paths[0].points[6].x;
                    obj.paths[0].points[7].x = recvdObj.paths[0].points[7].x;
                    obj.paths[1].text = recvdObj.paths[1].text;
                    break;

                case "combo":
                    obj.left = recvdObj.left;
                    obj.width = recvdObj.width;
                    obj.paths[0].width = recvdObj.paths[0].width;
                    obj.paths[1].points[0].x = recvdObj.paths[1].points[0].x;
                    obj.paths[1].points[1].x = recvdObj.paths[1].points[1].x;
                    obj.paths[1].points[2].x = recvdObj.paths[1].points[2].x;
                    obj.paths[1].points[3].x = recvdObj.paths[1].points[3].x;
                    obj.paths[2].points[0].x = recvdObj.paths[2].points[0].x;
                    obj.paths[2].points[1].x = recvdObj.paths[2].points[1].x;
                    obj.paths[2].points[2].x = recvdObj.paths[2].points[2].x;
                    obj.paths[3].text = recvdObj.paths[3].text;
                    break;

                case "progressbar":
                    obj.paths[1].points[1].x = recvdObj.paths[1].points[1].x;
                    obj.paths[1].points[2].x = recvdObj.paths[1].points[2].x;
                    break;
                }
            }
            canvas.setActiveObject(obj)
            updatePropertyPanel(obj)
            obj.setCoords(); // without this object selection pointers remain at orginal postion(beofore modified)
        } /*======================================================================================================*/
/*** for some reason below code not working for circle modification, hence commented and using above code
         /*======================================================================================================
         for (var prop in recvdObj) {
         obj.set(prop, recvdObj[prop]);
         $("#chattext").append(prop);
         }
         obj.setCoords();**/
        canvas.renderAll();
    }

    /**
     *  Reset Current seltected tool Icon when object is drawn on canvas
     *  @method  resetIconSelection
     *  @param none
     */
    function resetIconSelection() {
        if ($currActiveIcon) {
            $currActiveIcon.attr("src", $currActiveIcon.attr('data-inactive'));
            $currActiveIcon.parent().parent().removeClass('shape-active');
        }
    }

    function scrollUp(e) {
        $(this).siblings(".scrollerContentHolder").css("top", "yellow");
    }

    /**
     *  Handles the tools icon click events
     *  @method  handleToolClick
     *  @param e object
     */
    function handleToolClick(e) {
        resetIconSelection();
        $(e.target).attr("src", $(e.target).attr('data-active'));
        $(e.target).parent().parent().addClass('shape-active');
        $currActiveIcon = $(e.target);
        canvas.isSelectMode = false;
        var toolId = $(e.target).attr('id');
        currentTool = toolId;
        matisse.currTool = e.target;
        $(e.target).removeClass(toolId).addClass(toolId + "_click");
        document.getElementById("c").style.cursor = 'default'
        matisse.drawShape = true;
        matisse.action = e.target.id;
        matisse.palletteName = $(e.target).attr('data-parent');
        if (e.target.id != "path") {
            var obj = getDefaultDataFromArray(matisse.pallette[matisse.palletteName].shapes[e.target.id].properties);
            obj.uid = matisse.util.uniqid();
            matisse.shapeArgs = [obj];
        }
        if (matisse.action != "path") {
            canvas.isDrawingMode = false;
        } else {
            document.getElementById("c").style.cursor = 'crosshair';
            canvas.isDrawingMode = true;
            return;
        }
    }

    /**
     *  Creates an proeperties object from a  given array and returns that object
     *  @method  getDefaultDataFromArray
     *  @param arr - Array of properties
     *  @return obj - Object
     */
    function getDefaultDataFromArray(arr) {
        if (arr == undefined) return null;
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
            obj[arr[i].name] = arr[i].defaultvalue;
        }
        return obj;
    }

    /**
     *  Apply received property to the given shape on canvas
     *  @method  applyProperty
     *  @param objName, prop, val
     */
    function applyProperty(objName, prop, val) {
        var arr = [{
            obj: canvas.getActiveObject(),
            property: val
        }]
        for (var i = 0; i < matisse.pallette[matisse.palletteName].shapes[objName].properties.length; i++) {
            if (matisse.pallette[matisse.palletteName].shapes[objName].properties[i].name == prop) {
                matisse.pallette[matisse.palletteName].shapes[objName].properties[i].action.apply(this, arr);
                canvas.renderAll();
                canvas.getActiveObject().setCoords();
            }
        }
    }

    /**
     *  Sends the message typed by user to chat window and also notify it to Server
     *  @method  chatButtonListener
     *  @param e - event object
     */
    function chatButtonListener(e) {
        var msg = $("#chat").val();
        msg = "from $:" + msg + "\n";
        var txt = document.createTextNode(msg)
        $("#chattext").append(txt);
        matisse.com.sendDrawMsg({
            action: "chat",
            args: [{
                text: msg
            }]
        });
    }

    /**
     *  Handle MouseMove and MouseDown events - when user trying to draw a shape on canvas
     *  @method  handleMouseEvents
     *  @param none
     */
    function handleMouseEvents() {
        $("#canvasId").mousedown(function (event) {
            if (!canvas.isDrawingMode && matisse.drawShape) {
                matisse.points.x = event.pageX + document.getElementById("canvasId").scrollLeft - matisse.xOffset; //offset
                matisse.points.y = event.pageY + document.getElementById("canvasId").scrollTop - matisse.yOffset; //offset
                matisse.shapeArgs[0].left = matisse.points.x;
                matisse.shapeArgs[0].top = matisse.points.y;
                matisse.shapeArgs[0].name = matisse.action;
                matisse.shapeArgs[0].pallette = matisse.palletteName;
                matisse.pallette[matisse.palletteName].shapes[matisse.action].toolAction.apply(this, matisse.shapeArgs);
                matisse.com.sendDrawMsg({
                    pallette: matisse.palletteName,
                    action: matisse.action,
                    args: matisse.shapeArgs
                });

                canvas.isSelectMode = true;
                matisse.drawShape = false;
                resetIconSelection();
            }

            if (canvas.isDrawingMode) {
                matisse.xPoints = [];
                matisse.yPoints = [];
                matisse.xPoints.push(event.pageX + document.getElementById("canvasId").scrollLeft - matisse.xOffset);
                matisse.yPoints.push(event.pageY + document.getElementById("canvasId").scrollTop - matisse.yOffset);

            }
        });
        // drawingModeEl.innerHTML = 'Cancel drawing mode';
        $("#canvasId").mousemove(function (event) {
            if (canvas.isDrawingMode) {
                matisse.xPoints.push(event.pageX + document.getElementById("canvasId").scrollLeft - matisse.xOffset);
                matisse.yPoints.push(event.pageY + document.getElementById("canvasId").scrollTop - matisse.yOffset);
                // msg += event.pageX + ", " + event.pageY + "\n :";
            } else {
                var obj = canvas.getActiveObject();
                if (obj && matisse.associateText[obj.name]) {
                    matisse.associateText[obj.name].left = obj.left;
                    matisse.associateText[obj.name].top = obj.top;
                    matisse.associateText[obj.name].setAngle(obj.getAngle());
                }
            }

        });

    }

    /**
     *  Sets the property of a shape when a notification received from server
     *  @method  setObjectProperty
     *  @param args
     */
    function setObjectProperty(args) {
        var obj = getObjectById(args.uid);
        if (obj) {
            obj.set(args.property, args.value);
            canvas.renderAll();
        }
    }

    /**
     *  Check for the active object or group object and remove them from canvas
     *  @method  deleteObjects
     *  @param none
     */
    function deleteObjects() {
        var activeObject = canvas.getActiveObject(),
            activeGroup = canvas.getActiveGroup();

        if (activeObject) {
            canvas.remove(activeObject);
            matisse.com.sendDrawMsg({
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


    /**
     * Draw free-hand drawing path when notification received from server
     * @method drawPath
     * @param args
     */
    function drawPath(args) {
        var p = new fabric.Path(args.path);
        p.fill = null;
        p.stroke = '#FF000';
        p.strokeWidth = 1;
        p.uid = args.uid;
        p.name = "drawingpath";
        p.scaleX = 1;
        p.scaleY = 1;
        p.pallete = "basic";
        p.set("left", args.left);
        p.set("top", args.top);
        p.set("width", args.width);
        p.set("height", args.height);
        canvas.add(p);
        canvas.renderAll();
        p.setCoords();


    }

    function checkboxSelectionHandler(objct) {
        $("#proptable").append("<tr><td><input id='chkbox' type='checkbox'>check</input> </td></tr>");
        var chkbox = document.getElementById('chkbox');
        objct.paths[2].stroke == '#000000' ? chkbox.checked = true : chkbox.checked = false;
        chkbox.onmousedown = function () {
            if (!chkbox.checked) {
                objct.paths[2].stroke = '#000000';
            } else {
                objct.paths[2].stroke = '#ffffff';
            }
            matisse.com.sendDrawMsg({
                action: "modified",
                args: [{
                    uid: objct.uid,
                    object: objct
                }]
            });
            canvas.renderAll();
        }
    }

    function radioSelectionHandler(objct) {
        $("#proptable").append("<tr><td><input id='chkbox' type='checkbox'>select</input> </td></tr>");
        var chkbox = document.getElementById('chkbox');
        objct.paths[1].fill == '#555555' ? chkbox.checked = true : chkbox.checked = false;
        chkbox.onmousedown = function () {
            if (!chkbox.checked) {
                objct.paths[1].fill = '#555555';
            } else {
                objct.paths[1].fill = '#eeeeee';
            }
            matisse.com.sendDrawMsg({
                action: "modified",
                args: [{
                    uid: objct.uid,
                    object: objct,
                    text: objct.text
                }]
            });
            canvas.renderAll();
        }
    }

    function progressHandler(objct) {
        $("#proptable").append("<tr><td><input id='txtbox' type='text'>Progress %</input> </td></tr>");
        var txtbox = document.getElementById('txtbox');
        var wdth = objct.paths[0].width;
        txtbox.onfocus = function (e) {
            this.value = (wdth / 2 + objct.paths[1].points[1].x) * (100 / wdth);
        }
        txtbox.onkeyup = function (e) {

            if (this.value <= 100 && this.value >= 0) {
                objct.paths[1].points[1].x = (wdth * this.value / 100) - (wdth / 2);
                objct.paths[1].points[2].x = (wdth * this.value / 100) - (wdth / 2);
                matisse.com.sendDrawMsg({
                    action: "modified",
                    args: [{
                        uid: objct.uid,
                        object: objct
                    }]
                });
                canvas.renderAll();
            }
        }
    }

    /**
     * Creates a property panel with various properties based on object selected
     * @method createPropertiesPanel
     * @param obj
     */
    matisse.main.createPropertiesPanel = function(obj) { /*$('#propdiv').dialog();*/

        if (obj.pallette && obj && obj.name) {
            var val;
            var colorPicker;
            $('#prop').remove();
            objName = obj.name;
            matisse.palletteName = obj.pallette;
            if (matisse.pallette[matisse.palletteName] == null) return;
            if (objName == undefined || objName == 'drawingpath') return;
            properties = getDefaultDataFromArray(matisse.pallette[matisse.palletteName].shapes[objName].properties);
            var props = {};
            $('#propdiv').append('<div id="prop"><table id="proptable"><tr><td bgcolor="#FFFFFF" border="1px" class= "cp" id="colorpicker"></td></tr></table></div>');
            jQuery.each(properties, function (i, val) {
                if (i == 'angle') {
                    val = obj.getAngle()
                } else {
                    val = obj[i]
                }
                if (i === "fill" || i === "stroke") {
                    var inputTag = "<input style='width:100px' onKeyPress='return matisse.util.letternumber(event)' class= 'color' id='" + i + "' value='" + val + "'></input></div>";

                } else {
                    var inputTag = "<input type='text' style='width:100px' onKeyPress='return matisse.util.numbersonly(this, event)' id='" + i + "' value='" + val + "'></input>";
                }
                var $propTableDiv = $("#proptable");
                $propTableDiv.append("<tr class='" + i + "tr'><td ><label style = 'text-align: right' for='" + i + "'>" + i + ": </label></td><td >" + inputTag + "</td></tr>");
                var inBox = $("#" + i);

                $(":input").focus(function () {
                    matisse.focusInput = '';
                    id = this.id;
                    if (id == 'fill' || id == 'stroke') {
                        matisse.focusInput = id;
                        var prop = $(this).position();
                        $('#colorpicker').show();
                        var ht = $propTableDiv.height();
                        var cssObj = {
                            'position': 'absolute',
                            'left': 5,
                            'top': prop.top + 20
                        };
                        $('#colorpicker').css(cssObj);
                        $("#propdiv").dialog({
                            height: 530
                        });

                    }
                });
                $(":input").blur(function () {
                    matisse.focusInput = '';
                    id = this.id;
                    if (id == 'fill' || id == 'stroke') {
                        $('#colorpicker').hide();
                        $("#propdiv").dialog({
                            height: 'auto'
                        });
                    }
                });
                inBox.keyup(function () {
                    if (!canvas.getActiveObject()) return;
                    var actObj = canvas.getActiveObject();
                    var val = $("#" + i).val();
                    actObj.set(i, val);
                    if (i == 'angle') actObj.setAngle(val);
                    canvas.renderAll();
                    canvas.getActiveObject().setCoords();
                    // applyProperty(objName, i, $("#" + i).val());
                    console.log('changed val = ' + val + ' of ' + i)
                    matisse.com.sendDrawMsg({
                        action: "modified",
                        args: [{
                            uid: obj.uid,
                            object: obj
                        }]
                    });
                });
                // getDataFromArray(panel[obj].properties)[i].action.apply(this, $("#"+i).val())
            });
            colorPicker = $.farbtastic("#colorpicker");
            colorPicker.linkTo(matisse.ui.pickerUpdate);
            $('#colorpicker').hide();
            initPropWindow();
            if (obj.name == 'text') textInputHandler(obj, null);
            if (obj && obj.pallette == "wireframe" && obj.getObjects) {
                var objcts = obj.getObjects();
                for (var o in objcts) {
                    if (objcts[o].type == "text") {
                        textInputHandler(objcts[o], obj);
                        break;
                    }
                }
                switch (obj.name) {
                case "checkbox":
                    checkboxSelectionHandler(obj);
                    break;
                case "radio":
                    radioSelectionHandler(obj);
                    break;
                case "progressbar":
                    progressHandler(obj);
                    break;
                }
            }
        }
    }

    /**
     * Grabs all the shape elements and creates a tool icon for each shape, to add in the toolbar
     * @method addTools
     * @param none
     */

    function addTools() {
        //$('#leftdiv').draggable()
        createAllPallettes(matisse.pallette);

        $('#toolsdiv').append("<div id='deleteTool' class='tools deleteTool'></div>");
        $('#deleteTool').click(function () {
            currentTool = "deleteTool";
            deleteObjects();
        });

        //document.getElementById("drawing-mode").onclick = drawingButtonListener;
        $('#chatbutton').click(chatButtonListener);
        handleMouseEvents()
        $('#accordion').accordion();
        matisse.ui.setAccordinContentHeight();
    }


    /**
     * Loop through all pallettes and call createPallette for each pallette found
     * @method createAllPallettes
     * @param palletteObj
     */
    function createAllPallettes(palletteObj) {
        for (var palletteName in palletteObj) {
            createPallette(palletteName);
        }
    }

    /**
     * Create a  pallette for each type of pallette and add it in toolbar
     * @method createPallette
     * @param palletteName
     */
    function createPallette(palletteName) {
        var pallette_DisplayName = matisse.pallette[palletteName].collectionName;
        matisse.ui.updateAccordian(pallette_DisplayName);
        var shapesObj = matisse.pallette[palletteName];
        var html = '<div class="scroller scroller-up"></div>';
        html += '<div class="shapesHolder">';
        html += '<div class="scrollerContentHolder">';
        for (var i in shapesObj.shapes) {
            var shape = shapesObj.shapes[i]
            var shape_DisplayName = shape.displayName;
            var src = '/images/' + shape.inactiveIcon;
            var activesrc = '/images/' + shape.activeIcon;
            var shapeHolder = '<div class="shape-holder" id="shape-holder-' + shape_DisplayName + '">';
            shapeHolder += '<div id="shape"><img class="tool" id="' + shape_DisplayName + '" src="' + src + '" data-active="' + activesrc + '" data-inactive="' + src + '" data-parent="' + pallette_DisplayName + '" width="64" height="64" /></div><div id="shape-label">' + shape_DisplayName + '</div></div>';
            html += shapeHolder;
        }
        html += '</div></div>';
        html += '<div class="scroller scroller-down"></div>';
        $(document.getElementById(pallette_DisplayName)).append(html);
        $('.tool').click(handleToolClick);
    }



    /**
     * Listen for keyboard events and do necessary action
     * @method keyDown 
     * @param e keyevent
     */
    function keyDown(e) {
        var evt = (e) ? e : (window.event) ? window.event : null;
        if (evt) {
            var key = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
            if (key == "46" && evt.altKey) {
                deleteObjects();
            } else if (key == "38" && evt.ctrlKey) {
                var obj = canvas.getActiveObject();
                if (obj) canvas.bringForward(obj);
            } else if (key == "40" && evt.ctrlKey) {
                var obj = canvas.getActiveObject();
                if (obj) canvas.sendBackwards(obj);
            }
        }
    }




    function textInputHandler(obj, parent_obj) {

        $("#proptable").append("<tr id = 'txtrow'><td id= 'txttd' valign='top'><label style = 'text-align:right; vertical-align:top' id='labl' for='txtarea'>text:</label></td><td><textarea id='txtarea' cols= '10' style='height:75px'>hello</textarea> </td></tr>");
        var txt_area = document.getElementById("txtarea");
        txt_area.onfocus = function () {
            txt_area.innerHTML = obj.text;
        }
        if (parent_obj) {
            var wireframeObject = parent_obj.name;
        }


        switch (wireframeObject) {
        case "radio":
            txt_area.onkeyup = function (e) {
                var wdth = 0;
                obj.text = this.value;
                canvas.renderAll();
                wdth = obj.getWidth() + (2 * parent_obj.paths[1].radius) + 15 + 30;
                (wdth - parent_obj.width) > 0 ? parent_obj.left += (wdth - parent_obj.width) / 2 : parent_obj.left = parent_obj.left;
                parent_obj.width = wdth;
                parent_obj.paths[0].left = -((wdth / 2) - 15);
                parent_obj.paths[1].left = parent_obj.paths[0].left;
                var text_left = parent_obj.paths[0].left + (2 * parent_obj.paths[1].radius) + 15;
                parent_obj.paths[2].left = -(-obj.getWidth() / 2 - text_left);
                matisse.com.sendDrawMsg({
                    action: "modified",
                    args: [{
                        uid: parent_obj.uid,
                        object: parent_obj
                    }]
                });
                parent_obj.setCoords();
                canvas.renderAll();
            };
            break;

        case "checkbox":
            txt_area.onkeyup = function (e) {
                var wdth = 0;
                obj.text = this.value;
                canvas.renderAll();
                wdth = obj.getWidth() + 14 + 15 + 30;
                (wdth - parent_obj.width) > 0 ? parent_obj.left += (wdth - parent_obj.width) / 2 : parent_obj.left = parent_obj.left;
                parent_obj.width = wdth;
                var checkbox_left = -wdth / 2 + 15;
                var text_left = checkbox_left + 14 + 15;
                parent_obj.paths[0].points[0].x = checkbox_left;
                parent_obj.paths[0].points[1].x = checkbox_left + 14;
                parent_obj.paths[0].points[2].x = checkbox_left + 14;
                parent_obj.paths[0].points[3].x = checkbox_left;
                parent_obj.paths[1].left = -(-(obj.getWidth()) / 2 - text_left);
                parent_obj.paths[2].points[0].x = checkbox_left + 3;
                parent_obj.paths[2].points[1].x = checkbox_left + 6;
                parent_obj.paths[2].points[2].x = checkbox_left + 11;
                matisse.com.sendDrawMsg({
                    action: "modified",
                    args: [{
                        uid: parent_obj.uid,
                        object: parent_obj
                    }]
                });
                parent_obj.setCoords();
                canvas.renderAll();
            };
            break;
        case "label":
            txt_area.onkeyup = function (e) {
                var width = 0,
                    height = 0;
                obj.text = this.value;
                canvas.renderAll();
                width = obj.getWidth() + 10;
                height = obj.height + 5;
                (width - parent_obj.width) > 0 ? parent_obj.left += (width - parent_obj.width) / 2 : parent_obj.left = parent_obj.left;
                (height - parent_obj.height) > 0 ? parent_obj.top += (height - parent_obj.height) / 2 : parent_obj.top = parent_obj.top;
                parent_obj.width = width;
                parent_obj.height = height;
                parent_obj.paths[0].width = width;
                parent_obj.paths[0].height = height;
                matisse.com.sendDrawMsg({
                    action: "modified",
                    args: [{
                        uid: parent_obj.uid,
                        object: parent_obj
                    }]
                });
                parent_obj.setCoords();
                canvas.renderAll();
            };
            break;
        case "textbox":
            txt_area.onkeyup = function (e) {
                var width = 0,
                    height = 0;
                obj.text = this.value;
                canvas.renderAll();
                width = obj.getWidth() + 15;
                (width <= 150) ? width = 150 : width = width;
                height = obj.height + 5;
                (width - parent_obj.width) > 0 ? parent_obj.left += (width - parent_obj.width) / 2 : parent_obj.left = parent_obj.left;
                (height - parent_obj.height) > 0 ? parent_obj.top += (height - parent_obj.height) / 2 : parent_obj.top = parent_obj.top;
                parent_obj.width = width;
                parent_obj.height = height;
                parent_obj.paths[0].width = width;
                parent_obj.paths[0].height = height;
                obj.left = -width / 2 + obj.getWidth() / 2 + 10;
                matisse.com.sendDrawMsg({
                    action: "modified",
                    args: [{
                        uid: parent_obj.uid,
                        object: parent_obj
                    }]
                });
                parent_obj.setCoords();
                canvas.renderAll();
            };
            break;

        case "password":
            txt_area.onkeyup = function (e) {
                obj.text = "";
                for (var i = 0; i < this.value.length; i++) {
                    obj.text += '*';
                }
                canvas.renderAll();
                this.value = obj.text;
                var width = 0,
                    height = 0;
                width = obj.getWidth() + 30;
                height = matisse.util.getStringHeight(obj.text);
                (width - parent_obj.width) > 0 ? parent_obj.left += (width - parent_obj.width) / 2 : parent_obj.left = parent_obj.left;
                parent_obj.width = width;
                parent_obj.height = height;
                parent_obj.paths[0].width = width;
                parent_obj.paths[0].height = height;
                matisse.com.sendDrawMsg({
                    action: "modified",
                    args: [{
                        uid: parent_obj.uid,
                        object: parent_obj
                    }]
                });
                parent_obj.setCoords();
                canvas.renderAll();
            };
            break;
        case "txt_button":
            txt_area.onkeyup = function (e) {
                var width = 0,
                    height = 0;
                obj.text = this.value;
                width = matisse.util.getStringWidth(obj.text) + 5;
                height = matisse.util.getStringHeight(obj.text) + 5;
                (width - parent_obj.width) > 0 ? parent_obj.left += (width - parent_obj.width) / 2 : parent_obj.left = parent_obj.left;
                parent_obj.width = width;
                parent_obj.paths[0].points[0].x = -width / 2;
                parent_obj.paths[0].points[1].x = -width / 2 + 5;
                parent_obj.paths[0].points[2].x = width / 2 - 5;
                parent_obj.paths[0].points[3].x = width / 2;
                parent_obj.paths[0].points[4].x = width / 2;
                parent_obj.paths[0].points[5].x = width / 2 - 5;
                parent_obj.paths[0].points[6].x = -width / 2 + 5;
                parent_obj.paths[0].points[7].x = -width / 2;

                matisse.com.sendDrawMsg({
                    action: "modified",
                    args: [{
                        uid: parent_obj.uid,
                        object: parent_obj
                    }]
                });
                parent_obj.setCoords();
                canvas.renderAll();
            };
            break;
        case "combo":
            txt_area.onkeyup = function (e) {
                var wdth = 0;
                obj.text = this.value;
                canvas.renderAll();
                wdth = obj.getWidth() + parent_obj.paths[1].width + 30;
                (wdth - parent_obj.width) > 0 ? parent_obj.left += (wdth - parent_obj.width) / 2 : parent_obj.left = parent_obj.left;
                parent_obj.width = wdth;
                parent_obj.paths[0].width = wdth;
                parent_obj.paths[1].points[0].x = wdth / 2 - 22;
                parent_obj.paths[1].points[1].x = wdth / 2;
                parent_obj.paths[1].points[2].x = wdth / 2;
                parent_obj.paths[1].points[3].x = wdth / 2 - 22;
                parent_obj.paths[2].points[0].x = wdth / 2 - 15.5;
                parent_obj.paths[2].points[1].x = wdth / 2 - 6.5;
                parent_obj.paths[2].points[2].x = wdth / 2 - 10.5;
                parent_obj.paths[3].left = -wdth / 2 + 15 + obj.getWidth() / 2;
                matisse.com.sendDrawMsg({
                    action: "modified",
                    args: [{
                        uid: parent_obj.uid,
                        object: parent_obj
                    }]
                });
                parent_obj.setCoords();
                canvas.renderAll();
            }
            break;
        default:
            txt_area.onkeyup = function (e) {
                obj.text = this.value;

                matisse.com.sendDrawMsg({
                    action: "modified",
                    args: [{
                        uid: obj.uid,
                        object: obj,
                        text: obj.text
                    }]
                });
                obj.setCoords();
                canvas.renderAll();
            }
            break;


        }
    }


    /**
     * To load wireframe objects. group the objects using pathgroup
     */
    matisse.main.loadWireframe = function (args, objects) {
        var pathGroup = new fabric.PathGroup(objects, {
            width: args.width,
            height: args.height
        });
        pathGroup.set({
            left: args.left,
            top: args.top,
            angle: args.angle,
            scaleX: args.scaleX,
            scaleY: args.scaleY
        });
        pathGroup.setCoords();
        pathGroup.name = args.name;
        pathGroup.uid = args.uid;
        pathGroup.pallette = args.pallette;
        canvas.add(pathGroup);
    }

    matisse.main.loadSVG = function (args) {

        fabric.loadSVGFromURL('images/svg/' + args.svg, function (objects, options) {
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
            loadedObject.scaleToWidth(100).setCoords();
            canvas.add(loadedObject);
        });

    }



    $(".scroller-up").live("click", function () {
        var scrollerContentHolderHeight = $(this).siblings().find(".scrollerContentHolder").css('height');
        var scrollerContentHolderTop = $(this).siblings().find(".scrollerContentHolder").css('top');
        var parentHeight = $(this).parent().css('height');
        var shapeHeight = $(".scrollerContentHolder:visible>.shape-holder").height();

        scrollerContentHolderHeight = scrollerContentHolderHeight.substr(0, scrollerContentHolderHeight.indexOf('px'));
        parentHeight = parentHeight.substr(0, parentHeight.indexOf('px'));
        scrollerContentHolderTop = scrollerContentHolderTop.substr(0, scrollerContentHolderTop.indexOf('px'));

        if (scrollerContentHolderHeight > parentHeight) {
            if (scrollerContentHolderTop < -30) {
                $("#wireframe .scroller-down").css("background-color", "#8F98A6");
                var newTop = (scrollerContentHolderTop - (-shapeHeight));
                $(this).siblings().find(".scrollerContentHolder").stop().animate({
                    "top": newTop
                }, "slow");
            } else {
                $("#wireframe .scroller-up").css("background-color", "#aaa");
            }
        }
    });

    $(".scroller-down").live("click", function () {
        var scrollerContentHolderHeight = $(this).siblings().find(".scrollerContentHolder").css('height');
        var scrollerContentHolderTop = $(this).siblings().find(".scrollerContentHolder").css('top');
        var parentHeight = $(this).parent().css('height');
        var shapeHeight = $(".scrollerContentHolder:visible>.shape-holder").height();

        scrollerContentHolderHeight = scrollerContentHolderHeight.substr(0, scrollerContentHolderHeight.indexOf('px'));
        parentHeight = parentHeight.substr(0, parentHeight.indexOf('px'));
        scrollerContentHolderTop = scrollerContentHolderTop.substr(0, scrollerContentHolderTop.indexOf('px'));

        var carouselArrowheight = 18;
        var accordianHeight = $(".ui-accordion-content").height() - (carouselArrowheight * 2);
        var sumOfShapesHeight = $(".scrollerContentHolder:visible").height();
        if (scrollerContentHolderHeight > parentHeight) {
            if (-(scrollerContentHolderTop) < (sumOfShapesHeight - accordianHeight - 30)) {
                $("#wireframe .scroller-up").css("background-color", "#8F98A6");
                var newTop = (scrollerContentHolderTop - shapeHeight);
                $(this).siblings().find(".scrollerContentHolder").stop().animate({
                    "top": newTop
                }, "slow");
            } else {
                $("#wireframe .scroller-down").css("background-color", "#aaa");
            }
        }
    });

    /**
     * Handler for Save Button Click
     * @method saveButtonClickHandler
     * @param none
     */
    saveButtonClickHandler = function () {
        $('#saveicon').bind("click", function () {
            var data = canvas.toDataURL('png')
            matisse.saveImage(data);
        });
    }

    /**
     * Handler for Import Image Button Click
     * @method importImageButtonClickHandler
     * @param none
     */
    importImageButtonClickHandler = function () {
        $('#loadicon').bind("click", function () {
            var args = {};
            args.path = 'images/conventional-html-layout.png';
            args.name = "importimage";
            args.left = 300;
            args.top = 200;
            args.uid = matisse.util.uniqid();
            args.pallette = 'imagepallette';
            loadImage(args);
        });
    }


    /**
     * Handler for New Document Button Click
     * @method newButtonClickHanlder
     * @param none
     */
    newButtonClickHanlder = function () {
        $('#newdocicon').bind("click", function () {
            var pageURL = document.location.href;
            // get the index of '/' from url (ex:http://localhost:8000/qd7kt3vd)
            var indx = pageURL.indexOf('/');
            pageURL = pageURL.substr(0, indx)
            window.open(pageURL + '/boards/', "mywindow");
        });
    }


})(jQuery);