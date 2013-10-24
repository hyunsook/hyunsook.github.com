$( "div.noti-demo" ).on("pagecreate", function () {
	$('#noti-demo').on('vmouseup', function ( e ) {
		$('#notification').notification('open');
	});

	$('#noti-icon1').on('vclick', function ( e ) {
		$('#notification').notification('icon', './test/icon02.png');
	});

	$('#noti-icon2').on('vclick', function ( e ) {
		$('#notification').notification('icon', './test/icon01.png');
	});

});