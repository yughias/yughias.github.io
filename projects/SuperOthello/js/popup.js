// SETTINGS POPUP ITEMS
let settingsPopup;
let difficultySlider;
let difficultyName;
let playBtn;


function initPopup(){
    closingButtons = document.getElementsByClassName("closeButton");
    for(let btn of closingButtons)
        btn.addEventListener("click", closePopup);
    settingsPopup = document.getElementById("settingsPopup");
    difficultySlider = document.getElementById("difficultySlider");
    difficultyName = document.getElementById("difficultyName");
    playBtn = document.getElementById("playButton");
    difficultySlider.addEventListener("input", changeDifficulty);
    playBtn.addEventListener("click", startCpuGame);
}

function openPopup(popup){
    popup.style.display = "block";
}

function closePopup(){
    let popups = document.getElementsByClassName("overlay");
    for(let popup of popups)
        popup.style.display = "none";
}

function changeDifficulty(){
    let value = Number(difficultySlider.value);
    MAX_DEPTH = value;
    if(value == 1)
        difficultyName.textContent = "Facile";
    if(value == 2)
        difficultyName.textContent = "Normale";
    if(value == 3)
        difficultyName.textContent = "Difficile";
    if(value == 4)
        difficultyName.textContent = "Esperto";
    if(value == 5)
        difficultyName.textContent = "Impossibile";
}

async function adjustIcon(){
    if(await isLogged()){
        loginIcon.src = "img/user.svg";
        loginIcon.title = "statistiche";
    } else {
        loginIcon.src = "img/login.svg";
        loginIcon.title = "login";
    }
}

function alertWrite(string, color){
    let alert = document.getElementById("alert");
    alert.style.animationName = "";
    alert.style.display = "none";

    setTimeout(() => {
        alert.textContent = string;
        alert.style.display = "block"
        alert.style.backgroundColor = color;
        alert.style.animationName = "alertAnimation";
    }, 10);

    if(loginAlertHandler)
        clearTimeout(loginAlertHandler);

    loginAlertHandler = setTimeout(() => {
        alert.style.animationName = "";
        alert.style.display = "none";
    }, 2500);
}