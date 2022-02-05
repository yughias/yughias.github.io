class Title {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  load(){
    this.img = loadImage('logo.png');
  }

  render(){
    image(this.img, this.x, this.y);
  }

}

class Player{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.vx = 0;
    this.vy = 0;
    this.vlimit = 200;
    this.acc = 100;
    this.size = 20;
    this.points = [ 0, Math.PI-Math.PI/6, Math.PI+Math.PI/6];

    this.flame = 0;
    this.flame_max = 20;
  }

  render(){
    line(this.size*cos(this.points[0]+this.angle), this.size*sin(this.points[0]+this.angle), this.size*cos(this.points[1]+this.angle), this.size*sin(this.points[1]+this.angle));
    line(this.size*cos(this.points[1]+this.angle), this.size*sin(this.points[1]+this.angle), this.size*cos(this.points[2]+this.angle), this.size*sin(this.points[2]+this.angle));
    line(this.size*cos(this.points[2]+this.angle), this.size*sin(this.points[2]+this.angle), this.size*cos(this.points[0]+this.angle), this.size*sin(this.points[0]+this.angle));

    //render rear flame
    let p0 = [ this.size*cos(this.angle+this.points[1]), this.size*sin(this.angle+this.points[1]) ];
    let p1 = [ this.size*cos(this.angle+this.points[2]), this.size*sin(this.angle+this.points[2]) ];
    let xm = (p0[0]+p1[0])/2;
    let ym = (p0[1]+p1[1])/2;
    let dist = sqrt(xm*xm+ym*ym);
    p0 = [ (p0[0]+xm)/2, (p0[1]+ym)/2 ];
    p1 = [ (p1[0]+xm)/2, (p1[1]+ym)/2] ;

    line(p0[0], p0[1], (dist+this.flame)*cos(this.angle+PI), (dist+this.flame)*sin(this.angle+PI));
    line(p1[0], p1[1], (dist+this.flame)*cos(this.angle+PI), (dist+this.flame)*sin(this.angle+PI));
  }

  update(){
    this.angle = atan2(mouseY-windowHeight/2, mouseX-windowWidth/2);
    if(mouseIsPressed){
      this.vx += this.acc*cos(this.angle)*(deltaTime/1000.0);
      this.vy += this.acc*sin(this.angle)*(deltaTime/1000.0);
      if(this.vx > this.vlimit)
        this.vx = this.vlimit;
      if(this.vx < -this.vlimit)
        this.vx = -this.vlimit;
      if(this.vy > this.vlimit)
        this.vy = this.vlimit;
      if(this.vy < -this.vlimit)
        this.vy = -this.vlimit;
      this.flame += 5*(deltaTime/1000.0);
      if(this.flame > this.flame_max)
        this.flame = this.flame_max;
    }
    else{
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.flame -= 1*this.flame_max*(deltaTime/1000.0);
      if(this.flame < 0)
        this.flame = 0;
    }
    this.x += this.vx*(deltaTime/1000.0);
    this.y += this.vy*(deltaTime/1000.0);
  }

}

class Bar{
  constructor(){
    this.x = 0;
    this.y = 0;
    this.w = 60;
    this.h = 10;
    this.size = (10+this.h*3+10*2);
    this.padding = 5;
    this.clicked = false;
    this.clickable = true;
    this.frame = 0;
    this.hover = 0;
  }

  load(){
    this.discord = loadImage('discord.png');
    this.github = loadImage('github.png');
    this.youtube = loadImage('youtube.png');
  }

