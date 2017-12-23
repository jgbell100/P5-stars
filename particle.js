
 function Particle() {
  this.colour = "white";
  this.position = createVector(random(windowWidth), random(windowHeight));
  this.speed = createVector(random(-5, 5), random(-5,5));
  this.acceleration = createVector(0.01,0.01);
  this.x = random(windowWidth);
  this.y = random(windowHeight);
  this.particle_range = 100;
  this.expanding = random([true, false]);
  this.MAX_DIAMETER = 30;
  this.MIN_DIAMETER = 20;
  this.diameter = random(this.MIN_DIAMETER, this.MAX_DIAMETER);
  this.rotation = random(-5, 5);
  this.rotation_rate = random([-20, -10,-7, -5, -1, 1, 5, 7, 10, 20]);
  this.pulse_rate = random([0.25, 0.5, 1, 1, 1.5, 2, 2.5]);
  this.history = [];
  this.length = 20;


  this.applyForce = function(force){
    var f = force.copy();
    this.acceleration.add(f);
  };

  // is the particle within range of another (specific) particle?
  this.withinRange = function(other){
    return (int(this.position.dist(other.position)) <= this.particle_range);
  };

  this.distanceTo = function(other){
    return (int(this.position.dist(other.position)));
  }

  this.changeDirection = function(){
    this.rotation_rate = -this.rotation_rate;
  };

  this.rotationRate = function(density){
    this.rotation_rate *= density * 5;
  }

  this.link = function(other){
    // link from the particle with the largest x value
    let link_to_particle = new Particle();
    let link_from_particle = new Particle();
    if (this.position.x > other.position.x){
      link_from_particle = this;
      link_to_particle = other;
    } else {
      link_to_particle = other;
      link_from_particle = this;
    }

    // the colour of the line depends on its horizontal location
    let colour = map(link_from_particle.position.x, 0, windowWidth, 0, 255);
    stroke(colour, colour, 256 - colour);
    line(link_from_particle.position.x, link_from_particle.position.y, link_to_particle.position.x, link_to_particle.position.y);
  };

  //repel other particles
  this.repel = function(other){
    // gravitational repulsion of particles
    var g = 10;

    var force = p5.Vector.sub(this.position,other.position);
    var distance = force.mag();
    distance = constrain(distance,5.0,25.0);
    force.normalize();
 
    var strength = (g * this.diameter) / (distance * distance);

    force.mult(strength);
    return force;
  };

  this.repelMouse = function(){
    var ms = createVector(mouseX, mouseY);
    var g = 1000;
    var force = p5.Vector.sub(this.position,ms);
    var distance = force.mag();
    force.normalize();
 
    var strength = (g * this.diameter) / (distance * distance);

    force.mult(strength);
    return force;
  };

  // make the particle expand and then contract
  this.pulse = function(){
  
    this.expanding ? this.diameter += this.pulse_rate : this.diameter -= this.pulse_rate;

    if (this.diameter >= this.MAX_DIAMETER || this.diameter <= this.MIN_DIAMETER) {
      this.expanding = !(this.expanding);
    } 
    push();
    translate(this.position.x, this.position.y);
    ellipseMode(CENTER);
    rotate(this.rotation);
    ellipse(0, 0, this.diameter, this.diameter / 3);
    ellipse(0, 0, this.diameter / 3, this.diameter);
    this.rotation += this.rotation_rate;
    pop();
  };

  this.show = function(){
    // the colour of the particle depends on its horizontal position on the screen 
  	let colour = this.getColour();
  
    fill (colour, colour, 256 - colour, 180);
  
    noStroke();
    this.pulse();
    this.showTrail();
  };

  this.getColour = function(){
    return (map(this.position.x, 0, windowWidth, 0, 255));
  };

  this.showTrail = function(){
    
    let colour = this.getColour();
    let alpha = 10;
    for (let pos of this.history){

      fill (colour, colour, 256 - colour, alpha);
      alpha += 3;
      ellipse(pos.x, pos.y, 10, 10); 
    }
  };

  this.move = function(){
    var p = this.position.copy();
    this.history.push(p);
    if (this.history.length > this.length){
      this.history.splice(0,1);
    }
  
    // particles 'wrap' around the screen
    if (this.position.x < 0){
      this.position.x = windowWidth;
    }
    if (this.position.x  > windowWidth){
      this.position.x = 0;
    }
    if (this.position.y  < 0) {
      this.position.y = windowHeight;
    }
    if (this.position.y  > windowHeight){
      this.position.y = 0;
    }

    this.speed.add(this.acceleration);
  	this.position.add(this.speed);
    this.speed.limit(3);

    //clear acceleration each frame
    this.acceleration.mult(0);
  };
}