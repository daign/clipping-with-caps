CAPS.SelectionBoxFace = function ( axis, v0, v1, v2, v3, selection ) {

	var frontFaceGeometry = new CAPS.PlaneGeometry( v0, v1, v2, v3 );
	frontFaceGeometry.dynamic = true;
	selection.meshGeometries.push( frontFaceGeometry );

	var frontFaceMesh = new THREE.Mesh( frontFaceGeometry, CAPS.MATERIAL.Invisible );
	frontFaceMesh.axis = axis;
	frontFaceMesh.guardian = this;
	selection.touchMeshes.add( frontFaceMesh );
	selection.selectables.push( frontFaceMesh );

	var backFaceGeometry = new CAPS.PlaneGeometry( v3, v2, v1, v0 );
	backFaceGeometry.dynamic = true;
	selection.meshGeometries.push( backFaceGeometry );

	var backFaceMesh = new THREE.Mesh( backFaceGeometry, CAPS.MATERIAL.BoxBackFace );
	selection.displayMeshes.add( backFaceMesh );

	this.lines = new Array();

};

CAPS.SelectionBoxFace.prototype = {

	constructor: CAPS.SelectionBoxFace,

	rayOver: function () {
		this.highlightLines( true );
	},

	rayOut: function () {
		this.highlightLines( false );
	},

	highlightLines: function ( b ) {
		for ( var i = 0; i < this.lines.length; i++ ) {
			this.lines[ i ].setHighlight( b );
		}
	}

};

