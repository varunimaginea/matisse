/**
 * Helps in viewing the active boards and users.  Stats.js page
   connects to 'godio' socket to get the active boards and users.
 */

module.exports = {
    enable : function(io, redis) {

        var activeBoards = [];

        function findBoard(name) { 
            for(var i = 0; i < activeBoards.length; i++) { 
                if(activeBoards[i].name == name) {
                    return activeBoards[i]; 
                }
            }
            var board = {name: name, users: []};
            activeBoards.push(board);
            return board;
        }
        
        function addUser(board, user) {
            if(board.users.indexOf(user) < 0) {
                board.users.push(user);                
            }
        }

        function removeUser(board, user) {
            board.users.splice(board.users.indexOf(user), 1);
            if(board.users.length == 0) {
                activeBoards.splice(activeBoards.indexOf(board), 1);
            }
        }

        function onHello(name) {
            this.get('board', function(err, board) {
                         addUser(findBoard(board), name);
                         boardcastActiveBoards();
                     });
        }
        
        function onBye() {
            var s = this;
            s.get('name', function(err, u) {
                      s.get('board', function(err, b) {
                                removeUser(findBoard(b), u);
                                boardcastActiveBoards();
                            });
                  });
        }

        io.sockets.on('connection', 
                      function (sock) {
                          sock.on('hello', onHello);
                          sock.on('disconnect', onBye);
                      });

        var godio = io.of('/god')
            .on('connection', 
                function (sock) {
                    sock.emit('active-boards', activeBoards);
                });

        function boardcastActiveBoards() {
            godio.emit('active-boards', activeBoards);
        }

        letGodsBeInvisible(redis);
    }
};

/**
 * God users, when joining a board, should not disturb other users.
 * No 'hello's... don't emit that event.
 */
function letGodsBeInvisible (redis) {

    var collaboration = require('./collaboration');

    collaboration.events.hello =
        (function (originalHello) {
             return function(name) {
                 var sock = this;
                 redis.sismember('matisse:gods', name,
                                 function (err, i) {
                                     if(i == 0) { // not god
                                         originalHello.call(sock, name);
                                     }
                                 });
             };
         })(collaboration.events.hello);
}
