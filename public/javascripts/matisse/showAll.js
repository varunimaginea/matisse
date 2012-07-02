$('#showOwned').on('click', function(e){
    // We don't want this to act as a link so cancel the link action
    e.preventDefault();

    if($(this).text() == "Show all") {
	// Show all boards
	$('.ownedBoardHide').show();
	$(this).html("Hide all");
    }
    else {
	// Hide all boards
	$('.ownedBoardHide').hide();
	$(this).html("Show all");
    }
  });
$('#showShared').on('click', function(e){
    // We don't want this to act as a link so cancel the link action
    e.preventDefault();

    if($(this).text() == "Show all") {
	// Show all boards
	$('.sharedBoardHide').show();
	$(this).html("Hide all");
    }
    else {
	// Hide all boards
	$('.sharedBoardHide').hide();
	$(this).html("Show all");
    }
  });
//display "show all" links only when there are more than three white boards
$('div.whiteboardList').each(function() {
	if($(this).find('li').length > 3) 
		$(this).parents('div.row').next('div.row').find('div#showAllCreateWhiteBoard').show();
});
