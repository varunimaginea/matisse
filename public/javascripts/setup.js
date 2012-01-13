/**
 * User: Bahvani Shankar,Pradeep
 * Date: 12/26/11
 * Time: 11:16 AM
 * About this :Entry Point File, All Dom Ready functions need to be defined here
 */



define(["app",
    "app/shapes","app/main","app/shapes.svg","app/shapes.basicshapes",
    "app/shapes.wireframe"],function(App,Shapes,Main){
    console.log(arguments);
    //Dom Ready function
    $(function(){
        //call all the functions, that are to be called on document ready here
        Main.init();
    });
    }
);

