
$('#whiteBoardForm').modal();

$('#createWhiteboard').on('click', function(e){
    // We don't want this to act as a link so cancel the link action
    e.preventDefault();
    
    // Find form and submit it
    $('#whiteboard').submit();
  });
