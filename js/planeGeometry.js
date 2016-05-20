CAPS.PlaneGeometry = function ( v0, v1, v2, v3 ) {

	THREE.Geometry.call( this );

	this.vertices.push( v0, v1, v2, v3 );
	this.faces.push( new THREE.Face3( 0, 1, 2 ) );
	this.faces.push( new THREE.Face3( 0, 2, 3 ) );

	this.computeFaceNormals();
	this.computeVertexNormals();

};

CAPS.PlaneGeometry.prototype = new THREE.Geometry();
CAPS.PlaneGeometry.prototype.constructor = CAPS.PlaneGeometry;

