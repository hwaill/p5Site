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
    color('#fa6e8d'),
    color('#e36b87'),
    color('#cd6881'),
    color('#b7657b'),
    color('#a16175'),
    color('#8a5d6f'),
    color('#745869'),
    color('#5e5363'),
    color('#464e5e'),
    color('#2a4858')
  ];

  loadPixels();
  for (var y = 0; y < windowHeight; y++) {
    for (var x = 0; x < windowWidth; x++) {
      colorPixel(x, y, colors[0]);
    }
  }
  updatePixels();
}

function colorPixel(x, y, color) {
  var index = (x + y * windowWidth) * 4;
  pixels[index] = red(color);
  pixels[index + 1] = green(color);
  pixels[index + 2] = blue(color);
  pixels[index + 3] = 255;
}