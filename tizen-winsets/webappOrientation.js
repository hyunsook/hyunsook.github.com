function onSuccessCallback ( ori ) {
	console.log( ori.status );
	if ( ori.status === "PORTRAIT_PRIMARY" ) {
		window.screen.lockOrientation( "portrait-primary" );
	}
	else if ( ori.status === "PORTRAIT_SECONDARY" ) {
		window.screen.lockOrientation( "portrait-secondary" );
	}
	else if ( ori.status === "LANDSCAPE_PRIMARY" ) {
		window.screen.lockOrientation( "landscape-primary" );
	}
	else if ( ori.status === "LANDSCAPE_SECONDARY" ) {
		window.screen.lockOrientation( "landscape-secondary" );
	}
}
function onErrorCallback ( error ) {
	console.log( "An error occurred " + error.message );
}

try {
	if ( $.tizen.__tizen__.util.isMobileBrowser() ) {
		/**
		 * Temporary rotation is blocked as TIZEN API is missing a flag,
		 * which can help to check if the orientation is locked or unlocked
		 * 
		 * JIRA https://tizendev.org/bugs/browse/N_SE-39394
		 */
		//tizen.systeminfo.addPropertyValueChangeListener( "DEVICE_ORIENTATION", onSuccessCallback, onErrorCallback );
	}
} catch ( exc ) {
	alert( exc.message );
}

