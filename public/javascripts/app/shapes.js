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
        rectangle:App.Templates.Rectangle,
        circle:App.Templates.Circle,
        // end of circle
        text: App.Templates.Text,
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
        pathgroup1:App.Templates.Anchor,
        pathgroup2:App.Templates.Thumb,
		button:App.Templates.Button

    } //end of shapes
} // end of svg
);


/***********************************
// WIREFRAME TOOLS
************************************/
App.Shapes.registerpalette("wireframe", {
    collectionName: 'wireframe',
    shapes: {	
	    label:App.Templates.Label,
	    txt_button:App.Templates.TxtButton,
	    textbox:App.Templates.TextBox,
	    checkbox:App.Templates.CheckBox,
	    radio:App.Templates.Radio
	} // end of shapes
} // end of wireframe
);