let cameraScreen;
let blockSize = 20;
let blockSizeSlider;
let selectedColor1;
let replaceColor1;
let selectedColorDisplay1;
let replaceColorInput1;
let replaceButton1;
let replaceColorDisplay1;
let replaceActive1 = false;
let selectedColor2;
let replaceColor2;
let selectedColorDisplay2;
let replaceColorInput2;
let replaceButton2;
let replaceColorDisplay2;
let replaceActive2 = false;
let similaritySlider;
let similarityThreshold = 50; // Default similarity threshold
let currentSelection = 1; // 1 for color1, 2 for color2

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent('videoContainer');
  cameraScreen = createCapture(VIDEO);
  cameraScreen.size(width, height);
  cameraScreen.hide();

  blockSizeSlider = select('#blockSizeSlider');
  selectedColorDisplay1 = select('#selectedColorDisplay1');
  replaceColorInput1 = select('#replaceColorInput1');
  replaceColorDisplay1 = select('#replaceColorDisplay1');
  replaceButton1 = select('#replaceButton1');
  selectedColorDisplay2 = select('#selectedColorDisplay2');
  replaceColorInput2 = select('#replaceColorInput2');
  replaceColorDisplay2 = select('#replaceColorDisplay2');
  replaceButton2 = select('#replaceButton2');
  similaritySlider = select('#similaritySlider');

  let colorSelector1 = select('#colorSelector1');
  colorSelector1.mousePressed(() => currentSelection = 1);

  let colorSelector2 = select('#colorSelector2');
  colorSelector2.mousePressed(() => currentSelection = 2);

  replaceButton1.mousePressed(() => {
    replaceColor1 = color(replaceColorInput1.value());
    replaceColorDisplay1.style('background-color', replaceColor1.toString('#rrggbb'));
    replaceActive1 = true;
  });

  replaceButton2.mousePressed(() => {
    replaceColor2 = color(replaceColorInput2.value());
    replaceColorDisplay2.style('background-color', replaceColor2.toString('#rrggbb'));
    replaceActive2 = true;
  });

  selectedColor1 = color(255, 255, 255); // Default selected color 1
  selectedColor2 = color(255, 255, 255); // Default selected color 2
}

function draw() {
  blockSize = blockSizeSlider.value();
  similarityThreshold = similaritySlider.value();
  cameraScreen.loadPixels();

  if (cameraScreen.pixels.length > 0) { // Load camera screen before applying effect
    for (let y = 0; y < height; y += blockSize) {
      for (let x = 0; x < width; x += blockSize) {
        let avgColor = getAverageColor(x, y, blockSize);
        if (replaceActive1 && colorDistance(avgColor, selectedColor1) < similarityThreshold) {
          fill(replaceColor1);
        } else if (replaceActive2 && colorDistance(avgColor, selectedColor2) < similarityThreshold) {
          fill(replaceColor2);
        } else {
          fill(avgColor);
        }
        rect(x, y, blockSize, blockSize);
      }
    }
  }
}

function getAverageColor(startX, startY, size) {
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let count = 0;

  for (let y = startY; y < startY + size; y++) {
    for (let x = startX; x < startX + size; x++) {
      if (x < width && y < height) { // Check bounds
        let index = (y * width + x) * 4;
        sumR += cameraScreen.pixels[index];
        sumG += cameraScreen.pixels[index + 1];
        sumB += cameraScreen.pixels[index + 2];
        count++;
      }
    }
  }

  return color(sumR / count, sumG / count, sumB / count);
}

function mousePressed() {
  if (mouseX < width && mouseY < height) {
    let pixelColor = cameraScreen.get(mouseX, mouseY);
    if (currentSelection === 1) {
      selectedColor1 = color(pixelColor[0], pixelColor[1], pixelColor[2]);
      selectedColorDisplay1.style('background-color', selectedColor1.toString('#rrggbb'));
    } else if (currentSelection === 2) {
      selectedColor2 = color(pixelColor[0], pixelColor[1], pixelColor[2]);
      selectedColorDisplay2.style('background-color', selectedColor2.toString('#rrggbb'));
    }
  }
}

function colorDistance(c1, c2) {
  return dist(red(c1), green(c1), blue(c1), red(c2), green(c2), blue(c2));
}
