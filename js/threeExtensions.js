// sets this vector to the coordinates of a mouse event, uses touch event if applicable
THREE.Vector2.prototype.setFromEvent = function ( event ) {

	this.x = ( event.clientX !== undefined ) ? event.clientX : ( event.touches && event.touches[ 0 ].clientX );
	this.y = ( event.clientY !== undefined ) ? event.clientY : ( event.touches && event.touches[ 0 ].clientY );
	return this;

};

// calculate mouse position in normalized device coordinates
THREE.Vector2.prototype.setToNormalizedDeviceCoordinates = function ( event, window ) {

	this.setFromEvent( event );
	this.x = ( this.x / window.innerWidth ) * 2 - 1;
	this.y = - ( this.y / window.innerHeight ) * 2 + 1;
	return this;

};

