/**
 * User: Bhavani Shankar
 * Date: 12/26/11
 * Time: 11:16 AM
 * About this : Utility to Create all the shapes,Based on the type specified
 *
 */
 
 define(["matisse", "matisse.main", "matisse.ui", "matisse.util"], function(matisse, main, ui, util) {
		
    return {
	registerpalette : function(paletteName, paletteDesc) {
         matisse.palette[paletteName] = paletteDesc;
    },

	
	 /**
     * Loop through all palettes and call createPallette for each palette found
     * @method createAllPallettes
     * @param paletteObj
     */
		createAllPallettes : function(paletteObj) {
			for (var paletteName in paletteObj) {
				this.createPallette(paletteName);
			}
			$('.tool').click(this.handleToolClick);
    },
	/**
     * Create a  palette for each type of palette and add it in toolbar
     * @method createPallette
     * @param paletteName
     */
     createPallette: function(paletteName) {
		var palette_DisplayName = matisse.palette[paletteName].collectionName;
        ui.updateAccordian(palette_DisplayName);
        var shapesObj = matisse.palette[paletteName];
        var html = '<div class="scroller scroller-up"></div>';
        html += '<div class="shapesHolder">';
        html += '<div class="scrollerContentHolder">';
        for (var i in shapesObj.shapes) {
            var shape = shapesObj.shapes[i]
            var shape_DisplayName = shape.displayName;
            var src = '/images/' + shape.inactiveIcon;
            var activesrc = '/images/' + shape.activeIcon;
            var shapeHolder = '<div class="shape-holder" id="shape-holder-' + shape_DisplayName + '">';
            shapeHolder += '<div id="shape"><img class="tool" id="' + shape_DisplayName + '" src="' + src + '" data-active="' + activesrc + '" data-inactive="' + src + '" data-parent="' + palette_DisplayName + '" width="64" height="64" /></div><div id="shape-label">' + shape_DisplayName + '</div></div>';
            html += shapeHolder;
        }
        html += '</div></div>';
        html += '<div class="scroller scroller-down"></div>';
        $(document.getElementById(palette_DisplayName)).append(html);
		
    }
	,
		
	/**
	 *  Handles the palette tools icon click events
	 *  @method  handleToolClick
	 *  @param e object
	 */
	handleToolClick: function (e) {
		ui.resetIconSelection();
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
	}
	}

    
	
});


