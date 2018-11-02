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

    // ---------- inner functions ---------
    // приблизительное определение наименьшей глубины итерации в изображении
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
