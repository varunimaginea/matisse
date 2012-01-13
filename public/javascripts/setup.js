/**
 * User: Bahvani Shankar,Pradeep
 * Date: 12/26/11
 * Time: 11:16 AM
 * About this :Entry Point File, All Dom Ready functions need to be defined here
 */



define("App.Setup",["javascripts/app",
    "shapes","shapes.svg","shapes.basicshapes",
    "shapes.wireframe","main"],function(){
    //Dom Ready function
    jQuery(function(){
        //call all the functions, that are to be called on document ready here
        App.Main.init();

    });
    }
);

