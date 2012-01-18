/**
 * User: Bahvani Shankar,Pradeep
 * Date: 12/26/11
 * Time: 11:16 AM
 * About matisse : matisse is the Main Namespace
 */
	//Defining the global name space
	define( function() {
    return {  
		fillColor : "#AAAAAA",
		points : {},
		palette: {},
		textEl: null,
		drawShape : false,
		action: null,
		shapeArgs: null,
		currTool: null,
		xPoints : [],
		yPoints : [],
		xOffset:null,
		yOffset:null,
		paletteName:null,
		associateText: {},
		focusInput : "stroke",
		palettes : {},
		Properties : {},
		$currActiveIcon : null,
		main:{},
		events:{}
		
	};
 })