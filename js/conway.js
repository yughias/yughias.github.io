let ctx;

let w;
let y;
let alive = [];
let new_alive = [];
const SPAWN_PROBABILITY = 0.4; 
const CELL_SIZE = 30;

function setup(){
    ctx = createCanvas(windowWidth, windowHeight);
    ctx.addClass("background");
    createMatrix();
    strokeWeight(5);
    stroke("white");

    frameRate(2);
    pixelDensity(1);
}

function draw(){
    background("white");
    
    for(let y = 0; y < h; y++){
        for(let x = 0; x < w; x++){
            updateCell(x, y);
        }
    }
    alive = [...new_alive];

    drawMatrix();
}

function windowResized(){
    resizeAll();
    createMatrix();
}

function resizeAll(){
    resizeCanvas(windowWidth, windowHeight);
}

function createMatrix(){
    w = Math.ceil(width / CELL_SIZE) + 2;
    h = Math.ceil(height / CELL_SIZE) + 2;

    alive = [];
    for(let y = 0; y < h; y++){
        for(let x = 0; x < w; x++){
            alive.push(Math.random() > SPAWN_PROBABILITY ? false : true);
        }
    }
    new_alive = [...alive];
}

function drawMatrix(){
    for(let y = 0; y < h; y++){
        for(let x = 0; x < w; x++){
            let idx = (x+1) + (y+1) * w;
            if(alive[idx] == true){
                fill(248);
                square(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE);
            }
        }
    }
}

function updateCell(x, y){
    let idx = x + y * w;
    let count = countCell(x, y);

    if(count < 2){
        new_alive[idx] = false;
        return;
    }

    if(count == 3){
        new_alive[idx] = true;
        return;
    }

    if(count > 3){
        new_alive[idx] = false;
        return;
    }
}

function countCell(x, y){
    let count = 0;
    for(let dy = -1; dy <= 1; dy++){
        for(let dx = -1; dx <= 1; dx++){
            if(dx == 0 && dy == 0)
                continue;
            let xx = x + dx;
            let yy = y + dy;
            if(xx < 0 || yy < 0 || xx >= w || yy >= h)
                continue;
            if(alive[xx + yy * w] == true)
                count += 1;
        }
    }
    return count;
}