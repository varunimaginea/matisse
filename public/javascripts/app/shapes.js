/**
 * User: Bahvani Shankar
 * Date: 12/26/11
 * Time: 11:16 AM
 * About this : Utility to Create all the shapes,Based on the type specified
 *
 */


    App.Shapes = {};

    /**
     * @param paletteName  -- shape that needs to be generated
     * @param paletteDesc  -- model describing the shapes
     */
    App.Shapes.registerpalette = function(paletteName, paletteDesc) {
         App.palette[paletteName] = paletteDesc;
    }


/***********************************
// BASIC SHAPES
************************************/
 App.Shapes.registerpalette("basic_shapes", {
    collectionName: 'basic shapes',
    shapes: {
        rectangle:App.Data.Rectangle,
        circle:App.Data.Circle,
        // end of circle
        text: App.Data.Text,
        // end of text
        path: {
            displayName: "path",
            displayIcon: "brush.png",
            displayIcon2: "brush.png",
            toolAction: null
			
        } // end of path

    } // end of shapes
} // end of basic shapes
);

/***********************************
// SVG IMAGES
************************************/

App.Shapes.registerpalette("svg", {
    collectionName: 'svg',
    shapes: {
        pathgroup1:App.Data.Anchor,
        pathgroup2:App.Data.Thumb,
		button:App.Data.Button

    } //end of shapes
} // end of svg
);


/***********************************
// WIREFRAME TOOLS
************************************/
App.Shapes.registerpalette("wireframe", {
    collectionName: 'wireframe',
    shapes: {	
	    label:App.Data.Label,
	    txt_button:App.Data.TxtButton,
	    textbox:App.Data.TextBox,
	    checkbox:App.Data.CheckBox,
	    radio:App.Data.Radio
	} // end of shapes
} // end of wireframe
);