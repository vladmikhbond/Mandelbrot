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
    //
    iterText.value = iterLimit;
    colorSchemes[0].checked = true;

    draw();
}

function draw() {
    ctx.fillStyle = darkColor.value;
    ctx.fillRect(0, 0, canvas1.width, canvas1.height );

    for (let x = 0; x < canvas1.width; x += D) {
        for (let y = 0; y < canvas1.height; y += D) {
            let [wx, wy] = canvasToWorld(x, y);
            let count = countIter(wx, wy);
            if (count < iterLimit) {
                ctx.fillStyle = getColor(count);
                ctx.fillRect(x, y, D, D);
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

canvas1.addEventListener('mousemove', function (e) {
    let [wx, wy] = canvasToWorld(e.clientX, e.clientY);
    iter.innerHTML = countIter(wx, wy, 10000).toString();
});


resetButton.addEventListener('click', init);

colorSchemes[0].onclick = function() { getColor = getColor0; draw() };
colorSchemes[1].onclick = function() { getColor = getColor1; draw() };
colorSchemes[2].onclick = function() { getColor = getColor2; draw() };
colorSchemes[3].onclick = function() { getColor = getColor3; draw() };
colorSchemes[4].onclick = function() { getColor = getColor4; draw() };
colorSchemes[5].onclick = function() { getColor = getColor5; draw() };

darkColor.oninput = draw;
lightColor.oninput = draw;
thirdColor.oninput = function() {
    level = +("0x" + this.value.slice(1, 3));
    draw()
};

iterButton.addEventListener('click', function () {
    iterLimit = +iterText.value;
    draw();
});

// ---------------- Stack & Storage ----------------------

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
    let o = {"x1": x1, "x2": x2, "y1": y1, "y2": y2,
        "iterLimit": iterLimit, "stack": stack};
    localStorage.setItem("LAST", JSON.stringify(o));
}

function restoreFromStorage() {
    let str = localStorage.getItem("LAST");
    try {
        let o = JSON.parse(str);
        x1 = o.x1; x2 = o.x2; y1 = o.y1; y2 = o.y2;
        iterLimit = o.iterLimit;
        stack = o.stack;
        //
        iterText.value = iterLimit;
        colorSchemes[0].checked = true;
    }
    catch {}
}


// ---------------- Colors ----------------------

function getColor0() {
    return lightColor.value;
}

function getColor1(n) {
    const colors = ["red", "vermilion", "orange", "amber", "yellow",
        "chartreuse", "green", "teal", "blue", "violet", "purple", "magenta"];
    let i = (n % colors.length);
    return colors[i];
}

function getColor2(n) {
    const colors = [lightColor.value, thirdColor.value];
    let i = (n % colors.length);
    return colors[i];
}

let level = 64;

function getColor3(n) {
    let c = 256 + 2 * (n - iterLimit);
    if (c < level) c = level;
    return `rgb(${c}, ${level}, ${level})`;
}

function getColor4(n) {
    let c = 256 + 2 * (n - iterLimit);
    if (c < level) c = level;
    return `rgb(${level}, ${c}, ${level})`;
}

function getColor5(n) {
    let c = 256 + 2 * (n - iterLimit);
    if (c < level) c = level;
    return `rgb(${level}, ${level}, ${c})`;
}
