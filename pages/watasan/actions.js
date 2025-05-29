function loadGame(){
    let input = document.createElement('input');
    input.type = "file";
    input.accept = [".sv", ".bin"];
    input.onchange = _ => {
            let file = input.files[0];
            let reader = new FileReader();

            reader.onload = function (e) {
                let arrayBuffer = e.target.result;
                let uint8Array = new Uint8Array(arrayBuffer);
                
                let fileInfo = FS.analyzePath("/rom.sv");
                if(fileInfo.exists)
                    FS.unlink("/rom.sv");
                FS.createDataFile("/", "rom.sv", uint8Array, true, true);
        
                callMain(["rom.sv"]);
                let load_button = document.getElementById("load_button");
                let game_scene = document.getElementById("game_scene");
                load_button.style.display = "none";
                game_scene.style.display = "block";
            };

            reader.readAsArrayBuffer(file);

            let instructions = document.getElementById("instructions");
            instructions.style.display = "none";
        };
    input.click();
}