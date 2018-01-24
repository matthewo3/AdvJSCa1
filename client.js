let asteroids = [];
let bullets = [];
let barriers = [];
let ship;
let enemyleft;
let boss;
let score = 0;
let lives = 3;
let bossLives = 3;
let meteor;



function setup() {
    createCanvas(600, 400);
    ship = new Ship();
    boss = new Boss();
    meteor = new Meteor();


    for (let i = 0; i < 11; i++) {
        let x = random(width);
        asteroids[i] = new Asteroid(i * 40, 35, 30);
    }

    for (let i = 0; i < 3; i++) {
        barriers[i] = new Barrier;
    }
    enemyleft = asteroids.length;
} //End of Setup


function draw() {
    background(255);
    ellipseMode(CENTER);
    rectMode(CENTER);
    background(0);

    //Calling meteor functions
    meteor.move();
    meteor.bounce();
    meteor.show();

    //Calling ship functions
    ship.show();
    ship.move()

    //calling the boss functions
    boss.show();
    boss.move();
    boss.fire();
    boss.hits();

    //Calling the different outcomes
    endGame();
    winGame();

    //this removes a bullet from the bullets array if more than one bullet is shot
    if (bullets.length > 1) {
        bullets.splice(0, 1);
    }

    let edge = false;
    //loops through asteroids array and calls funcrtions for each asteroid.
    for (let a of asteroids) {
        a.show();
        a.move();
        //checks if the asteroids hit both sides of the canvas
        if (a.x > width || a.x < 0) {
            edge = true;
        }
    }
    //loops through the array of asteroids and calls the function for each individual asteroid
    if (edge) {
        for (let a of asteroids) {
            a.shiftDown();
            a.playerHit();
        }
    }

    //again loops through the bullets array and calls the functions for each bullet
    for (let b of bullets) {
        b.move();
        b.show();
        b.destroy();
        for (let i = 0; i < asteroids.length; i++) {
            //calls the hit function from the bullet class which checks to see if it hit the asteroid
            if (b.hits(asteroids[i])) {
                console.log("Asteroid hit");
                score += 3;
                //if the asteroid is hit, that asteroid is removed from array
                asteroids.splice(i, 1);
                //the bullet is also removed from the array and the user can then fire the bullet again 
                bullets.splice(0, 1);
                enemyleft--;
            }
            if (b.hits2(boss)) {
                bullets.splice(0, 1);
                console.log("Boss hit");
                score += 1;
                bossLives--;

            }
        }
        //this calls the hits function if a bullet hits the meteor
        if (b.hits3(meteor)) {
            //removes the bullet if it hits
            bullets.splice(0, 1);

            //sets the meteor to false so its removed
            meteor.appear = false;
            //adds the score
            score += 20;
            b.speed = 20;
        }
    }

    textSize(12);
    fill(255);
    text("Lives: " + lives, 500, 375);
    text("Score: " + score, 50, 375);
    text("Boss Lives: " + bossLives, 50, 40);
} //End of Draw 


function keyPressed() {
    //if space is pressed 
    if (key === ' ') {
        //create a new bullet atthe ships coordinates
        let a = new Bullet(ship.x, ship.y, 10);
        //push this bullet into the array
        bullets.push(a);
    }
    //if arrow pressed, call the set direction function of the ship to move
    if (keyCode === RIGHT_ARROW) {
        ship.setDir(1);
    } else if (keyCode === LEFT_ARROW) {
        ship.setDir(-1);
    }
}
//this is so that the ship can fire whilst moving
function keyReleased() {
    if (key != ' ') {
        ship.setDir(0);
    }
}

class Meteor {
    constructor() {
        this.x = 300;
        this.y = 200;
        this.r = 20;
        this.xspeed = 10;
        this.yspeed = -10;
        this.appear = true;
    }
    show() {
        //if the meteor hasnt been hit then show
        if (this.appear) {
            noStroke();
            strokeWeight(4);
            fill(0, 0, 250);
            ellipse(this.x, this.y, this.r);
        }
    }

    move() {
        //move the x and y by the speed 
        this.x = this.x + this.xspeed;
        this.y = this.y + this.yspeed;
    }

    bounce() {
        //setting the bondaries so that if the meteor hits an edge, the direction is changed
        if (this.x > width || this.x < 0) {
            this.xspeed = this.xspeed * -1;
        }
        if (this.y > height || this.y < 0) {
            this.yspeed = this.yspeed * -1;
        }
    }

}
class Asteroid {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.toDelete = false;

