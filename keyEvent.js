let canvas;
let coinButton;
let startButton;
let joystick;
let joyLastPosition = undefined;

const KEY_SHIFT = 16;
const KEY_1 = 49;
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

function init(){
    canvas = document.getElementById("canvas");
    coinButton = document.getElementById("coin");
	startButton = document.getElementById("start");
    joystick = document.getElementById("joystick");

	coinButton.addEventListener("mousedown", () => simulateKey(KEY_SHIFT, "down"));
	coinButton.addEventListener("mouseup", () => simulateKey(KEY_SHIFT, "up"));
	startButton.addEventListener("mousedown", () => simulateKey(KEY_1, "down"));
	startButton.addEventListener("mouseup", () => simulateKey(KEY_1, "up"));
	
	coinButton.addEventListener("touchstart", () => simulateKey(KEY_SHIFT, "down"));
	coinButton.addEventListener("touchend", () => simulateKey(KEY_SHIFT, "up"));
	startButton.addEventListener("touchstart", () => simulateKey(KEY_1, "down"));
	startButton.addEventListener("touchend", () => simulateKey(KEY_1, "up"));
	
	joystick.addEventListener("touchmove", updateJoystick);
	joystick.addEventListener("touchstart", updateJoystick);
	joystick.addEventListener("touchend", releaseJoystick);
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

function updateJoystick(event){
	let joyPosition = joystick.getBoundingClientRect();
	let center = {
		x: joyPosition.x+joyPosition.width/2,
		y: joyPosition.y+joyPosition.height/2
	};
	let vector = {
		x: event.touches[0].clientX - center.x,
		y: center.y - event.touches[0].clientY 
	};
	let angle = Math.atan2(vector.y, vector.x);
	if(angle < 0)
		angle = angle + 2*Math.PI;
	let dir = Math.round(angle / (2*Math.PI/4) + 4) % 4;
	console.log(dir);
	
	let actualPos = KEY_RIGHT;
	if(dir == 1)
		actualPos = KEY_UP;
	if(dir == 2)
		actualPos = KEY_LEFT;
	if(dir == 3)
		actualPos = KEY_DOWN;

	simulateKey(actualPos, "down");
	if(joyLastPosition != undefined)
		if(joyLastPosition != actualPos)
			simulateKey(joyLastPosition, "up");
	
	joyLastPosition = actualPos;
}

function releaseJoystick(event){
	simulateKey(joyLastPosition, "up");
	joyLastPosition = undefined;
}