var floorLevel;

class Leaf {
  constructor(startingPosition, diameter) {
    this.position = startingPosition;
    this.velocity = createVector(random(-1, 1), 4);
    this.acceleration = createVector(-2, 4).limit(.083);

    this.maxVelocity = 2;

    this.diameter = diameter;
    this.floorY = floorLevel + (random(20) - 10);

    this.isOnFloor = false;
  }

  show() {
    if (!this.isOnFloor) {
      this.position.add(this.velocity.add(this.acceleration).limit(this.maxVelocity));
      noStroke();
      fill(color(255, 255, 255));
      if (this.position.y > this.floorY) {
        this.isOnFloor = true;
      }
    }
    circle(this.position.x, this.position.y, this.diameter);
  }
}

var mountainImage;
var myLeaf;

function setup() {
  pixelDensity(1);
  var myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.style("display", "block");
  myCanvas.parent("sceneHolder");
  frameRate(30);

  floorLevel = windowHeight * 0.55;

  createMountainImage();

  myLeaf = new Leaf(createVector(windowWidth / 2, windowHeight / 3), 10);
}

function draw() {
  image(mountainImage, 0, 0);
  myLeaf.show();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createMountainImage();
}

function createMountainImage() {
  var colors = [
    color('#ae0d93'),
    color('#a6198f'),
    color('#9e218a'),
    color('#962786'),
    color('#8d2d81'),
    color('#84317c'),
    color('#793677'),
    color('#6e3a71'),
    color('#623e6b'),
    color('#534165'),
    color('#42455f'),
    color('#2a4858')
  ];

  mountainImage = createImage(windowWidth, windowHeight);

  mountainImage.loadPixels();
  for (var y = 0; y < windowHeight; y++) {
    for (var x = 0; x < windowWidth; x++) {
      colorPixel(x, y, colors[0]);
    }
  }
  mountainImage.updatePixels();


  var startingHeight;
  var thisHeight;
  for (var mountainLevel = 10; mountainLevel > 0; mountainLevel--) {
    var startingHeight = (Math.log10(mountainLevel) + 1) * 50;
    mountainImage.loadPixels();
    for (var imageColumn = 0; imageColumn < windowWidth; imageColumn++) {
      thisHeight = int((windowHeight / 2) - (startingHeight + (noise(mountainLevel, imageColumn * mountainLevel * 0.01) - 0.5) * 20));
      colorPixelsBelow(imageColumn, thisHeight, colors[11 - mountainLevel]);
    }
    mountainImage.updatePixels();
  }

  mountainImage.loadPixels();
  for (var col = 0; col < windowWidth; col++) {
    colorPixelsBelow(col, windowHeight / 2, colors[11]);
  }
  mountainImage.updatePixels();
}

function colorPixelsBelow(x, y, color) {
  for (var pixel = y; pixel < windowHeight; pixel++) {
    if (pixel >= 0) {
      colorPixel(x, pixel, color);
    }
  }
}

function colorPixel(x, y, color) {
  var index = (x + y * windowWidth) * 4;
  mountainImage.pixels[index] = red(color);
  mountainImage.pixels[index + 1] = green(color);
  mountainImage.pixels[index + 2] = blue(color);
  mountainImage.pixels[index + 3] = 255;
}