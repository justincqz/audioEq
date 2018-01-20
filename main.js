var hCanvas = 800;
var wCanvas = 1600;
var colourScheme = [];
var bgColour;
var nodeWidth;
var vNodes = 0;
var wNodes = 0;
var saveLast = [];
var eqField = new EqField();
var gap = 5;

function preload(){
  sound = loadSound('https://a.tumblr.com/tumblr_mm1qr5F2lU1rn72uoo1.mp3#_=_')
}

function setup() {
  cnv = createCanvas(wCanvas,hCanvas);
  cnv.mouseClicked(togglePlay);

  colourScheme.push(color(204, 166, 112, 100));
  colourScheme.push(color(140, 116, 105, 100));
  colourScheme.push(color(63, 60, 82, 100));
  colourScheme.push(color(33, 38, 56, 100));
  bgColour = color(33, 38, 56, 100);
  nodeWidth = round(sqrt(hCanvas * wCanvas) / 50);
  vNodes = round((hCanvas / 2)/nodeWidth);
  wNodes = round((wCanvas/ 2)/nodeWidth);
  console.log(nodeWidth);

  eqField.init();
  fft = new p5.FFT();
  sound.amp(0.5);
}

// Draw function
function draw() {
  translate(wCanvas/2,hCanvas/2);
  var bgColour = colourScheme[colourScheme.length - 1];
  background(bgColour);
  var spectrum = fft.analyze();

  if (sound.isPlaying()){
    eqField.update(spectrum);
    saveLast = spectrum;
  } else {
    eqField.update(saveLast);
    fill(color(0, 0, 0, 70));
    rect(-wCanvas/2, -hCanvas/2, wCanvas, hCanvas);
    playButton(0, 0, colourScheme[0]);
  }

  translate(-wCanvas/2,(hCanvas/2) - 10);
  fill(colourScheme[0]);
  var percentageRemaining = sound.currentTime() / sound.duration();
  rect(0,0,round(wCanvas*percentageRemaining),10);
}

// Displays a 'play' button (Triangle)
function playButton(x, y, colour){
  var size = hCanvas / 40;
  noStroke();
  fill(colour);
  triangle((x-size), (y+size), (x-size), (y-size), (x+size),y);
}

// Node function
function EqNode(x, y){
  this.x = x;
  this.y = y;
  this.value = 3;
  this.update = function(newVal){
    if (this.value != newVal || newVal != colourScheme.length - 1){
      this.value = newVal;
      this.show();
    }
  }

  this.show = function (){
    noStroke();
    fill(colourScheme[this.value]);
    ellipse(this.x, this.y, nodeWidth - gap, nodeWidth - gap);
    ellipse(this.x, -this.y, nodeWidth - gap, nodeWidth - gap);
    ellipse(-this.x, this.y, nodeWidth - gap, nodeWidth - gap);
    ellipse(-this.x, -this.y, nodeWidth - gap, nodeWidth - gap);
  }
}

// Converts a amplitutde to an array of colour values
function ampToH(h){
  var min = 100;
  var max = 200;
  var input = h > min ? h: min;
  var sc = (map (input, min, max, 0, vNodes))/(colourScheme.length);
  var rArray = [];
  for (var i = 0; i < colourScheme.length; i++){
    for (var times = 0; times < sc; times++){
      rArray.push(i);
    }
  }
  var len = rArray.length;
  for (var left = 0; left < (vNodes - len); left++){
    rArray.push(colourScheme.length - 1);
  }
  return rArray;
}

// The visualiser field class
function EqField(){
  this.freqMap = [];
  this.nodes = [];

  this.init = function(){
    var init = ampToH(0);
    for (var c = 0; c < wNodes; c++){
      this.freqMap[c] = init;
    }
    for (var y = 0; y < vNodes; y++){
      this.nodes[y] = [];
      for (var x = 0; x < wNodes; x++){
        this.nodes[y][x] = new EqNode(x*nodeWidth, y*nodeWidth);
      }
    }
    this.show();
  }

  this.update = function(spectrum){
    for (var i = 0; i < wNodes; i++){
      this.freqMap[i] = ampToH(spectrum[i]);
    }
    this.show();
  }

  this.show = function(){
    for (var x = 0; x < wNodes; x++){
      var currentFreqMap = this.freqMap[x];
      for (var map = 0; map < vNodes; map++){
        var value = currentFreqMap[map];
        this.nodes[map][x].update(value);
      }
    }
  }
}

// Toggles between playing and pause
function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}
