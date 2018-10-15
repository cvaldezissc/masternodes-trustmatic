var clicolor = require('cli-color');

module.exports= {

    successMessage : function(msg) {
        console.log(clicolor.green(msg));
    },

    errorMessage: function(msg) {
        console.log(clicolor.red(msg));
    },

    warningMessage: function(msg){
        console.log(clicolor.yellow(msg));
    },

    neutralMessage: function(msg){
        console.log(clicolor.white(msg));
    }

};