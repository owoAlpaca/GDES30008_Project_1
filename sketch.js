// The following sketch is based on example code provided by Kuan-Ju Wu: https://editor.p5js.org/kjwu.co/sketches/flzHaDxEl
// This project was completed with the help of ChatGPT - I used ChatGPT to help me optimize my code and implement some features, such as selecting buttons by their names in HTML.

// --- Start --- //

let cameraScreen; // Webcam Video
let blockSize = 20; // Pixelation Level (Block Number & Size)
let blockSizeSlider; // Slider Control Pixelation Level
let selectedColors = [];
let replaceColors = [];
let selectedColorInputs = [];
let replaceColorInputs = [];
let replaceButtons = [];
let resetButtons = [];
let replaceActives = [];
let similaritySlider; // Slider Control Similarity Threshold
let similarityThreshold = 50; // Default colour similarity threshold 
// Lower value -> Harder to replace selected colour & smaller selected area
// Higher value -> Easier to replace selected colour & larger selected area
let numColors = 2; // Number of color pairs
let filterButtons = []; // Filter preset buttons
let clickSound; // Click Sound

function preload() {
  clickSound = loadSound('click.mp3'); // Click Sound from Minecraft Menu Click Sound
}
// Preload Sound File

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight); // Fullscreen Canvas
  canvas.parent('videoContainer');
  cameraScreen = createCapture(VIDEO); // Apply Webcam Video to 'cameraScreen'
  cameraScreen.size(windowWidth, windowHeight);
  cameraScreen.hide();

  blockSizeSlider = select('#blockSizeSlider'); 
  similaritySlider = select('#similaritySlider'); // Apply Sliders from HTML

  for (let i = 1; i <= numColors; i++) {
    selectedColors.push(color(255, 255, 255)); // Default selected color
    replaceColors.push(color(255, 255, 255)); // Default replace color
    replaceActives.push(false); // Default not applying colour replacement

    selectedColorInputs.push(select(`#selectedColorInput${i}`));
    replaceColorInputs.push(select(`#replaceColorInput${i}`));
    replaceButtons.push(select(`#replaceButton${i}`));
    resetButtons.push(select(`#resetButton${i}`));
    // Using for loop functions allowed me to add more colour replacements, for Demo, only 2 colours are used

    replaceButtons[i - 1].mousePressed(() => {
      replaceColors[i - 1] = color(replaceColorInputs[i - 1].value());
      replaceActives[i - 1] = true;
      clickSound.play();
    });
    // Colour Replacement Button Function: Select -> Apply -> PlaySound

    resetButtons[i - 1].mousePressed(() => {
      replaceActives[i - 1] = false;
      clickSound.play();
    });
    // Colour Reset Button Function: Remove -> PlaySound

    selectedColorInputs[i - 1].input(() => {
      selectedColors[i - 1] = color(selectedColorInputs[i - 1].value());
    });
    // Colour Input Function
  }

  // Add filter preset buttons
  filterButtons.push(select('#filterButton1'));
  filterButtons.push(select('#filterButton2'));
  filterButtons.push(select('#filterButton3'));
  filterButtons.push(select('#filterButton4'));
  filterButtons.push(select('#filterButton5'));

  filterButtons.forEach((button, index) => {
    button.mousePressed(() => {
      applyFilterPreset(button.html().toLowerCase()); // Apply Filter based on button's name in lower cases
      clickSound.play();
    });
  });

  // Screenshot button
  select('#screenshotButton').mousePressed(() => {
    takeScreenshot();
    clickSound.play();
  });
}

function draw() {
  blockSize = blockSizeSlider.value();
  similarityThreshold = similaritySlider.value(); // Connect Sliders with their value
  cameraScreen.loadPixels(); // Pixelation
  loadPixels();

  if (cameraScreen.pixels.length > 0) { // Load camera screen before applying effect
    for (let y = 0; y < height; y += blockSize) {
      for (let x = 0; x < width; x += blockSize) {
        let avgColor = getAverageColor(x, y, blockSize); // Detect average colour in a block
        let newColor = avgColor; // Replace block with one colour
        for (let i = 0; i < numColors; i++) {
          if (replaceActives[i] && colorDistance(avgColor, selectedColors[i]) < similarityThreshold) {
            newColor = replaceColors[i];
            break; // Apply the first matching replacement
          }
        }
        fill(newColor);
        rect(x, y, blockSize, blockSize); // Stroke
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
        let index = (y * width + x) * 4; // colour index to find first value in x, y
        sumR += cameraScreen.pixels[index]; // Tunnel R
        sumG += cameraScreen.pixels[index + 1]; // Tunnel G
        sumB += cameraScreen.pixels[index + 2]; // Tunnel B
        count++;
      }
    }
  }

  return color(sumR / count, sumG / count, sumB / count);
}
// Used to calculate the Average R / G / B in a block: AverageR = sumR / count

