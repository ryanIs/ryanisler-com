/**
 * Background.js
 * 
 * Background.js is in charge of animating the background. It attches to a canvas
 * element and creates circles which change colors as time continues.
 */

var FPS = 30;
var MAX_CIRCLES = 180; // 256
var MAX_CIRCLES_DEFAULT = 140;
var CIRCLE_DIAMETER = 40;
var CANVAS_WIDTH = window.innerWidth; // Must be actual canavs width & height (2k,1.2k)
var CANVAS_HEIGHT = window.innerHeight;
var canvasBaseR = 220;
var canvasBaseG = 220;
var canvasBaseB = 220;
var canvasBaseA = 0.1;
var canvasFillColorMaxDistance = 40;
var circleColorChangeTime = FPS * 10;
var introductionBaseRestTime = (FPS * 12);

var canvas;
var ctx;
var circles = [];
var circleInterval;
var circleColorChangeTimer = circleColorChangeTime;
var circleAddTimer = 0;
var circlesAdded = 0;
var backgroundMode;

/**
 * Log to the console (short-hand).
 * 
 * @param {String} _ Output text to log.
 * @returns Console.log return data.
 */
var cl = function(_) { return console.log(_); };

/**
 * Get a random number.
 * 
 * @param {Number} _ Get a random number from 0 up to _.
 * @returns {Number} Random number.
 */
var random = function(_) { return Math.floor( Math.random() * _ ); };

/**
 * Initiate the index background canvas. (currently only the circles mode available)
 * 
 * @param {String} playMode Play mode of the background.
 */
function initCanvas(playMode = 'DEFAULT') {
  if(playMode != 'NONE') {
    setPlayMode(playMode)

    canvas = document.getElementById("background-canvas"); 
    ctx = canvas.getContext("2d"); 

    // Handle size of canvas on init and resize
    setCanvasWidthAndHeight(window.innerWidth, window.innerHeight)
    window.addEventListener('resize', windowResizeHandler);

    initCircles();

  }
}

/**
 * Window resize handler. Handles the adjustments of the canvas height and width 
 * based on the window size.
 */
function windowResizeHandler() {
  setCanvasWidthAndHeight(window.innerWidth, window.innerHeight)
}

/**
 * Set the canvas width and height.
 * 
 * @param {Number} width New canvas width.
 * @param {Number} height New canvas height.
 */
function setCanvasWidthAndHeight(width, height) {
  CANVAS_WIDTH = width;
  CANVAS_HEIGHT = height;
  ctx.canvas.width  = width;
  ctx.canvas.height = height;
}

/**
 * Sets the play mode. Determines the number of MAX_CIRCLES to generate. 
 * The LITE mode helps reduce CPU usage.
 * @param {String} mode The mode (OPTIONS: 'LITE')
 */
function setPlayMode(mode) {

  mode = mode.toUpperCase()

  if(mode == 'LITE') {
    MAX_CIRCLES = 10;
  }

  backgroundMode = mode
}

/**
 * Initiate the circles handler.
 */
function initCircles() {
  /*
  for(let i = 0; i < 0; i++) {
      let _color = canvasBaseFillColor + random(canvasFillColorMaxDistance);
      addCircle(CIRCLE_DIAMETER, random(CANVAS_WIDTH), random(CANVAS_HEIGHT), [_color, _color, _color, 0.8] );
  }
  */

  circleInterval = setInterval(circlesHandler, Math.round(1000/FPS));
}

/**
 * Unload the background.
 */
function unloadBG() {
  clearInterval(circleInterval)
  window.removeEventListener('resize', windowResizeHandler)
}

/**
 * Update a circle instance.
 * Runs every frame.
 */
