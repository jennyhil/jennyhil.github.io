/////////////////////////////////////////////////////////////////
// TODO: 
// 1. Fá örvar til að virka, hægri vinstri - √
// 2. Gera þríhyrning sem flippast - √
// 3. Fá hann til að hoppa - √ 
// 4. Gera óvin - √
// 5. Gera peninga - √
// 6. Collision detection - √ laga þegar ég er til vinstri og coin er hægra megin
// 7. Timer fyrir coins - √
// 8. Halda utan um stig - √
// 9. Gera end screen með stigum - you won eða game over - √
/////////////////////////////////////////////////////////////////
var gl;
var locColor;
var bufferId;
var program;
let dir = "right";
var left = false;
var right = false;
var jump = false;


var player = [];
var enemy = [];
var coin = [];
let gameOver=false;

var coinCount = 0;
var coinVisible = false;
let interval = 5000;
let scores = 0;

let colorBuffer;
var color_player = vec4(0.0, 0.0, 1, 0.8);
var color_enemy = vec4(1, 0.0, 0.0, 0.8);
var color_coin = vec4(240, 140, 0.0, 1);
var color_points = vec4(240, 140, 0.0, 1);

let randomX;
let randomY;
let lineGap = 0;


var vPosition;
var fColor;

window.onload = function init() {

    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 0.9);

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    vPosition = gl.getAttribLocation(program, "vPosition");
    locColor = gl.getUniformLocation(program, "fColor");

    initListeners();

    player = [
        vec2(-0.05, -0.95),
        vec2(0.05, -0.875),
        vec2(-0.05, -0.8),
    ];

    enemy = [
        vec2(1.10, -0.7), // efra hægra - 0 
        vec2(0.95, -0.7),  // efra vinstra - 1
        vec2(0.95, -0.98),  // neðra vinstra -2
        vec2(1.10, -0.98),  // neðra hægra  - 3
    ];

    coin = [
        vec2(randomX, randomY),      // vinstra neðra
        vec2(randomX, randomY + 0.05),     // math random x - w
        vec2(randomX + 0.1, randomY + 0.05),
        vec2(randomX + 0.1, randomY),
    ]

    // Load the data into the GPU
    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(player), gl.DYNAMIC_DRAW);

    bufferId2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(enemy), gl.DYNAMIC_DRAW);

    bufferId3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId3);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(coin), gl.DYNAMIC_DRAW);

    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 12000, gl.STATIC_DRAW);

    setInterval(() => {
        coinVisible = !coinVisible;
        if (coinCount === 1) coinCount--;
    }, interval);

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (scores < 10 && !gameOver) {
        //player = [];
        //update(player)
        update();
        updateEnemy();

        // Associate out shader variables with our data buffer
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        // Maríus
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(player));
        gl.uniform4fv(locColor, color_player);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);

        // Enemy
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(enemy));
        gl.uniform4fv(locColor, color_enemy);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        // Coin
        setInterval(() => { coin = randomCoin(); }, interval)
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(coin));
        if (coinVisible) gl.uniform4fv(locColor, color_coin);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        // Score
        showScores();

        document.getElementById('result').innerHTML = "Your score: " + scores;
        window.requestAnimFrame(render);

    }
    else if(scores >=10){
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        document.getElementById("gl-canvas").style.background = "url('win.jpg') no-repeat center";
        document.getElementById('result').innerHTML = "You win";
    }
    else {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        document.getElementById("gl-canvas").style.background = "url('lost.jpg') no-repeat center";
        document.getElementById('result').innerHTML = "You lost";
    }
}
