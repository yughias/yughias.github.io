function loadGame(){
    let input = document.createElement('input');
    input.type = "file";
    input.accept = [".sms", ".gg", ".sg", ".sc"];
    input.onchange = _ => {
            let file = input.files[0];
            let filename = file.name
            let reader = new FileReader();

            reader.onload = function (e) {
                let arrayBuffer = e.target.result;
                let uint8Array = new Uint8Array(arrayBuffer);
                
                let fileInfo = FS.analyzePath("/" + filename);
                if(fileInfo.exists)
                    FS.unlink("/" + filename);
                FS.createDataFile("/", filename, uint8Array, true, true);
        
                callMain([filename]);
                console.log(filename);
                let load_button = document.getElementById("load_button");
                let game_scene = document.getElementById("game_scene");
                let instruction = document.getElementById("instructions");
                instruction.style.display = "none";
                load_button.style.display = "none";
                game_scene.style.display = "block";
            };

            reader.readAsArrayBuffer(file);
        };
    input.click();
}