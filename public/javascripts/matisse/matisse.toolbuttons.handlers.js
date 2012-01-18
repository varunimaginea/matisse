/*matisse.events*/
define(["matisse", "matisse.com"], function(matisse, com) {
return {
	/**
     * Handler for Save Button Click
     * @method saveButtonClickHandler
     * @param none
     */
    saveButtonClickHandler: function() {
        $('#saveicon').bind("click", function () {
            var data = canvas.toDataURL('png')
            //matisse.saveImage(data);
        });
    },

    /**
     * Handler for Import Image Button Click
     * @method importImageButtonClickHandler
     * @param none
     */
    importImageButtonClickHandler: function() {
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
    },

    /**
     * Handler for New Document Button Click
     * @method newButtonClickHanlder
     * @param none
     */
    newButtonClickHanlder: function() {	
        $('#newdocicon').bind("click", function () {
            var pageURL = document.location.href;
            // get the index of '/' from url (ex:http://localhost:8000/qd7kt3vd)
            var indx = pageURL.indexOf('/');
            pageURL = pageURL.substr(0, indx)
            window.open(pageURL + '/boards/', "mywindow");
        });
    },
	
	/**
     * Open Chat Window when user clicks on chat icon
     * @method openChatWindow
     * @param none
     *
     */
    openChatWindow: function() {
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
    },
	
	/**
     * Open a Properties panel for currently selected object
     * @method openPropertiesPanel
     * @param none
     */
    openPropertiesPanel: function() {	
        if (canvas.getActiveObject() == undefined) return;
        var dialog_width = $("#chatdialog").dialog("option", "width");
        var win_width = $(window).width();
        $('#propdiv').dialog({
            position: [win_width - dialog_width, 300]
        })
        $('#propdiv').dialog('open')
    },
	
	/**
     * Initializes the Chat Window, hide it initially
     * @method initChatWindow
     * @param none
     *
     */
    initChatWindow: function() {
        $('#chatdialog').dialog();
        $('#chatdialog').dialog('close');
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
     *  Sends the message typed by user to chat window and also notify it to Server
     *  @method  chatButtonListener
     *  @param e - event object
     */
    chatButtonListener: function(e) {
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
}
});