/**
 * User: Bahvani Shankar
 * Date: 12/26/11
 * Time: 11:16 AM
 * About this : This is the main javascipt file to handle adding, editing, deleting all elements on canvas (text, rectangle, circle etc)
 * Uses 'Fabric.js' library for client side
 * Node.js and  Node Package Manager (NPM) for server side - JavaScript environment that uses an asynchronous event-driven model.
 */ (function ($) {
    var currentTool = "";
    /**
     * @namespace
     */
    App.Main = {};

    // create canvas object
    window.canvas = new fabric.Canvas('c', {
        backgroundColor: '#FFFFFF'
        //backgroundImage: '/images/combobox_w.png'
        //HOVER_CURSOR: 'pointer'
    });

    /** width and height of panels for resize */
    var bodyWidth, bodyHeight;
    var initialBodyWidth = $(window).width() > 960 ? $(window).width() : 960,
        initialBodyHeight = $(window).height() > 800 ? $(window).height() : 800;
    var topPanelHeight;
    var leftPanelWidth, leftPanelHeight;
    var accordionContentHeight;
    var canvasWidth, canvasHeight;
    var horIndent = 1;
    var verIndent = 1;
    var indentMultiplier = 10;
    var hLine, vLine;
    var imageTag;
    /**
     * current active reference
     */
    var $currActiveIcon;

    /* by default selection mode is false */
    canvas.isSelectMode = false;

    /**
     * Initializes the application
     * @method App.Main.init
     * @param none
     * 
     */

    App.Main.init = function () {
        //drawGrid()
        initWidthAndHeightOfPanels();
        //resetWidthAndHeightOfPanels();
        resizeWindow();
        setCanvasSize();
        bindResizeWindow();
        canvas.isSelectMode = true;
        //setCanvasSize();
        App.xOffset = getOffset(document.getElementById('canvasId')).left;
        App.yOffset = getOffset(document.getElementById('canvasId')).top;

        addTools();

        document.onkeydown = keyDown;
        $('#chaticon').click(openChatWindow);
        $('#propicon').click(openPropWindow);

        initChatWindow();
        initPropWindow();
        addObservers();
        // initAnnotation();
    }

    /**
     * function to initialize width and heights
     */
    function initWidthAndHeightOfPanels() {
        bodyWidth = $(window).width() - 2;
        bodyHeight = $(window).height();
        topPanelHeight = 100;
        leftPanelWidth = 100;
        leftPanelHeight = bodyHeight - topPanelHeight;
        canvasWidth = bodyWidth - leftPanelWidth;
        canvasHeight = bodyHeight - topPanelHeight - 23;
    }
    /**
     * function to reset width and heights
     */
    function resetWidthAndHeightOfPanels() {

        var windowHeight = $(window).height();
        var windowWidth = $(window).width();

        if (windowWidth > 960) {
            bodyWidth = windowWidth;
        } else {
            bodyWidth = 960;
        }

        if (windowHeight > 800) {
            bodyHeight = windowHeight;
        } else {
            bodyHeight = 800;
        }
        //bodyHeight = $(window).height();
        //bodyWidth = $(window).width();
        topPanelHeight = 100;
        leftPanelHeight = windowHeight - 100;
        canvasHeight = bodyHeight - 130;
        canvasWidth = bodyWidth - 130;
    }
    /**
     * method to resize panels on resize of window
     */
    function resizeWindow() {
        resizeBody();
        resizeHeader();
        resizeMainPanel();
        resizeLeftPanel();
        setAccordinContentHeight();
        resizeCanvas();
    }

    function resizeBody() {
        $('#_body').width(bodyWidth + 2);
        $('#_body').height(bodyHeight);
    }

    /**
     * method to set header width and height
     */
    function resizeHeader() {
        $('#header').width(bodyWidth);
        $('#header').height(topPanelHeight);
    }

    /**
     * method to set outer panel width and height
     */
    function resizeMainPanel() {
        $('#outer').height(leftPanelHeight);
        $('#outer').width(bodyWidth);
    }

    /**
     * method to set left panel width and height
     */
    function resizeLeftPanel() {
        $('#leftdiv').width(leftPanelWidth);
        $('#leftdiv').height(leftPanelHeight);
    }

    /**
     * method to set Canvas width and height
     */
    function resizeCanvas() {
        $('#canvasId').height(canvasHeight);
        $('#canvasId').width(canvasWidth);
        //canvas.setDimensions({width:canvasWidth, height:canvasHeight});
    }

    /**
     * method to set Accordian width and height
     */
    function setAccordinContentHeight() {
        var $accordionHeaders = $('.ui-accordion-header');
        var accordionHeaderHeight = 0;
        $accordionHeaders.each(function (i, s) {
            accordionHeaderHeight = accordionHeaderHeight + $(s).outerHeight(true);
        });
        accordionContentHeight = (leftPanelHeight - (accordionHeaderHeight + 25));
        //  console.log(accordionHeaderHeight);
        $('.ui-accordion-content').height(accordionContentHeight);
    }

    /**
     * method to bind resizing of window to panels
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
     * Sets the canvas width and height based on browser window size
     * @method setCanvasSize
     * @param none
     * 
     */
    function setCanvasSize() {
        width = (bodyWidth > initialBodyWidth) ? (bodyWidth - 100) : ((initialBodyWidth > 1060) ? (initialBodyWidth - 100) : 960);
        height = (bodyHeight > initialBodyHeight) ? (bodyHeight - 100) : ((initialBodyHeight > 900) ? (initialBodyHeight - 100) : 800);
        canvas.setDimensions({
            width: width,
            height: height
        });
        drawHVLines();
    }



    function drawGrid() {
        var line = new fabric.Line([10, 10, 100, 10], {
            eanbled: false,
            stroke: '#ff0000'
        })
        canvas.add(line);
        line.set('stroke', '#ff0000');
        //disableObject(line);
        //	fabric.util.makeElementUnselectable(line)
    }

    function drawHVLines() {
        hLine = new fabric.Line([0, -10, width, -10], {
            eanbled: false,
            stroke: '#ff0000',
            left: width / 2
        })
        vLine = new fabric.Line([-10, 0, -10, height], {
            eanbled: false,
            stroke: '#ff0000',
            top: height / 2
        })
        vLine.name = 'vline';
        hLine.name = 'hline';
        canvas.add(hLine);
        canvas.add(vLine);
        hLine.set('fill', '#ff0000');
        vLine.set('fill', '#ff0000');
        hLine.set('strokeWidth', '.5');
        vLine.set('strokeWidth', '.5');
        //disableObject(line);
        //	fabric.util.makeElementUnselectable(line)
    }

    function disableObject(obj) {
        obj.lockMovementX = true;
        obj.lockMovementY = true;
        obj.lockScalingX = true;
        obj.lockScalingY = true;
        obj.lockUniScaling = true;
        obj.lockRotation = true;
        obj.selection = false;
    }

    function initPropWindow() {
        $('#propdiv').dialog();
        $('#propdiv').dialog({
            width: 'auto',
            height: 'auto',
            resizable: false
        });
        $('#propdiv').dialog('close');
    }

    function initChatWindow() {
        $('#chatdialog').dialog();
        $('#chatdialog').dialog('close');
    }

    function initAnnotation() {
        $('#annotation').dialog();
        //$('#annotate').dialog('close');
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
        observe('object:moving');
        observe('object:selected');
    }

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
     * method to open a Properties panel for currently selected object
     */
    function openPropWindow() {
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
     *  @parama data - shape(data.shape) and args array (data.args)
     * 
     */

    matisse.onDraw = function (data) {
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
                if (App.pallette[data.pallette] != undefined) {
                    App.pallette[data.pallette].shapes[data.action].toolAction.apply(this, data.args);
                }
            }
        }
    }

    /**
     * searches for the object with the given id and returns that object
     * @property id
     * @type object
     */

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
        if (App.pallette[App.palletteName] == null) return;
        if (canvas.getActiveGroup()) return;
        if (obj && obj.name && obj.pallette) {
            properties = getDefaultDataFromArray(App.pallette[App.palletteName].shapes[obj.name].properties);
            jQuery.each(properties, function (i, value) {
                $('#' + i).val(obj[i]);
            })
            if (obj.getAngle()) {
                $('#angle').val(obj.getAngle());
            }
        }
    }

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

    function observe(eventName) {
        canvas.observe(eventName, function (e) {
            // alert(eventName);
            switch (eventName) {
            case "object:modified":
                if (canvas.getActiveGroup()) {
                    notifyServerGroupMoved();
                    return;
                }
                var obj = e.memo.target;
                console.log(" modified object  name =" + obj.type + '   ' + obj.name + '  ::  ' + obj);
                matisse.sendDrawMsg({
                    action: "modified",
                    name: obj.name,
                    pallette: obj.pallette,
                    args: [{
                        uid: obj.uid,
                        object: obj
                    }] // When sent only 'object' for some reason object  'uid' is not available to the receiver method.
                })
                hLine.set('top', -10);
                vLine.set('left', -10);
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
                obj.name = "drawingpath";
				obj.pallette = App.palletteName;
                //alert("mousedown"+canvas.isDrawingMode);
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
                        name: obj.name
                    }]
                });
                App.xPoints = [];
                App.yPoints = [];
                break;
            case 'object:selected':
                var obj = e.memo.target;
                if (canvas.getActiveGroup()) {
                    return;
                }
                //  console.log("object name ==" + obj.type + '    ' + obj.name + '   ::  ' + obj);
                createPropertiesPanel(obj);

                break;
            case 'object:moving':
                //console.log('moving....');
                var obj = e.memo.target;
                checkAlign(obj)
                break;
            }

        })
    }


    function modifyObject(args) {
        var obj = getObjectById(args.uid);

        if (obj) {
            //canvas.setActiveObject(obj);
            var recvdObj = args.object;
            console.log('RECEEEEEEEEEEVD OBJECT =============' + recvdObj.type + '   ' + recvdObj.pallette + '   ' + recvdObj.name)
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


    function resetIconSelection() {
        if ($currActiveIcon) {
            $currActiveIcon.attr("src", $currActiveIcon.attr('data-inactive'));
            $currActiveIcon.parent().parent().removeClass('shape-active');
        }
    }

    function scrollUp(e) {
        $(this).siblings(".scrollerContentHolder").css("top", "yellow");
    }

    function handleToolClick(e) {
        resetIconSelection();
        $(e.target).attr("src", $(e.target).attr('data-active'));
        $(e.target).parent().parent().addClass('shape-active');
        $currActiveIcon = $(e.target);
        canvas.isSelectMode = false;
        var toolId = $(e.target).attr('id');
        currentTool = toolId;
        App.currTool = e.target;
        $(e.target).removeClass(toolId).addClass(toolId + "_click");
        //App.currTool.setAttribute('border', "2px");
        document.getElementById("c").style.cursor = 'default'
        App.drawShape = true;
        App.action = e.target.id;
        App.palletteName = $(e.target).attr('data-parent');
        //	console.log('App.palletteName =='+App.pallette+'  ::::  '+App.palletteName+"   "+e.target.id+" >>>>>>  "+App.pallette[App.palletteName]);
        if (e.target.id != "path") {
            var obj = getDefaultDataFromArray(App.pallette[App.palletteName].shapes[e.target.id].properties);
            obj.uid = uniqid();
            App.shapeArgs = [obj];
        }
        //alert(e.target.id)
        if (App.action != "path") {
            canvas.isDrawingMode = false;
            //document.getElementById("path").src =  'images/nobrush.png' 
        } else {
            document.getElementById("c").style.cursor = 'crosshair';
            canvas.isDrawingMode = true;
            return;
        }
    }

    function getDefaultDataFromArray(arr) {
        console.log('arrraaa=' + arr);
        if (arr == undefined) return "undefined";
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
            obj[arr[i].name] = arr[i].defaultvalue;
        }
        //alert(obj);
        return obj;
    }


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


    function handleMouseEvents() {
        $("#canvasId").mousedown(function (event) {
            if (!canvas.isDrawingMode && App.drawShape) {
                console.log("App.palletteName =" + App.palletteName);
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
            } else {
                var obj = canvas.getActiveObject();
                if (obj && App.associateText[obj.name]) {
                    App.associateText[obj.name].left = obj.left;
                    App.associateText[obj.name].top = obj.top;
                    App.associateText[obj.name].setAngle(obj.getAngle());
                }
            }

        });

    }





    function setObjectProperty(args) {
        var obj = getObjectById(args.uid);
        if (obj) {
            obj.set(args.property, args.value);
            canvas.renderAll();
        }
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



    /**
     * Returns unique id to attach to an object
     * @property null
     * @type string
     */

    function uniqid() {
        var newDate = new Date;
        return randomString() + newDate.getTime();
    }

    function randomString() {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 8;
        var randomstring = '';
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
        return randomstring;
    }

    function unhide(divID, className) {
        var item = document.getElementById(divID);
        if (item) {
            item.value = canvas.getActiveObject().text;
            item.className = className;
        }
    }

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
        //this.fire('path:created', { path: p });
        console.log("drawingpath name =" + p.name);
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
            matisse.sendDrawMsg({
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

    function createPropertiesPanel(obj) { /*$('#propdiv').dialog();*/

        if (obj.pallette && obj && obj.name) {
            console.log('CREATE PROP PANEL');
            var val;
            var colorPicker;
            $('#prop').remove();
            objName = obj.name;
            App.palletteName = obj.pallette;
            if (App.pallette[App.palletteName] == null) return;
            if (objName == undefined || objName == 'drawingpath') return;
            properties = getDefaultDataFromArray(App.pallette[App.palletteName].shapes[objName].properties);
            var props = {};
            //alert(obj.width);
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
                    App.focusInput = '';
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
     *
     */

    function addTools() {
        //$('#leftdiv').draggable()
        createAllPallettes(App.pallette);

        $('#toolsdiv').append("<div id='deleteTool' class='tools deleteTool'></div>");
        $('#deleteTool').click(function () {
            currentTool = "deleteTool";
            deleteObjects();
        });

        //document.getElementById("drawing-mode").onclick = drawingButtonListener;
        $('#chatbutton').click(chatButtonListener);
        handleMouseEvents()
        $('#accordion').accordion();
        setAccordinContentHeight();
    }



    function createAllPallettes(palletteObj) {
        for (var palletteName in palletteObj) {
            createPallette(palletteName);
        }
    }

    function createPallette(palletteName) {
        var pallette_DisplayName = App.pallette[palletteName].collectionName;
        updateAccordian(pallette_DisplayName);
        var shapesObj = App.pallette[palletteName];
        var html = '<div class="scroller scroller-up"></div>';
        html += '<div class="shapesHolder">';
        html += '<div class="scrollerContentHolder">';
        for (var i in shapesObj.shapes) {
            var shape = shapesObj.shapes[i]
            console.log(shape.activeIcon);
            var shape_DisplayName = shape.displayName;
            var src = 'images/' + shape.inactiveIcon;
            var activesrc = 'images/' + shape.activeIcon;
            var shapeHolder = '<div class="shape-holder" id="shape-holder-' + shape_DisplayName + '">';
            shapeHolder += '<div id="shape"><img class="tool" id="' + shape_DisplayName + '" src="' + src + '" data-active="' + activesrc + '" data-inactive="' + src + '" data-parent="' + pallette_DisplayName + '" width="64" height="64" /></div><div id="shape-label">' + shape_DisplayName + '</div></div>';
            html += shapeHolder;
        }
        html += '</div></div>';
        html += '<div class="scroller scroller-down"></div>';
        $(document.getElementById(pallette_DisplayName)).append(html);
        $('.tool').click(handleToolClick);
    }

    function updateAccordian(pallette_DisplayName) {
        $("#accordion").append('<h3><a href="#">' + pallette_DisplayName + '</a></h3><div height="100%" id="' + pallette_DisplayName + '"></div>');
    }


    function closePopup() {
        var popEl = document.getElementById('popUpDiv');
        var closeEl = document.getElementById('closediv');
        var blanketEl = document.getElementById('blanket');
        if (popEl.style.display != 'none') popEl.style.display = 'none';
        if (closeEl.style.display != 'none') closeEl.style.display = 'none';
        if (blanketEl.style.display != 'none') blanketEl.style.display = 'none'
    }

    function keyDown(e) {
        var evt = (e) ? e : (window.event) ? window.event : null;
        if (evt) {
            var key = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
            if (key == "46" && evt.altKey) {
                deleteObjects();
            }
            if (key == "27") // when escape pressed
            {
                closePopup()
            } /* when ALT+upArrow pressed*/
            else if (key == "38" && evt.altKey) {
                var obj = canvas.getActiveObject();
                if (obj) canvas.bringForward(obj);
            } /* when ALT+downArrow pressed*/
            else if (key == "40" && evt.altKey) {
                var obj = canvas.getActiveObject();
                if (obj) canvas.sendBackwards(obj);
            } else if (key == "37" && evt.shiftKey) {
                var obj = canvas.getActiveObject();
                var objleft = obj.left;
                obj.set('left', objleft - (horIndent * indentMultiplier));
                onObjectMoveByKey(obj)
            } else if (key == "37") {
                var obj = canvas.getActiveObject();
                var objleft = obj.left;
                obj.set('left', objleft - horIndent);
                onObjectMoveByKey(obj)
            } else if (key == "39" && evt.shiftKey) {
                var obj = canvas.getActiveObject();
                var objleft = obj.left;
                obj.set('left', objleft + (horIndent * indentMultiplier));
                onObjectMoveByKey(obj);
            } else if (key == "39") {
                var obj = canvas.getActiveObject();
                var objleft = obj.left;
                obj.set('left', objleft + horIndent);
                onObjectMoveByKey(obj)
            } else if (key == "38" && evt.shiftKey) {
                var obj = canvas.getActiveObject();
                var objtop = obj.top;
                obj.set('top', objtop - verIndent * indentMultiplier);
                onObjectMoveByKey(obj)
            } else if (key == "38") {
                var obj = canvas.getActiveObject();
                var objtop = obj.top;
                obj.set('top', objtop - verIndent);
                onObjectMoveByKey(obj)
            } else if (key == "40" && evt.shiftKey) {
                var obj = canvas.getActiveObject();
                var objtop = obj.top;
                obj.set('top', objtop + verIndent * indentMultiplier);
                onObjectMoveByKey(obj)
            } else if (key == "40") {
                var obj = canvas.getActiveObject();
                var objtop = obj.top;
                obj.set('top', objtop + verIndent);
                onObjectMoveByKey(obj)
            }
        }
    }

    function onObjectMoveByKey(obj) {
        canvas.renderAll();
        obj.setCoords();
        canvas.fire('object:moving', {
            target: obj
        });
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

    App.Main.getStringWidth = function (str) {
        var font = '20px delicious_500',
            obj = $('<div id=div1>' + str + '</div>').css({
                'position': 'absolute',
                'float': 'left',
                'white-space': 'pre-wrap',
                'visibility': 'hidden',
                'font': font
            }).appendTo($('body')),
            w = document.getElementById('div1').clientWidth;
        obj.remove();
        return w;
    }

    App.Main.getStringHeight = function (str) {
        var font = '20px delicious_500',
            obj = $('<div id=div1>' + str + '</div>').css({
                'position': 'absolute',
                'float': 'left',
                'white-space': 'pre-wrap',
                'visibility': 'hidden',
                'font': font
            }).appendTo($('body')),
            h = document.getElementById('div1').clientHeight;
        obj.remove();
        return h;
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
                height = App.Main.getStringHeight(obj.text);
                (width - parent_obj.width) > 0 ? parent_obj.left += (width - parent_obj.width) / 2 : parent_obj.left = parent_obj.left;
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
        case "txt_button":
            txt_area.onkeyup = function (e) {
                var width = 0,
                    height = 0;
                obj.text = this.value;
                width = App.Main.getStringWidth(obj.text) + 5;
                height = App.Main.getStringHeight(obj.text) + 5;
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
    App.Main.loadWireframe = function (args, objects) {
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

    App.Main.loadSVG = function (args) {

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
            loadedObject.scaleToWidth(100).setCoords();
            canvas.add(loadedObject);
        });

    }

    function showTextEditor() {
        $('#texteditdiv').dialog();
        $('#texteditdiv').dialog('open');
        textHandler();
    }

    App.Main.numbersonly = function (myfield, e, dec) {
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


    App.Main.letternumber = function (e) {
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

    $(".scroller-up").live("click", function () {
        var scrollerContentHolderHeight = $(this).siblings().find(".scrollerContentHolder").css('height');
        var scrollerContentHolderTop = $(this).siblings().find(".scrollerContentHolder").css('top');
        var parentHeight = $(this).parent().css('height');
        var shapeHeight = $(".scrollerContentHolder:visible>.shape-holder").height();

        scrollerContentHolderHeight = scrollerContentHolderHeight.substr(0, scrollerContentHolderHeight.indexOf('px'));
        parentHeight = parentHeight.substr(0, parentHeight.indexOf('px'));
        scrollerContentHolderTop = scrollerContentHolderTop.substr(0, scrollerContentHolderTop.indexOf('px'));

        //alert($(".scrollerContentHolder:visible>.shape-holder").height());
        if (scrollerContentHolderHeight > parentHeight) {
            if (scrollerContentHolderTop < -30) {
                $("#wireframe .scroller-down").css("background-color", "#8F98A6");
                var newTop = (scrollerContentHolderTop - (-shapeHeight));
                //alert(scrollerContentHolderTop+" - "+scrollerContentHolderHeight+" - "+newTop);
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

        //alert(sumOfShapesHeight+" - "+accordianHeight+": "+(sumOfShapesHeight-accordianHeight)+" ::: "+scrollerContentHolderTop);
        if (scrollerContentHolderHeight > parentHeight) {
            if (-(scrollerContentHolderTop) < (sumOfShapesHeight - accordianHeight - 30)) {
                $("#wireframe .scroller-up").css("background-color", "#8F98A6");
                var newTop = (scrollerContentHolderTop - shapeHeight);
                //alert(scrollerContentHolderTop+" - "+scrollerContentHolderHeight+" - "+newTop);
                $(this).siblings().find(".scrollerContentHolder").stop().animate({
                    "top": newTop
                }, "slow");
            } else {
                $("#wireframe .scroller-down").css("background-color", "#aaa");
            }
        }
    });

    $('#saveicon').bind("click", function () {
        //canvas.loadImageFromURL('images/mockup.png' , onload);
        Canvas2Image.saveAsPNG(canvas, false);
	/*canvas.deactivateAll();
		var data = canvas.toDataURL('png', 0.1)
		//console.log(data);
		popup('popUpDiv', 'closediv', 600, 600);
		$("#result").html('<img src='+data+' />');
		alert("Right click and choose Save Image as...");
		/*$("#data").val(data);
		$("#get").click(function(){
			$("#frm").trigger('submit');
		});*/
        //matisse.saveImage(data);
    });
    $('#helpicon').bind("click", showHelp);

    /* faking inputfile */
    $("#loadicon").click(function () {
        $("#inputfile").click(); //show().focus().click().hide();
    });

	/* $('#loadicon').bind("click", function () {
        var args = {};
        args.path = 'images/conventional-html-layout.png';
        args.name = "importimage";
        args.left = 300;
        args.top = 200;
        args.uid = uniqid();
        args.pallette = 'imagepallette';
        loadImage(args);
    });*/

    $('#inputfile').change(fileSelected);
    $('#inputfile').bind("mouseup", function () {
        console.log('Click was triggered');
    });

    $('#newdocicon').bind("click", function () {
        var pageURL = document.location.href;
        // get the index of '/' from url (ex:http://localhost:8000/qd7kt3vd)
        var indx = pageURL.indexOf('/');
        pageURL = pageURL.substr(0, indx)
        window.open(pageURL + '/html', "mywindow");
    });

    addToCanvas = function () {
        var fabImage = new fabric.Image("myimage", {
            left: 500,
            top: 200,
            width: $('#myimage').width(),
            height: $('#myimage').height()
        });
        canvas.add(fabImage);
        fabImage.uid = uniqid();
        fabImage.name = "image";
        fabImage.pallette = 'imagepallette';
        fabImage.setCoords();
        canvas.renderAll();
        $('#myimage').remove();
		//var id = 'addToCanvas2("'+fabImage.uid+'")'
		var id = ["addToCanvas2(", "'",fabImage.uid,"'", ")" ].join('');
		console.log("===================>>>>>>>>>>>>>>>  "+id)
		//alert(id);
	    //imageTag = imageTag.replace("addToCanvas()", "addToCanvas2()");
		imageTag = imageTag.replace("addToCanvas()", id);
		console.log("==========imageTag=========>>>>>>>>>>>>>>>  "+imageTag)
        matisse.sendDrawMsg({
            action: 'importimage',
            pallette: fabImage.pallette,

            args: [{
                uid: fabImage.uid,
                left: fabImage.left,
                top: fabImage.top,
                width: fabImage.width,
                height: fabImage.height,
                name: fabImage.name,
                path: imageTag
            }]
        });
    };

    addToCanvas2 = function (uid) {
		console.log("ON OTHER =="+uid)
        var fabImage = new fabric.Image("myimage", {
            left: 500,
            top: 200,
            width: $('#myimage').width(),
            height: $('#myimage').height()
        });
        canvas.add(fabImage);
        fabImage.uid = uid;
        fabImage.name = "image";
        fabImage.pallette = 'imagepallette';
        fabImage.setCoords();
        canvas.renderAll();
        $('#myimage').remove();
    };

    function fileSelected() {
        var oFile = document.getElementById('inputfile').files[0];
        var filepath = document.getElementById('inputfile').value;
        var oReader = new FileReader();
        // Closure to capture the file information.
        oReader.onload = (function (theFile) {
            return function (e) {
                // Render thumbnail.
                var span = document.createElement('span');
                imageTag = ['<img id="myimage" class="thumb" onload = "addToCanvas()" src="', e.target.result, '" title="', theFile.name, '"/>'].join('');
                span.innerHTML = imageTag;
                document.getElementById('icons-wrapper').insertBefore(span, null);
                console.log("image width = " + $('#myimage').width() + theFile.width);

                var fabImage = new fabric.Image("myimage", {
                    left: 500,
                    top: 200,
                    width: $('#myimage').width(),
                    height: $('#myimage').height()
                });

                //  var fabImage = new fabric.Image("<img class = 'topicons' id='helpicon' src='images/help.png' alt='help'/>", );

            };
        })(oFile);

        // Read in the image file as a data URL.
        oReader.readAsDataURL(oFile);
        //	oReader.readAsDataURL(oFile);
        // canvas.loadImageFromURL(oFile.name, onImageLoad, args);
        console.log('file ==========' + filepath)
    }


    function loadImage(args) {
        //canvas.loadImageFromURL('images/conventional-html-layout.png' , onImageLoad);
        //  console.log('IMAGE PATH = ' + args.path);
        // canvas.loadImageFromURL(args.path, onImageLoad, args);
        var span = document.createElement('span');
        imageTag = args.path;
        span.innerHTML = imageTag;
        document.getElementById('icons-wrapper').insertBefore(span, null);
        //	 console.log("image width = "+$('#myimage').width()+ theFile.width);
        // var fabImage = new fabric.Image("myimage", {left:500, top:200, width:$('#myimage').width(), height:$('#myimage').height()});
    }

    function onImageLoad(obj, args) {
        obj.name = args.name;
        obj.uid = args.uid;
        obj.left = args.left;
        obj.top = args.top;
        obj.pallette = args.pallette;
        canvas.add(obj);
        obj.setCoords();
        matisse.sendDrawMsg({
            action: 'importimage',
            pallette: args.pallette,

            args: [{
                uid: obj.uid,
                left: obj.left,
                top: obj.top,
                width: obj.width,
                height: obj.height,
                name: obj.name,
                path: args.path
            }]
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

/* Get all objects from canvas and check if borders of any of them matches with active object borders
	
	*/
    function checkAlign(obj) {
        hLine.set('top', -10);
        vLine.set('left', -10);
        var movingObjLeft = Math.round(obj.left - (obj.width * obj.scaleX) / 2);
        var movingObjTop = Math.round(obj.top - (obj.height * obj.scaleY) / 2);
        var movingObjRight = Math.round(obj.left + (obj.width * obj.scaleX) / 2);
        var movingObjBottom = Math.round(obj.top + (obj.height * obj.scaleY) / 2);
        var canvasObjects = canvas.getObjects();
        for (var i = 0; i < canvasObjects.length; i++) {
            var otherObjLeft = Math.round(canvasObjects[i].left - (canvasObjects[i].width * canvasObjects[i].scaleX) / 2);
            var otherObjTop = Math.round(canvasObjects[i].top - (canvasObjects[i].height * canvasObjects[i].scaleY) / 2);
            var otherObjRight = Math.round(canvasObjects[i].left + (canvasObjects[i].width * canvasObjects[i].scaleX) / 2);
            var otherObjBottom = Math.round(canvasObjects[i].top + (canvasObjects[i].height * canvasObjects[i].scaleY) / 2);
            if (canvasObjects[i] != obj && canvasObjects[i].name != 'vline' && canvasObjects[i].name != 'hline') { /* this LEFT matches with Other LEFT */
                if (otherObjLeft - 1 === movingObjLeft || otherObjLeft + 1 === movingObjLeft) {
                    showAlginLine(obj, "left", "minus");
                } /* this RIGHT matches with Other RIGHT */
                if (otherObjRight - 1 === movingObjRight || otherObjRight + 1 === movingObjRight) {
                    showAlginLine(obj, "left", "plus");
                } /* this TOP matches with Other TOP */
                if (otherObjTop - 1 === movingObjTop || otherObjTop + 1 === movingObjTop) {
                    showAlginLine(obj, "top", "minus");
                } /* this BOTTOM matches with Other BOTTOM */
                if (otherObjBottom - 1 === movingObjBottom || otherObjBottom + 1 === movingObjBottom) {
                    showAlginLine(obj, "top", "plus");
                } /* this LEFT matches with Other RIGHT */
                if (otherObjRight - 1 === movingObjLeft || otherObjRight - 1 === movingObjLeft) {
                    showAlginLine(obj, "left", "minus");
                } /* this RIGHT matches with Other LEFT */
                if (otherObjLeft - 1 === movingObjRight || otherObjLeft + 1 === movingObjRight) {
                    showAlginLine(obj, "left", "plus");
                } /* this TOP matches with Other BOTTOM */
                if (otherObjBottom - 1 === movingObjTop || otherObjBottom + 1 === movingObjTop) {
                    showAlginLine(obj, "top", "minus");
                } /* this BOTTOM matches with Other TOP */
                if (otherObjTop - 1 === movingObjBottom || otherObjTop + 1 === movingObjBottom) {
                    showAlginLine(obj, "top", "plus");
                }
            }
        }
        return null;
    }

    function showAlginLine(obj, position, operator) {
        switch (position) {
        case "left":
            (operator == "plus") ? vLine.set('left', obj.left + (obj.width * obj.scaleX) / 2) : vLine.set('left', obj.left - (obj.width * obj.scaleX) / 2)
            break;
        case "top":
            (operator == "plus") ? hLine.set('top', obj.top + (obj.height * obj.scaleY) / 2) : hLine.set('top', obj.top - (obj.height * obj.scaleY) / 2);
            break;
        }
        canvas.renderAll();
        hLine.setCoords()
    }
})(jQuery);