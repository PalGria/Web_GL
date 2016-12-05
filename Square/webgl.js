	var gl = null; // WebGL context
	var prg = null; // The program (shaders)
	var c_width = 0; // Variable to store the width of the canvas
	var c_height = 0; // Variable to store the height of the canvas
	
	var squareVertexBuffer = null; //The vertex buffer for the square
	var squareIndexBuffer = null; // The index buffer for the square
	
	var indices = []; //JavaScript array to store the indices of the square
	var vertices = []; //JavaScript array to store the vertices of the square
	
 
	/*
	* The program contains a series of instructions that tell the Graphic Processing Unit (GPU)
	* what to do with every vertex and fragment that we pass it. (more about this on chapter 3)
	* The vertex shader and the fragment shader together are called the program.
	*/
	function initProgram() {
		var fgShader = utils.getShader(gl, "shader-fs");
		var vxShader = utils.getShader(gl, "shader-vs");
 
		prg = gl.createProgram();
		gl.attachShader(prg, vxShader);
		gl.attachShader(prg, fgShader);
		gl.linkProgram(prg);
 
		if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
			alert("Could not initialise shaders");
		}
 
		gl.useProgram(prg);
 
		//The following lines allow us obtaining a reference to the uniforms and attributes defined in the shaders.
		//This is a necessary step as the shaders are NOT written in JavaScript but in a 
		//specialized language called GLSL. More about this on chapter 3.
		prg.vertexPosition = gl.getAttribLocation(prg, "aVertexPosition");
	
	}		
	
	/*
	* Creates the buffers that contain the geometry of the square
	*
	*   #0 (-0.5,0.5) +--------------+  (0.5,0.5)  #3
	*               |              |
	*               |              |
	*               |      .(0,0)  |
	*               |              |
	*               |              | 
	*   #1(-0.5,-0.5) +--------------+  (0.5,-0.5) #2
	*/
	function initBuffers() {
		
        
        vertices =  [
		-0.5,0.5,0.0, 	//Vertex 0
		-0.5,-0.5,0.0, 	//Vertex 1
		0.5,-0.5,0.0, 	//Vertex 2
		0.5,0.5,0.0]; 	//Vertex 3
 
		indices = [3,2,1,3,1,0];
		
		//The following code snippet creates a vertex buffer and binds the vertices to it
		squareVertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		
		//The following code snippet creates a vertex buffer and binds the indices to it
		squareIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	}
	
	/**
	* Draws the scene
	*/
	function drawScene(){
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
	
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.viewport(0,0,c_width, c_height);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
		gl.vertexAttribPointer(prg.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(prg.vertexPosition);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer);
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
	}
	
	/**
	* Render Loop
	*/
	function renderLoop() {
		utils.requestAnimFrame(renderLoop);
		drawScene();
	}
	/**
	* Executes the WebGL application
	* This function is invoked on the onLoad event of the webpage. 
	*/
	function runWebGLApp(){
		//Obtains a WebGL context
		gl = utils.getGLContext('canvas-element-id');
		//Initializes the program (shaders). More about this on chapter 3!
		initProgram();
		//Initializes the buffers that we are going to use to draw the square (vertex buffer and index buffer)
		initBuffers();
		//Renders the square!
		renderLoop();
	}