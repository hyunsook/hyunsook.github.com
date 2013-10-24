$( document ).one( "pagecreate", "#pageUpdateDemo", function () {
	$( "#hideheader" ).on( "vclick", function ( e ) {
		var $elPage = $( ".ui-page-active" );

		$elPage.find( ".ui-header" ).hide();
		$elPage.page( "refresh" );
	});

	$( "#showheader" ).on( "vclick", function ( e ) {
		var $elPage = $( ".ui-page-active" );

		$elPage.find( ".ui-header" ).show();
		$elPage.page( "refresh" );
	});

	$( "#hidefooter" ).on( "vclick", function ( e ) {
		var $elPage = $( ".ui-page-active" );

		$elPage.find( ".ui-footer" ).hide();
		$elPage.page( "refresh" );
	});

	$( "#showfooter" ).on( "vclick", function ( e ) {
		var $elPage = $( ".ui-page-active" );

		$elPage.find( ".ui-footer" ).show();
		$elPage.page( "refresh" );
	});
});
