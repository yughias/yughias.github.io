const KEY_ENTER = 13;
const KEY_SHIFT = 16;
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_X = 88;
const KEY_Z = 90;
const KEY_A = 65;
const KEY_S = 83;


let lastDpadValue = [0, 0];

function init(){
    let aBtn = document.getElementById("a-btn");
    let bBtn = document.getElementById("b-btn");   
    let lBtn = document.getElementById("l-btn");
    let rBtn = document.getElementById("r-btn");   
    let startBtn = document.getElementById("start-btn");
    let selectBtn = document.getElementById("select-btn");
    let dpad = document.getElementById("dpad");

    aBtn.addEventListener("touchstart", () => simulateKey(KEY_X, "down"));
    aBtn.addEventListener("touchend", () => simulateKey(KEY_X, "up"));

    bBtn.addEventListener("touchstart", () => simulateKey(KEY_Z, "down"));
    bBtn.addEventListener("touchend", () => simulateKey(KEY_Z, "up"));

    lBtn.addEventListener("touchstart", () => simulateKey(KEY_A, "down"));
    lBtn.addEventListener("touchend", () => simulateKey(KEY_A, "up"));

    rBtn.addEventListener("touchstart", () => simulateKey(KEY_S, "down"));
    rBtn.addEventListener("touchend", () => simulateKey(KEY_S, "up"));

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
    input.accept = [".gba"];
    input.onchange = _ => {
            let file = input.files[0];
            let reader = new FileReader();

            reader.onload = function (e) {
                let arrayBuffer = e.target.result;
                let uint8Array = new Uint8Array(arrayBuffer);
                
                let fileInfo = FS.analyzePath("/rom.gba");
                if(fileInfo.exists)
                    FS.unlink("/rom.gba");
                FS.createDataFile("/", "rom.gba", uint8Array, true, true);
        
                callMain(["rom.gba"]);
                let cartridge = document.getElementsByClassName("cartridge")[0];
                let gba = document.getElementById("gba");
                cartridge.style.display = "none";
                gba.style.display = "block";
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