// Made by Katakana! / K. Ansi

let O = x => {
  return new OmegaNum(x); // Ignore
};

function Game() {
  this.pts = "0";
  this.layers = ["0"];
}

var game = new Game();
var date = Date.now();
var pps; // points per second
var targetLayer; // the layer that will be prestiged
var diff;

function notate(x, rounding){
  if(O(x).lt("e9")){
    return (Math.round(O(x).toNumber()*rounding)/rounding).toLocaleString();
  } else {
    return O(x).div(O(10).pow(O(x).log10().floor())).toNumber().toFixed(3) + "e" + O(x).log10().floor().toNumber().toLocaleString();
  }
} // Converts numbers to make them readable.

function calcPending(layer){
  if(layer == 0){
    return O(game.pts).div(10).sqrt().floor();
  } else {
    return O(game.layers[layer-1]).div(10).sqrt().floor();
  }
} // Calculates pending Prestige points for a given layer.

function calcPendingMult(layer){
  return calcPending(layer).div(O(game.layers[layer]).add(1/2**layer)).add(1);
} // Calculates how much a given layer's effects would be multiplied by if reset.

function findHighestMult(){
  var layerFound = 0;
  var highestMult = O(1);
  
  for(var i = 0; i < game.layers.length; i++){
    if(highestMult.lt(calcPendingMult(i))){
      layerFound = i;
      highestMult = calcPendingMult(i);
    }
  }
  
  return layerFound;
} // Finds the layer whose effects would be multiplied by the most if reset.

function updateVars(){
  var pending;
  var pendMult;
  var highestMult;
  var str;
  
  diff = (Date.now() - date)/1000; // Calculates difference between two ticks to generate income.
  targetLayer = 0;
  
  pps = 1;
  for(var i = 0; i < game.layers.length; i++){
    pps = O(pps).mul(O(game.layers[i]).mul(2**i).add(1));
  } // Calculates points per second.
  
  document.getElementById("pps").textContent = notate(pps, 1); // Shows points per second
  
  game.pts = O(game.pts).add(O(diff).mul(pps)).toString(); // Increases points each tick.
  
  pending = O(game.pts).div(10).sqrt().floor();
  pendMult = pending.div(O(game.layers[0]).add(1)).add(1);
  highestMult = pendMult;
  str = "<p>Layer 1 points: <span class='number'>" + notate(game.layers[0], 1) + "</span>, translating to <span class='number'>×" + notate(O(game.layers[0]).add(1), 1) + "</span> points. Resetting gives <span class='number'>" + notate(pending, 1) + "</span>, multiplying effects by <span class='number'>×" + notate(pendMult, 100) + "</span>.</p>";
  
  for(var i = 1; i < game.layers.length; i++){
    pending = O(game.layers[i-1]).add(pending).div(10).sqrt().floor();
    pendMult = pending.div(O(game.layers[i]).add(1/2**i)).add(1);
    if(highestMult.lt(pendMult)){
      targetLayer = i;
      highestMult = pendMult;
    }
    str += "<p>Layer " + (i+1) + " points: <span class='number'>" + notate(game.layers[i], 1) + "</span>, translating to <span class='number'>×" + notate(O(game.layers[i]).mul(2**i).add(1), 1) + "</span> points. Resetting gives <span class='number'>" + notate(pending, 1) + "</span>, multiplying effects by <span class='number'>×" + notate(pendMult, 100) + "</span>.</p>";
  }
  
  document.getElementById("layers").innerHTML = str;
  document.getElementsByTagName("p")[targetLayer].style.color = "#FF0000";
  
  date = Date.now();
} // Updates points and layer information each tick.

function prestige(layer){
  if(O(game.pts).gte(10) && layer == 0){
    game.layers[0] = O(game.layers[0]).add(O(game.pts).div(10).sqrt().floor()).toString(); // Increase points on current layer
    game.pts = "0";
  } else if(layer > 0){
    prestige(layer-1);
    game.layers[layer] = O(game.layers[layer]).add(O(game.layers[layer-1]).div(10).sqrt().floor()).toString();
    game.layers[layer-1] = "0";
  }
  
  if(O(game.layers[game.layers.length-1]).gt(0)){
    game.layers.push("0");
  } // Adds a new layer when the last one has been reached.
} // Prestiges a layer for the appropriate amount of points.

function updateHTML(){
  document.getElementById("pts").textContent = notate(game.pts, 1);
} // Updates some changing HTML each tick.

function targetPrestige(){
  prestige(targetLayer);
} // Prestiges the target layer

function interval(){
  updateVars();
  updateHTML();
} // Does the game loop.

load();
setInterval(save,1000);
setInterval(targetPrestige,1000);
setInterval(interval,30);
