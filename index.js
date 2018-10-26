

const K = 10;         // scale change for one step

// let iterButton = document.getElementById("iterButton");
// const canvas1 = document.getElementById("canvas1");
const ctx = canvas1.getContext("2d");

let x1 = -2, y1 = -1, x2 = 1, y2 = 1;
let d = 1   ;
let iterLimit = +iterText.value;
const stack = [];

draw();

// ---------------------- kernel --------------------------------

function draw() {
    ctx.clearRect(0, 0, canvas1.width, canvas1.height );

    for (let x = 0; x < canvas1.width; x += d) {
        for (let y = 0; y < canvas1.height; y += d) {
            let [wx, wy] = canvasToWorld(x, y);
            let i = countIter(wx, wy);
            if (i === iterLimit)
                ctx.fillRect(x, y, d, d);
        }
    }
    // info
    info.innerHTML = `M = 1:${K ** stack.length}`;

}

// Zn = Zn * Zn + c;
// Zo = 0; c = {x, y}
function countIter(x, y, limit = iterLimit) {
    let cx = x, cy = y;
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

// ----------- event handlers --------------------------

canvas1.addEventListener('click', function (e) {
    save();

    let [x, y] = canvasToWorld(e.clientX, e.clientY);
    let dx = (x2 - x1) / K;
    let dy = (y2 - y1) / K;
    x1 = x - dx / 2;
    x2 = x + dx / 2;
    y1 = y - dy / 2;
    y2 = y + dy / 2;

    draw();
});


iterButton.addEventListener('click', function () {
    iterLimit = +iterText.value;
    draw();
});

backButton.addEventListener('click', function () {
    restore();
    iterText.value = iterLimit;
    draw();
});

// canvas1.addEventListener('mousemove', function (e)
// {
//     let [x, y] = canvasToWorld(e.clientX, e.clientY);
// });

// ---------------- Stack ----------------------

function save() {
    stack.push({"x1": x1, "x2": x2, "y1": y1, "y2": y2, "iterLimit":iterLimit });
}

function restore() {
    if (stack.length < 1) return;
    let o = stack.pop();
    x1 = o.x1; x2 = o.x2; y1 = o.y1; y2 = o.y2; iterLimit = o.iterLimit;
}

