/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Tepottur sem litaður er með Phong litun.  Hægt að snúa
//     honum með músinni og þysja með músarhjóli
//
//    Hjálmtýr Hafsteinsson, mars 2022
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var index = 0;

var pointsArray = [];
var normalsArray = [];

var movement = false;     // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var zDist = -5.0;

var fovy = 60.0;
var near = 0.2;
var far = 100.0;

var lightPosition = vec4(10.0, 10.0, 10.0, 1.0);
var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(0.2, 0.0, 0.2, 1.0);
// dreifendurskin = diffuse
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 50.0;

var ctm;
var ambientColor, specularColor;
var diffuseColor = 970;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var normalMatrix, normalMatrixLoc;

var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);
let discard_number = 1.8;

window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.9, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);


    var myTeapot = teapot(15);
    myTeapot.scale(0.5, 0.5, 0.5);

    console.log(myTeapot.TriangleVertices.length);

    points = myTeapot.TriangleVertices;
    normals = myTeapot.Normals;

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, extractNumbers(diffuseColor));
    specularProduct = mult(lightSpecular, materialSpecular);


    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");

    projectionMatrix = perspective(fovy, 1.0, near, far);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
    gl.uniform1f(gl.getUniformLocation(program, "discard_number"), discard_number);

    //event listeners for mouse
    canvas.addEventListener("mousedown", function (e) {
        movement = true;
        origX = e.clientX;
        origY = e.clientY;
        e.preventDefault();         // Disable drag and drop
    });

    canvas.addEventListener("mouseup", function (e) {
        movement = false;
    });

    canvas.addEventListener("mousemove", function (e) {
        if (movement) {
            spinY = (spinY + (e.clientX - origX)) % 360;
            spinX = (spinX + (e.clientY - origY)) % 360;
            origX = e.clientX;
            origY = e.clientY;
        }
    });

    // Event listener for mousewheel
    window.addEventListener("wheel", function (e) {
        if (e.deltaY > 0.0) {
            zDist += 0.2;
        } else {
            zDist -= 0.2;
        }
    });
    // event listener for keyboad
    window.addEventListener("keydown", function (e) {
        switch (e.keyCode) {
            case 37:    // left arrow
                diffuseColor -= 1;
                diffuseProduct = mult(lightDiffuse, extractNumbers(diffuseColor));
                gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
                break;
            case 38:    // up arrow
                if (discard_number > 0) discard_number -= 0.1;
                gl.uniform1f(gl.getUniformLocation(program, "discard_number"), discard_number);
                break;
            case 39:    // right arrow
                diffuseColor += 1;
                diffuseProduct = mult(lightDiffuse, extractNumbers(diffuseColor));
                gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
                break;
            case 40:    // down arrow
                if (discard_number <= 4) discard_number += 0.1;
                gl.uniform1f(gl.getUniformLocation(program, "discard_number"), discard_number);
    
                break;
        }
    });

    render();
}

function extractNumbers(num) {
    let strNumFirst = String(num)[0];
    let numFirst = Number(strNumFirst) / 10
    let strNumSecond = String(num)[1];
    let numSecond = Number(strNumSecond) / 10
    let strNumThird = String(num)[2];
    let numThird = Number(strNumThird) / 10;

    if (numFirst < 1) numFirst += 0.1;
    if (numSecond < 1) numSecond += 0.1;
    if (numThird < 1) numThird += 0.1;

    return vec4(numFirst, numSecond, numThird, 1.0);
}

function render() {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    modelViewMatrix = lookAt(vec3(0.0, 0.0, zDist), at, up);
    modelViewMatrix = mult(modelViewMatrix, rotateY(-spinY));
    modelViewMatrix = mult(modelViewMatrix, rotateX(spinX));

    normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, points.length);
    window.requestAnimFrame(render);
}
