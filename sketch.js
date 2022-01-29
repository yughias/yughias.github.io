title = new Title(0, 0);
player = new Player(0, 150);

scaleWin = 0;

function preload(){
  title.load();
}


function setup(){
  pixelDensity(1);
  noSmooth();
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  stroke(255);
  frameRate(30);
  imageMode(CENTER);
  scaleWin = windowHeight/600;
  scaleWin *= 0.8;
}

function draw(){
  background(0);
  translate(width/2, height/2);
  scale(scaleWin);
  player.render();
  translate(-player.x, -player.y);
  title.render();
  player.update(mouseIsPressed, deltaTime);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  scaleWin = windowHeight/600;
  scaleWin *= 0.8;
}
