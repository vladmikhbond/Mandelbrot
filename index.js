

let x1 = -2, y1 = -1, x2 = 1, y2 = 1;
let d = 0.005;
const IT = 40;

const canvas1 = document.getElementById("canvas1");
const ctx = canvas1.getContext("2d");
const size = canvas1.width;


ctx.scale(canvas1.width /(x2 - x1), canvas1.height /(y2 - y1) );
ctx.translate(-x1, -y1);

for (let x = x1; x < x2; x += d) {
    for (let y = y1; y < y2; y += d) {
       let i = nextIter(x, y);
       if (i == IT)
           ctx.fillRect(x, y, d, d);
    }
}


function nextIter(x, y) {
    // Zn = Zn * Zn + c
    let cx = x, cy = y;
    for (let i = 0; i < IT; i++)
    {
        [x, y] = [x * x - y * y + cx, 2 * x * y + cy];
        if ((x * x) + (y * y) > 4)
            return i
    }
    return IT;
}