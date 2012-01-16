/**
 * User: Bahvani Shankar
 * Date: 12/26/11
 * Time: 11:16 AM
 * About this : Utility to Create all the shapes,Based on the type specified
 *
 */
    matisse.pallettes.registerpallette = function(palletteName, palletteDesc) {
         matisse.pallette[palletteName] = palletteDesc;
    }

	  /**
     * Loop through all pallettes and call createPallette for each pallette found
     * @method createAllPallettes
     * @param palletteObj
     */
    matisse.pallettes.createAllPallettes = function(palletteObj) {
        for (var palletteName in palletteObj) {
            this.createPallette(palletteName);
        }
    }

    /**
     * Create a  pallette for each type of pallette and add it in toolbar
     * @method createPallette
     * @param palletteName
     */
    matisse.pallettes.createPallette = function(palletteName) {
        var pallette_DisplayName = matisse.pallette[palletteName].collectionName;
        matisse.ui.updateAccordian(pallette_DisplayName);
        var shapesObj = matisse.pallette[palletteName];
        var html = '<div class="scroller scroller-up"></div>';
        html += '<div class="shapesHolder">';
        html += '<div class="scrollerContentHolder">';
        for (var i in shapesObj.shapes) {
            var shape = shapesObj.shapes[i]
            var shape_DisplayName = shape.displayName;
            var src = '/images/' + shape.inactiveIcon;
            var activesrc = '/images/' + shape.activeIcon;
            var shapeHolder = '<div class="shape-holder" id="shape-holder-' + shape_DisplayName + '">';
            shapeHolder += '<div id="shape"><img class="tool" id="' + shape_DisplayName + '" src="' + src + '" data-active="' + activesrc + '" data-inactive="' + src + '" data-parent="' + pallette_DisplayName + '" width="64" height="64" /></div><div id="shape-label">' + shape_DisplayName + '</div></div>';
            html += shapeHolder;
        }
        html += '</div></div>';
        html += '<div class="scroller scroller-down"></div>';
        $(document.getElementById(pallette_DisplayName)).append(html);
        $('.tool').click(matisse.main.handleToolClick);
    }