        this.xdir = 2;
        this.ydir = 0;
    }

    shiftDown() {
        //this changes the direction the asteroids move in the x axis
        this.xdir *= -1;
        //this moves the asteroids down a row by adding to their y value
        this.y += this.r;
    }
    move() {
        this.x = this.x + this.xdir;
        this.y = this.y + this.ydir;
    }
    show() {
        noStroke();
        fill(250);
        ellipse(this.x, this.y, this.r);
    }

    playerHit() {
        //testing if the asteroid hits the ship, by using the 
        if (this.x > ship.x && this.x < ship.x + ship.w && this.y > ship.y + ship.h) {
            this.xdir = -10;
            this.x = 0;
            ship.shipCrash = true;
        }
    }
}

class Ship {
    constructor() {
        this.x = width / 2;
        this.y = height - 10;
        this.w = 50;
        this.h = 20;
        this.xdir = 0;
        this.shipCrash = false;

    }
    show() {
        noStroke();
        fill(0, 250, 0);
        rectMode(CENTER);
        rect(this.x, this.y, this.w, this.h)
    }
    setDir(dir) {
        this.xdir = dir;
    }
    move(dir) {
        this.x += this.xdir * 10;
    }
}



class Bullet {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.speed = 15
    }
    move() {
        this.y = this.y - this.speed;

    }
    destroy() {
        //limits the amount of bullets to 1
        if (bullets.y < 0) {
            //removes bullet from array
            bullets.splice(0, 1);
        }
    }

    hits(asteroid) {
        let d = dist(this.x, this.y, asteroid.x, asteroid.y)
        if (d < this.r + asteroid.r) {
            return true;
        } else {
            return false;
        }
    }

    hits2() {
        if ((this.x > boss.x && this.x < boss.x + boss.w && this.y > boss.y + boss.h)) {


        }
    }


    hits3(meteor) {
        let d = dist(this.x, this.y, meteor.x, meteor.y)
        if (d < this.r + meteor.r) {
            return true;
        } else {
            return false;
        }
    }

    show() {
        fill(0, 250, 0);
        ellipse(this.x, this.y, this.r);
    }
}


class Barrier {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    show() {
        ellipse(this.x, this.y, this.r);
    }

}

class Boss {
    constructor() {
        this.x = 300;
        this.y = 0;
        this.w = 50;
        this.h = 30;
        this.bX = this.x + this.w / 2;
        this.bY = this.y + this.h / 2;
        this.bR = 10;
        this.bSpeed = 4.5;
    }
    show() {
        fill(250, 0, 0);
        noStroke();
        rect(this.x, this.y, this.w, this.h);
        ellipse(this.x, this.bY, this.bR);
    }
    move() {
        //cheking if the distance between the ship and the boss is greater than the ships x and width
        if (this.x + this.w / 2 < ship.x + ship.w / 2) {
            //if it is then it is moved by 3
            this.x += 3;
        }
        //this is for the opposite direction
        if (this.x + this.w / 2 > ship.x + ship.w / 2) {
            this.x -= 3;
        }
    }
    fire() {
        //if the bullet reaches the end of the canvas its reset to the boss ship
        this.bY += this.bSpeed;
        if (this.bY > height) {
            this.bY = this.y;
        }
    }
    hits() {
        if ((this.bX + this.bR) < ship.x + ship.w &&
            (this.bX + this.bR) > ship.x + ship.w &&
            (this.bY + this.bR) < ship.y + ship.h &&
            (this.bY + this.bR) > ship.y + ship.h) {
            console.log("enemy hit");


        }

    }


}

function endGame() {
    if (ship.shipCrash || lives === 0) {
        background(255, 0, 0);
        ship.x = 700;
        boss.bSpeed = 0;
        fill(255);
        noStroke();
        textSize(32);
        text("GAME OVER", 200, 200);
        textSize(20);
        text("Submit Your Score Above", 190, 240);
    }
}

function winGame() {
    if (enemyleft === 0) {
        background(0, 250, 0);
        ship.x = 700;
        boss.bSpeed = 0;
        fill(255);
        noStroke();
        textSize(32);
        text("WINNER!!!", 200, 200);
        textSize(20);
        text("Submit Your Score Above", 160, 230);

    }
}

window.onload = function() {
    //
    const button = document.getElementById('button');
    console.log(button);

    button.addEventListener('click', function(e) {
        let name = document.getElementById('name').value;
        fetch('/score', {
                method: 'PUT',
                body: JSON.stringify({
                    name: name,
                    score: score
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(function(response) {
                if (response.ok) {
                    console.log('score was updated in the DB.');
                    return;
                }
                throw new Error('Request failed.');
            })
            .catch(function(error) {
                console.log(error);
            });
    });
};