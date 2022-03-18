/////////////////////////////////////////////////////////////////
//    Verkefni 2 - Tölvugrafík
//    Jenný Hildur Ómarsdóttir 
// --------------------------------------------------------------  
//  DONE:
//  Cube box √
//  Teikna úlfa √
//  Teikna kindur √
//  Láta kindur hreyfast √
//  Láta dýr koma aftur inn í ramma ef þau fara út fyrir √
//  útbúta slider-a í HTML √
//  Láta alla slider fyrir kindur virka √
//  Láta slider fyrir tíma milli fæðinga lamba √
//  Láta slider fyrir hraða hermunar virka √
//  Láta kindur eignast börn í hólfi við hliðina á - √ 
//  Láta úlfa hreyfast - √
//  Láta úlfa eignast börn - √
//  Láta slider fyrir tíma f. úlfa að svelta virka - √
//  Láta slider f yrðlinga virka eftir að úlfar hafa borðað lömb- √ 
//  Láta úlfa deyja eftir smá tíma ef þeir borða ekki - √
//  Láta slider f úlfa virka- √ 
//  Double tjekka: 
//  Collision detection með kindur - semi komið √ gera fixed to(2)
//  Láta úlfa elta kindur - √ semi
//  TODO: 
//  Stíla ef tími
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var NumVertices = 24;

var points = [];
var colors = [];

var vBuffer;
var vPosition;

var movement = false;     // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;
var lines = [];
var zDist = -3.0;
var eyesep = 0.2;

var proLoc;
var mvLoc;
let vertices = [];

// Sheep
var animal = [];
var numAnimals;
var flockOfSheep = [];
var packOfWolves = [];

// Wolves
var wolf = [];
var numWolves;

// Slider numbers
let noOfSheeps;
let noOfWolves;
let sheepBirth = 3;
let wolfBirth = 1;
let starvationTime=50;
let simSpeed = 150;
var time = 0;
let audio = false;

var audioElement = new Audio("sound/baaa.mp3");

window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }
    world();
    colorCube();

    flockOfSheep.push(makeSheep(getRandomPos(flockOfSheep)));
    packOfWolves.push(makeWolf(getRandomPos(packOfWolves)));

    vertices.push(...animal);
    vertices.push(...lines);

    numAnimals = animal.length;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    colorLoc = gl.getUniformLocation(program, "wireColor");

    proLoc = gl.getUniformLocation(program, "projection");
    mvLoc = gl.getUniformLocation(program, "modelview");

    var proj = perspective(50.0, 1.0, 0.2, 100.0);
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));

    //event listeners for mouse
    canvas.addEventListener("mousedown", function (e) {
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    });

    canvas.addEventListener("mouseup", function (e) {
        movement = false;
    });

    canvas.addEventListener("mousemove", function (e) {
        if (movement) {
            spinY = (spinY + (origX - e.offsetX)) % 360;
            spinX = (spinX + (e.offsetY - origY)) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    });

    // Event listener for keyboard
    window.addEventListener("keydown", function (e) {
        switch (e.keyCode) {
            case 38:	// upp ör
                zDist += 0.1;
                break;
            case 40:	// niður ör
                zDist -= 0.1;
                break;
            case 32:
                audio = !audio;
                break;
        }
    });

    // Event listener for mousewheel
    window.addEventListener("mousewheel", function (e) {
        if (e.wheelDelta > 0.0) {
            zDist += 0.1;
        } else {
            zDist -= 0.1;
        }
    });

    sliders();

    render();
}

