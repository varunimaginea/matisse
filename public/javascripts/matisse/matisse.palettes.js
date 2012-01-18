/**
 * User: Bhavani Shankar
 * Date: 12/26/11
 * Time: 11:16 AM
 * About this : Utility to Create all the shapes,Based on the type specified
 *
 */
 
 define(["matisse", "matisse.main", "matisse.ui"], function(matisse, main, ui) {
		
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
			$('.tool').click(matisse.main.handleToolClick);
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
	}

    
	
});


