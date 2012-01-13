/**
 * User: Bahvani Shankar
 * Date: 12/26/11
 * Time: 11:16 AM
 * About this : Utility to Create all the shapes,Based on the type specified
 *
 */

define(["app"],function(App){
    return {
            registerpallette : function(palletteName, palletteDesc) {
            App.pallette[palletteName] = palletteDesc;
         }
    };
});



