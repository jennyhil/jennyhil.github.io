var sheepColor = vec4(0.0, 1.0, 0.0, 1.0);
var wolfColor = vec4(1.0, 0.0, 0.0, 1.0);

function makeSheep(positions) {
    return {
        color: sheepColor,
        timeForBaby: sheepBirth,
        pos: {
            x: positions.x,
            y: positions.y,
            z: positions.z,
        },


    };
}

function makeWolf(positions) {
    return {
        color: wolfColor,
        lifetime: starvationTime,
        timeForBaby: wolfBirth,
        pos: {
            x: positions.x,
            y: positions.y,
            z: positions.z,
        },

    };
}

function grid() {
    // Setja 10 x 10 x 10 grid
    let xCol = [];
    let yCol = [];
    let zCol = [];
    let placement = -0.63;

    for (var i = 0; i < 10; i++) {
        xCol.push(placement);
        yCol.push(placement);
        zCol.push(placement);
        placement += 0.14;
    }
    return { xCol, yCol, zCol }
}

function getRandomPos() {
    let x = grid().xCol[Math.round(Math.random() * 10)];
    let y = grid().yCol[Math.round(Math.random() * 10)];
    let z = grid().zCol[Math.round(Math.random() * 10)];

    // Undfined prevention
    if (!x) x = -0.63;
    if (!y) y = -0.63;
    if (!z) z = -0.63;
    return { x, y, z }
}

function moveSheep() {
    for (var i = 0; i < flockOfSheep.length; i++) {
        let newPos = getRandomDirection(flockOfSheep[i])
        // if newPos is empty - move, else find a new pos
        if (spotIsEmpty(newPos, i, flockOfSheep)) {
            if (flockOfSheep[i].timeForBaby === 0) birthLamb(flockOfSheep[i], i);
            flockOfSheep[i].pos = newPos;
        }
        flockOfSheep[i].timeForBaby -= 1;
    }
}

function moveWolf() {
    for (var i = 0; i < packOfWolves.length; i++) {
        let newPos = findNearestSheep(packOfWolves[i]);

        if (spotIsEmpty(newPos, i, packOfWolves)) {
            packOfWolves[i].pos = newPos;
        }
        if (packOfWolves[i].timeForBaby === 0) {
            birthWolf(packOfWolves[i], i);
            packOfWolves[i].timeForBaby = 1;
        }

        packOfWolves[i].lifetime -= 1;
        if (packOfWolves[i].lifetime === 0) packOfWolves.splice(i, 1);
    }
}

function findNearestSheep(wolf) {
    let newPos = { x: wolf.pos.x, y: wolf.pos.y, z: wolf.pos.z }
    let closestIndex;
    let closestSheep;
    var minTotalDistance = Infinity

    for (var i = 0; i < flockOfSheep.length; i++) {
        var diffrenceX = Math.abs(wolf.pos.x - flockOfSheep[i].pos.x);
        var diffrenceY = Math.abs(wolf.pos.y - flockOfSheep[i].pos.y);
        var diffrenceZ = Math.abs(wolf.pos.z - flockOfSheep[i].pos.z);

        var totalDistance = Math.sqrt(Math.pow(diffrenceX, 2) + Math.pow(diffrenceY, 2) + Math.pow(diffrenceZ, 2));

        if (minTotalDistance > totalDistance) {
            minTotalDistance = totalDistance;
            closestIndex = i;
            closestSheep = flockOfSheep[i];
        }

        if (closestSheep.pos.y != newPos.y && closestSheep.pos.x != newPos.x && closestSheep.pos.z != newPos.z) {
            newPos = getRandomDirection(wolf);
        }

        if (closestSheep.pos.x === wolf.pos.x) {
            newPos.x = closestSheep.pos.x;
            // lets search for z and y
            if (newPos.y != closestSheep.pos.y) newPos.y += 0.14;
            if (newPos.z != closestSheep.pos.z) newPos.z += 0.14;
        }
        if (closestSheep.pos.y === wolf.pos.y) {
            newPos.y = closestSheep.pos.y;
            if (newPos.x != closestSheep.pos.x) newPos.x += 0.14;
            if (newPos.z != closestSheep.pos.z) newPos.z += 0.14;
        }
        if (closestSheep.pos.z === wolf.pos.z) {
            newPos.z = closestSheep.pos.z;
            if (newPos.x != closestSheep.pos.x) newPos.x += 0.14;
            if (newPos.y != closestSheep.pos.z) newPos.y += 0.14;
        }
    }

    if (flockOfSheep.length != 0 && eatSheep(closestSheep.pos, wolf)) {
        flockOfSheep.splice(closestIndex, 1);
        wolf.timeForBaby -= 1;
        wolf.lifetime = starvationTime;
    }

    if (flockOfSheep.length === 0) newPos = getRandomDirection(wolf);
    newPos = aroundTheWorld(newPos);

    return newPos;
}

function eatSheep(target, wolf) {
    return target.x.toFixed(2) === wolf.pos.x.toFixed(2) && target.y.toFixed(2) === wolf.pos.y.toFixed(2) && target.z.toFixed(2) === wolf.pos.z.toFixed(2);
}

function aroundTheWorld(newPos) {
    if (newPos.x > 0.64) newPos.x = -0.63;  // grid columns start at 0.63 and -0.63
    if (newPos.y > 0.64) newPos.y = -0.63;
    if (newPos.z > 0.64) newPos.z = -0.63;

    if (newPos.x <= -0.64) newPos.x = 0.63;
    if (newPos.y <= -0.64) newPos.y = 0.63;
    if (newPos.z <= -0.64) newPos.z = 0.63;
    return newPos;
}

