var hCanvas = 1000;
var wCanvas = 1000;
var vNodes = 50;
var wNodes = 50;
var nodeWidth = 23;
var colourScheme = [];
var eqField = new EqField([]);

function preload(){
  sound = loadSound('https://a.tumblr.com/tumblr_mm1qr5F2lU1rn72uoo1.mp3#_=_')
}

function setup() {
  cnv = createCanvas(hCanvas,wCanvas);
  cnv.mouseClicked(togglePlay);
  colourScheme.push(color(33, 38, 56, 100));
  colourScheme.push(color(63, 60, 82, 100));
  colourScheme.push(color(107, 85, 102, 100));
  colourScheme.push(color(140, 116, 105, 100));
  colourScheme.push(color(204, 166, 112, 100));

  eqField.init();
  fft = new p5.FFT();
  sound.amp(0.5);
}

function draw() {
  background(colourScheme[0]);
  var spectrum = fft.analyze();
  eqField.update(spectrum);
}

function hToArray(h){
  var sc = h/4;
  var rArray = [];
  for (var i = 0; i < 4; i++){
    for (var times = 0; times < sc; times++){
      rArray.push(i + 1);
    }
  }
  var len = rArray.length;
  for (var left = 0; left < (vNodes - len); left++){
    rArray.push(0);
  }
  return rArray;
}

function EqNode(x, y){
  this.x = x;
  this.y = y;
  this.value = 3;

  this.update = function(newVal){
    if (this.value != newVal){
      this.value = newVal;
      this.show();
    }
  }

  this.show = function (){
    noStroke();
    fill(colourScheme[this.value]);
    ellipse(this.x, this.y, nodeWidth, nodeWidth);
  }
}

function EqField(){
  this.columns = wCanvas/(nodeWidth + 2);
  this.rows = hCanvas/(nodeWidth + 2);
  this.freqMap = [];
  this.nodes = [];
  this.gap = 25;

  this.init = function(){
    for (var y = 0; y < this.rows; y++){
      this.nodes[y] = [];
      this.freqMap[y] = hToArray(0);
      for (var x = 0; x < this.columns; x++){
        this.nodes[y][x] = new EqNode(x*this.gap, y*this.gap);
      }
    }
    this.show();
  }

  this.update = function(spectrum){
    for (var i = 0; i < this.freqMap.length; i++){
      this.freqMap[i] = hToArray(spectrum[i]);
    }
    this.show();
  }

  this.show = function(){
    for (var x = 0; x < this.columns; x++){
      var currentFreqMap = this.freqMap[x];
      for (var map = 0; map < this.rows; map++){
        var value = currentFreqMap[map];
        this.nodes[map][x].update(value);
      }
    }
  }
}

function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}
