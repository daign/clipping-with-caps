CAPS.picking = function ( simulation ) {

	var intersected = null;
	var mouse = new THREE.Vector2();
	var ray = new THREE.Raycaster();
	var plane = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000, 8, 8 ), CAPS.MATERIAL.Invisible );
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
			simulation.selection.dragStart( axis );

			plane.position.copy( intersected.position );
			plane.lookAt( simulation.camera.position );

			simulation.renderer.domElement.style.cursor = 'move';

			var continueDrag = function ( event ) {

				event.preventDefault();
				event.stopPropagation();

				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

				ray.setFromCamera( mouse, simulation.camera );	

				var intersects = ray.intersectObject( plane );

				if ( intersects.length > 0 ) {
					simulation.selection.setFromMouse( axis, intersects[ 0 ].point );
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

