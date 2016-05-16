CAPS.Simulation = function () {

	this.scene        = undefined;
	this.capsScene    = undefined;
	this.backStencil  = undefined;
	this.frontStencil = undefined;

	this.camera   = undefined;
	this.renderer = undefined;
	this.controls = undefined;

	this.init();

};

CAPS.Simulation.prototype = {

	constructor: CAPS.Simulation,

	init: function () {

		var self = this;

		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.load( './models/house.dae', function ( collada ) {
			self.initScene( collada.scene );
		} );

		var container = document.createElement( 'div' );
		document.body.appendChild( container );

		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
		this.camera.position.set( 20, 20, 30 );
		this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

		this.scene        = new THREE.Scene();
		this.capsScene    = new THREE.Scene();
		this.backStencil  = new THREE.Scene();
		this.frontStencil = new THREE.Scene();

		var box = new THREE.BoxGeometry( 24, 24, 24 );
		var boxMesh = new THREE.Mesh( box, CAPS.MATERIAL.cap );
		boxMesh.position.set( 5, -5, -9 );
		this.capsScene.add( boxMesh );

		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.setClearColor( 0xffffff );
		this.renderer.autoClear = false;
		container.appendChild( this.renderer.domElement );

		var render = function () {
			self.render();
		};

		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
		this.controls.addEventListener( 'change', render );

		var onWindowResize = function () {
			self.camera.aspect = window.innerWidth / window.innerHeight;
			self.camera.updateProjectionMatrix();
			self.renderer.setSize( window.innerWidth, window.innerHeight );
			render();
		};
		window.addEventListener( 'resize', onWindowResize, false );

	},

	initScene: function ( collada ) {

		var setMaterial = function ( node, material ) {
			node.material = material;
			if ( node.children ) {
				for ( var i = 0; i < node.children.length; i++ ) {
					setMaterial( node.children[i], material );
				}
			}
		};

		var back = collada.clone();
		setMaterial( back, CAPS.MATERIAL.backStencil );
		back.scale.set( 0.03, 0.03, 0.03 );
		back.updateMatrix();
		this.backStencil.add( back );

		var front = collada.clone();
		setMaterial( front, CAPS.MATERIAL.frontStencil );
		front.scale.set( 0.03, 0.03, 0.03 );
		front.updateMatrix();
		this.frontStencil.add( front );

		setMaterial( collada, CAPS.MATERIAL.sheet );
		collada.scale.set( 0.03, 0.03, 0.03 );
		collada.updateMatrix();
		this.scene.add( collada );

		this.render();

	},

	render: function () {

		this.renderer.clear();

		var gl = this.renderer.context;

		this.renderer.state.setStencilTest( true );

		this.renderer.state.setStencilFunc( gl.ALWAYS, 1, 0xff );
		this.renderer.state.setStencilOp( gl.KEEP, gl.KEEP, gl.INCR );
		this.renderer.render( this.backStencil, this.camera );

		this.renderer.state.setStencilFunc( gl.ALWAYS, 1, 0xff );
		this.renderer.state.setStencilOp( gl.KEEP, gl.KEEP, gl.DECR );
		this.renderer.render( this.frontStencil, this.camera );

		this.renderer.state.setStencilFunc( gl.EQUAL, 1, 0xff );
		this.renderer.state.setStencilOp( gl.KEEP, gl.KEEP, gl.KEEP );
		this.renderer.render( this.capsScene, this.camera );

		this.renderer.state.setStencilTest( false );

		this.renderer.render( this.scene, this.camera );

	}

};

