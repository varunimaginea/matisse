/**
 * Author: Divya
 * Date: 02/27/12
 * Time: 12:40 PM
 * About this : Utility to register layouts based on the layout name and layout data provided.
 *
 */
define(["matisse", "matisse.main", "matisse.ui", "matisse.util"], function (matisse, main, ui, util) {
    
	return {
		registerLayout : function (layoutName, layoutDesc) {			
			matisse.layout[layoutName] = layoutDesc;
		},
		
		createLayoutsList: function () {
			var layoutName;
			var html = '<div id="layoutList" style="padding:15px"><p>Select a Layout</p>';
			var layoutContainer = "<select id='layouts' >"
			for (layoutName in matisse.layout) {				
				layoutContainer += '<optgroup label='+layoutName+ '>';
				for (var layoutType in matisse.layout[layoutName].layouts)
				{					
					layoutContainer += '<option value='+layoutType+ ' id='+layoutType+'>'+layoutType;
				}				
				html += layoutContainer;				
			}
			$(document.getElementById('result')).append(html);			
		},
		
		setLayoutType: function (type) {
			console.log(arguments.callee.caller.toString());
			var opt = document.getElementById(type);
			var group = opt.parentElement.label;				
			var obj = matisse.layout[group].layouts[type].toolAction();			
			matisse.comm.sendDrawMsg({			
				action: type,
				palette: "content",
				args: [{
					uid: obj.uid,
					object: obj						
				}]
			});
		}
	}
});