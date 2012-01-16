/**
 * User: Divya
 * Date: 01/16/12
 * Time: 04:19 PM
 * About this : Utility to apply specified properties to the pallette 
 */
 matisse.Properties._applyProperties = function(properties) {        
	var props = {};
	$('#propdiv').append('<div id="prop"><table id="proptable"><tr><td bgcolor="#FFFFFF" border="1px" class= "cp" id="colorpicker"></td></tr></table></div>');
	jQuery.each(properties, function (i, val) {
		if (i == 'angle') {
			val = canvas.getActiveObject().getAngle();
		} else {
			val = canvas.getActiveObject()[i];
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
				var cssObj = {'position':'absolute', 'left':5, 'top': prop.top+20};
				$('#colorpicker').css(cssObj);
				$( "#propdiv").dialog({ height:530});
			}
		});
		
		$(":input").blur(function () {
			matisse.focusInput = '';
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
			matisse.sendDrawMsg({
				action: "modified",
				args: [{
					uid: actObj.uid,
					object: actObj
				}]
			});
		});
	});
	colorPicker = $.farbtastic("#colorpicker");
	colorPicker.linkTo(matisse.ui.pickerUpdate);
	$('#colorpicker').hide();
	matisse.main.initPropWindow();
}