
var canvas;
var gl;

// numCirclePoints er fjöldi punkta í hringnum
// Heildarfjöldi punkta er tveimur meiri (miðpunktur + fyrsti punktur kemur tvisvar)
var numCirclePoints = 20;

var radius = 0.4;
var center = vec2(0, 0);

var points = [];

window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Create the circle
    points.push(center);
    createCirclePoints(center, radius, numCirclePoints);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render();
}


// Create the points of the circle
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


function render() {

    gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw circle using Triangle Fan
    //gl.drawArrays(gl.TRIANGLE_FAN, 0, numCirclePoints + 2);
    gl.drawArrays(gl.TRIANGLES, 0, numCirclePoints + 2);


    window.requestAnimFrame(render);
}