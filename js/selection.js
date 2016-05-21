CAPS.Selection = function ( low, high ) {

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
	this.faces.push( new CAPS.SelectionBoxFace( 'y1', v[ 0 ], v[ 1 ], v[ 5 ], v[ 4 ], this ) );
	this.faces.push( new CAPS.SelectionBoxFace( 'z1', v[ 0 ], v[ 2 ], v[ 3 ], v[ 1 ], this ) );
	this.faces.push( new CAPS.SelectionBoxFace( 'x1', v[ 0 ], v[ 4 ], v[ 6 ], v[ 2 ], this ) );
	this.faces.push( new CAPS.SelectionBoxFace( 'x2', v[ 7 ], v[ 5 ], v[ 1 ], v[ 3 ], this ) );
	this.faces.push( new CAPS.SelectionBoxFace( 'y2', v[ 7 ], v[ 3 ], v[ 2 ], v[ 6 ], this ) );
	this.faces.push( new CAPS.SelectionBoxFace( 'z2', v[ 7 ], v[ 6 ], v[ 4 ], v[ 5 ], this ) );

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

	this.oldValue = 0;

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

		if ( axis === 'x1' ) {
			this.oldValue = this.limitLow.x;
		} else if ( axis === 'x2' ) {
			this.oldValue = this.limitHigh.x;
		} else if ( axis === 'y1' ) {
			this.oldValue = this.limitLow.y;
		} else if ( axis === 'y2' ) {
			this.oldValue = this.limitHigh.y;
		} else if ( axis === 'z1' ) {
			this.oldValue = this.limitLow.z;
		} else if ( axis === 'z2' ) {
			this.oldValue = this.limitHigh.z;
		}

	},

	setFromMouse: function ( axis, point ) {

		var value = undefined;

		if ( axis === 'x1' ) {
			value = point.x;
		} else if ( axis === 'x2' ) {
			value = point.x;
		} else if ( axis === 'y1' ) {
			value = point.y;
		} else if ( axis === 'y2' ) {
			value = point.y;
		} else if ( axis === 'z1' ) {
			value = point.z;
		} else if ( axis === 'z2' ) {
			value = point.z;
		}

		value += this.oldValue;
		this.setValue( axis, value );

		this.setBox();
		this.setUniforms();

		this.updateVertices();
		this.updateGeometries();

	},

	setValue: function ( axis, value ) {

		var buffer = 0.4;
		var limit = 14;

		if ( axis === 'x1' ) {
			this.limitLow.x = Math.max( -limit, Math.min( this.limitHigh.x-buffer, value ) );
		} else if ( axis === 'x2' ) {
			this.limitHigh.x = Math.max( this.limitLow.x+buffer, Math.min( limit, value ) );
		} else if ( axis === 'y1' ) {
			this.limitLow.y = Math.max( -limit, Math.min( this.limitHigh.y-buffer, value ) );
		} else if ( axis === 'y2' ) {
			this.limitHigh.y = Math.max( this.limitLow.y+buffer, Math.min( limit, value ) );
		} else if ( axis === 'z1' ) {
			this.limitLow.z = Math.max( -limit, Math.min( this.limitHigh.z-buffer, value ) );
		} else if ( axis === 'z2' ) {
			this.limitHigh.z = Math.max( this.limitLow.z+buffer, Math.min( limit, value ) );
		}

	}

};

