$( document ).one("pagecreate", "#genlist-dialog-edit", function () {
	$(this).on("vclick", ".ui-li-dialogue-edit .ui-btn", function ( e ) {
		$(this).siblings("input").val("");
	});
});
