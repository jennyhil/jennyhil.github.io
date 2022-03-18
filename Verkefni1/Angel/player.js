let onGround = true;
// movement x and y
let dX = 0;
let dY = 0;
var lives = 3;

function updateEnemy() {

    var x = - 0.005;
    if (enemy[0][0] < -1 || collidesWithEnemy()) {

        enemy = [
            vec2(1.10, -0.98),
            vec2(0.95, -0.98),
            vec2(0.95, -0.7),
            vec2(1.10, -0.7)
        ];
    }

    for (var i = 0; i < 4; i++) {
        enemy[i][0] += x;
    }
    return enemy;
}

function changeDir() {
    let marius = [];

    if (dir === "left") {

        marius = [
            vec2(-0.05, -0.95), // neðsti punktur
            vec2(-0.15, -0.875), // goggur
            vec2(-0.05, -0.8), // efsti
        ];
    }
    if (dir === "right") {
        marius = [
            vec2(-0.05, -0.95),
            vec2(0.05, -0.875),
            vec2(-0.05, -0.8),
        ];
    }
    return marius;
}

function updatePlayer(dX, dY) {
    // let marius = changeDir();
     player = changeDir();
    for (var i = 0; i < 3; i++) {
        player[i][0] += dX; //marius[i]0
        player[i][1] += dY; //marius[i][0]
    }
    return player; // return marius
}

function moveAround() {
    if (jump) {
        onGround = false;
        dY += 0.03;
        if (dir === "right") dX += 0.004;
        else dX -= 0.004;
    }
    if (right) {
        dX += 0.01;
        dir = "right";
    }
    if (left) {
        dX -= 0.01;
        dir = "left";
    }
    if (dY >= 1) {
        jump = false;
    }
    // Jump arc
    if (!jump && dY >= 0) {
        dY -= 0.03;
        if (dir === "right") dX += 0.004;
        else dX -= 0.004;
        if (dY <= 0.001) onGround = true;
    }
}

function update(player) {
    collidesWithEnemy()
    if (collidesWithCoin() && coinCount === 1) {
        coinCount = 0;
        scores += 1;
        lineGap += 0.03;
        addScore();
    }
    moveAround();
    //player.push(updatePlayer(dX, dY).flat());
    updatePlayer();

}

function collidesWithEnemy() {

    let marius = updatePlayer(dX, dY);
    let bottomX = marius[0][0];
    let bottomY = marius[0][1];
    let noseX = marius[1][0];
    let noseY = marius[1][1];

    // Colliston w. enemy, check Y coords
    if (bottomY <= enemy[1][1] || noseY <= enemy[1][1]) {
        // Check X coords
        if ((noseX >= enemy[1][0] && bottomX <= enemy[0][0]) ||
            (bottomX >= enemy[1][0] && noseX <= enemy[0][0])) {
            gameOver = true;
        };
    }
}