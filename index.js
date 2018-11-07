const canvas1 = document.getElementById("canvas1");
const iterText = document.getElementById("iterText");
const themes = document.getElementsByName("themes");
const info = document.getElementById("info");
const iter = document.getElementById("iter");
const resetButton = document.getElementById("resetButton");
const exportButton = document.getElementById("exportButton");
const importButton = document.getElementById("importButton");
const exportText = document.getElementById("exportText");
const darkColor = document.getElementById("darkColor");
const lightColor = document.getElementById("lightColor");
const thirdColor = document.getElementById("thirdColor");
const power = document.getElementById("power");

const D = 1;      // canvas pixel
const K = 2;      // scale change for one step
const ctx = canvas1.getContext("2d");

let pow = 2;
let x1, x2, y1, y2;
let iterLimit;
let stack = [];
let themeIdx;

// ----------- Canvas events --------------------------

canvas1.addEventListener('click', function (e) {
    save();
    saveToStorage();
    //
    let [x, y] = canvasToWorld(e.clientX - canvas1.offsetLeft, e.clientY - canvas1.offsetTop);
    let xSize = (x2 - x1) / K;
    let ySize = (y2 - y1) / K;
    x1 = x - xSize / 2;
    x2 = x + xSize / 2;
    y1 = y - ySize / 2;
    y2 = y + ySize / 2;
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
    let [wx, wy] = canvasToWorld(e.clientX - canvas1.offsetLeft, e.clientY - canvas1.offsetTop);
    let n = countIter(wx, wy, infinity);
    iter.innerHTML = n === infinity ? "∞" : n.toString();
});

// ----------- Button events --------------------------

exportButton.onclick = function() {
    if (!exportText.style.display) {
        let o = stack[stack.length - 1];
        o.stackLength = stack.length;
        exportText.value = JSON.stringify(o);
        exportText.style.display = "inline-block";
    } else {
        exportText.style.display = "";
    }
};

importButton.onclick = function() {
    if (exportText.style.display) {  // visible text
        try {
            let o = JSON.parse(exportText.value);
            stack = [];
            for (let i = 0; i < o.stackLength; i++)
                stack.push(o);
            restore();
            draw();
            exportText.style.display = "";
        } catch (e) {
            alert ("Wrong data");
        }
    } else {
        exportText.style.display = "inline-block";
        exportText.value = "";
    }
};

resetButton.onclick = function() {
    init();
    draw();
    save();
    saveToStorage();

};

iterText.addEventListener('keydown', function (e) {
    if (e.key === "Enter" && (+iterText.value)) {
        iterLimit = +iterText.value;
        draw();
    }
});

power.addEventListener('click', function () {
    pow = (pow + 1) % 10;
    draw();
    power.innerHTML = `Z<sup>${pow}</sup> + C`;
});

// ----------- Color events --------------------------

for (let i = 0; i < themes.length; i++)
    themes[i].onclick = function() { themeIdx = i; draw() };

darkColor.oninput = draw;
lightColor.oninput = draw;
thirdColor.oninput = draw;


//================ Main =====================

function init() {
    x1 = -2; y1 = -1; x2 = 1; y2 = 1;
    stack = [];
    iterLimit = 20;
    themeIdx = 0;
    // UI
    themes[0].checked = true;
    iterText.value = iterLimit;
}

restoreFromStorage();
draw();

// sample picture
// {"x1":-0.741962890625,"x2":-0.739033203125,"y1":-0.184375,"y2":-0.182421875,"iterLimit":400,"themeIdx":0,"colors":["#000000","#ffffff","#ffffff"],"stackLength":12}