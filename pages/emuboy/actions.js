let emulatorStarted = false;

const KEY_ENTER = 13;
const KEY_SHIFT = 16;
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_X = 88;
const KEY_Z = 90;

let lastDpadValue = [0, 0];

function init(){
    let aBtn = document.getElementById("a-btn");
    let bBtn = document.getElementById("b-btn");   
    let startBtn = document.getElementById("start-btn");
    let selectBtn = document.getElementById("select-btn");
    let dpad = document.getElementById("dpad");

    aBtn.addEventListener("touchstart", () => simulateKey(KEY_X, "down"));
    aBtn.addEventListener("touchend", () => simulateKey(KEY_X, "up"));

    bBtn.addEventListener("touchstart", () => simulateKey(KEY_Z, "down"));
    bBtn.addEventListener("touchend", () => simulateKey(KEY_Z, "up"));

    startBtn.addEventListener("touchstart", () => simulateKey(KEY_ENTER, "down"));
    startBtn.addEventListener("touchend", () => simulateKey(KEY_ENTER, "up"));

    selectBtn.addEventListener("touchstart", () => simulateKey(KEY_SHIFT, "down"));
    selectBtn.addEventListener("touchend", () => simulateKey(KEY_SHIFT, "up"));

    dpad.addEventListener("touchstart", updateDpad);
    dpad.addEventListener("touchmove", updateDpad);
    dpad.addEventListener("touchend", releaseDpad);
}

function loadGame(){
    let input = document.createElement('input');
    input.type = "file";
    input.accept = [".gb", ".gbc", ".bin", ".md1", ".md2"];
    input.onchange = _ => {
            let file = input.files[0];
            let reader = new FileReader();

            reader.onload = function (e) {
                let arrayBuffer = e.target.result;
                let uint8Array = new Uint8Array(arrayBuffer);
                let ext = file.name.split('.').pop();
                let colorizeBtn = document.getElementById("colorizeBtn");
                
                if(["gb", "gbc"].includes(ext)){
                    if(uint8Array[0x143] < 0x80){
                        loadCss("dmg");
                        colorizeBtn.style.display = "inline";
                        colorizeBtn.className = "colorizeCgb";
                    } else {
                        colorizeBtn.style.display = "none";
                        loadCss("cgb");
                    }
                }

                if(["bin", "md1", "md2"].includes(ext))
                    loadCss("megaduck");
                
                let fileInfo = FS.analyzePath("/rom.gb");
                if(fileInfo.exists)
                    FS.unlink("/rom.gb");
                FS.createDataFile("/", "rom.gb", uint8Array, true, true);
            
                if(!emulatorStarted){
                    callMain(["rom.gb"]);
                    emulatorStarted = true;
                } else {
                    Module._emscripten_loadRom(stringToNewUTF8("rom.gb"));
                }
                
                let led = document.getElementById("led");
                led.style.opacity = "1";
            };

            reader.readAsArrayBuffer(file);
        };
    input.click();
}

function simulateKey (keyCode, type, modifiers) {
	var evtName = (typeof(type) === "string") ? "key" + type : "keydown";	
	var modifier = (typeof(modifiers) === "object") ? modifier : {};

	var event = document.createEvent("HTMLEvents");
	event.initEvent(evtName, true, false);
	event.keyCode = keyCode;
	
	for (var i in modifiers) {
		event[i] = modifiers[i];
	}

	document.dispatchEvent(event);
}

function updateDpad(event){
    const DPAD_DEADZONE = 0.2;
    let dpad = document.getElementById("dpad");
    let dpadRect = dpad.getBoundingClientRect();

	let x = (event.touches[0].clientX - dpadRect.left) - (dpad.clientWidth / 2);
    let y = -(event.touches[0].clientY - dpadRect.top) + (dpad.clientHeight / 2);

    for(let i = 1; i < event.touches.length; i++){
        let xx = (event.touches[i].clientX - dpadRect.left) - (dpad.clientWidth / 2);
        let yy = -(event.touches[i].clientY - dpadRect.top) + (dpad.clientHeight / 2);
        if(xx*xx + yy*yy < x*x + y*y){
            x = xx;
            y = yy;
        }
    }

    x /= dpad.clientWidth / 2;
    y /= dpad.clientHeight / 2;

    if(x > -DPAD_DEADZONE && x < DPAD_DEADZONE)
        x = 0;
    else
        x /= Math.abs(x);
    
    if(y > -DPAD_DEADZONE && y < DPAD_DEADZONE)
        y = 0;
    else
        y /= Math.abs(y);
	
    if(x != lastDpadValue[0]){
        if(lastDpadValue[0] == 1)
            simulateKey(KEY_RIGHT, "up");
        if(lastDpadValue[0] == -1)
            simulateKey(KEY_LEFT, "up");
        if(x == 1)
            simulateKey(KEY_RIGHT, "down");
        if(x == -1)
            simulateKey(KEY_LEFT, "down");
    }

    if(y != lastDpadValue[1]){
        if(lastDpadValue[1] == 1)
            simulateKey(KEY_UP, "up");
        if(lastDpadValue[1] == -1)
            simulateKey(KEY_DOWN, "up");
        if(y == 1)
            simulateKey(KEY_UP, "down");
        if(y == -1)
            simulateKey(KEY_DOWN, "down");
    }

    lastDpadValue = [x, y];
}

function releaseDpad(event){
    simulateKey(KEY_UP, "up");
    simulateKey(KEY_LEFT, "up");
    simulateKey(KEY_DOWN, "up");
    simulateKey(KEY_RIGHT, "up");
    lastDpadValue = [0, 0];
}

function loadCss(css_name){
    let linkCSS = document.getElementById("linkCSS");
    linkCSS.href = "./style/" + css_name + ".css";

    loadFromCache(linkCSS.href);
}

function switchToCgb(){
    let btn = document.getElementById("colorizeBtn");
    if(btn.className == "colorizeDmg"){
        btn.className = "colorizeCgb";
        loadCss("dmg");
    } else {
        btn.className = "colorizeDmg";
        loadCss("cgb");
    }
    Module._switchCompatibilityMode();
}