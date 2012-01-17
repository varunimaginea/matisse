/**
 * User: Bhavani Shankar
 * Date: 01/13/12
 * Time: 11:16 AM
 * About this : This is the main javascipt file to handle adding, editing, deleting all elements on canvas (text, rectangle, circle etc)
 * Uses 'Fabric.js' library for client side
 * Node.js and  Node Package Manager (NPM) for server side - JavaScript environment that uses an asynchronous event-driven model.
 */ 
 
   (function ($) {

    /**
     *	create canvas object
     */
    window.canvas = new fabric.Canvas('c', {
        backgroundColor: '#FFFFFF'
    });

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

        this.addTools();

        document.onkeydown = matisse.events.keyDown;
        $('#chaticon').click(openChatWindow);
        $('#propicon').click(openPropertiesPanel);

        initChatWindow();
        this.initPropWindow();
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
    matisse.main.initPropWindow = function () {
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
            args.palette = 'imagepalette';
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
                modifyObject(data.args)
            } else if (data.action == "modifiedbyvalue") {
                setObjectProperty(data.args[0]);
            } else if (data.action == "drawpath") {
                matisse.fabric.drawPath(data.args[0])
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
                if (matisse.palette[data.palette] != undefined) {
                    matisse.palette[data.palette].shapes[data.action].toolAction.apply(this, data.args);
                }
            }
        }
    }

    /**
     * Searches for the object with the given id and returns that object
     * @property id
     * @type object
     */
    matisse.main.getObjectById = function (id) {
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
    matisse.main.updatePropertyPanel = function (obj) {
        if (matisse.palette[matisse.paletteName] == null) return;
        if (canvas.getActiveGroup()) return;
        if (obj && obj.name && obj.palette) {
            properties = getDefaultDataFromArray(matisse.palette[matisse.paletteName].shapes[obj.name].properties);
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
                palette: obj.palette,
                args: [{
                    uid: obj.uid,
                    object: obj
                }] // When sent only 'object' for some reason object  'uid' is not available to the receiver method.
            })
        });

    }

    /**
     *  When receive a notification from server to modify the other side when it gets modified.
     *  @method  modifyObject
     *  @param rgs - received object and object's id.
     */
    function modifyObject(args) {
        var obj = matisse.main.getObjectById(args[0].uid);
        if (obj) {
            matisse.palette[obj.palette].shapes[obj.name].modifyAction ? matisse.palette[obj.palette].shapes[obj.name].modifyAction.apply(this, args) : null;
            canvas.setActiveObject(obj)
            matisse.main.updatePropertyPanel(obj)
            obj.setCoords(); // without this object selection pointers remain at orginal postion(beofore modified)
        }
        canvas.renderAll();
    }


    /**
     *  Reset Current seltected tool Icon when object is drawn on canvas
     *  @method  resetIconSelection
     *  @param none
     */
    matisse.main.resetIconSelection = function () {
        if (matisse.$currActiveIcon) {
            matisse.$currActiveIcon.attr("src", matisse.$currActiveIcon.attr('data-inactive'));
            matisse.$currActiveIcon.parent().parent().removeClass('shape-active');
        }
    }


    /**
     *  Handles the tools icon click events
     *  @method  handleToolClick
     *  @param e object
     */
    matisse.main.handleToolClick = function (e) {
        matisse.main.resetIconSelection();
        $(e.target).attr("src", $(e.target).attr('data-active'));
        $(e.target).parent().parent().addClass('shape-active');
        matisse.$currActiveIcon = $(e.target);
        canvas.isSelectMode = false;
        var toolId = $(e.target).attr('id');
        matisse.currTool = e.target;
        $(e.target).removeClass(toolId).addClass(toolId + "_click");
        document.getElementById("c").style.cursor = 'default'
        matisse.drawShape = true;
        matisse.action = e.target.id;
        matisse.paletteName = $(e.target).attr('data-parent');
        if (e.target.id != "path") {
            var obj = getDefaultDataFromArray(matisse.palette[matisse.paletteName].shapes[e.target.id].properties);
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
     matisse.main.deleteObjects = function() {
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
     * Creates a property panel with various properties based on object selected
     * @method createPropertiesPanel
     * @param obj
     */
    matisse.main.createPropertiesPanel = function (obj) { /*$('#propdiv').dialog();*/

        if (obj.palette && obj && obj.name) {
            $('#prop').remove();
            objName = obj.name;
            matisse.paletteName = obj.palette;
            if (matisse.palette[matisse.paletteName] == null) return;
            if (objName == undefined || objName == 'drawingpath') return;
            properties = getDefaultDataFromArray(matisse.palette[matisse.paletteName].shapes[objName].properties);
            if (properties) {
                matisse.palette[matisse.paletteName].shapes[objName].applyProperties ? matisse.palette[matisse.paletteName].shapes[objName].applyProperties(properties) : null;
            }
        }
    }

    /**
     * Grabs all the shape elements and creates a tool icon for each shape, to add in the toolbar
     * @method addTools
     * @param none
     */

    matisse.main.addTools = function () {
        //$('#leftdiv').draggable()
        matisse.palettes.createAllPallettes(matisse.palette);

        $('#toolsdiv').append("<div id='deleteTool' class='tools deleteTool'></div>");
        $('#deleteTool').click(function () {
            deleteObjects();
        });

        //document.getElementById("drawing-mode").onclick = drawingButtonListener;
        $('#chatbutton').click(chatButtonListener);
        matisse.events.handleMouseEvents()
        $('#accordion').accordion();
        matisse.ui.setAccordinContentHeight();
    }

})(jQuery);