

const IT_LIMIT = 100; // iteration limit
const K = 10;         // scale change for one step

const canvas1 = document.getElementById("canvas1");
const ctx = canvas1.getContext("2d");

let x1 = -2, y1 = -1, x2 = 1, y2 = 1;
let d = 0.005;

draw();

// ========================================================================

canvas1.addEventListener('mousemove', function (e)
{
    let [x, y] = fromCanvas(e.clientX, e.clientY);
    document.getElementById("info").innerHTML =
        `x=${x} <br/> y=${y} <br/> d=${d} <br/> it=${countIter(x, y, 1000)} `;
});


canvas1.addEventListener('click', function (e) {
    let [x, y] = fromCanvas(e.clientX, e.clientY);
    let dx = (x2 - x1) / K;
    let dy = (y2 - y1) / K;

    x1 = x - dx / 2;
    x2 = x + dx / 2;
    y1 = y - dy / 2;
    y2 = y + dy / 2;
    d /= K;

    draw();
});

function fromCanvas(canvasX, canvasY) {
    return [
        canvasX * (x2 - x1) / canvas1.width + x1,
        canvasY * (y2 - y1) / canvas1.height + y1 ]
}

function draw() {
    ctx.clearRect(0, 0, canvas1.width, canvas1.height );
    ctx.save();

    ctx.scale(canvas1.width /(x2 - x1), canvas1.height /(y2 - y1) );
    ctx.translate(-x1, -y1);

    for (let x = x1; x < x2; x += d) {
        for (let y = y1; y < y2; y += d) {
            let i = countIter(x, y);
            if (i === IT_LIMIT)
                ctx.fillRect(x, y, d, d);
        }
    }
    ctx.restore();
}


function countIter(x, y, limit = IT_LIMIT) {
    // Zn = Zn * Zn + c
    let cx = x, cy = y;
    for (let i = 0; i < limit; i++)
    {
        [x, y] = [x * x - y * y + cx, 2 * x * y + cy];
        if ((x * x) + (y * y) > 4)
            return i
    }
    return limit;
}
