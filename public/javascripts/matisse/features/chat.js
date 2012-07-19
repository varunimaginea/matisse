/**
 * To handle sending/receiving and showing user chat
 */

define(["matisse", "matisse.comm"],
       function(matisse, commType) {
           
           function init(view) {
               commType.prototype.onDraw = 
                   (function (originalOnDraw) {
                        return function(data) {
                            if(data
                               && data.args 
                               && data.action == 'chat') {
                                view.showMessage(data.args[0].text);
                            } else {
                                originalOnDraw.call(matisse.comm, data);
                            }
                       };
                    })(commType.prototype.onDraw);

           }

           function view() {

               function showMessage(msg) {
                   $("#chattext").append('<li>' + msg + '</li>');
               }

               function sendMessage() {
                   var msg = matisse.userName +': ' + $("#chat").val();
                   showMessage(msg);
                   matisse.comm.sendDrawMsg(
                       {
                           action: "chat",
                           args: [{text: msg}]
                       });                   
               }

               $('#chatdialog').dialog();
               $('#chatdialog').dialog('close');
	       $('#chatbutton').click(sendMessage);

               return {
                   showMessage: showMessage
               };
           }

           return {
               init: function() { init(view()); }
           };
       });