  render(){
      let space = 10;
      for(let i = 0; i < 3; i++){
        rect(this.padding+this.x+this.h/2, this.y+space, this.w-this.h, this.h);
        circle(this.padding+this.x+this.h/2, this.y+space+this.h/2, 10);
        circle(this.padding+this.x+this.w-this.h/2, this.y+space+this.h/2, 10);
        space += 20;
      }
      fill(0);
      stroke(0);
      rect(this.x, this.y, this.padding+this.w+1, min(this.size+1, this.frame));
      stroke(255);
      fill(255);
      if(this.frame > this.size){
        fill(0);
        stroke(0);
        rect(windowWidth/scaleWin, 0, this.size-this.frame, this.size);

        if(mouseY < this.size*scaleWin)
          if(mouseX > width/2-this.github.width*scaleWin/2 && mouseX < width/2+this.github.width*scaleWin/2)
            tint(255-this.hover, 255-this.hover*1.5, 255-this.hover*1.25);
        image(this.github, windowWidth/scaleWin/2, this.size/2);
        noTint();

      if(mouseY < this.size*scaleWin)
          if(mouseX > width/4-this.youtube.width*scaleWin/2 && mouseX < width/4+this.youtube.width*scaleWin/2)
            tint(255, 255-this.hover*1.5, 255-this.hover*1.5);
        image(this.youtube, windowWidth/scaleWin/4, this.size/2);
        noTint();

        if(mouseY < this.size*scaleWin)
          if(mouseX > 3*width/4-this.discord.width*scaleWin/2 && mouseX < 3*width/4+this.discord.width*scaleWin/2)
            tint(255-this.over, 255-this.hover, 255);
        image(this.discord, 3*(windowWidth/scaleWin)/4, this.size/2);
        noTint();

        rect(0, 0, windowWidth/scaleWin-this.frame+this.size, this.size);
        fill(255);
        stroke(255);
        line(windowWidth/scaleWin, this.size, (windowWidth/scaleWin+this.size-this.frame), this.size);
      }
  }

  update(){
    let sign = (this.clicked)? 1 : -1;
    let hovering = false;

    if(this.frame == 0)
      this.clickable = true;
    if(mouseY > this.size*scaleWin && this.clicked && mouseIsPressed)
      this.clicked = false;
    if(this.frame < this.size)
      this.frame = max(this.frame+sign*deltaTime/10, 0);
    else {
      this.frame = min(windowWidth/scaleWin+this.size, this.frame+sign*this.frame*(deltaTime/200)) ;
      if(this.frame == windowWidth/scaleWin+this.size)
        if(mouseY < this.size*scaleWin){
          if(mouseX > width/4-this.youtube.width*scaleWin/2 && mouseX < width/4+this.youtube.width*scaleWin/2)
            hovering = true;
          else if(mouseX > width/2-this.github.width*scaleWin/2 && mouseX < width/2+this.github.width*scaleWin/2)
            hovering = true;
          else if(mouseX > 3*width/4-this.discord.width*scaleWin/2 && mouseX < 3*width/4+this.discord.width*scaleWin/2)
            hovering = true;
        }
    }

    if(!hovering){
      cursor(ARROW);
      this.hover = 0;
    } else {
      this.hover = min(this.hover+deltaTime/5, 255/2);
      cursor(HAND);
    }
    if(this.clickable && mouseX >= 0 && mouseY >= 0 && mouseX <= (this.padding+this.w)*scaleWin && mouseY <= this.size*scaleWin)
      cursor(HAND);
  }

  checkClick(){
    if(this.clickable && mouseX >= 0 && mouseY >= 0 && mouseX <= (this.padding+this.w)*scaleWin && mouseY <= this.size*scaleWin){
      this.clicked = true;
      this.clickable = false;
    }

    if(this.hover != 0 && mouseY < this.size){
      if(mouseX > width/4-this.youtube.width*scaleWin/2 && mouseX < width/4+this.youtube.width*scaleWin/2)
        window.open("https://www.youtube.com/channel/UC3hAN4vRIoGZDNPUwmEDZ2Q");
      if(mouseX > width/2-this.github.width*scaleWin/2 && mouseX < width/2+this.github.width*scaleWin/2)
        window.open("https://github.com/yughias");
      if(mouseX > 3*width/4-this.discord.width*scaleWin/2 && mouseX < 3*width/4+this.discord.width*scaleWin/2)
        window.open("https://discord.gg/b8retee3Zk");
    }
  }

}
