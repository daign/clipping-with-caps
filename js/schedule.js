CAPS.SCHEDULE = {

	postpone: function ( callback, context, wait ) {

		return function () {
			setTimeout( function () {
				callback.apply( context, arguments );
			}, wait );
		};

	},

	deferringThrottle: function ( callback, context, wait ) { // wait 60 = 16fps // wait 40 = 25fps // wait 20 = 50fps

		var execute = function ( arguments ) {
			callback.apply( context, arguments );
			setTimeout( function () {
				if ( deferredCalls ) {
					deferredCalls = false;
					execute( args );
				} else {
					blocked = false;
				}
			}, wait );
		};

		var blocked = false;
		var deferredCalls = false;
		var args = undefined;

		return function () {
			if ( blocked ) {
				args = arguments;
				deferredCalls = true;
				return;
			} else {
				blocked = true;
				deferredCalls = false;
				execute( arguments );
			}
		};

	}

};

