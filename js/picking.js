CAPS.picking = function ( simulation ) {

	var intersected = null;
	var intersectionPoint = undefined;
	var mouse = new THREE.Vector2();
	var ray = new THREE.Raycaster();

	var plane = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100, 4, 4 ), CAPS.MATERIAL.Invisible );
	simulation.scene.add( plane );

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

			intersectionPoint = intersects[ 0 ].point;

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

			if ( axis === 'x1' || axis === 'x2' ) {
				intersectionPoint.setX( 0 );
			} else if ( axis === 'y1' || axis === 'y2' ) {
				intersectionPoint.setY( 0 );
			} else if ( axis === 'z1' || axis === 'z2' ) {
				intersectionPoint.setZ( 0 );
			}
			plane.position.copy( intersectionPoint );

			var newNormal = simulation.camera.position.clone().sub(
				simulation.camera.position.clone().projectOnVector( axisNormal )
			);
			plane.lookAt( newNormal.add( intersectionPoint ) );

			simulation.renderer.domElement.style.cursor = 'move';
			simulation.throttledRender();

			var continueDrag = function ( event ) {

				event.preventDefault();
				event.stopPropagation();

				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

				ray.setFromCamera( mouse, simulation.camera );	

				var intersects = ray.intersectObject( plane );

				if ( intersects.length > 0 ) {

					if ( axis === 'x1' || axis === 'x2' ) {
						value = intersects[ 0 ].point.x;
					} else if ( axis === 'y1' || axis === 'y2' ) {
						value = intersects[ 0 ].point.y;
					} else if ( axis === 'z1' || axis === 'z2' ) {
						value = intersects[ 0 ].point.z;
					}

					simulation.selection.setValue( axis, value );
					simulation.throttledRender();

				}

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

