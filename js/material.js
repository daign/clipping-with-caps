CAPS.MATERIAL = {

	sheet: new THREE.ShaderMaterial( {
		uniforms:       CAPS.UNIFORMS.clipping,
		vertexShader:   CAPS.SHADER.vertexClipping,
		fragmentShader: CAPS.SHADER.fragmentClipping
	} ),

	cap: new THREE.ShaderMaterial( {
		uniforms:       CAPS.UNIFORMS.caps,
		vertexShader:   CAPS.SHADER.vertex,
		fragmentShader: CAPS.SHADER.fragment
	} ),

	backStencil: new THREE.ShaderMaterial( {
		uniforms:       CAPS.UNIFORMS.clipping,
		vertexShader:   CAPS.SHADER.vertexClipping,
		fragmentShader: CAPS.SHADER.fragmentClippingFront,
		colorWrite: false,
		depthWrite: false,
		side: THREE.BackSide
	} ),

	frontStencil: new THREE.ShaderMaterial( {
		uniforms:       CAPS.UNIFORMS.clipping,
		vertexShader:   CAPS.SHADER.vertexClipping,
		fragmentShader: CAPS.SHADER.fragmentClippingFront,
		colorWrite: false,
		depthWrite: false,
	} )

};

