/**+*****************************************************************************************
** Breytið sýnisforritinu box-bounce þannig að vinstri og hægri örvalyklarnir breyta stefnu 
** "boltans" til vinstri og hægri.  Ef slegið er á vinstri örvalykil þá fer hann að færast aðeins 
** meira til vinstri (lækka dX).  Sambærilegt gildir ef slegið er á hægri örvalykil.  √
** Breytið svo virkni upp og niður örvalyklanna þannig að upp-örin stækkar boltann, 
** en niður-örin minnkar hann (boxRad). 
*********************************************************************************************/
var canvas;
var gl;

// Núverandi staðsetning miðju ferningsins
var box = vec2(0.0, 0.0);

// Stefna (og hraði) fernings
var dX;
var dY;
var sx = 1;
var sy = 1;

// Svæðið er frá -maxX til maxX og -maxY til maxY
var maxX = 1.0;
var maxY = 1.0;

// Hálf breidd/hæð ferningsins
var boxRad = 0.05;


// Ferningurinn er upphaflega í miðjunni
//var vertices = new Float32Array([-0.05, -0.05, 0.05, -0.05, 0.05, 0.05, -0.05, 0.05]);
var vertices = [
    vec2(-0.05, -0.05), // niðri vinstri 
    vec2(0.05, -0.05),  // niðri hægri 
    vec2(0.05, 0.05),
    vec2(-0.05, 0.05)
]

window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    // Gefa ferningnum slembistefnu í upphafi
    dX = Math.random() * 0.1 - 0.05;
    dY = Math.random() * 0.1 - 0.05;
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW);

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    locBox = gl.getUniformLocation(program, "boxPos");
    scaleLoc = gl.getUniformLocation(program, "scale");

    // Meðhöndlun örvalykla
    window.addEventListener("keydown", function (e) {
        switch (e.keyCode) {
            case 38:	// upp ör
                sx += 0.1;
                sy += 0.1;
                boxRad += 0.005;
                break;
            case 40:	// niður ör
                dX /= 1.1;
                dY /= 1.1;
                // látum scale ekki fara í mínus tölu
                if (sx > 0) {
                    sx -= 0.1;
                    sy -= 0.1;
                    boxRad -= 0.005;
                }
                break;
            case 39:	// hægri ör
                dX += 0.01;
                break;
            case 37:	// vinstri  ör
                dX -= 0.01;
                break;
        }
    });

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Læt ferninginn skoppa af veggjunum
    if (Math.abs(box[0] + dX) > maxX - boxRad) dX = -dX;
    if (Math.abs(box[1] + dY) > maxY - boxRad) dY = -dY;

    // Uppfæra staðsetningu
    box[0] += dX;
    box[1] += dY;

    var mv = mat4();
    mv = mult(mv, scalem(sx, sy, 1));

    // Box
    gl.uniform2fv(locBox, flatten(box));

    // Scale
    gl.uniformMatrix4fv(scaleLoc, false, flatten(mv));

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    window.requestAnimFrame(render);
}
