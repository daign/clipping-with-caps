var uniforms = {
	color:        { type: "c",  value: new THREE.Color( 0x3d9ecb ) },
	clippingLow:  { type: "v3", value: new THREE.Vector3( -7, -17, -21 ) },
	clippingHigh: { type: "v3", value: new THREE.Vector3( 17,   7,   3 ) }
};

var capsUniforms = {
	color: { type: "c", value: new THREE.Color( 0xf83610 ) }
};

CAPS.MATERIAL = {

	sheet: new THREE.ShaderMaterial( {
		uniforms:       uniforms,
		vertexShader:   CAPS.SHADER.vertexClipping,
		fragmentShader: CAPS.SHADER.fragmentClipping
	} ),

	cap: new THREE.ShaderMaterial( {
		uniforms:       capsUniforms,
		vertexShader:   CAPS.SHADER.vertex,
		fragmentShader: CAPS.SHADER.fragment
	} ),

	backStencil: new THREE.ShaderMaterial( {
		uniforms:       uniforms,
		vertexShader:   CAPS.SHADER.vertexClipping,
		fragmentShader: CAPS.SHADER.fragmentClippingFront,
		colorWrite: false,
		depthWrite: false,
		side: THREE.BackSide
	} ),

	frontStencil: new THREE.ShaderMaterial( {
		uniforms:       uniforms,
		vertexShader:   CAPS.SHADER.vertexClipping,
		fragmentShader: CAPS.SHADER.fragmentClippingFront,
		colorWrite: false,
		depthWrite: false,
	} )

};

