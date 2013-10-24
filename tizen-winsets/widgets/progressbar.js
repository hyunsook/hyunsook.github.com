$(document).one( "pagecreate", "#progressbar-demo", function () {
	var progressbar_running;

	$("#progressbar-demo").on("pageshow", function ( e ) {

		$("#progressbarTest").on("vclick", function ( e ) {
			progressbar_running = !progressbar_running;

			// request animation frame
			window.requestAnimFrame = (function () {
				return window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					function (animloop) {
						return window.setTimeout(animloop, 1000 / 60);
					};
			}());

			window.cancelRequestAnimFrame = (function () {
				return window.cancelAnimationFrame ||
					window.webkitCancelRequestAnimationFrame ||
					window.mozCancelRequestAnimationFrame ||
					window.oCancelRequestAnimationFrame ||
					window.msCancelRequestAnimationFrame ||
					clearTimeout;
			}());

			var request,
				i = 0;

			// start and run the animloop
			(function animloop() {
				if ( !progressbar_running ) {
					window.cancelRequestAnimFrame( request );
					return;
				}

				$("#progressbar").progressbar( "option", "value", i++ );

				request = window.requestAnimFrame( animloop );

				if ( i > 100 ) {
					window.cancelRequestAnimFrame( request );
				}
			}());
		});

		$("#pending").progress( "running", true );
		$("#progressing").progress( "running", true );

		$("#pendingTest").on("vclick", function ( e ) {
			var running = $("#pending").progress( "running" );
			// start/stop progressing animation
			$("#pending").progress( "running", !running );
		});

		$("#progressingTest").on("vclick", function ( e ) {
			var running = $("#progressing").progress( "running" );
			// start/stop progressing animation
			$("#progressing").progress( "running", !running );

			if ( running ) {
				$("#progressing").progress( "hide" );
			}
		});
	});

	$("#progressbar-demo").on("pagehide", function ( e ) {
		progressbar_running = false;
		$("#pending").progress( "running", false );
		$("#progressing").progress( "running", false );
	});
});
