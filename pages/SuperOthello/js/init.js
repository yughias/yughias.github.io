// OFTEN USED DOM ELEMENTS 
let body;
let menu;
let gameScenario;

// MAIN MENU BUTTONS
let cpuBtn;
let localBtn;
let aboutBtn;

// NAV BAR ELEMENTS
let navUsername;
let soundButton;

function init(){
    menu = document.getElementById("menu");
    cpuBtn = document.getElementById("cpuButton");
    localBtn = document.getElementById("localButton");
    onlineBtn = document.getElementById("onlineButton");
    aboutBtn = document.getElementById("aboutButton");
    aboutBtn.addEventListener("click", () => window.location.href = "about.html");
    initPopup();
    localBtn.addEventListener("click", startLocalGame);
    cpuBtn.addEventListener("click", () => openPopup(settingsPopup));
    gameScenario = document.getElementById("gameScenario");
    body = document.getElementsByTagName("body")[0];
    navUsername = document.getElementById("nav-username");
    soundButton = document.getElementById("soundButton");
    soundButton.addEventListener("click", updateSound);
    initSound();
}

function startLocalGame(){
    createGameScenario();
    initGame(LOCAL_MODE);
}

function startCpuGame(){
    createGameScenario();
    initGame(CPU_MODE);
    closePopup();
}

function createGameScenario(){
    menu.remove();
    cpuBtn.remove();
    localBtn.remove();
    aboutBtn.remove();
    gameScenario.style.display = "flex";
}