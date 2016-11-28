///<reference path="jquery-1.6.4-vsdoc.js" />

// Define the globals we'll be using throughout the code
var baseCanvas;
var baseContext;
var canvas;
var context;
var gameW = 600;
var gameH = 600;
var hero = null;
// Variable to hold the time stamp for the last game loop call
var lastUpdate = null;
// The FPS rate we want to simulate with our loop
var desiredFps = 30
// To get a timer ratio we divide 1s (1000ms) by our desired frame rate
var timerRatio = 1000 / desiredFps;
// variable to determine how many rocks to draw into the scene
var numRocks = 25;
// array to hold all of the rock objects we have
var rocks = new Array();
// variable to hold our base rock image
var baseRock = null;

function staticObject()
{
    // the width and height of the sprites for our static objects
    // I'm using 32x32 as the default grid size
    this.width = 32;
    this.height = 32;
    // Place it at a random spot on the screen to start
    this.x = this.width * Math.floor(Math.random() * ((gameW - this.width * 1) / this.width)) + this.width;
    this.y = this.height * Math.floor(Math.random() * ((gameH - this.height * 1) / this.height)) + this.height;
    // What image are we using for the object
    this.image;
    // Do we have a collision event?
    this.collision = false;

    this.render = function()
    {
        // drawImage takes for parameters:
        //      the image to draw
        //      the x and y coordinates to use from the source image
        //      the width and height to use from the source image
        //      the x and y coordinates to draw it to on the canvas
        //      the width and height to draw it into on the canvas
        baseContext.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    };
};

