let canvas1 = document.getElementById("canvas1");
let iterText = document.getElementById("iterText");
let colorSchemes = document.getElementsByName("colorSchemes");
let info = document.getElementById("info");
let iter = document.getElementById("iter");
let iterButton = document.getElementById("iterButton");

const K = 2;         // scale change for one step

const ctx = canvas1.getContext("2d");

let x1 = -2, y1 = -1, x2 = 1, y2 = 1;
let d = 1;
let iterLimit = +iterText.value;
const stack = [];
let getColor = getColor0;

restoreFromStorage();
draw();

// ---------------------- Drawing --------------------------------

function draw() {
    ctx.fillStyle = "black";
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
    drawInfo();

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


function canvasToWorld(canvasX, canvasY) {
    return [
        canvasX * (x2 - x1) / canvas1.width + x1,
        canvasY * (y2 - y1) / canvas1.height + y1 ]
}

// ----------- Event handlers --------------------------

canvas1.addEventListener('click', function (e) {
    save();
    saveToStorage();

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


canvas1.addEventListener('mousemove', function (e) {
    let [wx, wy] = canvasToWorld(e.clientX, e.clientY);
    iter.innerHTML = countIter(wx, wy, 10000).toString();
});


colorSchemes[0].onclick = function() { getColor = getColor0; draw() };
colorSchemes[1].onclick = function() { getColor = getColor1; draw() };
colorSchemes[2].onclick = function() { getColor = getColor2; draw() };
colorSchemes[3].onclick = function() { getColor = getColor3; draw() };



// ---------------- Stack ----------------------

function save() {
    let o = {"x1": x1, "x2": x2, "y1": y1, "y2": y2, "iterLimit":iterLimit };
    stack.push(o);
}

function restore() {
    if (stack.length < 1) return;
    let o = stack.pop();
    x1 = o.x1; x2 = o.x2; y1 = o.y1; y2 = o.y2; iterLimit = o.iterLimit;
}

function saveToStorage() {
    let o = {"x1": x1, "x2": x2, "y1": y1, "y2": y2, "iterLimit":iterLimit };
    localStorage.setItem("LAST", o);
}

function restoreFromStorage() {
    let str = localStorage.getItem("LAST");

    if (!str) return;
    let o = JSON.parse(str);
    x1 = o.x1; x2 = o.x2; y1 = o.y1; y2 = o.y2; iterLimit = o.iterLimit;
}


// ---------------- Colors ----------------------

function getColor0(n) {
    return "aqua";
}

function getColor1(n) {
    const colors = ["red", "vermilion", "orange", "amber", "yellow",
        "chartreuse", "green", "teal", "blue", "violet", "purple", "magenta"];
    let i = (n % colors.length);
    return colors[i];
}

function getColor2(n) {
    const colors = ["red", "yellow"];
    let i = (n % colors.length);
    return colors[i];
}

function getColor3(n) {
    let c = 256 + (n - iterLimit);
    if (c < 0) c = 0;
    return `rgb(${128}, ${c}, ${128})`;
}
