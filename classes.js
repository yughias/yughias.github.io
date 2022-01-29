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
    line(this.size*Math.cos(this.points[0]+this.angle), this.size*Math.sin(this.points[0]+this.angle), this.size*Math.cos(this.points[1]+this.angle), this.size*Math.sin(this.points[1]+this.angle));
    line(this.size*Math.cos(this.points[1]+this.angle), this.size*Math.sin(this.points[1]+this.angle), this.size*Math.cos(this.points[2]+this.angle), this.size*Math.sin(this.points[2]+this.angle));
    line(this.size*Math.cos(this.points[2]+this.angle), this.size*Math.sin(this.points[2]+this.angle), this.size*Math.cos(this.points[0]+this.angle), this.size*Math.sin(this.points[0]+this.angle));

    //render rear flame
    let p0 = [ this.size*Math.cos(this.angle+this.points[1]), this.size*Math.sin(this.angle+this.points[1]) ];
    let p1 = [ this.size*Math.cos(this.angle+this.points[2]), this.size*Math.sin(this.angle+this.points[2]) ];
    let xm = (p0[0]+p1[0])/2;
    let ym = (p0[1]+p1[1])/2;
    let dist = Math.sqrt(xm*xm+ym*ym);
    p0 = [ (p0[0]+xm)/2, (p0[1]+ym)/2 ];
    p1 = [ (p1[0]+xm)/2, (p1[1]+ym)/2] ;

    line(p0[0], p0[1], (dist+this.flame)*Math.cos(this.angle+Math.PI), (dist+this.flame)*Math.sin(this.angle+Math.PI));
    line(p1[0], p1[1], (dist+this.flame)*Math.cos(this.angle+Math.PI), (dist+this.flame)*Math.sin(this.angle+Math.PI));
  }

  update(mouse, deltatime){
    this.angle = atan2(mouseY-windowHeight/2, mouseX-windowWidth/2);
    if(mouse){
      this.vx += this.acc*Math.cos(this.angle)*(deltatime/1000.0);
      this.vy += this.acc*Math.sin(this.angle)*(deltatime/1000.0);
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
    this.x += this.vx*(deltatime/1000.0);
    this.y += this.vy*(deltatime/1000.0);
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
  }

  render(){
      let space = 10;
      for(let i = 0; i < 3; i++){
        rect(this.padding+this.x+this.h/2, this.y+space, this.w-this.h, this.h);
        circle(this.padding+this.x+this.h/2, this.y+space+this.h/2, 10);
        circle(this.padding+this.x+this.w-this.h/2, this.y+space+this.h/2, 10);
        space += 20;
      }
      if(this.clicked){
        fill(0);
        stroke(0);
        rect(this.x, this.y, this.padding+this.w+1, min(this.size+1, this.frame));
        stroke(255);
        fill(255);
        if(this.frame > this.size){
          fill(0);
          stroke(0);
          rect(windowWidth/scaleWin, 0, this.size-this.frame, this.size);
          fill(255);
          stroke(255);
          line(windowWidth/scaleWin, this.size, (windowWidth/scaleWin+this.size-this.frame), this.size);
        }
      }
  }

  update(x, y, click){
    if(this.clickable && click && x >= 0 && y >= 0 && x <= (this.padding+this.w)*scaleWin && y <= this.size*scaleWin)
      {
        this.clicked = !this.clicked;
        this.clickable = false;
      }
    if(this.clicked){
      if(this.frame < this.size)
        this.frame += 3;
      else {
        if(windowWidth/scaleWin+this.size-this.frame > 0)
          this.frame *= 2;
      }
    }
  }
}
