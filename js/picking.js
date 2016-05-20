CAPS.picking = function ( simulation ) {

	var intersected = undefined;
	var selected = undefined;

	var mouse = new THREE.Vector2();

	var plane = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000, 8, 8 ), CAPS.MATERIAL.Invisible );
	simulation.scene.add( plane );

	simulation.renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
	simulation.renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
	simulation.renderer.domElement.addEventListener( 'mouseup',   onDocumentMouseUp,   false );
	simulation.renderer.domElement.addEventListener( 'mouseout',  onDocumentMouseOut,  false );

	function onDocumentMouseMove( event ) {

		event.preventDefault();

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		var ray = new THREE.Raycaster();
		ray.setFromCamera( mouse, simulation.camera );	

		if ( selected ) {

			var intersects = ray.intersectObject( plane );
			if ( intersects.length > 0 ) {
				var newPosition = intersects[ 0 ].point;
				simulation.selection.setFromMouse( selected.axis, newPosition[ selected.axis.a ] );
			}
			return;

		}

		var intersects = ray.intersectObjects( simulation.selection.selectables );

		if ( intersects.length > 0 ) {

			var candidate = intersects[ 0 ].object;

			if ( intersected !== candidate ) {

				if ( intersected && intersected.guardian ) {
					intersected.guardian.rayOut();
				}

				intersected = candidate;
				if ( intersected && intersected.guardian ) {
					intersected.guardian.rayOver();
				}

				plane.position.copy( intersected.position );
				plane.lookAt( simulation.camera.position );

			}

			document.body.style.cursor = 'pointer';

		} else {

			if ( intersected && intersected.guardian ) {
				intersected.guardian.rayOut();
			}

			intersected = null;

			document.body.style.cursor = 'auto';

		}

		simulation.render();

	}

	function onDocumentMouseDown( event ) {

		event.preventDefault();

		var ray = new THREE.Raycaster();
		ray.setFromCamera( mouse, simulation.camera );	

		var intersects = ray.intersectObjects( simulation.selection.selectables );

		if ( intersects.length > 0 ) {

			selected = intersects[ 0 ].object;
			simulation.selection.dragStart( selected.axis );

			document.body.style.cursor = 'move';

		}

	}

	function onDocumentMouseUp( event ) {

		event.preventDefault();

		if ( intersected ) {

			plane.position.copy( intersected.position );
			selected = null;

		}

		document.body.style.cursor = 'pointer';

	}

	function onDocumentMouseOut( event ) {

		if ( intersected && intersected.guardian ) {
			intersected.guardian.rayOut();
		}
		intersected = null;
		selected = null;

		document.body.style.cursor = 'auto';

	}

}

