/**
 * User: Divya, Bhavani Shankar
 * Date: 01/16/12
 * Time: 04:19 PM
 * About this : Utility to apply specified properties to the palette 
 */
define(["matisse", "matisse.util", "matisse.ui", "matisse.toolbuttons.handlers"], function (matisse, util, ui, toolHandlers) {
	return {
		_applyProperties: function (properties) {
			keyPressed_letterNumber = function (e) {
				return util.letternumber(e);
			};
			keyPressed_numbersOnly = function (e) {
				return util.numbersonly(this, e);
			};
			var props = {};
			$('#propdiv').append('<div id="prop"><table id="proptable"><tr><td bgcolor="#FFFFFF" border="1px" class= "cp" id="colorpicker"></td></tr></table></div>');
			jQuery.each(properties, function (i, val) {
				if (i === 'angle') {
					val = canvas.getActiveObject().getAngle();
				} else {
					val = canvas.getActiveObject()[i];
				}
				if (i === "fill" || i === "stroke") {
					var inputTag = "<input style='width:100px' onKeyPress = keyPressed_letterNumber()  class= 'color' id='" + i + "' value='" + val + "'></input></div>";
				} else {
					var inputTag = "<input type='text' style='width:100px' onKeyPress = keyPressed_numbersOnly() id='" + i + "' value='" + val + "'></input>";
				}
				var $propTableDiv = $("#proptable");
				$propTableDiv.append("<tr class='" + i + "tr'><td ><label style = 'text-align: right' for='" + i + "'>" + i + ": </label></td><td >" + inputTag + "</td></tr>");
				var inBox = $("#" + i);
				if(i === "width" || i === "height") {
					inBox.prop('disabled', true);
				}
				$(":input").focus(function () {
					matisse.focusInput = '';
					var id = this.id;
					if (id === 'fill' || id === 'stroke') {
						matisse.focusInput = id;
						var prop = $(this).position();
						$('#colorpicker').show();
						var ht = $propTableDiv.height();
						var cssObj = {'position': 'absolute', 'left': 5, 'top': prop.top + 20};
						$('#colorpicker').css(cssObj);
						$("#propdiv").dialog({ height: 530});
					}
				});

				$(":input").blur(function () {
					matisse.focusInput = '';
					var id = this.id;
					if (id === 'fill' || id === 'stroke') {
						$('#colorpicker').hide();
						$("#propdiv").dialog({ height: 'auto'});
					}
				});
				inBox.keyup(function () {
					if (!canvas.getActiveObject()) {
						return;
					}
					var actObj = canvas.getActiveObject();
					var val = $("#" + i).val();
					actObj.set(i, val);
					if (i === 'angle') {
						actObj.setAngle(val);
					}
					canvas.renderAll();
					canvas.getActiveObject().setCoords();
					matisse.comm.sendDrawMsg({
						action: "modified",
						args: [{
							uid: actObj.uid,
							object: actObj
						}]
					});
				});
			});
			var colorPicker = $.farbtastic("#colorpicker");
			colorPicker.linkTo(function (color) {
				if (matisse.focusInput === "") {
					return;
				}
				var obj = canvas.getActiveObject();
				obj.set(matisse.focusInput, color);
				$('#' + matisse.focusInput).val(color);
				$('#' + matisse.focusInput).css('background', color);
				matisse.comm.sendDrawMsg({
					action: "modified",
					args: [{
						uid: obj.uid,
						object: obj
					}]
				});
				canvas.renderAll();
			});
			$('#colorpicker').hide();
			toolHandlers.initPropWindow();
		},
		/**
		 *  Updates proeperties panel with current selected object properites
		 *  @method  updatePropertyPanel
		 *  @param obj - Object
		 *
		 */
		updatePropertyPanel: function (obj) {
			if (matisse.palette[matisse.paletteName] === null) {
				return;
			}
			if (canvas.getActiveGroup()) {
				return;
			}
			if (obj && obj.name && obj.palette) {
				var properties = util.getDefaultDataFromArray(matisse.palette[matisse.paletteName].shapes[obj.name].properties);
				jQuery.each(properties, function (i, value) {
					$('#' + i).val(obj[i]);
				});
				if (obj.getAngle()) {
					$('#angle').val(obj.getAngle());
				}
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
				var objName = obj.name;
				matisse.paletteName = obj.palette;
				if (matisse.palette[matisse.paletteName] === null) {
					return;
				}
				if (objName === undefined || objName === 'drawingpath') {
					return;
				}
				var _properties = util.getDefaultDataFromArray(matisse.palette[matisse.paletteName].shapes[objName].properties);
				if (_properties) {
					matisse.palette[matisse.paletteName].shapes[objName].applyProperties ? matisse.palette[matisse.paletteName].shapes[objName].applyProperties(_properties) : null;
				}
			}
		}
	};
});