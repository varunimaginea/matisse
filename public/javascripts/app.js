/**
 * User: Bahvani Shankar,Pradeep
 * Date: 12/26/11
 * Time: 11:16 AM
 * About this : This is the Main Name space
 */

    //Defining the global name space
    define(function(){
        return {
            fillColor : "#AAAAAA",
            points : {},
            pallette : {},
            textEl : null,
            drawShape : false,
            action : null,
            shapeArgs : null,
            currTool : null,
            xPoints : [],
            yPoints : [],
            xOffset : null,
            yOffset : null,
            associateText : {},
            focusInput : "stroke",
            Shapes : {}
        };
    });
