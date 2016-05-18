CAPS.Selection = function ( low, high ) {

	this.limitLow = low;
	this.limitHigh = high;

	this.box = new THREE.BoxGeometry( 1, 1, 1 );
	this.boxMesh = new THREE.Mesh( this.box, CAPS.MATERIAL.cap );

	this.setBox();
	this.setUniforms();

};

CAPS.Selection.prototype = {

	constructor: CAPS.Selection,

	setBox: function () {

		var width = new THREE.Vector3();
		width.subVectors( this.limitHigh, this.limitLow );

		this.boxMesh.scale.copy( width );
		width.multiplyScalar( 0.5 ).add( this.limitLow );
		this.boxMesh.position.copy( width );

	},

	setUniforms: function () {

		var uniforms = CAPS.UNIFORMS.clipping;
		uniforms.clippingLow.value.copy(  this.limitLow );
		uniforms.clippingHigh.value.copy( this.limitHigh );

	}

};

