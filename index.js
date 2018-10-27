const K = 2;         // scale change for one step

const ctx = canvas1.getContext("2d");

let x1 = -2, y1 = -1, x2 = 1, y2 = 1;
let d = 1;
let iterLimit = +iterText.value;
const stack = [];
const colors = ["red", "vermilion", "orange", "amber", "yellow",
    "chartreuse", "green", "teal", "blue", "violet", "purple", "magenta"];

draw();

// ---------------------- Drawing --------------------------------

function draw() {
    if (colorCheck.checked)
        drawColor();
    else
        drawBW();
    drawInfo();
}

function drawColor() {
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas1.width, canvas1.height );

    for (let x = 0; x < canvas1.width; x += d) {
        for (let y = 0; y < canvas1.height; y += d) {
            let [wx, wy] = canvasToWorld(x, y);
            let count = countIter(wx, wy);
            if (count < iterLimit) {
                ctx.fillStyle = getColor(count);
                ctx.fillRect(x, y, d, d);
            }
        }
    }
}

function drawBW() {
    ctx.fillStyle = "black";
    ctx.clearRect(0, 0, canvas1.width, canvas1.height );

    for (let x = 0; x < canvas1.width; x += d) {
        for (let y = 0; y < canvas1.height; y += d) {
            let [wx, wy] = canvasToWorld(x, y);
            if (countIter(wx, wy) === iterLimit) {
                ctx.fillRect(x, y, d, d);
            }
        }
    }
}

function drawInfo() {
    info.innerHTML = (K**stack.length < 1000) ?
        `M = 1:${K**stack.length}` :
        `M = 1:${K}<sup>${stack.length}</sup>`;
}

// ---------------------- Math --------------------------------

// Zn = Zn * Zn + c;
// Zo = 0; c = {x, y}
function countIter(cx, cy, limit = iterLimit) {
    let x = cx, y = cy;
    for (let i = 0; i < limit; i++)
    {
        [x, y] = [x * x - y * y + cx, 2 * x * y + cy];
        if ((x * x) + (y * y) > 4)
            return i
    }
    return limit;
}
// function countIter(x, y, limit = iterLimit) {
//     let cx = x, cy = y;
//     for (let i = 0; i < limit; i++)
//     {
//         [x, y] = [x * x - y * y + cx, 2 * x * y + cy];
//         if ((x * x) + (y * y) > 4)
//             return i
//     }
//     return limit;
// }


function canvasToWorld(canvasX, canvasY) {
    return [
        canvasX * (x2 - x1) / canvas1.width + x1,
        canvasY * (y2 - y1) / canvas1.height + y1 ]
}

// ----------- Event handlers --------------------------

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

canvas1.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    restore();
    iterText.value = iterLimit;
    draw();
});

iterButton.addEventListener('click', function () {
    iterLimit = +iterText.value;
    draw();
});

colorCheck.addEventListener('click', draw);


canvas1.addEventListener('mousemove', function (e) {
    let [wx, wy] = canvasToWorld(e.clientX, e.clientY);
    iter.innerHTML = countIter(wx, wy, 10000);
});

// ---------------- Stack ----------------------

function save() {
    stack.push({"x1": x1, "x2": x2, "y1": y1, "y2": y2, "iterLimit":iterLimit });
}

function restore() {
    if (stack.length < 1) return;
    let o = stack.pop();
    x1 = o.x1; x2 = o.x2; y1 = o.y1; y2 = o.y2; iterLimit = o.iterLimit;
}

// ---------------- Colors ----------------------

function getColor(n) {
    let i = (n % colors.length);
    return colors[i];
}
