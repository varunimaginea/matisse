/**
 * User: Bahvani Shankar
 * Date: 01/13/12
 * Time: 11:16 AM
 * About this : This is the main javascipt file to handle adding, editing, deleting all elements on canvas (text, rectangle, circle etc)
 * Uses 'Fabric.js' library for client side
 * Node.js and  Node Package Manager (NPM) for server side - JavaScript environment that uses an asynchronous event-driven model.
 */

(function($){
    var currentTool="";
    /**
     * @namespace
     */
    App.Main = {};

    // create canvas object
    window.canvas = new fabric.Canvas('c', {
        backgroundColor: '#FFFFFF'
    });

    /** width and height of panels for resize */
    var bodyWidth,bodyHeight;
    var initialBodyWidth = $(window).width() > 960 ? $(window).width() : 960,
        initialBodyHeight = $(window).height() > 800 ? $(window).height() : 800;
    var topPanelHeight;
    var leftPanelWidth,leftPanelHeight;
    var accordionContentHeight;
    var canvasWidth,canvasHeight;

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
     * @method App.Main.init
     * @param none
     *
     */

    App.Main.init = function(){
        initWidthAndHeightOfPanels();
        resizeWindow();
        setCanvasSize();
        bindResizeWindow();
        canvas.isSelectMode = true;
        App.xOffset = getOffset(document.getElementById('canvasId')).left;
        App.yOffset = getOffset(document.getElementById('canvasId')).top;

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
     * function to initialize width and heights
	 * @method initWidthAndHeightOfPanels
	 * @param none
     */
    function initWidthAndHeightOfPanels(){
        bodyWidth = $(window).width() - 2;
        bodyHeight = $(window).height();
        topPanelHeight = 100;
        leftPanelWidth = 100;
        leftPanelHeight = bodyHeight - topPanelHeight;
        canvasWidth = bodyWidth - leftPanelWidth;
        canvasHeight = bodyHeight - topPanelHeight - 23;
    }
   
    /**
     * method to resize panels on resize of browser window
	 * @method resizeWindow
	 * @param none
     */
    function resizeWindow(){
        resizeBody();
        resizeHeader();
        resizeMainPanel();
        resizeLeftPanel();
        setAccordinContentHeight();
        resizeCanvas();
    }
	
	/**
     * method to resize the document body
	 * @method resizeBody
	 * @param none
     */
    function resizeBody(){
        $('#_body').width(bodyWidth + 2);
        $('#_body').height(bodyHeight);
    }

    /**
     * method to set header width and height
	 * @method resizeHeader
	 * @param none
     */
    function resizeHeader() {
        $('#header').width(bodyWidth);
        $('#header').height(topPanelHeight);
    }

    /**
     * Set Outer panel width and height
     * @method resizeMainPanel
	 * @param none
     */
    function resizeMainPanel() {
        $('#outer').height(leftPanelHeight);
        $('#outer').width(bodyWidth);
    }

    /**
     * Set left panel width and height
     * @method resizeLeftPanel
	 * @param none
     */
    function resizeLeftPanel() {
        $('#leftdiv').width(leftPanelWidth);
        $('#leftdiv').height(leftPanelHeight);
    }

    /**
     * Set Canvas width and height
     * @method resizeCanvas
	 * @param none
     */
    function resizeCanvas() {
        $('#canvasId').height(canvasHeight);
        $('#canvasId').width(canvasWidth);
        //canvas.setDimensions({width:canvasWidth, height:canvasHeight});
    }

    /**
     * Set Accordian width and height
	 * @method setAccordinContentHeight
	 * @param none
     */
    function setAccordinContentHeight() {
        var $accordionHeaders = $('.ui-accordion-header');
        var accordionHeaderHeight = 0;
        $accordionHeaders.each(function(i,s){
            accordionHeaderHeight = accordionHeaderHeight+$(s).outerHeight(true);
        });
        accordionContentHeight = (leftPanelHeight-(accordionHeaderHeight+25));
        $('.ui-accordion-content').height(accordionContentHeight);
    }

    /**
     * Bind resizing of window to panels
	 * @method bindResizeWindow
	 * @param none
     */
    function bindResizeWindow() {
        $(window).resize(function () {
            initWidthAndHeightOfPanels();
            resizeWindow();
            setCanvasSize();
        });
    }

    /**
     * Applies color picked from picker to object
     * @method pickerUpdate
     * @param (String) color value
     *
     */

    function pickerUpdate(color) {
        if (App.focusInput == "") return;
        var obj = canvas.getActiveObject();
        obj.set(App.focusInput, color);
        $('#' + App.focusInput).val(color);
        $('#' + App.focusInput).css('background', color);
        matisse.sendDrawMsg({
            action: "modified",
            args: [{
                uid: obj.uid,
                object: obj
            }]
        });
        canvas.renderAll();
    }


    /**
     * Sets the Canvas width and height based on browser window size
     * @method setCanvasSize
     * @param none
     *
     */
    function setCanvasSize() {
        width = (bodyWidth > initialBodyWidth ) ? (bodyWidth - 100) : ((initialBodyWidth > 1060) ? (initialBodyWidth - 100) : 960);
        height = (bodyHeight > initialBodyHeight) ? (bodyHeight - 100) : ((initialBodyHeight > 900) ? (initialBodyHeight - 100) : 800);
        canvas.setDimensions({width:width, height:height});
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
        observe('object:modified');
        observe('path:created');
        observe('selection:cleared');
        observe('object:moved');
        observe('object:selected');
    }
	/**
     * Open Chat Window when user clicks on chat icon
     * @method openChatWindow
     * @param none
     *
     */
    function openChatWindow() {
        $('#chatdialog').dialog({ width : 200});
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

    matisse.onDraw = function (data) {
        if(data && data.args)
        {
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
            } else if(data.action == "importimage") {
                loadImage(data.args[0]);
            } else {
                if (App.pallette[data.pallette] != undefined) {
                    App.pallette[data.pallette].shapes[data.action].toolAction.apply(this, data.args);
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
    function updatePropertyPanel(obj) {
        if(App.pallette[App.palletteName] == null) return;
        if(canvas.getActiveGroup()) return;
        if (obj && obj.name && obj.pallette)
        {
            properties = getDefaultDataFromArray(App.pallette[App.palletteName].shapes[obj.name].properties);
            jQuery.each(properties, function (i, value) {
                $('#' + i).val(obj[i]);
            })
            if(obj.getAngle()) {
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
            matisse.sendDrawMsg({
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
     *  Check for the event fired by fabric when any of the canvas objects modified and apply update properites panel accordingly
     *  @method  observe
     *  @param eventName
     */
    function observe(eventName) {
        canvas.observe(eventName, function (e) {
            switch (eventName) {
                case "object:modified":
                    if(canvas.getActiveGroup()) {
                        notifyServerGroupMoved();
                        return;
                    }
                    var obj = e.memo.target;
                    matisse.sendDrawMsg({
                        action: "modified",
                        name: obj.name,
                        pallette: obj.pallette,
                        args: [{
                            uid: obj.uid,
                            object: obj
                        }] // When sent only 'object' for some reason object  'uid' is not available to the receiver method.
                    })
                    updatePropertyPanel(obj);
                    break;
                case "selection:cleared":
                    $('#prop').remove();
                    $('#propdiv').dialog('close');

                    break;
                case 'path:created':
                    canvas.isSelectMode = true;
                    canvas.isDrawingMode = false;
                    resetIconSelection();
                    App.drawShape = false;
                    document.getElementById("c").style.cursor = 'default';
                    var obj = e.memo.path;
                    obj.uid = uniqid();
                    obj.name = "drawingpath"
                    matisse.sendDrawMsg({
                        action: 'drawpath',
                        pallette: App.palletteName,
                        args: [{
                            uid: obj.uid,
                            left: obj.left,
                            top: obj.top,
                            width: obj.width,
                            height: obj.height,
                            path: obj.path,
                            name:obj.name
                        }]
                    });
                    App.xPoints = [];
                    App.yPoints = [];
                    break;
                case 'object:selected':
                    var obj = e.memo.target;
                    if(canvas.getActiveGroup()) {
                        return;
                    }
                    createPropertiesPanel(obj);
                    break;
            }

        })
    }

	/**
     *  Modify object when receive a notification from server 
     *  @method  modifyObject
     *  @param args - args array/object
     */
    function modifyObject(args) {
        var obj = getObjectById(args.uid);

        if(obj) {
            var recvdObj = args.object;
            obj.set("left", recvdObj.left);
            obj.set("top", recvdObj.top);
            obj.set("scaleX", recvdObj.scaleX);
            obj.set("scaleY", recvdObj.scaleY);
            if(recvdObj.fill)
                obj.set("fill", recvdObj.fill);
            if(recvdObj.stroke)
                obj.set("stroke", recvdObj.stroke);
            if (obj.name == "text") obj.text = recvdObj.text;
            obj.setAngle(recvdObj.angle)
            //  obj.set("angle", recvdObj.angle);
            if (obj.pallette == "wireframe")
            {
                switch(obj.name)
                {
                    case "radio" :
                        obj.paths[0].fill = recvdObj.paths[0].fill;
                        obj.paths[0].left = recvdObj.paths[0].left;
                        obj.paths[1].left = recvdObj.paths[1].left;
                        obj.paths[2].left = recvdObj.paths[2].left;
                        obj.paths[2].text = recvdObj.paths[2].text;
                        obj.width = recvdObj.width;
                        break;

                    case "checkbox" :

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
                    case "textbox" :
                        obj.left = recvdObj.left;
                        obj.top = recvdObj.top;
                        obj.width = recvdObj.width;
                        obj.height = recvdObj.height;
                        obj.paths[0].width = recvdObj.paths[0].width;
                        obj.paths[0].height = recvdObj.paths[0].height;
                        obj.paths[1].text = recvdObj.paths[1].text;
                        break;

                    case "label" :
                        obj.left = recvdObj.left;
                        obj.top = recvdObj.top;
                        obj.width = recvdObj.width;
                        obj.height = recvdObj.height;
                        obj.paths[0].width = recvdObj.paths[0].width;
                        obj.paths[0].height = recvdObj.paths[0].height;
                        obj.paths[0].text = recvdObj.paths[0].text;
                        break;

                    case "txt_button" :
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

                    case "combo" :
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
        }
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

	/**
     *  Reset Current seltected tool Icon when object is drawn on canvas
     *  @method  resetIconSelection
     *  @param none
     */
    function resetIconSelection(){
        if($currActiveIcon) {
            $currActiveIcon.attr("src",$currActiveIcon.attr('data-inactive'));
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
        $(e.target).attr("src",$(e.target).attr('data-active'));
        $(e.target).parent().parent().addClass('shape-active');
        $currActiveIcon = $(e.target);
        canvas.isSelectMode = false;
        var toolId = $(e.target).attr('id');
        currentTool = toolId;
        App.currTool = e.target;
        $(e.target).removeClass(toolId).addClass(toolId+"_click");
        document.getElementById("c").style.cursor = 'default'
        App.drawShape = true;
        App.action = e.target.id;
        App.palletteName = $(e.target).attr('data-parent');
	    if(e.target.id !="path") {
            var obj = getDefaultDataFromArray(App.pallette[App.palletteName].shapes[e.target.id].properties);
            obj.uid = uniqid();
            App.shapeArgs = [obj];
        }
        if (App.action != "path") {
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
        if (arr == undefined) return "undefined";
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
        for (var i = 0; i < App.pallette[App.palletteName].shapes[objName].properties.length; i++) {
            if (App.pallette[App.palletteName].shapes[objName].properties[i].name == prop) {
                App.pallette[App.palletteName].shapes[objName].properties[i].action.apply(this, arr);
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
        matisse.sendDrawMsg({
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
            if (!canvas.isDrawingMode && App.drawShape) {
                App.points.x = event.pageX + document.getElementById("canvasId").scrollLeft - App.xOffset; //offset
                App.points.y = event.pageY + document.getElementById("canvasId").scrollTop - App.yOffset; //offset
                App.shapeArgs[0].left = App.points.x;
                App.shapeArgs[0].top = App.points.y;
                App.shapeArgs[0].name = App.action;
                App.shapeArgs[0].pallette = App.palletteName;
                App.pallette[App.palletteName].shapes[App.action].toolAction.apply(this, App.shapeArgs);
                matisse.sendDrawMsg({
                    pallette: App.palletteName,
                    action: App.action,
                    args: App.shapeArgs
                });

                canvas.isSelectMode = true;
                App.drawShape = false;
                resetIconSelection();
            }

            if (canvas.isDrawingMode) {
                App.xPoints = [];
                App.yPoints = [];
                App.xPoints.push(event.pageX + document.getElementById("canvasId").scrollLeft - App.xOffset);
                App.yPoints.push(event.pageY + document.getElementById("canvasId").scrollTop - App.yOffset);

            }
        });
        // drawingModeEl.innerHTML = 'Cancel drawing mode';
        $("#canvasId").mousemove(function (event) {
            if (canvas.isDrawingMode) {
                App.xPoints.push(event.pageX + document.getElementById("canvasId").scrollLeft - App.xOffset);
                App.yPoints.push(event.pageY + document.getElementById("canvasId").scrollTop - App.yOffset);
                // msg += event.pageX + ", " + event.pageY + "\n :";
            }
            else {
                var obj = canvas.getActiveObject();
                if(obj && App.associateText[obj.name]) {
                    App.associateText[obj.name].left = obj.left;
                    App.associateText[obj.name].top = obj.top;
                    App.associateText[obj.name].setAngle(obj.getAngle());
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
        if(obj) {
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



    /**
     * Returns unique id to attach to an object
	 * @method uniqid
     * @param null
     */

    function uniqid() {
        var newDate = new Date;
        return randomString()+newDate.getTime();
    }
	
	/**
     * Returns Random String 
	 * @method randomString
     * @param null
     */
    function randomString() {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 8;
        var randomstring = '';
        for (var i=0; i<string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum,rnum+1);
        }
        return randomstring;
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

        p.set("left", args.left);
        p.set("top", args.top);
        p.set("width", args.width);
        p.set("height", args.height);
        canvas.add(p);
        canvas.renderAll();
        p.setCoords();
        
        
    }

    function checkboxSelectionHandler(objct)
    {
        $("#proptable").append("<tr><td><input id='chkbox' type='checkbox'>check</input> </td></tr>");
        var chkbox = document.getElementById('chkbox');
        objct.paths[2].stroke == '#000000' ? chkbox.checked = true : chkbox.checked = false;
        chkbox.onmousedown = function()
        {
            if (!chkbox.checked)
            {
                objct.paths[2].stroke = '#000000';
            }
            else
            {
                objct.paths[2].stroke = '#ffffff';
            }
            matisse.sendDrawMsg({
                action: "modified",
                args: [{
                    uid: objct.uid,
                    object: objct
                }]
            });
            canvas.renderAll();
        }
    }

    function radioSelectionHandler(objct)
    {
        $("#proptable").append("<tr><td><input id='chkbox' type='checkbox'>select</input> </td></tr>");
        var chkbox = document.getElementById('chkbox');
        objct.paths[1].fill == '#555555' ? chkbox.checked = true : chkbox.checked = false;
        chkbox.onmousedown = function()
        {
            if (!chkbox.checked)
            {
                objct.paths[1].fill = '#555555';
            }
            else
            {
                objct.paths[1].fill = '#eeeeee';
            }
            matisse.sendDrawMsg({
                action: "modified",
                args: [{
                    uid: objct.uid,
                    object: objct,
                    text:objct.text
                }]
            });
            canvas.renderAll();
        }
    }

    function progressHandler(objct)
    {
        $("#proptable").append("<tr><td><input id='txtbox' type='text'>Progress %</input> </td></tr>");
        var txtbox = document.getElementById('txtbox');
        var wdth = objct.paths[0].width;
        txtbox.onfocus = function(e)
        {
            this.value = (wdth/2 + objct.paths[1].points[1].x) * (100/wdth);
        }
        txtbox.onkeyup = function(e)
        {

            if (this.value <= 100 && this.value >= 0)
            {
                objct.paths[1].points[1].x = (wdth * this.value/100) - (wdth/2);
                objct.paths[1].points[2].x = (wdth * this.value/100) - (wdth/2);
                matisse.sendDrawMsg({
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
    function createPropertiesPanel(obj) { /*$('#propdiv').dialog();*/

        if (obj.pallette && obj && obj.name) {
            var val;
            var colorPicker;
            $('#prop').remove();
            objName = obj.name;
            App.palletteName = obj.pallette;
            if(App.pallette[App.palletteName] == null ) return;
            if (objName == undefined || objName == 'drawingpath') return;
            properties = getDefaultDataFromArray(App.pallette[App.palletteName].shapes[objName].properties);
            var props = {};
            $('#propdiv').append('<div id="prop"><table id="proptable"><tr><td bgcolor="#FFFFFF" border="1px" class= "cp" id="colorpicker"></td></tr></table></div>');
            jQuery.each(properties, function (i, val) {
                if (i == 'angle') {
                    val = obj.getAngle()
                } else {
                    val = obj[i]
                }
                if (i === "fill" || i === "stroke") {
                    var inputTag = "<input style='width:100px' onKeyPress='return App.Main.letternumber(event)' class= 'color' id='" + i + "' value='" + val + "'></input></div>";

                } else {
                    var inputTag = "<input type='text' style='width:100px' onKeyPress='return App.Main.numbersonly(this, event)' id='" + i + "' value='" + val + "'></input>";
                }
                var $propTableDiv = $("#proptable");
                $propTableDiv.append("<tr class='" + i + "tr'><td ><label style = 'text-align: right' for='" + i + "'>" + i + ": </label></td><td >" + inputTag + "</td></tr>");
                var inBox = $("#" + i);

                $(":input").focus(function () {
                    App.focusInput = '';
                    id = this.id;
                    if (id == 'fill' || id == 'stroke') {
                        App.focusInput = id;
                        var prop = $(this).position();
                        $('#colorpicker').show();
                        var ht = $propTableDiv.height();
                        var cssObj = {'position':'absolute', 'left':5, 'top': prop.top+20};
                        $('#colorpicker').css(cssObj);
                        $( "#propdiv").dialog({ height:530});

                    }
                });
                $(":input").blur(function () {
                    App.focusInput = '';
                    id = this.id;
                    if (id == 'fill' || id == 'stroke') {
                        $('#colorpicker').hide();
                        $( "#propdiv").dialog({ height:'auto'});
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
                    matisse.sendDrawMsg({
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
            colorPicker.linkTo(pickerUpdate);
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
        createAllPallettes(App.pallette);

        $('#toolsdiv').append("<div id='deleteTool' class='tools deleteTool'></div>");
        $('#deleteTool').click( function() {
            currentTool = "deleteTool";
            deleteObjects();
        });

        //document.getElementById("drawing-mode").onclick = drawingButtonListener;
        $('#chatbutton').click(chatButtonListener);
        handleMouseEvents()
        $('#accordion').accordion();
        setAccordinContentHeight();
    }


	/**
     * Loop through all pallettes and call createPallette for each pallette found
     * @method createAllPallettes
	 * @param palletteObj
     */
    function createAllPallettes(palletteObj){
        for(var palletteName in palletteObj) {
            createPallette(palletteName);
        }
    }
	
	/**
     * Create a  pallette for each type of pallette and add it in toolbar
     * @method createPallette
	 * @param palletteName
     */
    function createPallette(palletteName){
        var pallette_DisplayName = App.pallette[palletteName].collectionName;
        updateAccordian(pallette_DisplayName);
        var shapesObj = App.pallette[palletteName];
        var html = '<div class="scroller scroller-up"></div>';
        html += '<div class="shapesHolder">';
        html += '<div class="scrollerContentHolder">';
        for (var i in shapesObj.shapes) {
            var shape = shapesObj.shapes[i]
            var shape_DisplayName = shape.displayName;
            var src = '/images/' + shape.inactiveIcon;
            var activesrc = '/images/' + shape.activeIcon;
            var shapeHolder = '<div class="shape-holder" id="shape-holder-'+shape_DisplayName+'">';
            shapeHolder+='<div id="shape"><img class="tool" id="' + shape_DisplayName + '" src="' + src + '" data-active="'+activesrc+'" data-inactive="'+src+'" data-parent="'+pallette_DisplayName+'" width="64" height="64" /></div><div id="shape-label">'+shape_DisplayName+'</div></div>';
            html += shapeHolder;
        }
        html += '</div></div>';
        html += '<div class="scroller scroller-down"></div>';
        $(document.getElementById(pallette_DisplayName)).append(html);
        $('.tool').click(handleToolClick);
    }
	
	/**
     * Update accordion
     * @method updateAccordian
	 * @param pallette_DisplayName
     */
    function updateAccordian(pallette_DisplayName){
        $("#accordion").append('<h3><a href="#">'+pallette_DisplayName+'</a></h3><div height="100%" id="'+pallette_DisplayName+'"></div>');
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
            }
            else if (key == "38" && evt.ctrlKey) {
                var obj = canvas.getActiveObject();
                if(obj)	canvas.bringForward(obj);
            }
            else if (key == "40" && evt.ctrlKey) {
                var obj = canvas.getActiveObject();
                if(obj)	canvas.sendBackwards(obj);
            }
        }
    }
	
	/**
     * Calculate the offset value for the canvas and return it
     * @method getOffset 
	 * @param el 
     */
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
	
	/**
     * Calculate width of the given text string and return it
     * @method getStringWidth 
	 * @str
     */
    App.Main.getStringWidth = function(str)
    {
        var font = '20px delicious_500',
            obj = $('<div id=div1>' + str + '</div>')
                .css({'position': 'absolute', 'float': 'left', 'white-space': 'pre-wrap', 'visibility': 'hidden', 'font': font})
                .appendTo($('body')),
            w = document.getElementById('div1').clientWidth;
        obj.remove();
        return w;
    }

	
	/**
     * Calculate height of the given text string and return it
     * @method getStringHeight 
	 * @param str
     */
    App.Main.getStringHeight = function(str)
    {
        var font = '20px delicious_500',
            obj = $('<div id=div1>' + str + '</div>')
                .css({'position': 'absolute', 'float': 'left', 'white-space': 'pre-wrap', 'visibility': 'hidden', 'font': font})
                .appendTo($('body')),
            h = document.getElementById('div1').clientHeight;
        obj.remove();
        return h;
    }

    function textInputHandler(obj, parent_obj)
    {

        $("#proptable").append("<tr id = 'txtrow'><td id= 'txttd' valign='top'><label style = 'text-align:right; vertical-align:top' id='labl' for='txtarea'>text:</label></td><td><textarea id='txtarea' cols= '10' style='height:75px'>hello</textarea> </td></tr>");
        var txt_area = document.getElementById("txtarea");
        txt_area.onfocus = function()
        {
            txt_area.innerHTML = obj.text;
        }
        if(parent_obj) {
            var wireframeObject = parent_obj.name;
        }


        switch(wireframeObject)
        {
            case "radio":	txt_area.onkeyup = function (e) {
                var wdth = 0;
                obj.text = this.value;
                canvas.renderAll();
                wdth = obj.getWidth() + (2 * parent_obj.paths[1].radius) + 15 + 30;
                (wdth - parent_obj.width) > 0 ? parent_obj.left += (wdth - parent_obj.width)/2 : parent_obj.left = parent_obj.left;
                parent_obj.width = wdth;
                parent_obj.paths[0].left = -((wdth/2) - 15);
                parent_obj.paths[1].left = parent_obj.paths[0].left;
                var text_left = parent_obj.paths[0].left + (2 * parent_obj.paths[1].radius) + 15;
                parent_obj.paths[2].left = -(-obj.getWidth()/2 - text_left);
                matisse.sendDrawMsg({
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

            case "checkbox":	txt_area.onkeyup = function (e) {
                var wdth = 0;
                obj.text = this.value;
                canvas.renderAll();
                wdth = obj.getWidth() + 14 + 15 + 30;
                (wdth - parent_obj.width) > 0 ? parent_obj.left += (wdth - parent_obj.width)/2 : parent_obj.left = parent_obj.left;
                parent_obj.width = wdth;
                var checkbox_left = -wdth/2 + 15;
                var text_left = checkbox_left + 14 + 15;
                parent_obj.paths[0].points[0].x = checkbox_left;
                parent_obj.paths[0].points[1].x = checkbox_left + 14;
                parent_obj.paths[0].points[2].x = checkbox_left + 14;
                parent_obj.paths[0].points[3].x = checkbox_left;
                parent_obj.paths[1].left = -(-(obj.getWidth())/2 - text_left);
                parent_obj.paths[2].points[0].x = checkbox_left + 3;
                parent_obj.paths[2].points[1].x = checkbox_left + 6;
                parent_obj.paths[2].points[2].x = checkbox_left + 11;
                matisse.sendDrawMsg({
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
            case "label":		txt_area.onkeyup = function (e) {
                var width = 0, height = 0;
                obj.text = this.value;
                canvas.renderAll();
                width = obj.getWidth() + 10;
                height = obj.height + 5;
                (width - parent_obj.width) > 0 ? parent_obj.left += (width - parent_obj.width)/2 : parent_obj.left = parent_obj.left;
                (height - parent_obj.height) > 0 ? parent_obj.top += (height - parent_obj.height)/2 : parent_obj.top = parent_obj.top;
                parent_obj.width = width;
                parent_obj.height = height;
                parent_obj.paths[0].width = width;
                parent_obj.paths[0].height = height;
                matisse.sendDrawMsg({
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
            case "textbox":		txt_area.onkeyup = function (e) {
                var width = 0, height = 0;
                obj.text = this.value;
                canvas.renderAll();
                width = obj.getWidth() + 15;
                (width <= 150)? width = 150 : width = width;
                height = obj.height + 5;
                (width - parent_obj.width) > 0 ? parent_obj.left += (width - parent_obj.width)/2 : parent_obj.left = parent_obj.left;
                (height - parent_obj.height) > 0 ? parent_obj.top += (height - parent_obj.height)/2 : parent_obj.top = parent_obj.top;
                parent_obj.width = width;
                parent_obj.height = height;
                parent_obj.paths[0].width = width;
                parent_obj.paths[0].height = height;
                obj.left = -width/2 + obj.getWidth()/2 + 10;
                matisse.sendDrawMsg({
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
                txt_area.onkeyup = function(e){
                    obj.text = "";
                    for (var i = 0; i < this.value.length; i++)
                    {
                        obj.text += '*';
                    }
                    canvas.renderAll();
                    this.value = obj.text;
                    var width = 0, height = 0;
                    width = obj.getWidth() + 30;
                    height = App.Main.getStringHeight(obj.text);
                    (width - parent_obj.width) > 0 ? parent_obj.left += (width - parent_obj.width)/2 : parent_obj.left = parent_obj.left;
                    parent_obj.width = width;
                    parent_obj.height = height;
                    parent_obj.paths[0].width = width;
                    parent_obj.paths[0].height = height;
                    matisse.sendDrawMsg({
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
            case "txt_button": 	txt_area.onkeyup = function (e) {
                var width = 0, height = 0;
                obj.text = this.value;
                width = App.Main.getStringWidth(obj.text) + 5;
                height = App.Main.getStringHeight(obj.text) + 5;
                (width - parent_obj.width) > 0 ? parent_obj.left += (width - parent_obj.width)/2 : parent_obj.left = parent_obj.left;
                parent_obj.width = width;
                parent_obj.paths[0].points[0].x = -width/2;
                parent_obj.paths[0].points[1].x = -width/2 + 5;
                parent_obj.paths[0].points[2].x = width/2 - 5;
                parent_obj.paths[0].points[3].x = width/2;
                parent_obj.paths[0].points[4].x = width/2;
                parent_obj.paths[0].points[5].x = width/2 - 5;
                parent_obj.paths[0].points[6].x = -width/2 + 5;
                parent_obj.paths[0].points[7].x = -width/2;

                matisse.sendDrawMsg({
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
            case "combo":	txt_area.onkeyup = function (e){
                var wdth = 0;
                obj.text = this.value;
                canvas.renderAll();
                wdth = obj.getWidth() + parent_obj.paths[1].width + 30;
                (wdth - parent_obj.width) > 0 ? parent_obj.left += (wdth - parent_obj.width)/2 : parent_obj.left = parent_obj.left;
                parent_obj.width = wdth;
                parent_obj.paths[0].width = wdth;
                parent_obj.paths[1].points[0].x = wdth/2 -22;
                parent_obj.paths[1].points[1].x = wdth/2;
                parent_obj.paths[1].points[2].x = wdth/2;
                parent_obj.paths[1].points[3].x = wdth/2 - 22;
                parent_obj.paths[2].points[0].x = wdth/2 - 15.5;
                parent_obj.paths[2].points[1].x = wdth/2 - 6.5;
                parent_obj.paths[2].points[2].x = wdth/2 - 10.5;
                parent_obj.paths[3].left = -wdth/2 + 15 + obj.getWidth()/2;
                matisse.sendDrawMsg({
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

                    matisse.sendDrawMsg({
                        action: "modified",
                        args: [{
                            uid: obj.uid,
                            object: obj,
                            text:obj.text
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
    App.Main.loadWireframe = function(args,objects)
    {
        var pathGroup = new fabric.PathGroup(objects, {width:args.width, height: args.height});
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

    App.Main.loadSVG = function(args)  {

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
	
	/**
     * Validation method for input field, checks for the user keypress and allows only numbers
     * @method numbersonly
	 * @param myfield, e, dec
     */
    App.Main.numbersonly = function(myfield, e, dec) {
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

	/**
     * Validation method for input field, checks for the user keypress and allows only letters
     * @method letternumber
	 * @param e
     */
    App.Main.letternumber = function(e) {
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

    $(".scroller-up").live("click", function(){
        var scrollerContentHolderHeight = $(this).siblings().find(".scrollerContentHolder").css('height');
        var scrollerContentHolderTop = $(this).siblings().find(".scrollerContentHolder").css('top');
        var parentHeight = $(this).parent().css('height');
        var shapeHeight = $(".scrollerContentHolder:visible>.shape-holder").height();

        scrollerContentHolderHeight = scrollerContentHolderHeight.substr(0,scrollerContentHolderHeight.indexOf('px'));
        parentHeight = parentHeight.substr(0,parentHeight.indexOf('px'));
        scrollerContentHolderTop = scrollerContentHolderTop.substr(0,scrollerContentHolderTop.indexOf('px'));

        if(scrollerContentHolderHeight>parentHeight)
        {
            if(scrollerContentHolderTop < -30)
            {
                $("#wireframe .scroller-down").css("background-color","#8F98A6");
                var newTop = (scrollerContentHolderTop-(-shapeHeight));
                $(this).siblings().find(".scrollerContentHolder").stop().animate({"top":newTop},"slow");
            }
            else
            {
                $("#wireframe .scroller-up").css("background-color","#aaa");
            }
        }
    });

    $(".scroller-down").live("click", function(){
        var scrollerContentHolderHeight = $(this).siblings().find(".scrollerContentHolder").css('height');
        var scrollerContentHolderTop = $(this).siblings().find(".scrollerContentHolder").css('top');
        var parentHeight = $(this).parent().css('height');
        var shapeHeight = $(".scrollerContentHolder:visible>.shape-holder").height();

        scrollerContentHolderHeight = scrollerContentHolderHeight.substr(0,scrollerContentHolderHeight.indexOf('px'));
        parentHeight = parentHeight.substr(0,parentHeight.indexOf('px'));
        scrollerContentHolderTop = scrollerContentHolderTop.substr(0,scrollerContentHolderTop.indexOf('px'));

        var carouselArrowheight = 18;
        var accordianHeight = $(".ui-accordion-content").height()-(carouselArrowheight*2);
        var sumOfShapesHeight = $(".scrollerContentHolder:visible").height();
        if(scrollerContentHolderHeight>parentHeight)
        {
            if(-(scrollerContentHolderTop) < (sumOfShapesHeight-accordianHeight-30))
            {
                $("#wireframe .scroller-up").css("background-color","#8F98A6");
                var newTop = (scrollerContentHolderTop-shapeHeight);
                $(this).siblings().find(".scrollerContentHolder").stop().animate({"top":newTop},"slow");
            }
            else
            {
                $("#wireframe .scroller-down").css("background-color","#aaa");
            }
        }
    });
	
	/**
     * Handler for Save Button Click
     * @method saveButtonClickHandler
	 * @param none
     */
	saveButtonClickHandler = function() {
		$('#saveicon').bind("click", function() {
			var data = canvas.toDataURL('png')
			matisse.saveImage(data);
		});
	}
	
	/**
     * Handler for Import Image Button Click
     * @method importImageButtonClickHandler
	 * @param none
     */
	importImageButtonClickHandler = function() {
		$('#loadicon').bind("click", function() {
			var args = {};
			args.path = 'images/conventional-html-layout.png';
			args.name ="importimage";
			args.left = 300;
			args.top = 200;
			args.uid = uniqid();
			args.pallette = 'imagepallette';
			loadImage(args);
		});
	}
	
   
	/**
     * Handler for New Document Button Click
     * @method newButtonClickHanlder
	 * @param none
     */
	newButtonClickHanlder = function() {
		$('#newdocicon').bind("click", function() {
			var pageURL = document.location.href;
			// get the index of '/' from url (ex:http://localhost:8000/qd7kt3vd)
			var indx = pageURL.indexOf('/');
			pageURL = pageURL.substr(0, indx)
			window.open (pageURL+'/boards/',"mywindow");
		});
	}

  

   

    /* Throws Error if the value is null.
     */
    function assertNotNull(value, str) {
        if (value == null || (value.pallette) == null || (value.name) == null) {
            throw new Error(str);
            canvas.activeObject = null;
            return false;
        }
        return true;
    }
})(jQuery);