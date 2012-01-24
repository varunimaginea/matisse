/*matisse.events*/
define(["matisse", "matisse.util"], function (matisse, util) {
    "use strict";
    return {
        /**
         * Handler for Save Button Click
         * @method saveButtonClickHandler
         * @param none
         */
        saveButtonClickHandler: function () {
            $('#saveicon').bind("click", function () {
                //Canvas2Image.saveAsPNG(canvas, false); /* alernative method */
                canvas.deactivateAll();
                var data = canvas.toDataURL('png', 0.1)
                popup('popUpDiv', 'closediv', 600, 600);
                $("#result").html('<img src=' + data + ' />');
            });
        },

        /**
         * Handler for Import Image Button Click
         * @method importImageButtonClickHandler
         * @param none
         */
        importImageButtonClickHandler: function () {
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
        newButtonClickHanlder: function () {
            $('#newdocicon').bind("click", function () {
                var pageURL = document.location.href;
                // get the index of '/' from url (ex:http://localhost:8000/qd7kt3vd)
                var indx = pageURL.indexOf('/');
                pageURL = pageURL.substr(0, indx);
                window.open(pageURL + '/boards/', "mywindow");
            });
        },

        /**
         * Open Chat Window when user clicks on chat icon
         * @method openChatWindow
         * @param none
         *
         */
        openChatWindow: function () {
            $('#chatdialog').dialog({
                width: 200
            });
            var dialog_width = $("#chatdialog").dialog("option", "width");
            var win_width = $(window).width();
            $('#chatdialog').dialog({
                position: [win_width - dialog_width, 100]
            });

            $('#chatdialog').dialog('open');
            $('#chatdialog').dialog({
                resizable: false
            });
        },

        /**
         * Open a Properties panel for currently selected object
         * @method openPropertiesPanel
         * @param none
         */
        openPropertiesPanel: function () {
            if (canvas.getActiveObject() === undefined) {
                return;
            }
            var dialog_width = $("#chatdialog").dialog("option", "width");
            var win_width = $(window).width();
            $('#propdiv').dialog({
                position: [win_width - dialog_width, 300]
            });
            $('#propdiv').dialog('open');
        },

        /**
         * Initializes the Chat Window, hide it initially
         * @method initChatWindow
         * @param none
         *
         */
        initChatWindow: function () {
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
        chatButtonListener: function (e) {
            var msg = $("#chat").val();
            msg = "from $:" + msg + "\n";
            var txt = document.createTextNode(msg);
            $("#chattext").append(txt);
            matisse.comm.sendDrawMsg({
                action: "chat",
                args: [{
                    text: msg
                }]
            });
        },
        helpButtonListener: function () {
            $('#helpicon').bind("click", showHelp);
        },
		/**
		* importImageButtonListener
		*
		*/
		importImageButtonListener: function() {
			$("#loadicon").click(function () {
			$("#inputfile").click(); //show().focus().click().hide();
			});
			$('#inputfile').change(this.fileSelected);
			$('#inputfile').bind("mouseup", function () {
				console.log('Click was triggered');
			});
		},

		fileSelected: function() {
			var oFile = document.getElementById('inputfile').files[0];
			var filepath = document.getElementById('inputfile').value;
			var oReader = new FileReader();
			// Closure to capture the file information.
			var thisRef = this;
			
			oReader.onload = (function (theFile) {
				return function (e) {
					//console.log("src====="+e.target.result);
					// Render thumbnail.
					var span = document.createElement('span');
					matisse.imageTag = ['<img id="myimage" class="thumb" src="', e.target.result, '" title="', theFile.name, '"/>'].join('');
					span.innerHTML = matisse.imageTag;
					document.getElementById('icons-wrapper').insertBefore(span, null);
					var args = {};
					args.left = 100;
					args.top = 300;
					args.path = matisse.imageTag;
					args.width = $('#myimage').width();
					args.height = $('#myimage').height();
					args.uid = util.uniqid();
					args.name = "importimage";
					args.palette = 'basic';
					args.self = true;
					$('#myimage').bind('onload', matisse.main.addImageToCanvas(args));
				};
			})(oFile);

			// Read in the image file as a data URL.
			oReader.readAsDataURL(oFile);
			console.log('file ==========' + filepath)
		}

		
	} // end of return;
 
});