/*matisse.events*/
define(["matisse", "matisse.com" ], function(matisse, com) {
return {
	/**
	 * Listen for keyboard events and do necessary action
	 * @method keyDown 
	 * @param e keyevent
	 */
	keyDown: function (e) {
		var evt = (e) ? e : (window.event) ? window.event : null;
		if (evt) {
			var key = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
			if (key == "46" && evt.altKey) {
				matisse.main.deleteObjects();
			} else if (key == "38" && evt.ctrlKey) {
				var obj = canvas.getActiveObject();
				if (obj) canvas.bringForward(obj);
			} else if (key == "40" && evt.ctrlKey) {
				var obj = canvas.getActiveObject();
				if (obj) canvas.sendBackwards(obj);
			}
		}
	}
	
	
	
}
});