
var particle;
var particles = [];
const MAX_PARTICLES = 100;


function setup() {
  createCanvas(windowWidth, windowHeight);

  background("black");
  angleMode(DEGREES);

  for (i = 0; i < MAX_PARTICLES; i += 1){
    particles.push(new Particle());
  }
}

function draw() {
  background("black");
  for (i = 0; i < particles.length ; i += 1){
    for (j = i; j < particles.length; j += 1){
      if (particles[i] != particles[j]){
        if (particles[i].within_range(particles[j])){
          particles[i].link(particles[j]);
          var repel_force = particles[i].repel(particles[j]);
          particles[i].applyForce(repel_force);
        }
      }
    }
    particles[i].move();
    particles[i].show();
  }
}


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
  this.pulse_rate = random([0.25, 0.5, 1, 1, 1.5, 2, 2.5]);


  this.applyForce = function(force){
    var f = force.copy();
    this.acceleration.add(f);
  };

  // is the particle within range of another (specific) particle?
  this.within_range = function(other){
    return (int(this.position.dist(other.position)) <= this.particle_range);
  };

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
    this.rotation += 10;
    this.r
    pop();
  };

  this.show = function(){
    // the colour of the particle depends on its horizontal position on the screen 
  	let colour = map(this.position.x, 0, windowWidth, 0, 255);
  
    fill (colour, colour, 256 - colour, 180);
  
    noStroke();
    this.pulse();
  };

  this.move = function(){
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