function heroObject()
{
    // The width and height of the sprites for our hero
    this.width = 32;
    this.height = 32;
    // Place it at a random spot on the screen to start
    this.x = this.width * Math.floor(Math.random() * (gameW / this.width));
    this.y = this.height * Math.floor(Math.random() * (gameH / this.height));
    // An array to hold the information about which keyboard keys are pressed
    this.keys = new Array();
    // When was the last time we drew the hero to the screen
    this.lastRender = Date.now();
    // What delay do we want to use between switching sprites (in milliseconds)
    this.animSpeed = 250;
    // What image are we using for the hero
    this.image = new Image();
    // Which sprite in the image are we currently rendering
    this.whichSprite = 0;
    // How many pixels do we want to move the hero each loop
    this.moveSpeed = 4;
    // Do we have a collision event?
    this.collision = false;

    this.render = function()
    {
        // drawImage takes for parameters:
        //      the image to draw
        //      the x and y coordinates to use from the source image
        //      the width and height to use from the source image
        //      the x and y coordinates to draw it to on the canvas
        //      the width and height to draw it into on the canvas
        context.drawImage(this.image, this.whichSprite, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    };

    this.checkCollision = function(obj)
    {
        // check to see if our x coordinate is inside the object and
        // our y coordinate is also inside the object
        if ((this.x < (obj.x + obj.width) && Math.floor(this.x + this.width) > obj.x)
            && (this.y < (obj.y + obj.height) && Math.floor(this.y + this.height) > obj.y))
        {
            return true;
        }
    };

    this.update = function(elapsed)
    {
        // store out the current x and y coordinates
        var prevX = this.x;
        var prevY = this.y;
        // reset the collision property
        this.collision = false;

        var now = Date.now();
        // How long has it been since we last updated the sprite
        var delta = now - this.lastRender;

        // perform a switch statement on the last key pushed into the array
        // this allows us to always move the direction of the most recently pressed
        // key
        switch (this.keys[this.keys.length - 1])
        {
            case 37:
                // move the hero left on the screen
                this.x -= this.moveSpeed * elapsed;
                // Check if the animation timer has elapsed or if we aren't using one of the
                // two valid sprites for this direction
                if (delta > this.animSpeed
                    || (this.whichSprite != this.width * 2 && this.whichSprite != this.width * 3))
                {
                    // The sprites for moving left are the 3rd and 4th sprites in the image (0 based index)
                    this.whichSprite = this.whichSprite == this.width * 2 ? this.width * 3 : this.width * 2;
                    this.lastRender = now;
                }
                break;
            case 38:
                // move the hero up on the screen
                this.y -= this.moveSpeed * elapsed;
                // Check if the animation timer has elapsed or if we aren't using one of the
                // two valid sprites for this direction
                if (delta > this.animSpeed
                    || (this.whichSprite != this.width * 6 && this.whichSprite != this.width * 7))
                {
                    // The sprites for moving up are the 7th and 8th sprites in the image (0 based index)
                    this.whichSprite = this.whichSprite == this.width * 6 ? this.width * 7 : this.width * 6;
                    this.lastRender = now;
                }
                break;
            case 39:
                // move the hero right on the screen
                this.x += this.moveSpeed * elapsed;
                // Check if the animation timer has elapsed or if we aren't using one of the
                // two valid sprites for this direction
                if (delta > this.animSpeed
                    || (this.whichSprite != this.width * 4 && this.whichSprite != this.width * 5))
                {
                    // The sprites for moving right are the 5th and 6th sprites in the image (0 based index)
                    this.whichSprite = this.whichSprite == this.width * 4 ? this.width * 5 : this.width * 4;
                    this.lastRender = now;
                }
                break;
            case 40:
                // move the hero down on the screen
                this.y += this.moveSpeed * elapsed;
                // Check if the animation timer has elapsed or if we aren't using one of the
                // two valid sprites for this direction
                if (delta > this.animSpeed
                    || (this.whichSprite != 0 && this.whichSprite != this.width))
                {
                    // The sprites for moving down are the 1st and 2nd sprites in the image (0 based index)
                    this.whichSprite = this.whichSprite == 0 ? this.width : 0;
                    this.lastRender = now;
                }
                break;
        }

        // This code handles wrapping the hero from one edge of the canvas to the other
        if (this.x < -this.width)
        {
            this.x = gameW - this.width;
        }
        if (this.x >= gameW)
        {
            this.x = 0;
        }
        if (this.y < -this.height)
        {
            this.y = gameH - this.height;
        }
        if (this.y >= gameH)
        {
            this.y = 0;
        }

        // loop through all of the rocks in the array
        // we use an for-in loop to go through the rocks in case
        // we later add some logic that can destroy static objects
        // a regular for loop could break with null values if that happens
        for (iter in rocks)
        {
            // if we already have a collision there's no need to continue
            // check the other rocks
            if (this.collision)
            {
                break;
            }
            else
            {
                // check to see if we have a collision event with the
                // current rock
                if (this.checkCollision(rocks[iter]))
                {
                    // reset our x and y coordinates and set our collision property to true
                    this.x = prevX;
                    this.y = prevY;
                    this.collision = true;
                }
            }
        }

        // This code would cause the edges of the canvas to be a barrier
        //        if (this.x < 0)
        //        {
        //            this.x += this.moveSpeed * elapsed;
        //        }
        //        if (this.x + this.width >= gameW)
        //        {
        //            this.x -= this.moveSpeed * elapsed;
        //        }
        //        if (this.y < 0)
        //        {
        //            this.y += this.moveSpeed * elapsed;
        //        }
        //        if (this.y + this.height >= gameH)
        //        {
        //            this.y -= this.moveSpeed * elapsed;
        //        }
    };
};

function initCanvas()
{
    // retrieve a reference to the canvas object
    canvas = document.getElementById("mainCanvas");
    // create a context object from our canvas
    context = canvas.getContext("2d");

    // retrieve a reference to the base canvas object
    baseCanvas = document.getElementById("baseCanvas");
    // create a context object from our baseCanvas
    baseContext = baseCanvas.getContext("2d");

    // set the width and height of the canvas
    canvas.width = gameW;
    canvas.height = gameH;

    // set the width and height of the baseCanvas
    baseCanvas.width = gameW;
    baseCanvas.height = gameH;

    // we no longer fill the main canvas with anything, we just let the
    // base canvas show through
    // tell the baseContext we are going to use a dark green fill color
    baseContext.fillStyle = "#004400";
    // fill the entire baseContext with the color
    baseContext.fillRect(0, 0, gameW, gameH);
}

function initHero()
{
    // instantiate a heroObject
    hero = new heroObject();
    // set it's image to the proper src URL
    hero.image.src = "images/Mage_Sprite.png";
    // once the image has completed loading, render it to the screen
    hero.image.onload = function()
    {
        hero.render();
    };
}

function initRocks()
{
    // Set up the base rock Image object
    // and load in the correct image we want to use
    baseRock = new Image();
    baseRock.src = "images/SimpleBrick.png";
    // once it has loaded into memory we loop through 
    // and create a new staticObject and set the image to our base
    baseRock.onload = function()
    {
        for (var i = 0; i < numRocks; i++)
        {
            // this creates the rock which we set up to have a random
            // x and y coordinate
            rocks[i] = new staticObject();

            // check to see if we have a collision between this rock and
            // the hero object, if so we generate new coordinates for the rock
            while (hero.checkCollision(rocks[i]))
            {
                rocks[i].x = this.width * Math.floor(Math.random() * ((gameW - this.width * 2) / this.width)) + this.width;
                rocks[i].y = this.height * Math.floor(Math.random() * ((gameH - this.height * 2) / this.height)) + this.height;
            }

            // use the baseRock object as our image
            rocks[i].image = baseRock;
            // render it to the baseContext
            rocks[i].render();
        }
    };
}

$(window).load(function()
{
    initCanvas();
    initHero();
    initRocks();

    lastUpdate = Date.now();
    // call the gameLoop as fast as possible
    setInterval(gameLoop, 1);
});

function gameLoop()
{
    var now = Date.now();
    // calculate how long as passed since our last iteration
    var elapsed = now - lastUpdate;
    
    // clear the entire canvas
    context.clearRect(0, 0, gameW, gameH);

    // Update the hero based upon how long it took for the game loop
    hero.update(elapsed / timerRatio);
    
    // draw the player to the screen again
    hero.render();

    lastUpdate = now;
}

$(document).keydown(function(event)
{
    // check if the key being pressed is one of the arrow keys
    if (event.keyCode < 41 && event.keyCode > 36)
    {
        // block the default browser action for the arrow keys
        event.preventDefault();

        // check to see if this key is already in the array
        // of keys being pressed, if not add it to the array
        curKey = $.inArray(event.keyCode, hero.keys);
        if (curKey == -1)
            hero.keys.push(event.keyCode);
    }
});

$(document).keyup(function(event)
{
    if (event.keyCode < 41 && event.keyCode > 36)
    {
        // block the default browser action for the arrow keys
        event.preventDefault();

        // check to see if this key is already in the array
        // of keys being pressed, if so remove it from the array
        curKey = $.inArray(event.keyCode, hero.keys);
        if (curKey > -1)
            hero.keys.splice(curKey, 1);
    }
});