var hCanvas = 1000;
var wCanvas = 2000;
var vNodes = 20;
var wNodes = 80;
var nodeWidth = (wCanvas/(wNodes))-10;
var colourScheme = [];
var eqField = new EqField([]);
var rangeOffset = 10;
var saveLoop = [];

function preload(){
  sound = loadSound('https://a.tumblr.com/tumblr_mm1qr5F2lU1rn72uoo1.mp3#_=_')
}

function setup() {
  cnv = createCanvas(wCanvas,hCanvas);

  cnv.mouseClicked(togglePlay);
  console.log(hToArray(135));
  colourScheme.push(color(204, 166, 112, 100));
  colourScheme.push(color(140, 116, 105, 100));
  colourScheme.push(color(63, 60, 82, 100));
  colourScheme.push(color(33, 38, 56, 100));

  eqField.init();

  fft = new p5.FFT();
  sound.amp(0.5);
}

function draw() {
  translate(wCanvas/2,hCanvas/2);
  background(colourScheme[colourScheme.length - 1]);
  var spectrum = fft.analyze();
  if (sound.isPlaying()){
    eqField.update(spectrum);
    if (saveLoop.length < 25){
      saveLoop.push(spectrum);
    } else {
      saveLoop = [];
    }
  } else {
    if (saveLoop.length > 1){
      eqField.update(saveLoop[0]);
      var temp = saveLoop.pop();
      saveLoop.unshift(temp);
    }
  }


  fill(255,0,0,10);
  ellipse(0,0,10)
}

function hToArray(h, min, max){
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

function EqNode(x, y){
  this.x = x;
  this.y = y;
  this.value = 3;
  this.maxH = 120;
  this.minH = 00;

  this.update = function(newVal){
    if (this.value != newVal || this.value != (colourScheme.length - 1) ){
      this.value = newVal;
      this.show();
    }
  }

  this.show = function (){
    noStroke();
    fill(colourScheme[this.value]);
    ellipse(this.x, this.y, nodeWidth, nodeWidth);
    ellipse(this.x, -this.y, nodeWidth, nodeWidth);
    ellipse(-this.x, this.y, nodeWidth, nodeWidth);
    ellipse(-this.x, -this.y, nodeWidth, nodeWidth);
  }
}

function EqField(){
  this.columns = wNodes;
  this.rows = vNodes;
  this.freqMap = [];
  this.nodes = [];
  this.gap = 25;
  this.minH = 120;
  this.maxH = 200;

  this.init = function(){
    var init = hToArray(0, this.minH, this.maxH);
    for (var c = 0; c < wNodes; c++){
      this.freqMap[c] = init;
      console.log("Entered?");
    }
    for (var y = 0; y < this.rows; y++){
      this.nodes[y] = [];
      for (var x = 0; x < wNodes; x++){
        this.nodes[y][x] = new EqNode(x*this.gap, y*this.gap);
      }
    }
    this.show();
  }

  this.update = function(spectrum){
    for (var i = 0; i < wNodes; i++){
      this.freqMap[i] = hToArray(spectrum[i], this.minH, this.maxH);
    }
    this.show();
  }

  this.show = function(){
    for (var x = 0; x < wNodes; x++){
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
