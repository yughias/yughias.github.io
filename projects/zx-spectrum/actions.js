function reset(){
    let func = Module.cwrap('emscripten_resetEmulation');
    func();

    stopTape();
}

function useJoystick(){
    let func = Module.cwrap('frontend_useKempston');
    func();

    let button = document.getElementById("inputBtn");
    reassignClick(button, useJoystick, useKeyboard);
    button.title = "use keyboard";
    button.src = "img/keyboard.png";
}

function useKeyboard(){
    let func = Module.cwrap('frontend_useKeyboard');
    func();

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
                
                let func = Module.cwrap("emscripten_loadTape", null);
                func();
                
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
    tapeBtn.title = "load tape";
    tapeBtn.src = "img/tape.png";
    reassignClick(tapeBtn, stopTape, loadTape);


    let func = Module.cwrap("stopTape", null);
    func();
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
                
                let func = Module.cwrap("emscripten_instantLoadTape", null);
                func();
            };

            reader.readAsArrayBuffer(file);
        };
    input.click();
}