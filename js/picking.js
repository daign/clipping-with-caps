CAPS.picking = function ( simulation ) {

	var intersected = null;
	var mouse = new THREE.Vector2();
	var ray = new THREE.Raycaster();

	var targeting = function ( event ) {

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		ray.setFromCamera( mouse, simulation.camera );	

		var intersects = ray.intersectObjects( simulation.selection.selectables );

		if ( intersects.length > 0 ) {

			var candidate = intersects[ 0 ].object;

			if ( intersected !== candidate ) {

				if ( intersected !== null ) {
					intersected.guardian.rayOut();
				}

				candidate.guardian.rayOver();

				intersected = candidate;

				simulation.renderer.domElement.style.cursor = 'pointer';
				simulation.throttledRender();

			}

		} else if ( intersected !== null ) {

			intersected.guardian.rayOut();
			intersected = null;

			simulation.renderer.domElement.style.cursor = 'auto';
			simulation.throttledRender();

		}

	};

	var beginDrag = function ( event ) {

		if ( intersected !== null ) {

			simulation.controls.enabled = false;

			var axis = intersected.axis;
			var axisNormal = {
				x1: new THREE.Vector3( -1,  0,  0 ),
				x2: new THREE.Vector3(  1,  0,  0 ),
				y1: new THREE.Vector3(  0, -1,  0 ),
				y2: new THREE.Vector3(  0,  1,  0 ),
				z1: new THREE.Vector3(  0,  0, -1 ),
				z2: new THREE.Vector3(  0,  0,  1 )
			}[ axis ];

			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			var click0 = new THREE.Vector3( mouse.x, mouse.y, 0 ).unproject( simulation.camera );

			var limitLowStart = simulation.selection.limitLow.clone();
			var limitHighStart = simulation.selection.limitHigh.clone();

			simulation.renderer.domElement.style.cursor = 'move';

			var continueDrag = function ( event ) {

				event.preventDefault();
				event.stopPropagation();

				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
				var clickT = new THREE.Vector3( mouse.x, mouse.y, 0 ).unproject( simulation.camera );

				clickT.sub( click0 );
				var f = Math.pow( clickT.length(), 2 ) / clickT.dot( axisNormal );

				var value = f*20;

				if ( axis === 'x1' ) {
					value = limitLowStart.x - value;
				} else if ( axis === 'x2' ) {
					value = limitHighStart.x + value;
				} else if ( axis === 'y1' ) {
					value = limitLowStart.y - value;
				} else if ( axis === 'y2' ) {
					value = limitHighStart.y + value;
				} else if ( axis === 'z1' ) {
					value = limitLowStart.z - value;
				} else if ( axis === 'z2' ) {
					value = limitHighStart.z + value;
				}

				simulation.selection.setValue( axis, value );
				simulation.throttledRender();

			};

			var endDrag = function ( event ) {

				simulation.controls.enabled = true;

				simulation.renderer.domElement.style.cursor = 'pointer';

				document.removeEventListener( 'mousemove', continueDrag, true );
				document.removeEventListener( 'mouseup',   endDrag,      false );

			};

			document.addEventListener( 'mousemove', continueDrag, true );
			document.addEventListener( 'mouseup',   endDrag,      false );

		}

	};

	simulation.renderer.domElement.addEventListener( 'mousemove', targeting, true );
	simulation.renderer.domElement.addEventListener( 'mousedown', beginDrag, false );

};

