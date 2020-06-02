var floorLevel;
var leafImage;

class Leaf {
  constructor(startingPosition, diameter) {
    this.position = startingPosition;
    this.velocity = createVector(random(-1, 1), 4);
    this.acceleration = createVector(-2, 4).limit(.083);

    this.maxVelocity = 2;

    this.diameter = diameter;
    this.floorY = floorLevel + random(-2, 2);

    this.isOnFloor = false;
    this.isLocked = true;
  }

  show(sceneTime) {
    if (!this.isOnFloor) {
      if (this.isLocked) {
        if (random(50) < 0.45 * sceneTime) {
          this.isLocked = false;
        }
      } else {
        this.position.add(this.velocity.add(this.acceleration).limit(this.maxVelocity));
        if (this.position.y > this.floorY) {
          this.isOnFloor = true;
        }
      }
    }
    image(leafImage, this.position.x - this.diameter / 2, this.position.y - this.diameter / 2, this.diameter, this.diameter);
  }
}

class Tree {
  constructor(startingPoint, branchLevel, levelsSinceLastBranch, angle) {
    this.startingLength = 20;
    this.children = [];
    this.hasGrown = false;
    this.branchLevel = branchLevel;
    this.levelsSinceLastBranch = levelsSinceLastBranch;
    this.myLength = random(0.8, 1.1) * this.startingLength * pow(0.9, this.branchLevel);
    this.myWidth = this.startingLength * pow(0.85, this.branchLevel) / 4;
    this.branchVector = p5.Vector.fromAngle(angle).mult(this.myLength);
    this.startingPoint = startingPoint;
    this.endingPoint = p5.Vector.add(this.startingPoint, this.branchVector);
  }

  grow() {
    if (!this.hasGrown) {
      if (random(1) < 0.4 + 0.2 * this.levelsSinceLastBranch) {
        this.children.push(new Tree(this.endingPoint, this.branchLevel + 1, 0, -.3 + random(-0.1, 0.1) + this.branchVector.heading()));
        this.children.push(new Tree(this.endingPoint, this.branchLevel + 1, 0, .3 + random(-0.1, 0.1) + this.branchVector.heading()));
      } else {
        this.children.push(new Tree(this.endingPoint, this.branchLevel, this.levelsSinceLastBranch + 1, random(-0.1, 0.1) + this.branchVector.heading()));
        this.children[0].grow();
      }
      this.hasGrown = true;
    } else {
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].grow();
      }
    }
  }

  addLeaves(leafArray) {
    if (!this.hasGrown) {
      for (var i = 0; i < 4; i++) {
        leafArray.push(new Leaf(this.endingPoint.copy(), random(3, 6)));
      }
    } else {
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].addLeaves(leafArray);
      }
    }
  }

  show(image) {
    image.strokeWeight(this.myWidth);
    image.line(this.startingPoint.x, this.startingPoint.y, this.endingPoint.x, this.endingPoint.y);
    if (this.hasGrown) {
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].show(image);
      }
    }
  }
}

var mountainImage;
var treeImage;
var leafArray;
var myTree;

var sceneTime = 0;

var currWidth, currHeight;

function setup() {
  pixelDensity(1);
  var myCanvas = createCanvas(windowWidth, windowHeight);
  currWidth = windowWidth;
  currHeight = windowHeight;
  myCanvas.style("display", "block");
  myCanvas.parent("sceneHolder");
  frameRate(30);

  floorLevel = windowHeight * 0.55;

  createLeafImage();
  createMountainImage();

  leafArray = [];

  myTree = new Tree(createVector(0.7 * windowWidth, 0.55 * windowHeight), 0, 0, -PI / 2 + 0.1);
  treeImage = createGraphics(windowWidth, windowHeight);
  treeImage.stroke(color(0, 0, 0));
  for (var i = 0; i < 9; i++) {
    myTree.grow();
  }
  myTree.addLeaves(leafArray);

  myTree.show(treeImage);


}

function draw() {
  image(mountainImage, 0, 0);
  image(treeImage, windowWidth - treeImage.width, windowHeight - treeImage.height, treeImage.width, treeImage.height);
  for (var i = 0; i < leafArray.length; i++) {
    leafArray[i].show(sceneTime);
  }

  sceneTime += 2e-3;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createMountainImage();

  var widthDiff = windowWidth - currWidth;
  var heightDiff = windowHeight - currHeight;
  for (var i = 0; i < leafArray.length; i++) {
    leafArray[i].position.x += widthDiff;
    leafArray[i].position.y += heightDiff;
  }

  currWidth = windowWidth;
  currHeight = windowHeight;
}

function createLeafImage() {
  leafImage = createImage(40, 40);
  leafImage.loadPixels();
  for (var x = 0; x < 40; x++) {
    for (var y = 0; y < 40; y++) {
      if (sqrt(pow(20 - x, 2) + pow(20 - y, 2)) <= 20) {
        colorPixel(x, y, color('#e1873e'), leafImage);
      }
    }
  }
  leafImage.updatePixels();
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
      colorPixel(x, y, colors[0], mountainImage);
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
      colorPixelsBelow(imageColumn, thisHeight, colors[11 - mountainLevel], mountainImage);
    }
    mountainImage.updatePixels();
  }

  mountainImage.loadPixels();
  for (var col = 0; col < windowWidth; col++) {
    colorPixelsBelow(col, windowHeight / 2, colors[11], mountainImage);
  }
  mountainImage.updatePixels();
}

function colorPixelsBelow(x, y, color, image) {
  for (var pixel = y; pixel < image.height; pixel++) {
    if (pixel >= 0) {
      colorPixel(x, pixel, color, image);
    }
  }
}

function colorPixel(x, y, color, image) {
  var index = (x + y * image.width) * 4;
  image.pixels[index] = red(color);
  image.pixels[index + 1] = green(color);
  image.pixels[index + 2] = blue(color);
  image.pixels[index + 3] = 255;
}