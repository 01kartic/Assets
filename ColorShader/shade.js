// JS for Choosen Color 
// Event listener for the hue slider input
document.getElementById("hue-slider").addEventListener("input", updateColorShades);

// Update color shades based on the selected hue
function updateColorShades() {
    updateSelectedHueIndicator(document.getElementById("hue-slider").value);

    const selectedColor = calculateColor(document.getElementById("hue-slider").value);
    updateSelectedColor(selectedColor);

    generateColorShades(document.getElementById("hue-slider").value);
}

// Calculate color based on hue value
function calculateColor(hue) {
    const hueDegrees = hue * 3.6;
    const rgb = hslToRgb(hueDegrees, 100, 50);
    const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
    return hex;
}

// Convert HSL to RGB
function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Convert RGB to Hex
function rgbToHex(r, g, b) {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

// Generate color shades and display them
function generateColorShades(hue) {
    document.getElementById("color-shades").innerHTML = "";

    const numShades = 100;

    for (let i = 0; i < numShades; i++) {
        const lightness = (i + 1) * 1;
        const shadeColor = calculateColorShade(hue, lightness);

        const shadeDiv = document.createElement("div");
        shadeDiv.className = "shadeColor";
        shadeDiv.style.backgroundColor = shadeColor;
        shadeDiv.addEventListener("click", () => {
            addToColorPanel(shadeColor);
        });

        document.getElementById("color-shades").appendChild(shadeDiv);
    }
}

// Update selected hue indicator position
function updateSelectedHueIndicator(hue) {
    const indicatorPosition = (hue / 1000) * document.getElementById("hue-slider").clientWidth;
    document.getElementById("selected-hue").style.left = `${indicatorPosition}px`;
}

// Update selected color preview and code
function updateSelectedColor(hexColor) {
    document.getElementById("selected-color-preview").style.backgroundColor = hexColor;
    document.documentElement.style.setProperty('--slider-thumb-color', hexColor);
    document.getElementById("selected-color-code").value = hexColor;
}

// Add selected shade color to the color panel
function addToColorPanel(shadeColor) {
    document.getElementById("color").style.backgroundColor = shadeColor;
    document.getElementById("hexCode").value = shadeColor;
    document.getElementById("hexCodeCopy").addEventListener("click", () => {
        document.getElementById("hexCode").select();
        document.execCommand("copy");

        parent.postMessage({ pluginMessage: { type: 'copied', text: document.getElementById("hexCode").value } }, '*');
    });
}

function addToCanvas() {
    parent.postMessage({ pluginMessage: { type: 'addToCanvas', text: document.getElementById("hexCode").value, value: hexToRgb(document.getElementById("hexCode").value) } }, '*');
}

// Calculate color shade based on hue and lightness
function calculateColorShade(hue, lightness) {
    const hueDegrees = hue * 3.6;
    const rgb = hslToRgb(hueDegrees, 100, lightness);
    const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
    return hex;
}

function hexToRgb(hex) {
    // Remove the hash character if present
    hex = hex.replace(/^#/, '');

    // Parse the hex values
    const bigint = parseInt(hex, 16);

    // Extract RGB values
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;

    // Return an RGB object
    return { r, g, b };
}



// JS for Using Hex 
document.getElementById("selected-color-code2").addEventListener("click", () => {
    document.getElementById("selected-color-code2").select();
});

document.getElementById("selected-color-code2").addEventListener("input", (e) => {
    const hexColor = e.target.value;
    if (validateHexColor(hexColor)) {
        updateSelectedColor2(hexColor);
        generateColorShades2(hexColor);
    }
});

function validateHexColor(hex) {
    //if hex code not found in start then add it
    if (hex.charAt(0) !== "#") {
        hex = "#" + hex;
    }
    return /^#[0-9A-F]{6}$/i.test(hex);
}

function updateSelectedColor2(hexColor) {
    document.getElementById("selected-color-preview2").style.backgroundColor = hexColor;
    document.documentElement.style.setProperty('--slider-thumb-color', hexColor);
    document.getElementById("selected-color-code2").value = hexColor;
}

function generateColorShades2(hex) {
    document.getElementById("color-shades2").innerHTML = "";

    const numShades = 100;

    for (let i = 0; i < numShades; i++) {
        const lightness = (i + 1) * 1;
        const shadeColor = calculateColorShade2(hex, lightness);

        const shadeDiv = document.createElement("div");
        shadeDiv.className = "shadeColor";
        shadeDiv.style.backgroundColor = shadeColor;
        shadeDiv.addEventListener("click", () => {
            addToColorPanel2(shadeColor);
        });

        document.getElementById("color-shades2").appendChild(shadeDiv);
    }
}

function calculateColorShade2(hex, lightness) {
    const rgb = hexToRgb2(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl[2] = lightness / 100;
    const newRgb = hslToRgb2(hsl[0], hsl[1], hsl[2]);
    return rgbToHex2(newRgb[0], newRgb[1], newRgb[2]);
}

function hexToRgb2(hex) {
    // Remove the hash character if present
    hex = hex.replace(/^#/, '');

    // Parse the hex values
    const bigint = parseInt(hex, 16);

    // Extract RGB values
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    // Return an RGB object
    return { r, g, b };
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

function hslToRgb2(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex2(r, g, b) {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function addToColorPanel2(shadeColor) {
    document.getElementById("color2").style.backgroundColor = shadeColor;
    document.getElementById("hexCode2").value = shadeColor;
    document.getElementById("hexCodeCopy2").addEventListener("click", () => {
        document.getElementById("hexCode2").select();
        document.execCommand("copy");

        parent.postMessage({ pluginMessage: { type: 'copied', text: document.getElementById("hexCode2").value } }, '*');
    });
}

function addToCanvas2() {
    parent.postMessage({ pluginMessage: { type: 'addToCanvas', text: document.getElementById("hexCode2").value, value: hexToRgb2(document.getElementById("hexCode2").value) } }, '*');
}

function refresh() {
    document.getElementById("selected-color-code2").value = "#000000";
    updateSelectedColor2("#000000");
    generateColorShades2("#000000");
}

window.addEventListener("load", () => generateColorShades2("#000000"));

function hexToRgb2(hex) {
    // Remove the hash character if present
    hex = hex.replace(/^#/, '');

    // Parse the hex values
    const bigint = parseInt(hex, 16);

    // Extract RGB values
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;

    // Return an RGB object
    return { r, g, b };
}

document.getElementById("hexCodeCopy").addEventListener("click", () => {
    document.getElementById("hexCode").select();
    document.execCommand("copy");

    parent.postMessage({ pluginMessage: { type: 'copied', text: document.getElementById("hexCode").value } }, '*');
});



// JS for Color Gallery
const alternateOfWhiteHex = ["#ff0000", "#00ff00", "#0000ff"];
const alternateOfWhiteName = ["Red", "Green", "Blue"];

const alternateOfBlackHex = ["#ff5600", "#00ff66", "#0140ff", "#463245", "#653211", "#312654"];
const alternateOfBlackName = ["hf", "fhf", "gfhy", "gfh", "gfh", "gfh"];

const gallery = document.getElementById("gallery");

window.addEventListener("load", () => {
    createPart("Alternate of White", alternateOfWhiteHex, alternateOfWhiteName);
    createPart("Alternate of Black", alternateOfBlackHex, alternateOfBlackName);
});


function createPart(headingName, hexCode, colorName) {
    const divPart = document.createElement('div');
    divPart.classList.add('part', 'm-0', 'p-0');

    const heading = document.createElement('h6');
    heading.classList.add('px-3', 'py-3', 'mb-0');
    heading.textContent = headingName;

    const divColors = document.createElement('div');
    divColors.classList.add('colors', 'border-top', 'border-bottom');
    if (hexCode.length > 4) {
        divColors.style.height = "168px";
    } else {
        divColors.style.height = "160px";
    }

    for (let i = 0; i < hexCode.length; i++) {
        const divColor = document.createElement('div');
        divColor.classList.add('color');
        divColor.style.backgroundColor = hexCode[i];

        const divDetails = document.createElement('div');
        divDetails.classList.add('details');

        const divInputGroup1 = document.createElement('div');
        divInputGroup1.classList.add('input-group', 'border-bottom');

        const input1 = document.createElement('input');
        input1.classList.add('form-control', 'rounded-0', 'border-0');
        input1.value = colorName[i];
        input1.readOnly = true;

        const span1 = document.createElement('span');
        span1.classList.add('btn', 'btn-primary', 'input-group-text', 'add', 'px-2', 'rounded-0', 'border-0', 'border-start');
        span1.title = 'Add to canvas';
        span1.addEventListener("click", () => {
            parent.postMessage({ pluginMessage: { type: 'addToCanvas', text: colorName[i] + ' - ' + hexCode[i], value: hexToRgb(hexCode[i]) } }, '*');
        });

        const divInputGroup2 = document.createElement('div');
        divInputGroup2.classList.add('input-group');

        const input2 = document.createElement('input');
        input2.classList.add('form-control', 'rounded-0', 'border-0');
        input2.value = hexCode[i];
        input2.readOnly = true;

        const span2 = document.createElement('span');
        span2.classList.add('btn', 'btn-primary', 'input-group-text', 'copyCode', 'px-2', 'rounded-0', 'border-0', 'border-start');
        span2.addEventListener("click", () => {
            input2.select();
            document.execCommand("copy");

            parent.postMessage({ pluginMessage: { type: 'copied', text: hexCode[i] } }, '*');
        });

        divInputGroup1.appendChild(input1);
        divInputGroup1.appendChild(span1);

        divInputGroup2.appendChild(input2);
        divInputGroup2.appendChild(span2);

        divDetails.appendChild(divInputGroup1);
        divDetails.appendChild(divInputGroup2);

        divColor.appendChild(divDetails);

        divColors.appendChild(divColor);
    }

    divPart.appendChild(heading);
    divPart.appendChild(divColors);

    gallery.appendChild(divPart);
}


// JS for About

window.addEventListener("load", () => {
    document.getElementById("about").innerHTML = `
        <div class='card bg-transparent figma-text border-dashed m-5 px-5 py-4 rounded-5 text-center'>
            <img src='https://01kartic.github.io/Assets/Images/ColorShader.png' alt='Color Shader Logo' width='64'
                class='mx-auto my-3'>
            <p class='mb-2'>Contribute colors in our <strong>Color Gallery</strong>.</p>
            <p>Share your Color Colloection with us and help us to improove the Gallery.</p>
            <a href='' class='btn btn-primary px-2 rounded-pill w-33 py-2 m-auto' target='_blank'>Contribute Here</a>
        </div>

        <div class='mx-5'>
            <h3 class='mb-3'>About</h3>
            <p class='mb-1'>-&nbsp; Elevate your design process with the Figma Color Shader Plugin.</p>
            <p class='mb-1'>-&nbsp; Seamlessly navigate the spectrum, effortlessly generating vibrant color Shades.</p>
            <p class='mb-1'>-&nbsp; Unleash creativity and streamline your workflow.</p>
            <p class='mb-1'>-&nbsp; It has features which provide you to create shade with <b>Choosing Color</b>, <b>with Hex
                    code</b> or you can use <b>Color Gallery</b>.</p>
            <h3 class='mt-5 mb-3'>How to use ??</h3>
            <ol>
                <li>
                    <b>Choosing Color</b><br />
                    <p class='mb-1'>-&nbsp; Use the slider to choose the color and click on the shade which you want to see & add
                        it to the <b>Color Panel</b>.</p>
                    <p>-&nbsp; From <b>Color Panel</b> you can either <b>Copy Hex code</b> or direct <b>Add color to
                            Canvas</b>(One shape that filled with that color).</p>
                </li>
                <li>
                    <b>Using Hex code</b><br />
                    <p class='mb-1'>-&nbsp; Enter the Hex code and click on the shade which you want see & add it to the <b>Color
                            Panel</b>.</p>
                    <p>-&nbsp; From <b>Color Panel</b> you can either <b>Copy Hex code</b> or direct <b>Add color to
                            Canvas</b>(One shape that filled with that color).</p>
                </li>
                <li>
                    <b>Color Gallery</b><br />
                    <p class='mb-1'>-&nbsp; From the <b>Gallery</b> hover on color which you want & see Name of that Color & Hex
                        code.</p>
                    <p>-&nbsp; you can either <b>Copy Hex code</b> or direct <b>Add color to Canvas</b>(One shape that filled with
                        that color).</p>
                </li>
            </ol>
        </div>

        <div class='text-center my-3 py-5'>
            <h1 class='Honk'>Thank you for using !!</h1>
        </div>
        `;
});