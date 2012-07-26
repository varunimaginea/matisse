// global shell with references to most of the models we need
iShell = {};
/**
 * Module for db interactions
 */
(function() {
    var Nohm = require('nohm').Nohm;
    var BoardModel = require(__dirname + '/models/BoardModel.js');
    var ShapesModel = require(__dirname + '/models/ShapesModel.js');
    var UserModel = require(__dirname + '/models/UserModel.js');
    var redis = require("redis");
    var redisClient = redis.createClient(); //go thru redis readme for anyother config other than default: localhost 6379
    redisClient.select(4);
    Nohm.setPrefix('matisse'); //setting up app prefix for redis
    Nohm.setClient(redisClient);

    iShell['bm'] = BoardModel, iShell['sm'] = ShapesModel, iShell['um'] = UserModel;
    Nohm.logError = function (err) {
        if (err) {
            console.log("===============Nohm Error=======================");
            console.log(err);
            console.log("======================================");
        }
    };

    function CommandRunner() {
    }

    (function(){
        var self = this;
        var knownCommands = {};
        this.process = function(rawChunk) {
            var chunk = rawChunk.toString(), chunks, argV;
            //lets trim off the last '\n'
            chunk = chunk.substring(0, chunk.length - 1 );
            chunks = chunk.toString().split(":");
            argV = chunk.substring(chunks[0].length + 1);
            processCommand(chunks[0], argV, chunk);
        };
        function processCommand(cmd, arg, chunk) {
            var command = knownCommands[cmd];
            if (command && command != null ) {
                command.call(this, arg);
            } else {
                console.log("Can not find any command for "+ chunk);
            }
        };
        this.initialize = function() {
            knownCommands['getShapes'] =  getShapes;
            knownCommands['getBoard'] =  getBoard;
            knownCommands['getUsers'] =  getUsers;
            knownCommands['eval'] = evalArgs;
            knownCommands['help'] = getHelp;
            getHelp();
        };

        function showAll(model, criteria) {
            model.find(criteria, 
                       function(err, ids) {                           
                           console.log('Found: ' + ids.length);
                           ids.forEach(function(id) {
                                           model.load(id, function(err, props) {
                                                          console.log(props);
                                                      });
                                       });
                       });
        }

        function getShapes(boardUrl) {
            showAll(ShapesModel, {board_url: "boards/" + boardUrl});
        }

        function getBoard(boardUrl) {
            showAll(BoardModel, {url: boardUrl});
        }

        function getUsers() {
            showAll(UserModel);
        }

        function getHelp() {
            console.log('known commands are')
            console.log(knownCommands);
            console.log('type command:arg and hit enter for example to get the board use getBoard:hqgwkirg');
        }

        function evalArgs(argV) {
            eval(argV);
        }

    }).call(CommandRunner.prototype);

    var stdin = process.openStdin();
    var cmdRunner = new CommandRunner();
    cmdRunner.initialize();

    stdin.on('data', function(chunk) { 
        cmdRunner.process(chunk);
    });

}).call(this);