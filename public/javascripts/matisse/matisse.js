/**
 * User: Bahvani Shankar,Pradeep
 * Date: 12/26/11
 * Time: 11:16 AM
 * About matisse : matisse is the Main Name space
 */

    //Defining the global name space
    window.matisse = { };// global Object cointainer
		//Properties of the global name space
		matisse.fillColor = "#AAAAAA";
		matisse.points = {};
		matisse.palette = {};
		matisse.textEl;
		matisse.drawShape = false;
		matisse.action;
		matisse.shapeArgs;
		matisse.currTool;
		matisse.xPoints = [],
		matisse.yPoints = [];
		matisse.xOffset;
		matisse.yOffset;
		matisse.paletteName;
		matisse.associateText = {};
		matisse.focusInput = "stroke";
		//Defining shapes name space
		matisse.palettes = {};
		matisse.Properties = {};
		matisse.$currActiveIcon;
		matisse.main = {};
