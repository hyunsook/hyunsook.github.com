$(document).one( "pagecreate", "#ctxpopup-demo", function () {
	$( "#pop_js" ).on( "vclick", "#ctxpopup_update", function () {
		$( "#btn_js" ).text( "Peekaboo!" ).buttonMarkup( "refresh" );
	});

	$( "#btn_text_only3, #buttonPopup1, #buttonPopup2" ).on( "vclick", function () {
		$( "#pop_text_only" ).popup( "open" );
		return false;
	});
});
