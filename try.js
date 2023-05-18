const canvas=document.getElementById('myCanvas');
const ctx= canvas.getContext("2d"); // it helps to get access to all the context property of canvas to be used in the 2d

const antImage = new Image();
antImage.src = 'ant.png';

// for counting the number of the total ants killed 

let antsKilled=0;

const balls=[]; // for creating an array of different size of balls.

// adding event listener for the ants
canvas.addEventListener('click', killAnt); 

//start button 
const startButton = document.getElementById('start-button');
startButton.addEventListener('click', init);

// //stop button 
// const stopButton = document.getElementById("restart-button");
// stopButton.addEventListener("click", init);


class SmallCircle{
    constructor(){
        this.x=canvas.width/2;
        this.y=canvas.height/2;
        this.size = Math.random()*80 + 30; // it will generate from 1 to 20
        this.speedX = Math.random()* 5 -2  // both plus and minus value for the circles to hover 
        this.speedY=Math.random()*5 -2
        this.smashed = false;

        // generate random colors and it store random RGB values between 0 and 255.
        this.red = Math.floor(Math.random() * 256);
        this.green = Math.floor(Math.random() * 256);
        this.blue = Math.floor(Math.random() * 256);
    }

    // the logic part 
    update(){
        //for the different speed
        this.x+=this.speedX;
        this.y+=this.speedY;

        //collision detection  right and left side

        if(this.x+ this.speedX >canvas.width - this.size || this.x + this.speedX < this.size){
                this.speedX =-this.speedX;
        }

        //collision detection for the up and down 

        if(this.y+ this.speedY >canvas.height - this.size || this.y + this.speedY < this.size){
            this.speedY =-this.speedY;
    }

    // if the collision will happen between the balls 

    for (let i = 0; i < balls.length; i++) {
        if (this === balls[i])
         continue; // Skip if checking with itself
    
        const dx = this.x - balls[i].x;
        const dy = this.y - balls[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // logic is: if distance between 2 balls are less, collision has occured
        if (distance < this.size + balls[i].size) {
            if (distance < this.size + balls[i].size) {
                // Collision occurred, adjust positions

                // to remove collision, change in the angle using tan 
                const angle = Math.atan2(dy, dx);
                // the cos angle calculates the x direction and the y for sin 
                const targetX = this.x + Math.cos(angle) * (this.size + balls[i].size);
                const targetY = this.y + Math.sin(angle) * (this.size + balls[i].size);

                //calculating the acceleration between the balls, acc factor 0.03
                const ax = (targetX - balls[i].x) * 0.0;
                const ay = (targetY - balls[i].y) * 0.0;
          
                // this will be subtracting the acceleration and generating new speed 
                this.speedX -= ax;
                this.speedY -= ay;
                balls[i].speedX += ax;
                balls[i].speedY += ay;
            }
        }
      }
    }

    // now for drawing the circle
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI *2)  // x, y, radius, start degree 
        ctx.save();
        ctx.clip();
        ctx.drawImage(antImage, this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
        ctx.restore();
        ctx.closePath();
    }
}

// generating the number of balls 
function generate(numBalls){
    for (let i=0;i<numBalls;i++) 
    // 20 circles{}
    {
        balls.push(new SmallCircle());
    }
    updateBallCount();
}


generate(20); // the number of the ball

function updateBallCount() {
    const ballCountElement = document.getElementById('ballCount');
    // ballCountElement.textContent = `Number of balls: ${balls.length}`;
  }

function removeBall() {
    balls.pop(); // Remove a ball from the balls array
    updateBallCount(); // Call the function after removing the ball
  }


function handle(numBalls){
    if (balls.length === 0) 
    {  // displaying game over when the number of ants are all killed 
        ctx.font = "60px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
        return;
      }

    for (let i=0; i<numBalls;i++){
        balls[i].draw();
        balls[i].update();
    }
}


function killAnt(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    console.log(mouseX); // tells where the mouse is in x coordinate 
    const mouseY = event.clientY - rect.top;
  
    for (let i = 0; i < balls.length; i++) {
      const ball = balls[i];
      const dx = mouseX - ball.x;
      const dy = mouseY - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
  
      if (distance <= ball.size) {
        balls.splice(i, 1); // Remove the ball from the array
        // updateBallCount();
        antsKilled++; // Incrementing the count of ants killed
        updateAntsKilledCount();
        ball.smashed = true;
        break; // Exit the loop after killing one ant
      }
    }
  }

  function updateAntsKilledCount() {
    const antsKilledElement = document.getElementById('antsKilled');
    antsKilledElement.innerHTML = `Ants Killed: ${antsKilled}`;
    // console.log(antsKilledElement);
  }

// to generate small circle 
function init(){
    ctx.clearRect(0,0, canvas.width, canvas.height)
    handle(balls.length);
    animationId = requestAnimationFrame(init);
    updateAntsKilledCount();
 // it will run in the loop 
}


init(); // starts the whole thing 
