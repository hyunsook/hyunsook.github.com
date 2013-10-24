// Expand all textarea height automatically
$('#ButtonNolist').one( "pagecreate", function () {
	$( this ).on({
		'pageshow': function ( ) {
			$( document ).on( "tizenhwkey", function ( ev ) {
				if ( ev.originalEvent.keyName === "back" ) {
					//bind callbacks to the H/W keys
					window.history.back();
				}
			});
			//resize textareas
			var $textarea = $(this).find('textarea');
			$textarea.each( function ( idx, el ) {
				var h = Math.max( el.clientHeight, el.scrollHeight );
				$( el ).height( h );
			} );
		},
		"pagebeforehide": function() {
			//unbind callbacks to the H/W keys
			$( document ).off( "tizenhwkey" );
		}
	});
} );
