// ---------------- Themes ----------------------

const themeColors = [blackWhite, fair, zebra, threeColors];

function blackWhite() {
    return lightColor.value;
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