function getRandomDirection(sheep) {
    var newPos;
    newPos = { x: sheep.pos.x + 0.14, y: sheep.pos.y, z: sheep.pos.z }
    // 50% chance - x
    if (Math.random() < 0.5) newPos.x = sheep.pos.x + 0.14;
    // 10% chance - x
    else if (Math.random() < 0.6) newPos.x = sheep.pos.x - 0.14;
    // 10% chance - y 
    else if (Math.random() < 0.7) newPos.y = sheep.pos.y + 0.14;
    // 10% chance - y 
    else if (Math.random() < 0.8) newPos.y = sheep.pos.y - 0.14;
    // 10% chance - z
    else if (Math.random() < 0.9) newPos.z = sheep.pos.z + 0.14;
    // 10% chance - z
    else if (Math.random() <= 1) newPos.z = sheep.pos.z - 0.14;
    newPos = aroundTheWorld(newPos);

    return newPos;
}

// Keep one sheep in each "box" in the grid
function spotIsEmpty(pos, index, array) {
    for (var i = 0; i < array.length; i++) {
        if (pos.x.toFixed(2) === array[i].pos.x.toFixed(2) && pos.y.toFixed(2) === array[i].pos.y.toFixed(2) &&
            pos.z.toFixed(2) === array[i].pos.z.toFixed(2) && array[i] != pos) {
            return false
        }
    }
    return true;
}

function birthLamb(mamaSheep, i) {

    // All available spots 
    let babyPos1 = { x: mamaSheep.pos.x + 0.14, y: mamaSheep.pos.y, z: mamaSheep.pos.z }
    let babyPos2 = { x: mamaSheep.pos.x - 0.14, y: mamaSheep.pos.y, z: mamaSheep.pos.z }
    let babyPos3 = { x: mamaSheep.pos.x, y: mamaSheep.pos.y + 0.14, z: mamaSheep.pos.z }
    let babyPos4 = { x: mamaSheep.pos.x, y: mamaSheep.pos.y - 0.14, z: mamaSheep.pos.z }
    let babyPos5 = { x: mamaSheep.pos.x, y: mamaSheep.pos.y, z: mamaSheep.pos.z + 0.14 }
    let babyPos6 = { x: mamaSheep.pos.x, y: mamaSheep.pos.y, z: mamaSheep.pos.z - 0.14 }

    // Annoying way of finding an empty spot 
    if (spotIsEmpty(babyPos1, i, flockOfSheep)) flockOfSheep.push(makeSheep(babyPos1));
    else if (spotIsEmpty(babyPos2, i, flockOfSheep)) flockOfSheep.push(makeSheep(babyPos2));
    else if (spotIsEmpty(babyPos3, i, flockOfSheep)) flockOfSheep.push(makeSheep(babyPos3));
    else if (spotIsEmpty(babyPos4, i, flockOfSheep)) flockOfSheep.push(makeSheep(babyPos4));
    else if (spotIsEmpty(babyPos5, i, flockOfSheep)) flockOfSheep.push(makeSheep(babyPos5));
    else if (spotIsEmpty(babyPos6, i, flockOfSheep)) flockOfSheep.push(makeSheep(babyPos6));
}

function birthWolf(mamaWolf, i) {
    // All available spots 
    let babyPos1 = { x: mamaWolf.pos.x + 0.14, y: mamaWolf.pos.y, z: mamaWolf.pos.z }
    let babyPos2 = { x: mamaWolf.pos.x - 0.14, y: mamaWolf.pos.y, z: mamaWolf.pos.z }
    let babyPos3 = { x: mamaWolf.pos.x, y: mamaWolf.pos.y + 0.14, z: mamaWolf.pos.z }
    let babyPos4 = { x: mamaWolf.pos.x, y: mamaWolf.pos.y - 0.14, z: mamaWolf.pos.z }
    let babyPos5 = { x: mamaWolf.pos.x, y: mamaWolf.pos.y, z: mamaWolf.pos.z + 0.14 }
    let babyPos6 = { x: mamaWolf.pos.x, y: mamaWolf.pos.y, z: mamaWolf.pos.z - 0.14 }

    // Annoying way of finding an empty spot 
    if (spotIsEmpty(babyPos1, i, packOfWolves)) packOfWolves.push(makeWolf(babyPos1));
    else if (spotIsEmpty(babyPos2, i, packOfWolves)) packOfWolves.push(makeWolf(babyPos2));
    else if (spotIsEmpty(babyPos3, i, packOfWolves)) packOfWolves.push(makeWolf(babyPos3));
    else if (spotIsEmpty(babyPos4, i, packOfWolves)) packOfWolves.push(makeWolf(babyPos4));
    else if (spotIsEmpty(babyPos5, i, packOfWolves)) packOfWolves.push(makeWolf(babyPos5));
    else if (spotIsEmpty(babyPos6, i, packOfWolves)) packOfWolves.push(makeWolf(babyPos6));
}

function drawAnimal(mv, animal) {
    mv = mult(mv, translate(animal.pos.x, animal.pos.y, animal.pos.z));
    mv = mult(mv, scalem(0.1, 0.1, 0.1));

    gl.uniform4fv(colorLoc, animal.color);
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays(gl.TRIANGLES, 0, numAnimals);
}