$( document ).one( "pageshow", ":jqmData(role='page')", function ( ev ) {
	var page = ev.target;

	$( "#" + page.id + "-search" ).on( "input change", function ( ev ) {
		var regEx,
			sbar = ev.target,
			content = $( page ).children(":jqmData(role='content')")[0];

		regEx = new RegExp(".*" + $( sbar ).val().toLowerCase());

		$( content ).find( "p" ).each( function () {
			if ( $( this ).text().toLowerCase().match(regEx) ) {
				$( this ).show();
			} else {
				$( this ).hide();
			}
		});

		$( content ).scrollview( "scrollTo", 0, 0, 0 );
	});

	$( ".ui-btn-search-front-icon" ).on( "vclick", function () {
		window.alert( "front button in searchbar pressed!" );
	});
});


