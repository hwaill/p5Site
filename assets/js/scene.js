function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  noLoop();

  drawMountainBackground();
}

function draw() {

}

function drawMountainBackground() {
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

  loadPixels();
  for (var y = 0; y < windowHeight; y++) {
    for (var x = 0; x < windowWidth; x++) {
      colorPixel(x, y, colors[0]);
    }
  }
  updatePixels();


  var startingHeight;
  var thisHeight;
  for (var mountainLevel = 10; mountainLevel > 0; mountainLevel--) {
    var startingHeight = (Math.log10(mountainLevel) + 1) * 50;
    loadPixels();
    for (var imageColumn = 0; imageColumn < windowWidth; imageColumn++) {
      thisHeight = int((windowHeight / 2) - (startingHeight + (noise(mountainLevel, imageColumn * mountainLevel * 0.01) - 0.5) * 20));
      colorPixelsBelow(imageColumn, thisHeight, colors[11 - mountainLevel]);
    }
    updatePixels();
  }

  loadPixels();
  for (var col = 0; col < windowWidth; col++) {
    colorPixelsBelow(col, windowHeight / 2, colors[11]);
  }
  updatePixels();
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
  pixels[index] = red(color);
  pixels[index + 1] = green(color);
  pixels[index + 2] = blue(color);
  pixels[index + 3] = 255;
}