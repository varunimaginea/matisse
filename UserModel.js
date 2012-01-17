var nohm = require(__dirname+'/node_modules/nohm/lib/nohm.js').Nohm;

/**
 * Model definition of a Shapes
 */
var userModel = module.exports = nohm.model('User', {
    properties:{
        userId:{
            type:'string',
            index:true,
            unique:true,
            validations:[
                'notEmpty'
            ]
        }
    }
});
