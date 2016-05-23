CAPS.Selection = function ( low, high ) {

	var axis = {
		x1: new THREE.Vector3( -1,  0,  0 ),
		x2: new THREE.Vector3(  1,  0,  0 ),
		y1: new THREE.Vector3(  0, -1,  0 ),
		y2: new THREE.Vector3(  0,  1,  0 ),
		z1: new THREE.Vector3(  0,  0, -1 ),
		z2: new THREE.Vector3(  0,  0,  1 )
	};

	this.limitLow = low;
	this.limitHigh = high;

	this.box = new THREE.BoxGeometry( 1, 1, 1 );
	this.boxMesh = new THREE.Mesh( this.box, CAPS.MATERIAL.cap );

	this.vertices = [
		new THREE.Vector3(), new THREE.Vector3(),
		new THREE.Vector3(), new THREE.Vector3(),
		new THREE.Vector3(), new THREE.Vector3(),
		new THREE.Vector3(), new THREE.Vector3()
	];
	this.updateVertices();

	var v = this.vertices;

	this.touchMeshes = new THREE.Object3D();
	this.displayMeshes = new THREE.Object3D();
	this.meshGeometries = [];
	this.lineGeometries = [];
	this.selectables = [];

	this.faces = [];
	var f = this.faces;
	this.faces.push( new CAPS.SelectionBoxFace( axis.y1, v[ 0 ], v[ 1 ], v[ 5 ], v[ 4 ], this ) );
	this.faces.push( new CAPS.SelectionBoxFace( axis.z1, v[ 0 ], v[ 2 ], v[ 3 ], v[ 1 ], this ) );
	this.faces.push( new CAPS.SelectionBoxFace( axis.x1, v[ 0 ], v[ 4 ], v[ 6 ], v[ 2 ], this ) );
	this.faces.push( new CAPS.SelectionBoxFace( axis.x2, v[ 7 ], v[ 5 ], v[ 1 ], v[ 3 ], this ) );
	this.faces.push( new CAPS.SelectionBoxFace( axis.y2, v[ 7 ], v[ 3 ], v[ 2 ], v[ 6 ], this ) );
	this.faces.push( new CAPS.SelectionBoxFace( axis.z2, v[ 7 ], v[ 6 ], v[ 4 ], v[ 5 ], this ) );

	var l0  = new CAPS.SelectionBoxLine( v[ 0 ], v[ 1 ], f[ 0 ], f[ 1 ], this );
	var l1  = new CAPS.SelectionBoxLine( v[ 0 ], v[ 2 ], f[ 1 ], f[ 2 ], this );
	var l2  = new CAPS.SelectionBoxLine( v[ 0 ], v[ 4 ], f[ 0 ], f[ 2 ], this );
	var l3  = new CAPS.SelectionBoxLine( v[ 1 ], v[ 3 ], f[ 1 ], f[ 3 ], this );
	var l4  = new CAPS.SelectionBoxLine( v[ 1 ], v[ 5 ], f[ 0 ], f[ 3 ], this );
	var l5  = new CAPS.SelectionBoxLine( v[ 2 ], v[ 3 ], f[ 1 ], f[ 4 ], this );
	var l6  = new CAPS.SelectionBoxLine( v[ 2 ], v[ 6 ], f[ 2 ], f[ 4 ], this );
	var l7  = new CAPS.SelectionBoxLine( v[ 3 ], v[ 7 ], f[ 3 ], f[ 4 ], this );
	var l8  = new CAPS.SelectionBoxLine( v[ 4 ], v[ 5 ], f[ 0 ], f[ 5 ], this );
	var l9  = new CAPS.SelectionBoxLine( v[ 4 ], v[ 6 ], f[ 2 ], f[ 5 ], this );
	var l10 = new CAPS.SelectionBoxLine( v[ 5 ], v[ 7 ], f[ 3 ], f[ 5 ], this );
	var l11 = new CAPS.SelectionBoxLine( v[ 6 ], v[ 7 ], f[ 4 ], f[ 5 ], this );

	this.setBox();
	this.setUniforms();

	this.oldValue = undefined;

};

CAPS.Selection.prototype = {

	constructor: CAPS.Selection,

	updateVertices: function () {

		this.vertices[ 0 ].set( this.limitLow.x,  this.limitLow.y,  this.limitLow.z );
		this.vertices[ 1 ].set( this.limitHigh.x, this.limitLow.y,  this.limitLow.z );
		this.vertices[ 2 ].set( this.limitLow.x,  this.limitHigh.y, this.limitLow.z );
		this.vertices[ 3 ].set( this.limitHigh.x, this.limitHigh.y, this.limitLow.z );
		this.vertices[ 4 ].set( this.limitLow.x,  this.limitLow.y,  this.limitHigh.z );
		this.vertices[ 5 ].set( this.limitHigh.x, this.limitLow.y,  this.limitHigh.z );
		this.vertices[ 6 ].set( this.limitLow.x,  this.limitHigh.y, this.limitHigh.z );
		this.vertices[ 7 ].set( this.limitHigh.x, this.limitHigh.y, this.limitHigh.z );

	},

	updateGeometries: function () {

		for ( var i = 0; i < this.meshGeometries.length; i++ ) {
			this.meshGeometries[ i ].verticesNeedUpdate = true;
			this.meshGeometries[ i ].computeBoundingSphere();
			this.meshGeometries[ i ].computeBoundingBox();
		}
		for ( var i = 0; i < this.lineGeometries.length; i++ ) {
			this.lineGeometries[ i ].verticesNeedUpdate = true;
		}

	},

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

	},

	dragStart: function ( axis ) {

		this.oldValue = new THREE.Vector3().add(
			new THREE.Vector3( 1, 1, 1 ).sub( axis ).divideScalar( 2 ).multiply( this.limitLow )
		).add(
			new THREE.Vector3( 1, 1, 1 ).add( axis ).divideScalar( 2 ).multiply( this.limitHigh )
		);

	},

	setFromMouse: function ( axis, point ) {

		var value = undefined;

		if ( axis.x !== 0 ) {
			value = point.x + this.oldValue.x;
		} else if ( axis.y !== 0 ) {
			value = point.y + this.oldValue.y;
		} else if ( axis.z !== 0 ) {
			value = point.z + this.oldValue.z;
		}

		this.setValue( axis, value );

		this.setBox();
		this.setUniforms();

		this.updateVertices();
		this.updateGeometries();

	},

	setValue: function ( axis, value ) {

		var buffer = 0.4;
		var limit = 14;

		if ( axis.x === -1 ) {
			this.limitLow.x = Math.max( -limit, Math.min( this.limitHigh.x-buffer, value ) );
		} else if ( axis.x === 1 ) {
			this.limitHigh.x = Math.max( this.limitLow.x+buffer, Math.min( limit, value ) );
		} else if ( axis.y === -1 ) {
			this.limitLow.y = Math.max( -limit, Math.min( this.limitHigh.y-buffer, value ) );
		} else if ( axis.y === 1 ) {
			this.limitHigh.y = Math.max( this.limitLow.y+buffer, Math.min( limit, value ) );
		} else if ( axis.z === -1 ) {
			this.limitLow.z = Math.max( -limit, Math.min( this.limitHigh.z-buffer, value ) );
		} else if ( axis.z === 1 ) {
			this.limitHigh.z = Math.max( this.limitLow.z+buffer, Math.min( limit, value ) );
		}

	}

};

