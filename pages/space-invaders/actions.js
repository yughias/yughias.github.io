let coinButton;
let startButton;

let leftButton;
let rightButton;
let centerButton;

const KEY_1 = 49;
const KEY_SHIFT = 16;

const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;

function init(){
    coinButton = document.getElementById("coin");
	startButton = document.getElementById("start");
	leftButton = document.getElementById("left");
	centerButton = document.getElementById("center");
	rightButton = document.getElementById("right");

	coinButton.addEventListener("mousedown", () => simulateKey(KEY_SHIFT, "down"));
	coinButton.addEventListener("mouseup", () => simulateKey(KEY_SHIFT, "up"));
	startButton.addEventListener("mousedown", () => simulateKey(KEY_1, "down"));
	startButton.addEventListener("mouseup", () => simulateKey(KEY_1, "up"));
	
	coinButton.addEventListener("touchstart", () => simulateKey(KEY_SHIFT, "down"));
	coinButton.addEventListener("touchend", () => simulateKey(KEY_SHIFT, "up"));
	startButton.addEventListener("touchstart", () => simulateKey(KEY_1, "down"));
	startButton.addEventListener("touchend", () => simulateKey(KEY_1, "up"));

	leftButton.addEventListener("touchstart", () => simulateKey(KEY_A, "down"));
	leftButton.addEventListener("touchend", () => simulateKey(KEY_A, "up"));

	centerButton.addEventListener("touchstart", () => simulateKey(KEY_S, "down"));
	centerButton.addEventListener("touchend", () => simulateKey(KEY_S, "up"));

	rightButton.addEventListener("touchstart", () => simulateKey(KEY_D, "down"));
	rightButton.addEventListener("touchend", () => simulateKey(KEY_D, "up"));
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