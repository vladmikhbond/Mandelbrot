const canvas1 = document.getElementById("canvas1");
const iterText = document.getElementById("iterText");
const themes = document.getElementsByName("themes");
const info = document.getElementById("info");
const iter = document.getElementById("iter");
const iterButton = document.getElementById("iterButton");
const resetButton = document.getElementById("resetButton");
const darkColor = document.getElementById("darkColor");
const lightColor = document.getElementById("lightColor");
const thirdColor = document.getElementById("thirdColor");

const D = 1;      // canvas pixel
const K = 2;      // scale change for one step
const ctx = canvas1.getContext("2d");

let x1, x2, y1, y2;
let iterLimit;
let stack;
let themeIdx;



function init() {
    x1 = -2; y1 = -1; x2 = 1; y2 = 1;
    stack = [];
    iterLimit = 100;
    themeIdx = 0;
    // UI
    themes[0].checked = true;
    iterText.value = iterLimit;
}

function draw() {
    let getColor = themeColors[themeIdx];
    ctx.fillStyle = darkColor.value;
    ctx.fillRect(0, 0, canvas1.width, canvas1.height );
    let low = minIter();
    for (let x = 0; x < canvas1.width; x += D) {
        for (let y = 0; y < canvas1.height; y += D) {
            let [wx, wy] = canvasToWorld(x, y);
            let count = countIter(wx, wy);
            if (count < iterLimit) {
                ctx.fillStyle = getColor(count, low);
                ctx.fillRect(x, y, D, D);
            }
        }
    }
    drawInfo();
    // -----------------
    function minIter() {
        let res = Number.MAX_VALUE;
        const d = D * 50;
        for (let x = 0; x < canvas1.width; x += d) {
            for (let y = 0; y < canvas1.height; y += d) {
                let [wx, wy] = canvasToWorld(x, y);
                let count = countIter(wx, wy);
                if (count < res)
                    res = count;
            }
        }
        return res
    }

    function drawInfo() {
        info.innerHTML = (K**stack.length < 1000) ?
            `M = 1:${K**stack.length}` :
            `M = 1:${K}<sup>${stack.length}</sup>`;
    }
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
    //
    let [x, y] = canvasToWorld(e.clientX, e.clientY);
    let dx = (x2 - x1) / K;
    let dy = (y2 - y1) / K;
    x1 = x - dx / 2;
    x2 = x + dx / 2;
    y1 = y - dy / 2;
    y2 = y + dy / 2;
    //
    draw();
});

canvas1.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    restore();
    saveToStorage();
    draw();
});

canvas1.addEventListener('mousemove', function (e) {
    const infinity = 10000;
    let [wx, wy] = canvasToWorld(e.clientX, e.clientY);
    let n = countIter(wx, wy, infinity);
    iter.innerHTML = n === infinity ? "∞" : n.toString();
});


resetButton.onclick = function() { init(); draw() };

iterButton.addEventListener('click', function () {
    iterLimit = +iterText.value;
    draw();
});

for (let i = 0; i < themes.length; i++)
    themes[i].onclick = function() { themeIdx = i; draw() };

darkColor.oninput = draw;
lightColor.oninput = draw;
thirdColor.oninput = draw;

// ---------------- Stack & Storage ----------------------

function save() {
    let o = {x1, x2, y1, y2, iterLimit, themeIdx,
        "colors": [darkColor.value, lightColor.value, thirdColor.value] };
    stack.push(o);
}

function restore() {
    if (stack.length < 1)
        return;
    let o = stack.pop();
    x1 = o.x1; x2 = o.x2; y1 = o.y1; y2 = o.y2;
    iterLimit = o.iterLimit;
    themeIdx = o.themeIdx;
    // UI
    iterText.value = iterLimit;
    themes[o.themeIdx].checked = true;
    darkColor.value = o.colors[0];
    lightColor.value = o.colors[1];
    thirdColor.value = o.colors[2];
}


function saveToStorage() {
    localStorage.setItem("STACK", JSON.stringify(stack));
}

function restoreFromStorage() {
    let str = localStorage.getItem("STACK");
    if (!str) {
        init();
        return
    }
    stack = [];
    try {
        stack = JSON.parse(str);
        restore()
    } catch {
        init()
    }
}

// ---------------- Themes ----------------------

const themeColors = [blackWhite, fair, zebra, threeColors];

function blackWhite(n) {
    return n === iterLimit ? "black" : "white";
}

function fair(n) {
    const colors = ["red", "vermilion", "orange", "amber", "yellow",
        "chartreuse", "green", "teal", "blue", "violet", "purple", "magenta"];
    let i = (n % colors.length);
    return colors[i];
}

function zebra(n) {
    const colors = [lightColor.value, thirdColor.value];
    return colors[n % 2];
}

function threeColors(n, n0)
{
    let k = (n - n0) / (iterLimit - n0);
    let r1 = parseInt((lightColor.value.substr(1, 2)), 16);
    let g1 = parseInt((lightColor.value.substr(3, 2)), 16);
    let b1 = parseInt((lightColor.value.substr(5, 2)), 16);
    let r2 = parseInt((thirdColor.value.substr(1, 2)), 16);
    let g2 = parseInt((thirdColor.value.substr(3, 2)), 16);
    let b2 = parseInt((thirdColor.value.substr(5, 2)), 16);
    let r = (r1 * k + r2 * (1 - k)) | 0;
    let g = (g1 * k + g2 * (1 - k)) | 0;
    let b = (b1 * k + b2 * (1 - k)) | 0;
    return `rgb(${r}, ${g}, ${b})`;
}

//================ Main =====================

restoreFromStorage();
draw();

