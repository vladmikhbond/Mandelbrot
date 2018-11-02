// ---------------- Stack ----------------------

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

// ---------------- Storage ----------------------

function saveToStorage() {
    localStorage.setItem("STACK", JSON.stringify(stack));
}

function restoreFromStorage() {
    let str = localStorage.getItem("STACK");
    if (!str) {
        init();
        return
    }
    try {
        stack = JSON.parse(str);
        restore()
    } catch {
        init()
    }
}
