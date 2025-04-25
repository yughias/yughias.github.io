let cv;


let snake_start = false;

let snake_text = `
                      _____  _   _   ___   _   __ _____                     
                     /  ___|| \\ | | / _ \\ | | / /|  ___|                    
                     \\ \`--. |  \\| |/ /_\\ \\| |/ / | |__                      
                      \`--. \\| . \` ||  _  ||    \\ |  __|                     
                     /\\__/ /| |\\  || | | || |\\  \\| |___                     
                     \\____/ \\_| \\_/\\_| |_/\\_| \\_/\\____/                     
______ ______  _____  _____  _____        _____ ______   ___   _____  _____ 
| ___ \\| ___ \\|  ___|/  ___|/  ___|      /  ___|| ___ \\ / _ \\ /  __ \\|  ___|
| |_/ /| |_/ /| |__  \\ \`--. \\ \`--.       \\ \`--. | |_/ // /_\\ \\| /  \\/| |__  
|  __/ |    / |  __|  \`--. \\ \`--. \\       \`--. \\|  __/ |  _  || |    |  __| 
| |    | |\\ \\ | |___ /\\__/ //\\__/ /      /\\__/ /| |    | | | || \\__/\\| |___ 
\\_|    \\_| \\_|\\____/ \\____/ \\____/       \\____/ \\_|    \\_| |_/ \\____/\\____/ 
                                                                            
`;

let posX = 10;
let posY = 10;
let snake = []

let dirX = 1;
let dirY = 0;

let appleX = 1;
let appleY = 1;

function drawBorder(p){
    for(let i = 0; i < 32; i++){
        p.fill("white");
        p.rect(i*8, 0, 8, 8);
        p.rect(i*8, p.height-8, 8, 8);
        p.rect(0, i*8, 8, 8);
        p.rect(p.width-8, i*8, 8, 8);
    }
}

function snakeReset(p){
    snake_start = false;
    snakeSetup(p);
}

function checkCollision(p){
    if(posX == 0 || posY == 0)
        snakeReset(p);
    if(posX == 31 || posY == 31)
        snakeReset(p);

    for(let i = 0; i < snake.length; i++){
        let x = snake[i][0];
        let y = snake[i][1];
        if(x == posX && y == posY)
            snakeReset(p);
    }
}

function genApple(p){
    if(snake.length == 30*30)
        snakeReset(p);
    let loop = true;
    while(loop){
        loop = false;
        appleX = Math.floor(Math.random()*30+1);
        appleY = Math.floor(Math.random()*30+1);
        if(posX == appleX && posY == appleY)
            loop = true;
        for(let i = 0; i < snake.length; i++){
            let x = snake[i][0];
            let y = snake[i][1];
            if(appleX == x && appleY == y){
                loop = true;
                break;
            }
        }
    }
}

function drawSnake(p){
    p.fill("lime");
    p.rect(posX*8, posY*8, 8, 8);
    p.fill("green");
    for(let i = 0; i < snake.length; i++){
        let x = snake[i][0];
        let y = snake[i][1];
        p.rect(x*8, y*8, 8, 8);
    }
}

function showConsole() {
    const imageUrl = cv.toDataURL();
    const css = `
        font-size: 1px;
        padding: 128px;
        background: url(${imageUrl});
        background-size: 256px;
        background-repeat: no-repeat;
        color: transparent;
    `;

    lastFrameId = Date.now();
    console.log("%c ", css);
}

function keyUpdate(p){
    if(p.key == ' '){
        snake_start = true;
    }
    let tmpX = dirX;
    let tmpY = dirY;
    if(p.keyCode == p.LEFT_ARROW){
        tmpY = 0;
        tmpX = -1;
    }
    if(p.keyCode == p.RIGHT_ARROW){
        tmpY = 0;
        tmpX = +1;
    }
    if(p.keyCode == p.DOWN_ARROW){
        tmpX = 0;
        tmpY = +1;
    }
    if(p.keyCode == p.UP_ARROW){
        tmpX = 0;
        tmpY = -1;
    }
    let checkX = tmpX + posX;
    let checkY = tmpY + posY;
    if(
        snake.length == 0 ||
        (snake.length != 0 && checkX != snake[snake.length-1][0] && checkY != snake[snake.length-1][1])
    ){
        dirX = tmpX;
        dirY = tmpY;
    }
}

function drawApple(p){
    p.fill("red");
    p.rect(appleX*8, appleY*8, 8, 8);
}

function snakeSetup(p){
    posX = 10;
    posY = 10;
    snake = []
    dirX = 1;
    dirY = 0;
    appleX = 1;
    appleY = 1;
    p.frameRate(10);
    genApple(p);
}

function snakeConsole(p){
    p.setup = () => {
        cv = p.createCanvas(256, 256).canvas;
        cv.style = "display: none;";
        console.log(snake_text);
        snakeSetup(p);
    };

    p.draw = () => {
        if(!snake_start)
            return;
        p.clear();
        drawBorder(p);
        drawApple(p);
        drawSnake(p);
        if(posX == appleX && posY == appleY){
            snake.push([posX, posY]); 
            genApple(p);
        } else {
            for(let i = 0; i < snake.length-1; i++){
                snake[i][0] = snake[i+1][0];
                snake[i][1] = snake[i+1][1];
            }
            snake[snake.length-1] = [posX, posY];
        }
        posX += dirX;
        posY += dirY;
        checkCollision(p);
        showConsole();
        if(!snake_start)
            console.log(snake_text);
    };

    p.keyPressed = () => {
        keyUpdate(p);
    }
}

new p5(snakeConsole)