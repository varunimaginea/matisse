/**
 * User: Bahvani Shankar,Pradeep
 * Date: 12/26/11
 * Time: 11:16 AM
 * About this : This is the Main Name space
 */

    //Defining the global name space
    window.App = {}; // global Object cointainer
    //Properties of the global name space
    App.fillColor = "#AAAAAA";
    App.points = {};
    App.pallette = {};
    App.textEl;
    App.drawShape = false;
    App.action;
    App.shapeArgs;
    App.currTool;
    App.xPoints = [],
    App.yPoints = [];
    App.xOffset
    App.yOffset;
    App.palletteName;
    App.associateText = {};
    App.focusInput = "stroke";

	//Defining shapes name space
	App.Shapes = {};
