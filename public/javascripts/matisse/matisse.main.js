/**
 * User: Bhavani Shankar
 * Date: 01/13/12
 * Time: 11:16 AM
 * About this : This is the main javascipt file to handle adding, editing, deleting all elements on canvas (text, rectangle, circle etc)
 * Uses 'Fabric.js' library for client side
 * Node.js and  Node Package Manager (NPM) for server side - JavaScript environment that uses an asynchronous event-driven model.
 */
define(["matisse", "matisse.ui", "matisse.util", "matisse.fabric", "matisse.palettes", "matisse.events", "matisse.com", "matisse.palettes.properties"], function (matisse, ui, util, mfabric, palettes, events, com, properties) {

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

    var main = {
        /**
         * Initializes the application
         * @method main.init
         * @param none
         *
         */
        init: function () {
            ui.initWidthAndHeightOfPanels();
            ui.resizeWindow();
            ui.setCanvasSize();
            ui.bindResizeWindow();
            canvas.isSelectMode = true;
            matisse.xOffset = util.getOffset(document.getElementById('canvasId')).left;
            matisse.yOffset = util.getOffset(document.getElementById('canvasId')).top;

            addTools();

            document.onkeydown = events.keyDown;
            $('#chaticon').click(openChatWindow);
            $('#propicon').click(openPropertiesPanel);

            initChatWindow();

            addObservers();
            saveButtonClickHandler();
            newButtonClickHanlder();
        },
        /**
         *  Handles the tools icon click events
         *  @method  handleToolClick
         *  @param e object
         */
        handleToolClick: function (e) {
            // resetIconSelection();
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
                var obj = util.getDefaultDataFromArray(matisse.palette[matisse.paletteName].shapes[e.target.id].properties);
                obj.uid = util.uniqid();
                matisse.shapeArgs = [obj];
            }
            if (matisse.action != "path") {
                canvas.isDrawingMode = false;
            } else {
                document.getElementById("c").style.cursor = 'crosshair';
                canvas.isDrawingMode = true;
                return;
            }
        },

        /**
         *  Reset Current seltected tool Icon when object is drawn on canvas
         *  @method  resetIconSelection
         *  @param none
         */
        resetIconSelection: function () {
            if (matisse.$currActiveIcon) {
                matisse.$currActiveIcon.attr("src", matisse.$currActiveIcon.attr('data-inactive'));
                matisse.$currActiveIcon.parent().parent().removeClass('shape-active');
            }
        },
        /**
         * Creates a property panel with various properties based on object selected
         * @method createPropertiesPanel
         * @param obj
         */
        createPropertiesPanel: function (obj) { /*$('#propdiv').dialog();*/
            if (obj.palette && obj && obj.name) {
                $('#prop').remove();
                objName = obj.name;
                matisse.paletteName = obj.palette;
                if (matisse.palette[matisse.paletteName] == null) return;
                if (objName == undefined || objName == 'drawingpath') return;
                properties = util.getDefaultDataFromArray(matisse.palette[matisse.paletteName].shapes[objName].properties);
                if (properties) {
                    matisse.palette[matisse.paletteName].shapes[objName].applyProperties ? matisse.palette[matisse.paletteName].shapes[objName].applyProperties(properties) : null;
                }
            }
        },

        /**
         * Initializes the Properties Window, hide it initially
         * @method initPropWindow
         * @param none
         *
         */
        initPropWindow: function () {
            $('#propdiv').dialog();
            $('#propdiv').dialog({
                width: 'auto',
                height: 'auto',
                resizable: false
            });
            $('#propdiv').dialog('close');
        },


        /**
         *  Check for the active object or group object and remove them from canvas
         *  @method  deleteObjects
         *  @param none
         */
        deleteObjects: function () {
            var activeObject = canvas.getActiveObject(),
                activeGroup = canvas.getActiveGroup();

            if (activeObject) {
                canvas.remove(activeObject);
                com.sendDrawMsg({
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
        },
        /**
         *  When receive a notification from server to modify the other side when it gets modified.
         *  @method  modifyObject
         *  @param rgs - received object and object's id.
         */
        modifyObject: function (args) {
            var obj = util.getObjectById(args[0].uid);
            console.log("modify object");
            console.log(obj);
            if (obj) {
                matisse.palette[obj.palette].shapes[obj.name].modifyAction ? matisse.palette[obj.palette].shapes[obj.name].modifyAction.apply(this, args) : null;
                canvas.setActiveObject(obj)
                properties.updatePropertyPanel(obj)
                obj.setCoords(); // without this object selection pointers remain at orginal postion(beofore modified)
            }
            canvas.renderAll();
        },
        /**
         * Draw free-hand drawing path when notification received from server
         * @method drawPath
         * @param args
         */
        drawPath: function (args) {
            var p = new fabric.Path(args.path);
            p.fill = null;
            p.stroke = '#FF000';
            p.strokeWidth = 1;
            p.uid = args.uid;
            p.name = "drawingpath";
            p.scaleX = 1;
            p.scaleY = 1;
            p.palette = "basic";
            p.set("left", args.left);
            p.set("top", args.top);
            p.set("width", args.width);
            p.set("height", args.height);
            canvas.add(p);
            canvas.renderAll();
            p.setCoords();
        },
        /**
         *  Handle MouseMove and MouseDown events - when user trying to draw a shape on canvas
         *  @method  handleMouseEvents
         *  @param none
         */
        handleMouseEvents: function () {
            $("#canvasId").mousedown(function (event) {
                if (!canvas.isDrawingMode && matisse.drawShape) {
                    matisse.points.x = event.pageX + document.getElementById("canvasId").scrollLeft - matisse.xOffset; //offset
                    matisse.points.y = event.pageY + document.getElementById("canvasId").scrollTop - matisse.yOffset; //offset
                    matisse.shapeArgs[0].left = matisse.points.x;
                    matisse.shapeArgs[0].top = matisse.points.y;
                    matisse.shapeArgs[0].name = matisse.action;
                    matisse.shapeArgs[0].palette = matisse.paletteName;
                    matisse.palette[matisse.paletteName].shapes[matisse.action].toolAction.apply(this, matisse.shapeArgs);
                    com.sendDrawMsg({
                        palette: matisse.paletteName,
                        action: matisse.action,
                        args: matisse.shapeArgs
                    });

                    canvas.isSelectMode = true;
                    matisse.drawShape = false;
                    matisse.main.resetIconSelection();
                }

                if (canvas.isDrawingMode) {
                    matisse.xPoints = [];
                    matisse.yPoints = [];
                    matisse.xPoints.push(event.pageX + document.getElementById("canvasId").scrollLeft - matisse.xOffset);
                    matisse.yPoints.push(event.pageY + document.getElementById("canvasId").scrollTop - matisse.yOffset);
                }
            });

            $("#canvasId").mousemove(function (event) {
                if (canvas.isDrawingMode) {
                    matisse.xPoints.push(event.pageX + document.getElementById("canvasId").scrollLeft - matisse.xOffset);
                    matisse.yPoints.push(event.pageY + document.getElementById("canvasId").scrollTop - matisse.yOffset);
                }

            });
        }
    } // end of 'return'

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
        mfabric.observe('object:modified');
        mfabric.observe('path:created');
        mfabric.observe('selection:cleared');
        mfabric.observe('object:moved');
        mfabric.observe('object:selected');
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
    function saveButtonClickHandler() {
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
    function importImageButtonClickHandler() {
        $('#loadicon').bind("click", function () {
            var args = {};
            args.path = 'images/conventional-html-layout.png';
            args.name = "importimage";
            args.left = 300;
            args.top = 200;
            args.uid = util.uniqid();
            args.palette = 'imagepalette';
            loadImage(args);
        });
    }

    /**
     * Handler for New Document Button Click
     * @method newButtonClickHanlder
     * @param none
     */
    function newButtonClickHanlder() {
        $('#newdocicon').bind("click", function () {
            var pageURL = document.location.href;
            // get the index of '/' from url (ex:http://localhost:8000/qd7kt3vd)
            var indx = pageURL.indexOf('/');
            pageURL = pageURL.substr(0, indx)
            window.open(pageURL + '/boards/', "mywindow");
        });
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
            com.sendDrawMsg({
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
     *  Sends the message typed by user to chat window and also notify it to Server
     *  @method  chatButtonListener
     *  @param e - event object
     */
    function chatButtonListener(e) {
        var msg = $("#chat").val();
        msg = "from $:" + msg + "\n";
        var txt = document.createTextNode(msg)
        $("#chattext").append(txt);
        com.sendDrawMsg({
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
     * Grabs all the shape elements and creates a tool icon for each shape, to add in the toolbar
     * @method addTools
     * @param none
     */

    function addTools() {
        palettes.createAllPallettes(matisse.palette);
        $('#toolsdiv').append("<div id='deleteTool' class='tools deleteTool'></div>");
        $('#deleteTool').click(function () {
            deleteObjects();
        });
        $('#chatbutton').click(chatButtonListener);
        main.handleMouseEvents()
        $('#accordion').accordion();
        ui.setAccordinContentHeight();
    }
    return main;
})