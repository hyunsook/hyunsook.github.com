$("#genlist_extendable_page").one("pagecreate", function ( el ) {
	/*?_=ts code for no cache mechanism*/
	$.getScript( "./virtuallist-db-demo.js", function ( data, textStatus ) {
		$("ul.ui-extendable-list-container").extendablelist("create", {
			itemData: function ( idx ) {
				return JSON_DATA[ idx ];
			},
			numItemData: JSON_DATA.length
		});
	});
});