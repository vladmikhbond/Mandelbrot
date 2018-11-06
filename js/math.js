// ---------------------- Math --------------------------------

// Zn = Zn * Zn + c;
// Zo = 0; c = {x, y}
function countIter1(cx, cy, limit = iterLimit) {
    let x = cx, y = cy;
    for (let i = 0; i < limit; i++)
    {
        [x, y] = [x * x - y * y + cx, 2 * x * y + cy];
        if ((x * x) + (y * y) > 4)
            return i
    }
    return limit;
}


function canvasToWorld(canvasX, canvasY) {
    return [
        canvasX * (x2 - x1) / canvas1.width + x1,
        canvasY * (y2 - y1) / canvas1.height + y1 ]
}


function countIter(cx, cy, limit = iterLimit, pow = 6) {
    let x = cx, y = cy;  // первая итерация z = c
    for (let i = 0; i < limit; i++)
    {
        // ---- z2 = z**p + c
        let xs = x, ys = y;
        for (let p = pow; p > 1; p--) {
            [xs, ys] = [xs * x - ys * y, x * y + xs * ys];
        }
        x = xs + cx;
        y = ys + cy;
        // ------------------
        if ((x * x) + (y * y) > 4)
            return i
    }
    return limit;
}

// let iterLimit = 1000;
// for (let x = -2; x < 1; x += 0.1) {
//     console.log(countIter1(x, 0),  countIter(x, 0))
// }