function circleUpdateHandler() { 

  // Movement handling
  if(this.moveTimer > 0) {
      if(this.x < this.destX) {
          this.moveX += 0.1;
          if(this.moveX > this.moveSpeedMax) this.moveX = this.moveSpeedMax;
      } else {
          this.moveX -= 0.1;
          if(this.moveX < -this.moveSpeedMax) this.moveX = -this.moveSpeedMax;
      }
      if(this.y < this.destY) {
          this.moveY += 0.1;
          if(this.moveY > this.moveSpeedMax) this.moveY = this.moveSpeedMax;
      } else {
          this.moveY -= 0.1;
          if(this.moveY < -this.moveSpeedMax) this.moveY = -this.moveSpeedMax;
      }
  } 
  
  // Slow it down to idle
  else {
    if(this.moveX > 0) {
      this.moveX -= 0.1;
    } else {
      this.moveX += 0.1;
    }
    if(this.moveY > 0) {
      this.moveY -= 0.1;
    } else {
      this.moveY += 0.1;
    }
  }

  if(this.moveTime == Math.round(this.moveTime/2)) {
    if(random(4) == 0) this.destX = this.x + (this.moveX * 20);
    if(random(4) == 1) this.destY = this.y + (this.moveY * 20);
  }

  if(this.moveTimer < -this.idleTime) {
    this.moveTo(random(CANVAS_WIDTH), random(CANVAS_HEIGHT));
  }

  this.moveTimer -= 1;

  this.x += this.moveX;
  this.y += this.moveY;

  // Fade-in introduction
  if(this.introductionTimer[0] < FPS * 2) {
    this.fillStyle[3] += this.introductionTimer[1] / (FPS * 2);
    this.width += (420 - this.width) / 20;
  } else if(this.introductionTimer[0] == FPS * 2) {
    this.fillStyle[3] = this.introductionTimer[1];
    this.width = 400;
  } else if(this.introductionTimer[0] > this.introductionRestTime) {
    this.introductionTimer[0] = 0;
    this.width = CIRCLE_DIAMETER;
    this.fillStyle[3] = 0.0;
  }
  this.introductionTimer[0]++;

  // Update color
  if(this.fillStyleUpdateRequired) {
    if(this.fillStyle[0] < this.destFillStyle[0]) {
        this.fillStyle[0] += 1;
    } else if(this.fillStyle[0] > this.destFillStyle[0]) {
        this.fillStyle[0] -= 1;
    } else {
        if(this.fillStyle[1] < this.destFillStyle[1]) {
            this.fillStyle[1] += 1;
        } else if(this.fillStyle[1] > this.destFillStyle[1]) {
            this.fillStyle[1] -= 1;
        } else {
            if(this.fillStyle[2] < this.destFillStyle[2]) {
                this.fillStyle[2] += 1;
            } else if(this.fillStyle[1] > this.destFillStyle[2]) {
                this.fillStyle[2] -= 1;
            } else {
                this.fillStyleUpdateRequired = false;
            }
        }
    }
  }

  // Render
  this.render();
}

/**
 * Move a circle to an X and Y coordinate.
 * 
 * @param {Number} destinationX X coordinate to move to.
 * @param {Number} destinationY Y coordinate to move to.
 */
function circleMoveTo(destinationX, destinationY) {
  this.destX = destinationX;
  this.destY = destinationY;
  this.moveTime += FPS;
  this.moveTimer = this.moveTime; 
  this.idleTime = (FPS * 5) + (FPS * random(8));
}

/**
 * Get a CSS rgb string.
 * 
 * @param {Number} red Red offset.
 * @param {Number} green Green offset.
 * @param {Number} blue Blue offset.
 * @returns {String} RGB string.
 */
function rgb(red, green, blue) {
  return "rgb(" + red + ", " + green + ", " + blue + ")";
}

/**
 * Get a CSS rgba string.
 * 
 * @param {Number} red Red offset.
 * @param {Number} green Green offset.
 * @param {Number} blue Blue offset.
 * @param {Number} alpha Alpha offset.
 * @returns {String} RGBA string.
 */
function rgba(red, green, blue, alpha) {
  return "rgb(" + red + ", " + green + ", " + blue + ", " + alpha + ")";
}

