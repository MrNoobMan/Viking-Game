var Canvas = document.getElementById('gameCanvas'),
	Context = Canvas.getContext('2d'),
	Wrapper = document.getElementById('wrapper');

const PI2 = Math.PI*2,
	PIby12 = Math.PI/12,
	PIby10 = Math.PI/10,
	PIby9 = Math.PI/9,
	PIby8 = Math.PI/8,
	PIby7 = Math.PI/7,
	PIby5 = Math.PI/5,
	PIby4 = Math.PI/4,
	PIby3 = Math.PI/3,
	PIby2 = Math.PI/2,
	PI2by3 = Math.PI*2/3,
	PI3by4 = Math.PI*3/4,
	PI3by2 = Math.PI*3/2;
	
// The keycodes that will be mapped when a user presses a button.
// Original code by Doug McInnes
KEY_CODES = {
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6'
};
// Creates the array to hold the KEY_CODES and sets all their values
// to false. Checking true/flase is the quickest way to check status
// of a key press and which one was pressed when determining
// when to move and which direction.
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[ KEY_CODES[ code ]] = false;
};
/**
 * Sets up the document to listen to onkeydown events (fired when
 * any key on the keyboard is pressed down). When a key is pressed,
 * it sets the appropriate direction to true to let us know which
 * key it was.
 */
document.onkeydown = function(e) {
  // Firefox and opera use charCode instead of keyCode to
  // return which key was pressed.
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
};
/**
 * Sets up the document to listen to ownkeyup events (fired when
 * any key on the keyboard is released). When a key is released,
 * it sets teh appropriate direction to false to let us know which
 * key it was.
 */
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
};

(function() {
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
	// MIT license

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

function makeCross(x ,y){
	Context.beginPath();
	Context.moveTo(x, 0);
	Context.lineTo(x, Canvas.height);
	Context.moveTo(0, y);
	Context.lineTo(Canvas.width, y);
	Context.stroke();
}

var fps,
	avarageFps = 0,
	sumFps = 0,
	last10 = [],
	mousePos = [];

function fpsMeter(dt){
	var Delta = dt
	
	fps = 1/Delta;
	last10.push(fps);
	
	Context.fillStyle = "#000"; 
	Context.font="bold 20px Arial Black, Gadget, sans-serif";
	
	if(last10.length >= 10){
		for(var i = 0; i < last10.length; i++){
			sumFps += last10[i];
			avarageFps = Math.round(sumFps/last10.length);
		}
		last10.splice(0, last10.length);
		sumFps = 0;
	}
	
	Context.strokeStyle = "#fff";
	Context.font="bold 20.5px Arial Black, Gadget, sans-serif";
	Context.strokeText( Math.round(avarageFps)+" fps", 5, 20);
	Context.fillText( Math.round(avarageFps)+" fps", 5, 20);
};

Canvas.onmousemove = function(e) {
    mousePos = [e.clientX - Canvas.offsetLeft, e.clientY - Canvas.offsetTop];
	//console.log(mousePos);
}