let vertSrc = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;
void main() {
    vTexCoord = aTexCoord;
    gl_Position = vec4(aPosition, 1.0);
}`;

let theShader;
let editor;
let imgs = [];
let isDragging = false;

function setup() {
    suppressConsoleWarnings();
    setupEditor();
    setupSelector();
    setupCanvas();
    setupResizer();
    setupMediaLoader();
    setInterval(loadCurrentShader, 500);
}

function suppressConsoleWarnings() {
    console.warn = () => {};
    console.error = msg => {
        if (!msg.includes('Shader error:')) {
            document.getElementById('log').textContent = msg;
        }
    };
}

function setupSelector(){
    let selector = document.getElementById('examples-bar');
    selector.addEventListener('change', event => {
        let example = event.target.value;
        switch (example) {
            case 'Mandelbrot':
                editor.setValue(mandelbrotFrag);
                break;
            case 'Gradient':
                editor.setValue(gradientFrag);
                break;
            case 'Moving Gear':
                editor.setValue(gearFrag);
                break;
            case 'Wavy Italian Flag':
                editor.setValue(flagFrag);
                break;
            case 'Voronoi':
                editor.setValue(voronoiFrag);
                break;
        }
    })
}

function setupCanvas() {
    let canvas = createCanvas(windowWidth / 2, windowHeight, WEBGL);
    canvas.parent('canvas-container');
    noStroke();
}

function setupEditor() {
    editor = CodeMirror(document.getElementById('editor'), {
        value: mandelbrotFrag,
        mode: 'x-shader/x-fragment',
        lineNumbers: true,
        lineWrapping: true,
        indentUnit: 4,
        theme: 'default'
    });
}

function setupResizer() {
    const resizer = document.getElementById('resizer');
    const leftCol = document.getElementById('left-column');
    const rightCol = document.getElementById('canvas-container');

    resizer.addEventListener('mousedown', () => {
        isDragging = true;
        document.body.style.cursor = 'ew-resize';
    });

    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        let newLeftWidth = e.clientX;
        leftCol.style.width = `${newLeftWidth}px`;
        rightCol.style.width = `${window.innerWidth - newLeftWidth - resizer.offsetWidth}px`;
        resizeCanvas(rightCol.clientWidth, window.innerHeight);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.cursor = '';
    });
}

function setupMediaLoader() {
    const input = document.getElementById('media-loader');
    input.addEventListener('change', event => {
        Array.from(event.target.files).forEach(loadMediaFile);
        input.value = ''; // reset
    });
}

function loadMediaFile(file) {
    const url = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) return;

    let el = isVideo ? createVideo(url) : createImg(url);
    el.hide();
    if (isVideo) {
        el.volume(0);
        el.loop();
    }
    imgs.push(el);
    createThumbnail(url, el);
}

function createThumbnail(url, el) {
    const wrapper = document.createElement('div');
    wrapper.className = 'thumb-wrapper';

    const thumb = document.createElement(el.elt instanceof HTMLVideoElement ? 'video' : 'img');
    thumb.src = url;
    Object.assign(thumb.style, {
        width: '60px',
        height: '60px',
        borderRadius: '4px',
        objectFit: 'cover'
    });
    if (thumb instanceof HTMLVideoElement) {
        thumb.muted = true;
        thumb.autoplay = true;
        thumb.loop = true;
    }

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '×';
    removeBtn.onclick = () => {
        const i = imgs.indexOf(el);
        if (i !== -1) imgs.splice(i, 1);
        wrapper.remove();
        el.remove();
        URL.revokeObjectURL(url);
    };

    wrapper.append(thumb, removeBtn);
    document.getElementById('media-preview-container').appendChild(wrapper);
}

function draw() {
    if (!theShader) return;

    try {
        shader(theShader);
        imgs.forEach((img, i) => theShader.setUniform(`tex${i}`, img));
        theShader.setUniform('time', millis() / 1000.0);
        theShader.setUniform('mouse', [mouseX / width, mouseY / height]);
        theShader.setUniform('pmouse', [pmouseX / width, pmouseY / height]);
        theShader.setUniform('resolution', [width, height]);

        drawFullscreenQuad();
    } catch (e) {
        console.error('Shader error:', e);
    }
}

function drawFullscreenQuad() {
    beginShape();
    vertex(-1, -1, 0, 0, 1);
    vertex(1, -1, 0, 1, 1);
    vertex(1, 1, 0, 1, 0);
    vertex(-1, 1, 0, 0, 0);
    endShape(CLOSE);
}

function loadCurrentShader() {
    theShader = createShader(vertSrc, editor.getValue());
    document.getElementById('log').textContent = '';
}

function windowResized() {
    resizeCanvas(windowWidth / 2, windowHeight);
}
