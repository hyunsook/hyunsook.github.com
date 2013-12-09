( function( $, window, document, undefined ) {

$.widget( "mobile.listview", $.mobile.listview, {
		_isOpen: false,
		options: {
			swipe: false
		},

		_create: function() {
			if ( this.options.swipe ) {
				this._createSwipeItems();
			}
			this._super();
		},

		_cleanupDom: function() {
			var $view = this.element,
				cover,
				item,
				text,
				wrapper;

			$view.removeClass( "ui-swipe" );

			cover = $view.children().children( ":first-child" );
			item = $view.children().children( ":last-child" );

			cover.removeClass( "ui-swipe-item-cover ui-btn" );
			item.removeClass( "ui-swipe-item" );

			wrapper = cover.find( "ui-swipe-item-cover-inner" );
			wrapper.children().unwrap();
			text = wrapper.text();

			if ( text ) {
				cover.append( text );
				wrapper.remove();
			}

			if ( cover.data( "animateRight" ) && cover.data( "animateLeft" ) ) {
				cover.unbind( "swiperight", cover.data( "animateRight" ) );
				item.unbind( "swipeleft", cover.data( "animateLeft" ) );

				cover.data( "animateRight", null );
				cover.data( "animateLeft", null );
			}
		},

		_animateCover: function( cover, leftPercentage, item ) {
			var self = this,
				animationOptions = {
					easing: "linear",
					duration: "normal",
					queue: true,
					complete: function() {
						cover.trigger( "animationend" );
					}
				};

			this.element.find( ".ui-swipe-item-cover-opened" )
				.each(
					function() {
						if ( this !== self.element.get( 0 ) ) {
							var openedCover = $( this ),
								openedItems = openedCover.siblings();
							openedCover.removeClass( "ui-swipe-item-cover-opened" );
							self._animateCover( openedCover, 0, openedItems );
						}
					}
				);

			if ( leftPercentage === 110 ) {
				this._isOpen = true;
			} else {
				this._isOpen = false;
			}

			cover.stop();
			cover.clearQueue();
			cover.trigger( "animationstart" );
			cover.clearQueue().animate( { left: leftPercentage + "%" }, animationOptions );

			if ( leftPercentage === 0 ) {
				item.clearQueue().animate( { opacity: 0 }, "slow" );
			} else {
				item.clearQueue().animate( { opacity: 1 }, "slow" );
			}
		},

		_createSwipeItems: function() {
			this._cleanupDom();

			var self = this,
				$view  = this.element.children(),
				covers,
				item;

			$view.addClass( "ui-swipe" );

			covers = $view.children( ":first-child" );
			item = $view.children( ":last-child" );

			this._covers = covers;
			this._item = item;

			item.addClass( "ui-swipe-item" );

			item.find( ".ui-btn" ).addClass( "ui-mini ui-btn-inline" );

			covers.each( function() {
				var cover = $( this );

				cover.addClass( "ui-swipe-item-cover ui-btn" );

				if ( cover.has( ".ui-swipe-item-cover-inner" ).length === 0 ) {
					cover.wrapInner( $( "<span/>" ).addClass( "ui-swipe-item-cover-inner" ) );
				}

				if ( !( cover.data( "animateRight" ) && cover.data( "animateLeft" ) ) ) {
					cover.data( "animateRight", function() {
						self._animateCover( cover, 110, cover.parent().children( ":last-child" ) );
						cover.addClass( "ui-swipe-item-cover-opened" );
					});

					cover.data( "animateLeft", function() {
						self._animateCover( cover, 0, cover.parent().children( ":last-child" ) );
						cover.removeClass( "ui-swipe-item-cover-opened" );
					});
				}

				item.bind( "swipeleft", cover.data( "animateLeft" ) );
				cover.bind( "swiperight", cover.data( "animateRight" ) );
			});
		}
	});

} ( jQuery, window, document ) );

