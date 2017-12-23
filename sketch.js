
var particle;
var particles = [];
const MAX_PARTICLES = 20;

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
    let num_particles_within_range = 0;
    let total_distance_to_particles_within_range = 0;
    for (j = 0; j < particles.length; j += 1){
      if (particles[i] != particles[j]){
        if (particles[i].withinRange(particles[j])){
          //how many other particles are within range?
          num_particles_within_range += 1;
          //keep a total of the distance between the particle and the others in its range
          total_distance_to_particles_within_range += particles[i].distanceTo(particles[j]);
          
          // particles[i].link(particles[j]);
          particles[i].changeDirection();
          let repel_force = particles[i].repel(particles[j]);
          particles[i].applyForce(repel_force);

          // set the rotation rate depending on the density of other particles around it
          let density = num_particles_within_range * total_distance_to_particles_within_range;
          density = map(density, 0, 500, 0,1);
          particles[i].rotationRate(density);
        }
      }
    }

    // particles respond to the position of the mouse
    //only respond if the mouse if within the canvas
    if (mouseX > 0 && mouseX < windowWidth && mouseY > 0 && mouseY < windowHeight){
      let mouse_force = particles[i].repelMouse();
      particles[i].applyForce(mouse_force);
    }

    particles[i].move();
    particles[i].show();
  }
}






