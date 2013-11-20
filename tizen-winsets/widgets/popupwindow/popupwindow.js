$( document ).one( "pageinit", "#popupwindow-demo", function () {
	$("#btn_textbox_popup_cancel").on("vclick", function ( ev ) {
		$("#textbox_popup").find("input").val("");
		$("#textbox_popup").popup("close");
		return false;
	});
	
	$('#textbox_popup a').click(function(){
		$('#textbox_popup input').val('');
	});

	if ( $.tizen.__tizen__.util.isMobileBrowser() ) {
		var direction = window.screen.orientation;
		if ( direction === "landscape-primary" || direction === "landscape-secondary" ) {
			$( "#go_textbox_popup a" ).attr( "href", "#textbox_popup_landscape" );
		}
	}
	//JIRA fix - N_SE-48393
	$("#textbox_popup").bind('popupafterclose', function ( e ) {
		$("#textbox_popup").find("input").val("");
	});
});

function onSuccessPopupCallback ( ori ) {

	if ( ori.status === "PORTRAIT_PRIMARY" || ori.status === "PORTRAIT_SECONDARY" ) {
		if( $( "#textbox_popup_landscape" ).parents( ".ui-popup-container" ).is( ".ui-popup-active" ) ) {
			$( "#textbox_popup_landscape" ).popup( "close" );
		}
		$( "#go_textbox_popup a" ).attr( "href", "#textbox_popup" );
	} else if ( ori.status === "LANDSCAPE_PRIMARY" || ori.status === "LANDSCAPE_SECONDARY" ) {
		if( $( "#textbox_popup" ).parents( ".ui-popup-container" ).is( ".ui-popup-active" ) ) {
			$( "#textbox_popup" ).popup( "close" );
		}
		$( "#go_textbox_popup a" ).attr( "href", "#textbox_popup_landscape" );
	}
}

function onErrorPopupCallback ( error ) {
	console.error( "An error occurred " + error.message );
}

if ( $.tizen.__tizen__.util.isMobileBrowser() ) {
	/**
	 * Temporary rotation is blocked as TIZEN API is missing a flag,
	 * which can help to check if the orientation is locked or unlocked
	 *
	 * JIRA https://tizendev.org/bugs/browse/N_SE-39394
	 */
	//tizen.systeminfo.addPropertyValueChangeListener( "DEVICE_ORIENTATION", onSuccessPopupCallback, onErrorPopupCallback );
}

