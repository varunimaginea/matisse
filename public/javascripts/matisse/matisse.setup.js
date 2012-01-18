/**
 * User: Bahvani Shankar,Pradeep
 * Date: 12/26/11
 * Time: 11:16 AM
 * About this :Entry Point File, All Dom Ready functions need to be defined here
 */


define( ["matisse",  "matisse.main", "matisse.fabric", "matisse.com",  "matisse.palettes", "matisse.palettes.basicshapes", "matisse.palettes.wireframe", "matisse.events"] , function (matisse, main, mfabric, com, palettes) {
    matisse.Setup = {};
	matisse.main = main;
    //Dom Ready function
    $(function(){
        //call all the functions, that are to be called on document ready here
		main.init();		
    });

})