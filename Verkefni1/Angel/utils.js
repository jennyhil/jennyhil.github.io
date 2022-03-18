function initListeners() {
    // Event listener for keyboard
    window.addEventListener("keydown", function (e) {
        if (onGround) {
            switch (e.keyCode) {
                case 37:	// vinstri ör
                    left = true;
                    break;
                case 39:	// hægri ör
                    right = true;
                    break;
                case 38:   // hoppa
                    if (left || right) jump = false;
                    else jump = true;
                    break;
            }
        }

    });

    window.addEventListener("keyup", function (e) {
        switch (e.keyCode) {
            case 37: left = false; break;
            case 39: right = false; break;
        }
    });
}

function gameWon() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    document.getElementById("gl-canvas").style.background = "url('win.jpg') no-repeat center";
    document.getElementById('result').innerHTML = "You won";
}

function gameLost() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    document.getElementById("gl-canvas").style.background = "url('lost.jpg') no-repeat center";
    document.getElementById('result').innerHTML = "You lost";
}