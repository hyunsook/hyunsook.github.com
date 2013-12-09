var testIndexString = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
( function ($, window, document, undefined) {
	$.widget (  "mobile.listview", $.mobile.listview, {
		options: {
			fastscroll : null
		},
		_primaryLanguage: null,
		_secondLanguage: null,
		_dividerMap: {},
		_charSet: null,

		_create: function () {
			if ( this.options.fastscroll !== null && /true/i.test( this.options.fastscroll ) ) {
				this._createFastscroll();
			}
			this._super();
		},

		_createFastscroll : function () {
			// make fastscroll dom and event handler.
			var self = this,
				$el = self.element;

			self.$lastListItem = $el.children( "li" ).last();
			self.$shortcutsContainer = $( "<div class='ui-fastscroll' />" );
			self.$shortcutsList = $( "<ul aria-hidden='true'></ul>" );
			$el.append($( "<div class='ui-fastscroll-popup'></div>" ) );
			self.$popup = $el.find( ".ui-fastscroll-popup" );

			self.$shortcutsContainer.append( this.$shortcutsList );
			$el.prepend( this.$shortcutsContainer );

			this.indexString( testIndexString );

			self.jumpToDivider = function ( divider ) {
				// get the vertical position of the divider (so we can scroll to it)
				var dividerY = $( divider ).position().top,
					// find the bottom of the last list item
					bottomOffset = self.$lastListItem.outerHeight( true ) + self.$lastListItem.position().top,
					$fixedHeader = $el.parents( ".ui-page" ).find( ".ui-header[data-position=fixed]" ),
				// check that after the candidate scroll, the bottom of the
				// last item will still be at the bottom of the scroll view
				// and not some way up the page
					maxScroll = bottomOffset;

				dividerY = ( dividerY > maxScroll ? maxScroll : dividerY );
				if ( $fixedHeader.length !== 0 ) {
					dividerY -= $fixedHeader.outerHeight( true );
				}
				// don't apply a negative scroll, as this means the
				// divider should already be visible
				dividerY = Math.max( dividerY, 0 );
				window.scrollTo( 0, dividerY );
			};

			$( window ).bind( "pageshow resize", function ( event ) {
				self._updateFastscollLayout( event ) ;
			} );

			self.$shortcutsList.bind( "touchstart mousedown vmousedown touchmove vmousemove vmouseover", function ( e ) {
					// bind mouse over so it moves the scroller to the divider
					var $item = $( e.target ),
						height = $item.outerHeight( true ),
						index = 0,
						omitSet,
						unit;
					if ( $item.text() !== "." ) {
						self._hitItem ( $item );
					} else {
						omitSet = $item.data( "omitSet" );
						unit = height / omitSet.length;
						index = parseInt( e.offsetY / unit, 10 );
						index = index >=  omitSet.length ?  omitSet.length - 1 : index;
						self._hitOmitItem( $item, omitSet.charAt( index ) );
					}
					e.preventDefault();
					e.stopPropagation();
			} ).bind( "touchend mouseup vmouseup vmouseout", function ( e ) {
					// bind mouseout of the fastscroll container to remove popup
					self.$popup.hide();
					e.preventDefault();
					e.stopPropagation();
			});
		},

		_setOptions : function ( options ) {
			var $fastscroll;
			if ( options.fastscroll ) {
				$fastscroll = this.element.find( ".ui-fastscroll" );
				if ( "/true/i".test( options.fastscroll ) ) {
					if (  $fastscroll.length === 0 ) {
						this._createFastscroll();
					}
					this._updateFastscollLayout();
					this.$shortcutsContainer.show();
				} else if ( "/false/i".test( options.fastscroll )  &&  $fastscroll.length > 0 ) {
					this.$shortcutsContainer.hide();
					this.$popup.hide();
				}
			}
			return this._super( options );
		},

		_updateShortcutList : function ( ) {
			var self = this,
				shapItem = $( "<li tabindex='0' >#</li>" ),
				primaryCharacterSet = self._primaryLanguage ? self._primaryLanguage.replace( /,/g, "" ) : null,
				secondCharacterSet = self._secondLanguage ? self._secondLanguage.replace( /,/g, "" ) : null,
				contentHeight = self.$shortcutsContainer.height(),
				i = 0,
				omitIndex = 0,
				indexChar,
				shortcutItem,
				dividers,
				listItems,
				omitInfo,
				makeCharacterSet,
				minHeight,
				maxNumOfItems,
				numOfItems,
				size,
				shortcutsItems,
				seconds = [],
				makeOmitSet;

			makeCharacterSet = function ( index, divider ) {
				primaryCharacterSet += $( divider ).text();
			};

			makeOmitSet = function ( index, length ) {
				var count,
					omitSet = "";

				for ( count = 0; count < length; count++ ) {
					omitSet += primaryCharacterSet[ index + count ];
				}

				return omitSet;
			};

			minHeight = shapItem.outerHeight( true );
			maxNumOfItems = parseInt( contentHeight / minHeight - 1, 10 );
			numOfItems = primaryCharacterSet.length;
			maxNumOfItems = secondCharacterSet ? maxNumOfItems - 2 : maxNumOfItems;

			if ( maxNumOfItems < 3 ) {
				shapItem.remove();
				return;
			}

			// get all the dividers from the list and turn them into shortcuts
			dividers = self.element.find( ".ui-li-divider:visible" );
			if ( dividers.length < 2 ) {
				self.$shortcutsList.hide();
				return;
			}
			this._createDividerMap( dividers, primaryCharacterSet, secondCharacterSet );
			self.$shortcutsList.find( "li" ).remove();

			// get all the list items
			listItems = self.element.find( "li:visible" ).not( ".ui-li-divider" );

			self.$shortcutsList.show();
			self.$lastListItem = listItems.last();
			self.$shortcutsList.append( shapItem );

			if ( primaryCharacterSet === null ) {
				primaryCharacterSet = "";
				dividers.each( makeCharacterSet );
			}

			omitInfo = self._omit( numOfItems, maxNumOfItems );

			for ( i = 0; i < primaryCharacterSet.length; i++ ) {
				indexChar = primaryCharacterSet.charAt( i );
				shortcutItem = $( "<li tabindex='0'>" + indexChar + "</li>" );
				if ( typeof omitInfo !== "undefined" && omitInfo[ omitIndex ] > 1 ) {
					shortcutItem = $( "<li>.</li>" );
					shortcutItem.data( "omitSet",  makeOmitSet( i, omitInfo[ omitIndex ] ) );
					i += omitInfo[ omitIndex ] - 1;
				}

				self.$shortcutsList.append( shortcutItem );
				omitIndex++;
			}

			if ( secondCharacterSet !== null ) {
				seconds.push( secondCharacterSet.charAt( 0 ) );
				seconds.push( secondCharacterSet.charAt( secondCharacterSet.length - 1 ) );
				for ( i = 0; i < seconds.length; i++ ) {
					indexChar = seconds[ i ];
					shortcutItem = $( "<li tabindex='0' >" + indexChar + "</li>" );
					self.$shortcutsList.append( shortcutItem );
				}
			}

			shortcutsItems = self.$shortcutsList.children();
			size = ( parseInt( ( self.$shortcutsContainer.innerHeight( ) / shortcutsItems.length  ) * 10, 10 ) / 10 ) - 3;

			shortcutsItems.css( {
				height: size,
				lineHeight: size + "px"
			} );
		},

		// this function is must be called in pageshow & resize.
		_updateFastscollLayout : function ( ) {
			var $el = this.element,
				viewPortHeight = $( window ).innerHeight() > $el.parent().innerHeight() ? $el.parent().innerHeight() : $( window ).innerHeight(),
				$header, $footer,
				$popup = this.element.find( ".ui-fastscroll-popup" ),
				$container = $el.parent();

			if ( $container.has( ".ui-content" ) ) {
				// recalculate fastscollHeight;
				 $header = $container.siblings( ".ui-header" );
				 if ( $header.length > 0 ) {
					viewPortHeight -=  $header.outerHeight( true );
				 }
				 $footer = $container.siblings( ".ui-footer" );
				 if ( $footer.length > 0 ) {
					viewPortHeight -=  $footer.outerHeight( true );
				 }
			}
			this.$shortcutsContainer.css( "height", viewPortHeight +"px");
			this._updateShortcutList();
			$popup.text( "M" ) // Popup size is determined based on "M".
				.width( $popup.height() )
				.css( {	marginLeft: -( $popup.outerWidth() / 2 ),
						marginTop: -( $popup.outerHeight() / 2 ) } );
		},

		_findClosestDivider: function ( targetChar ) {
			var i,
				dividerMap = this._dividerMap,
				charSet = this._charSet,
				charSetLen = charSet.length,
				targetIdx = charSet.indexOf( targetChar ),
				lastDivider,
				subDivider = null;

			for ( i = 0; i < targetIdx; ++i ) {
				lastDivider = dividerMap[ charSet.charAt( i ) ];
				if ( lastDivider !== undefined ) {
					subDivider = lastDivider;
				}
			}
			if ( !subDivider ) {
				for ( ++i; i < charSetLen; ++i ) {
					lastDivider = dividerMap[ charSet.charAt( i ) ];
					if ( lastDivider !== undefined ) {
						subDivider = lastDivider;
						break;
					}
				}
			}
			return subDivider;
		},

		_hitOmitItem: function ( listItem, text ) {
			var $popup = this.element.find( ".ui-fastscroll-popup" ),
				divider;

			divider = this._dividerMap[ text ] || this._findClosestDivider( text );
			if ( typeof divider !== "undefined" ) {
				this.jumpToDivider( $( divider ) );
			}

			$popup.text( text ).show();
		},

		_hitItem: function ( listItem  ) {
			var $popup = this.element.find( ".ui-fastscroll-popup" ),
				text = listItem.text(),
				divider;

			if ( text === "#" ) {
				divider = this._dividerMap.number;
			} else {
				divider = this._dividerMap[ text ] || this._findClosestDivider( text );
			}

			if ( typeof divider !== "undefined" ) {
				this.jumpToDivider( $( divider ) );
			}
			$popup.text( text ).show();
		},

		_omit: function ( numOfItems, maxNumOfItems ) {
			var maxGroupNum = parseInt( ( maxNumOfItems - 1 ) / 2, 10 ),
				numOfExtraItems = numOfItems - maxNumOfItems,
				groupPos = [],
				omitInfo = [],
				groupPosLength,
				group,
				size,
				i;
			if ( ( maxNumOfItems < 3 ) || ( numOfItems <= maxNumOfItems ) ) {
				return;
			}

			if ( numOfExtraItems >= maxGroupNum ) {
				size = 2;
				group = 1;
				groupPosLength = maxGroupNum;
			} else {
				size = maxNumOfItems / ( numOfExtraItems + 1 );
				group = size;
				groupPosLength = numOfExtraItems;
			}

			for ( i = 0; i < groupPosLength; i++ ) {
				groupPos.push( parseInt( group, 10 ) );
				group += size;
			}

			for ( i = 0; i < maxNumOfItems; i++ ) {
				omitInfo.push( 1 );
			}

			for ( i = 0; i < numOfExtraItems; i++ ) {
				omitInfo[ groupPos[ i % maxGroupNum ] ]++;
			}

			return omitInfo;
		},

		_createDividerMap: function ( dividers, primaryCharacterSet, secondCharacterSet ) {
			var	numberSet = "0123456789",
				map = {},
				matchToDivider,
				indexChar,
				i;
			matchToDivider = function ( index, divider ) {
				if ( $( divider ).text() === indexChar ) {
					map[ indexChar ] = divider;
					return false;
				}
			};
			this._charSet = primaryCharacterSet + ( secondCharacterSet !== null ? secondCharacterSet : "" );
			for ( i = 0; i < this._charSet.length; i++ ) {
				indexChar = this._charSet.charAt( i );
				dividers.each( matchToDivider );
			}

			dividers.each( function ( index, divider ) {
				if ( numberSet.search( $( divider ).text() ) !== -1  ) {
					map.number = divider;
					return false;
				}
			});
			this._dividerMap = map;
		},

		indexString: function ( indexAlphabet ) {
			var self = this,
				characterSet = [];

			if ( typeof indexAlphabet === "undefined" ) {
				return self._primaryLanguage + ":" + self._secondLanguage;
			}
			characterSet = indexAlphabet.split( ":" );
			self._primaryLanguage = characterSet[ 0 ];
			if ( characterSet.length === 2 ) {
				self._secondLanguage = characterSet[ 1 ];
			}
		},

		refresh: function ( create ) {
			this._super( create );
			if ( this.options.fastscroll != null && /true/i.test( this.options.fastscroll ) ) {
				this._updateFastscollLayout();
			}
		}
	} );
} (jQuery, window, document) );