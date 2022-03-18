let p1=[];
let p2=[];
let p3=[];
let p4=[];
let p5=[];
let p6=[];
let p7=[];
let p8=[];
let p9=[];
let p10=[];

function addScore() {
    switch (scores) {
        case 1:
            p1 = [
                vec2(-0.95 +lineGap, 0.95 ),
                vec2(-0.96 +lineGap, 0.95 ),
                vec2(-0.96 +lineGap, 0.80 ),
                vec2(-0.95 +lineGap, 0.80 )
            ]

        case 2:
            p2 = [
                vec2(-0.95 +lineGap, 0.95 ),
                vec2(-0.96 +lineGap, 0.95 ),
                vec2(-0.96 +lineGap, 0.80 ),
                vec2(-0.95 +lineGap, 0.80 )
            ]
        case 3:
            p3 = [
                vec2(-0.95 +lineGap, 0.95 ),
                vec2(-0.96 +lineGap, 0.95 ),
                vec2(-0.96 +lineGap, 0.80 ),
                vec2(-0.95 +lineGap, 0.80 )
            ]
        case 4:
            p4 = [
                vec2(-0.95 +lineGap, 0.95 ),
                vec2(-0.96 +lineGap, 0.95 ),
                vec2(-0.96 +lineGap, 0.80 ),
                vec2(-0.95 +lineGap, 0.80 )
            ]
        case 5:
            p5 = [
                vec2(-0.95 +lineGap, 0.95 ),
                vec2(-0.96 +lineGap, 0.95 ),
                vec2(-0.96 +lineGap, 0.80 ),
                vec2(-0.95 +lineGap, 0.80 )
            ]
        case 6:
            p6 = [
                vec2(-0.95 +lineGap, 0.95 ),
                vec2(-0.96 +lineGap, 0.95 ),
                vec2(-0.96 +lineGap, 0.80 ),
                vec2(-0.95 +lineGap, 0.80 )
            ]
        case 7:
            p7 = [
                vec2(-0.95 +lineGap, 0.95 ),
                vec2(-0.96 +lineGap, 0.95 ),
                vec2(-0.96 +lineGap, 0.80 ),
                vec2(-0.95 +lineGap, 0.80 )
            ]
        case 8:
            p8 = [
                vec2(-0.95 +lineGap, 0.95 ),
                vec2(-0.96 +lineGap, 0.95 ),
                vec2(-0.96 +lineGap, 0.80 ),
                vec2(-0.95 +lineGap, 0.80 )
            ]
        case 9:
            p9 = [
                vec2(-0.95 +lineGap, 0.95 ),
                vec2(-0.96 +lineGap, 0.95 ),
                vec2(-0.96 +lineGap, 0.80 ),
                vec2(-0.95 +lineGap, 0.80 )
            ]
        case 10:
            p10 = [
                vec2(-0.95 +lineGap, 0.95 ),
                vec2(-0.96 +lineGap, 0.95 ),
                vec2(-0.96 +lineGap, 0.80 ),
                vec2(-0.95 +lineGap, 0.80 ) 
            ]

    }
}
function showScores() {
    if (scores > 0) {
        gl.uniform4fv(locColor, color_points);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(p1));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(p2));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(p3));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(p4));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(p5));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(p6));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(p7));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(p8));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(p9));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(p10));
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
}