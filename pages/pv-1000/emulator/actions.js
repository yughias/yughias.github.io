function loadGame(){
    let input = document.createElement('input');
    input.type = "file";
    input.accept = [".bin"];
    input.onchange = _ => {
            let file = input.files[0];
            let reader = new FileReader();

            reader.onload = function (e) {
                let arrayBuffer = e.target.result;
                let uint8Array = new Uint8Array(arrayBuffer);
                
                let fileInfo = FS.analyzePath("/rom.bin");
                if(fileInfo.exists)
                    FS.unlink("/rom.bin");
                FS.createDataFile("/", "rom.bin", uint8Array, true, true);
        
                callMain(["rom.bin"]);
                let load_button = document.getElementById("load_button");
                let game_scene = document.getElementById("game_scene");
                let instructions = document.getElementById("instructions");
                load_button.style.display = "none";
                game_scene.style.display = "block";
                instructions.style.display = "none";
            };

            reader.readAsArrayBuffer(file);
        };
    input.click();
}