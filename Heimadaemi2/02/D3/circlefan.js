
var canvas;
var gl;

var points = [];

var numCirclePoints = 4;
var radius = 0.4;
var center = vec2(0, 0);
var bufferId;

function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU

    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * Math.pow(3, 6), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    document.getElementById("slider").onchange = function (event) {
        numCirclePoints = event.target.value;
        document.getElementById("noOfPoints").innerHTML="You have chosen "+numCirclePoints+" points";
        render();
    };
    render();
};


function createCirclePoints(cent, rad, k) {
    var addPoints = 0;
    var dAngle = 2 * Math.PI / k;
    for (i = k; i >= 0; i--) {
        a = i * dAngle;
        var p = vec2(rad * Math.sin(a) + cent[0], rad * Math.cos(a) + cent[1]);
        points.push(p);
        points.push(center);
        points.push(p);
        addPoints += 2;
    }
    numCirclePoints += addPoints;
  
}

window.onload = init;

function render() {

    points = [];
    points.push(center);

    createCirclePoints(center, radius, numCirclePoints);
    
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
    points = [];
    //requestAnimFrame(render);
}

