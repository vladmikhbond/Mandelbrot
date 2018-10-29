const canvas1 = document.getElementById("canvas1");
const iterText = document.getElementById("iterText");
const colorSchemes = document.getElementsByName("colorSchemes");
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
let getColor;
//
init();
restoreFromStorage();
draw();

function init() {
    x1 = -2; y1 = -1; x2 = 1; y2 = 1;
    iterLimit = +iterText.value;
    stack = [];
    getColor = getColor0;
    iterLimit = 100;
    // UI
    iterText.value = iterLimit;
    colorSchemes[0].checked = true;

    draw();
}

function draw() {
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
    saveToStorage();
    draw();
});

canvas1.addEventListener('mousemove', function (e) {
    const INFIN = 10000;
    let [wx, wy] = canvasToWorld(e.clientX, e.clientY);
    let n = countIter(wx, wy, INFIN);
    iter.innerHTML = n === INFIN ? "∞" : n.toString();
});


resetButton.addEventListener('click', init);

colorSchemes[0].onclick = function() { getColor = getColor0; draw() };
colorSchemes[1].onclick = function() { getColor = getColor1; draw() };
colorSchemes[2].onclick = function() { getColor = getColor2; draw() };
colorSchemes[3].onclick = function() { getColor = getColor3; draw() };

darkColor.oninput = draw;
lightColor.oninput = draw;
thirdColor.oninput = draw;

iterButton.addEventListener('click', function () {
    iterLimit = +iterText.value;
    draw();
});

// ---------------- Stack & Storage ----------------------

function save() {
    let i = 0;
    for (; i < colorSchemes.length; i++)
        if (colorSchemes[i].checked)
            break;
    let o = {x1, x2, y1, y2, iterLimit, "colorSchemeIdx": i,
        "colors": [darkColor.value, lightColor.value, thirdColor.value] };
    stack.push(o);
}

function restore() {
    if (stack.length < 1)
        return;
    let o = stack.pop();
    x1 = o.x1; x2 = o.x2; y1 = o.y1; y2 = o.y2;
    iterLimit = o.iterLimit;
    iterText.value = iterLimit;
    colorSchemes[o.colorSchemeIdx].checked = true;
    darkColor.value = o.colors[0];
    lightColor.value = o.colors[1];
    thirdColor.value = o.colors[2];
}


function saveToStorage() {
    localStorage.setItem("STACK", JSON.stringify(stack));
}

function restoreFromStorage() {
    let str = localStorage.getItem("STACK");
    if (!str) return;

    stack = [];
    try {
        stack = JSON.parse(str);
        restore();
    } catch {}
}


// ---------------- Colors ----------------------

function getColor0(n) {
    return n === iterLimit ? "black" : "white";
}

function getColor1(n) {
    const colors = ["red", "vermilion", "orange", "amber", "yellow",
        "chartreuse", "green", "teal", "blue", "violet", "purple", "magenta"];
    let i = (n % colors.length);
    return colors[i];
}

function getColor2(n) {
    const colors = [lightColor.value, thirdColor.value];
    return colors[n % 2];
}

function getColor3(n, n0)
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