function colorDistance(c1, c2) {
  return dist(red(c1), green(c1), blue(c1), red(c2), green(c2), blue(c2));
}

function applyFilterPreset(filterType) {
  switch (filterType) {
    case 'gameboy':
      selectedColors[0] = color(0, 0, 0); // Select Colour 1
      replaceColors[0] = color(48, 98, 48); // Colour apply to video
      selectedColorInputs[0].value('#000000'); 
      replaceColorInputs[0].value('#306230'); //Colour display on panel
      
      selectedColors[1] = color(255, 255, 255); // Select Colour 2
      replaceColors[1] = color(139, 172, 15);
      selectedColorInputs[1].value('#ffffff');
      replaceColorInputs[1].value('#8BAC0F');
      
      similarityThreshold = 240;
      similaritySlider.value(240);
      replaceActives[0] = true;
      replaceActives[1] = true;
    break;
    case 'sepia':
      selectedColors[0] = color(0, 0, 0);
      replaceColors[0] = color(112, 66, 20);
      selectedColorInputs[0].value('#000000');
      replaceColorInputs[0].value('#704214');
      
      selectedColors[1] = color(255, 255, 255);
      replaceColors[1] = color(255, 235, 205);
      selectedColorInputs[1].value('#ffffff');
      replaceColorInputs[1].value('#ffebcd');
      
      similarityThreshold = 240;
      similaritySlider.value(240);
      replaceActives[0] = true;
      replaceActives[1] = true;
    break;
    case ':(':
      selectedColors[0] = color(0, 0, 0);
      replaceColors[0] = color(255, 255, 255);
      selectedColorInputs[0].value('#000000');
      replaceColorInputs[0].value('#ffffff');
      
      selectedColors[1] = color(255, 255, 255);
      replaceColors[1] = color(51, 117, 208);
      selectedColorInputs[1].value('#ffffff');
      replaceColorInputs[1].value('#3375D0');
      
      similarityThreshold = 240;
      similaritySlider.value(240);
      replaceActives[0] = true;
      replaceActives[1] = true;
    break;
    case 'black and white':
      selectedColors[0] = color(255, 255, 255);
      replaceColors[0] = color(255, 255, 255);
      selectedColorInputs[0].value('#ffffff');
      replaceColorInputs[0].value('#ffffff');
      
      selectedColors[1] = color(0, 0, 0);
      replaceColors[1] = color(0, 0, 0);
      selectedColorInputs[1].value('#000000');
      replaceColorInputs[1].value('#000000');
      
      similarityThreshold = 240;
      similaritySlider.value(240);
      replaceActives[0] = true;
      replaceActives[1] = true;
    break;
    case 'reset':
      selectedColors[0] = color(255, 255, 255);
      replaceColors[0] = color(255, 255, 255);
      selectedColorInputs[0].value('#ffffff');
      replaceColorInputs[0].value('#ffffff');
      
      selectedColors[1] = color(0, 0, 0);
      replaceColors[1] = color(0, 0, 0);
      selectedColorInputs[1].value('#000000');
      replaceColorInputs[1].value('#000000');
      
      similarityThreshold = 0;
      similaritySlider.value(0);
      replaceActives[0] = true;
      replaceActives[1] = true;
    break;  
  }
} // Filter Values

function takeScreenshot() {
  saveCanvas('screenshot', 'png');
}
// Screenshot function, download as png

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cameraScreen.size(windowWidth, windowHeight);
}
// If users resize their browser，the webcam video will resize too (However it usually failed to operate, user need to refresh website after resize)

// JavaScript functions for toggling the controls panel
function openNav() {
  document.getElementById('controls').style.right = '0';
} // Let Panel come to Left

function closeNav() {
  document.getElementById('controls').style.right = '-300px';
}// Let Panel go Right

document.getElementById('navToggle').addEventListener('click', function() {
  const controls = document.getElementById('controls');
  if (controls.style.right === '0px') {
    closeNav();
  } else {
    openNav();
  }
});
// Click the summon button, if panel is displaying, withdraw it. If not display, summon it.

// --- End --- //
