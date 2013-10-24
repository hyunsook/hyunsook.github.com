/* Gen list : Dummy DB load */
$("div.virtuallist_demo_page").one("pagecreate", function () {
	/* ?_=ts code for no cache mechanism */
	$.getScript( "virtuallist-db-demo.js", function ( data, textStatus ) {
		$("ul.ui-virtual-list-container").virtuallistview("create", {
			itemData: function ( idx ) {
				return JSON_DATA[ idx ];
			},
			numItemData: JSON_DATA.length
		});
	});
});