/**
 * Add a circle instance.
 * 
 * @param {Number} diameter The circle diameter.
 * @param {Number} startX The initial X coordinate for the circle.
 * @param {Number} startY The initial Y coordinate for the circle.
 * @param {String} circleFillStyle The fill style for the circle.
 */
function addCircle(diameter, startX, startY, circleFillStyle) {
  var newCircleObject = {
    fillStyleUpdateRequired: false,
    destFillStyle: []
  };

  // Width of circle
  newCircleObject.width = diameter;

  // Starting position
  newCircleObject.x = startX;
  newCircleObject.y = startY;

  // Position circle wants to move to
  newCircleObject.destX = startX;
  newCircleObject.destY = startY;

  // Amount of distance to move circle per update frame
  newCircleObject.moveX = 0;
  newCircleObject.moveY = 0;

  // Maximum possible movement speed
  newCircleObject.moveSpeedMax = 2 + random(6);

  // Movement duration (timer)
  newCircleObject.moveTimer = 0;

  // Maximum movement duration
  newCircleObject.moveTime = FPS + (FPS * random(5));

  // Maximum movement duration
  newCircleObject.idleTime = (FPS * 1) + (FPS * random(8));

  // Update function (called FPS times per second)
  newCircleObject.update = circleUpdateHandler;

  // Move function for initiating movement
  newCircleObject.moveTo = circleMoveTo;

  // Render
  newCircleObject.fillStyle = circleFillStyle;
  newCircleObject.render = drawCircle;

  // Fade-in init
  newCircleObject.introductionTimer = [0, circleFillStyle[3]];
  newCircleObject.introductionRestTime = introductionBaseRestTime + (FPS * random(10));
  newCircleObject.fillStyle[3] = 0.0;

  circles.push(newCircleObject);
  newCircleObject.render();
}

/**
 * Draws a this circle on the canvas context.
 */
function drawCircle() {
  ctx.beginPath();
  //ctx.shadowColor = '#999';
  //ctx.shadowBlur = 1;
  ctx.fillStyle = rgba(this.fillStyle[0], this.fillStyle[1], this.fillStyle[2], this.fillStyle[3]);
  ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
  ctx.fill();
}

/**
 * Change the color of this circle to a random one.
 */
function changeColor() {
  
  canvasBaseR = random(256);
  canvasBaseG = random(256);
  canvasBaseB = random(256);
  //canvasFillColorMaxDistance = random(40);
  
  for(let i = 0; i < circles.length; i++) {
      if(circles[i] != null) {
          let colorVariety = random(canvasFillColorMaxDistance);
          circles[i].fillStyleUpdateRequired = true;
          circles[i].destFillStyle = [canvasBaseR + colorVariety, canvasBaseG + colorVariety, canvasBaseB + colorVariety]
      }
  }

}

/**
 * Handles redrawing, updating, color changes, and adding circles.
 * Called every FPS times per second.
 */
function circlesHandler() {

  // clear canvas for redrawing
  clearCtx();

  // Update and render circles
  for(let i = 0; i < circles.length; i++) {
    if(circles[i] != null) {
      circles[i].update();
    }
  }

  // Color change handler
  if(--circleColorChangeTimer < 1) {
    changeColor();
    circleColorChangeTimer = circleColorChangeTime;
  }

  // Handle introduction fade in
  if(circlesAdded < MAX_CIRCLES) {
    if(circleAddTimer++ % 5 == 0) {
      let randomIncrease = random(canvasFillColorMaxDistance);
      let circleInitRed = canvasBaseR + randomIncrease;
      let circleInitGreen = canvasBaseG + randomIncrease;
      let circleInitBlue = canvasBaseB + randomIncrease;
      let circleInitAlpha = canvasBaseA;
      addCircle(CIRCLE_DIAMETER, random(CANVAS_WIDTH), random(CANVAS_HEIGHT), [circleInitRed, circleInitGreen, circleInitBlue, circleInitAlpha] );
      circlesAdded += 1;
    }
  }
  
}

/**
 * Clear the canvas content.
 */
function clearCtx() {

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

}

export default {initCanvas, unloadBG}