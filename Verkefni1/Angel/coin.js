var w = 0.1;
var h = 0.2;

function randomCoin() {
    // x frá -0.9 til 0.9
    // y frá -0.95 til 0.14
    // w: 0.05 h: 0.1

    if (!coinVisible) return [];

    if (coinVisible && coinCount === 0) {
        randomX = Math.random() * 0.9;
        randomY = Math.random() * (0.95 - 0.14) + 0.14;
        if (Math.random() < 0.5) randomX = -randomX;
        if (randomY > 0.14) randomY = -randomY;
        coinCount++;
    }
    coin = [
        vec2(randomX, randomY),      // vinstra neðra
        vec2(randomX, randomY + h),     // vinstra efra
        vec2(randomX + w, randomY + h), // hægra efra
        vec2(randomX + w, randomY),   // hægra neðra
    ]
    return coin;
}

function collidesWithCoin() {
    let marius = updatePlayer(dX, dY);
    let bottomX = marius[0][0];
    let bottomY = marius[0][1];
    let topY = marius[2][1];
    let noseX = marius[1][0];
    let noseY = marius[1][1];

    if (!coinVisible || coinCount === 0) return false;

    // Colliston w. coin, check Y coords
    if (topY >= coin[1][1] || topY >= coin[0][1]) {
        // Check X coords if coming from right
        if (dir === "right") {
            if (noseX >= coin[0][0] && bottomX <= coin[2][0]) {
                coinVisible = !coinVisible;
                console.log("HIT")
                coin = [];
                return true;
            }
        }
        // Check X coords if coming from left
        if (dir === "left") {
            if (noseX <= coin[2][0] && bottomX >= coin[0][1]) {
                coinVisible = !coinVisible;
                console.log("HIT")
                coin = [];
                return true;

            }
        }
    }
    return false;
}