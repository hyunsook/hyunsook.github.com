$(document).on( "pageinit", "#main" , function () {
	if ( window.tizen && window.tizen.application ) {
		$( "#main .ui-btn-back" ).on( "vclick", function () {
			window.tizen.application.getCurrentApplication().exit();
			return false;
		});
	}
});

$(document).ready( function () {
	// add current datetime with browser language format
	// NOTE: Globalize.* functions must be run after docoument ready.
	$('#current_date').html(Globalize.culture().name + " -- " +
				Globalize.format( new Date(), "F" ));
	$('#html_font_size').html('html font size:' + $('html').css('font-size'));
});