function sliders() {
    // Fjöldi kinda
    document.getElementById("noSheeps").onchange = function (event) {
        noOfSheeps = event.target.value;
        document.getElementById("noOfSheep").innerHTML = "Þú hefur valið " + noOfSheeps + " kindur";

        for (var i = 0; i < noOfSheeps - 1; i++) {
            if (flockOfSheep.length < noOfSheeps) flockOfSheep.push(makeSheep(getRandomPos(flockOfSheep)));
        }

        if (flockOfSheep.length > noOfSheeps) {
            flockOfSheep.splice(noOfSheeps, flockOfSheep.length);
        }
    };

    // Fjöldi úlfa
    document.getElementById("noWolves").onchange = function (event) {
        noOfWolves = event.target.value;
        document.getElementById("noOfWolves").innerHTML = "Þú hefur valið " + noOfWolves + " úlfa";

        for (var i = 0; i < noOfWolves - 1; i++) {
            if (packOfWolves.length < noOfWolves) packOfWolves.push(makeWolf(getRandomPos(flockOfSheep)));
        }
        if(packOfWolves.length===0)packOfWolves.push(makeWolf(getRandomPos(flockOfSheep)));

        if (packOfWolves.length > noOfWolves) {
            packOfWolves.splice(noOfWolves, packOfWolves.length);
        }
    };

    // Tímalengd á milli fæðinga lamba
    document.getElementById("sheepBirth").onchange = function (event) {
        sheepBirth = event.target.value;
    };

    // Fjöldi étinna lamba þar til yrðlingar fæðast
    document.getElementById("wolfBirth").onchange = function (event) {
        wolfBirth = event.target.value;
        for(var i=0;i< packOfWolves.length;i++)packOfWolves[i].timeForBaby =wolfBirth;
    };
    // Tími þar til úlfar svelta
    document.getElementById("starvationTime").onchange = function (event) {
        starvationTime = event.target.value;
        for(var i=0;i< packOfWolves.length;i++)packOfWolves[i].lifetime =starvationTime;
    };

    // Hraði hermunar
    document.getElementById("simulationSpeed").onchange = function (event) {
        let s = event.target.value;
        switch (s) {
            case '0':
                simSpeed = -Infinity;
                break;
            case '1':
                simSpeed = 150;
                break;
            case '2':
                simSpeed = 50;
                break;
            case '3':
                simSpeed = 35;
                break;
            case '4':
                simSpeed = 15;
                break;
            case '5':
                simSpeed = 5;
                break;
        }
    };

}
// Sheep and foxes
function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

function quad(a, b, c, d) {
    var v = [
        vec3(-0.5, -0.5, 0.5),
        vec3(-0.5, 0.5, 0.5),
        vec3(0.5, 0.5, 0.5),
        vec3(0.5, -0.5, 0.5),
        vec3(-0.5, -0.5, -0.5),
        vec3(-0.5, 0.5, -0.5),
        vec3(0.5, 0.5, -0.5),
        vec3(0.5, -0.5, -0.5)
    ];

    var indices = [a, b, c, a, c, d];

    for (var i = 0; i < indices.length; ++i) {
        animal.push(v[indices[i]]);

    }
}

function world() {
    // the 8 vertices of the cube
    var v = [
        vec3(-0.7, -0.7, 0.7),
        vec3(-0.7, 0.7, 0.7),
        vec3(0.7, 0.7, 0.7),
        vec3(0.7, -0.7, 0.7),
        vec3(-0.7, -0.7, -0.7),
        vec3(-0.7, 0.7, -0.7),
        vec3(0.7, 0.7, -0.7),
        vec3(0.7, -0.7, -0.7)
    ];

    lines = [v[0], v[1], v[1], v[2], v[2], v[3], v[3], v[0],
    v[4], v[5], v[5], v[6], v[6], v[7], v[7], v[4],
    v[0], v[4], v[1], v[5], v[2], v[6], v[3], v[7]
    ];

}

function render() {
    if (audio && flockOfSheep.length > 0) audioElement.play();
    if (!audio || flockOfSheep.length === 0) audioElement.pause()

    time += 1;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    var mv = lookAt(vec3(0.0 - eyesep / 2.0, 0.0, zDist),
        vec3(0.0, 0.0, zDist + 2.0),
        vec3(0.0, 1.0, 0.0));
    mv = mult(mv, mult(rotateX(spinX), rotateY(spinY)));

    // Draw wolves
    for (let i = 0; i < packOfWolves.length; i++) {
        drawAnimal(mv, packOfWolves[i]);

    }
    // Draw sheep
    for (let i = 0; i < flockOfSheep.length; i++) {
        drawAnimal(mv, flockOfSheep[i]);
    }
    if (time % simSpeed === 0) {
        moveSheep();
        moveWolf();
    }

    // Draw Cube
    gl.uniform4fv(colorLoc, vec4(0.0, 0.0, 0.0, 1.0));
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays(gl.LINES, numAnimals, lines.length);

    requestAnimFrame(render);
}