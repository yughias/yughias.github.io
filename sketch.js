title = new Title(0, 0);
player = new Player(0, 150);
bar = new Bar();

scaleWin = 0;

function preload(){
  title.load();
  bar.load();
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
  translate(-player.x, -player.y);
  title.render();
  translate(player.x, player.y);
  player.render();
  player.update();
  scale(1/scaleWin);
  translate(-width/2, -height/2);
  scale(scaleWin);
  bar.render();
  bar.update();
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  scaleWin = windowHeight/600;
  scaleWin *= 0.8;
}

function mouseReleased(){
  bar.checkClick();
}
