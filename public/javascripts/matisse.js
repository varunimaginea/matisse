/**
 * User: Bahvani Shankar,Pradeep
 * Date: 12/26/11
 * Time: 11:16 AM
 * About matisse. : matisse. is the Main Name space
 */

    //Defining the global name space
    window.matisse = { };// global Object cointainer
		//Properties of the global name space
		matisse.fillColor = "#AAAAAA";
		matisse.points = {};
		matisse.pallette = {};
		matisse.textEl;
		matisse.drawShape = false;
		matisse.action;
		matisse.shapeArgs;
		matisse.currTool;
		matisse.xPoints = [],
		matisse.yPoints = [];
		matisse.xOffset;
		matisse.yOffset;
		matisse.palletteName;
		matisse.associateText = {};
		matisse.focusInput = "stroke";
		//Defining shapes name space
		matisse.Shapes = {};
	
