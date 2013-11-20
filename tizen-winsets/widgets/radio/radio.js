$( document ).one( "pagecreate", "#radio-demo", function () {
	$(".choosepet input[type='radio']").on( "change", function (event, ui) {
		if ( this.checked ) {
			$( ".triggered-radio" ).text( this.id + " is selected..." );
		}
	});

});


