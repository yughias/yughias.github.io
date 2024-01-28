function reset(){
    Module._emscripten_resetEmulation();
    stopTape();
}

function useJoystick(){
    Module._frontend_useKempston();

    let button = document.getElementById("inputBtn");
    reassignClick(button, useJoystick, useKeyboard);
    button.title = "use keyboard";
    button.src = "img/keyboard.png";
}

function useKeyboard(){
    Module._frontend_useKeyboard();

    let button = document.getElementById("inputBtn");
    reassignClick(button, useKeyboard, useJoystick);
    button.title = "use joystick";
    button.src = "img/joystick.png";
}

function loadTape(){
    let input = document.createElement('input');
    input.type = "file";
    input.accept = ".tap";
    input.onchange = _ => {
            let file = input.files[0];
            let reader = new FileReader();

            reader.onload = function (e) {
                let arrayBuffer = e.target.result;
                let uint8Array = new Uint8Array(arrayBuffer);
                
                let fileInfo = FS.analyzePath("/file.bin");
                console.log(fileInfo);
                if(fileInfo.exists)
                    FS.unlink("/file.bin");
                FS.createDataFile("/", "file.bin", uint8Array, true, true);
                
                Module._emscripten_loadTape();
                
                let tapeBtn = document.getElementById("tapeBtn");
                tapeBtn.title = "stop tape";
                tapeBtn.src = "img/stop.png";
                reassignClick(tapeBtn, loadTape, stopTape);
            };

            reader.readAsArrayBuffer(file);
        };
    input.click();
}

function stopTape(){
    let tapeBtn = document.getElementById("tapeBtn");
    tapeBtn.title = "load .tap";
    tapeBtn.src = "img/tape.png";
    reassignClick(tapeBtn, stopTape, loadTape);
    Module._stopTape();
}

function reassignClick(dom, oldFunc, newFunc){
    dom.onclick = "";
    dom.removeEventListener("click", oldFunc);
    dom.addEventListener("click", newFunc);
}

function instantLoadTape(){
    let input = document.createElement('input');
    input.type = "file";
    input.accept = ".tap";
    input.onchange = _ => {
            let file = input.files[0];
            let reader = new FileReader();

            reader.onload = function (e) {
                let arrayBuffer = e.target.result;
                let uint8Array = new Uint8Array(arrayBuffer);
                
                let fileInfo = FS.analyzePath("/file.bin");
                console.log(fileInfo);
                if(fileInfo.exists)
                    FS.unlink("/file.bin");
                FS.createDataFile("/", "file.bin", uint8Array, true, true);
                
                Module._emscripten_instantLoadTape();
            };

            reader.readAsArrayBuffer(file);
        };
    input.click();
}

function loadZ80(){
    let input = document.createElement('input');
    input.type = "file";
    input.accept = ".z80";
    input.onchange = _ => {
            let file = input.files[0];
            let reader = new FileReader();

            reader.onload = function (e) {
                let arrayBuffer = e.target.result;
                let uint8Array = new Uint8Array(arrayBuffer);
                
                let fileInfo = FS.analyzePath("/file.bin");
                console.log(fileInfo);
                if(fileInfo.exists)
                    FS.unlink("/file.bin");
                FS.createDataFile("/", "file.bin", uint8Array, true, true);
                
                Module._emscripten_loadZ80();
            };

            reader.readAsArrayBuffer(file);
        };
    input.click();
}