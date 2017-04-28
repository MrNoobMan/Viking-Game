var Canvas = document.getElementById('gameCanvas'),
	Context = Canvas.getContext('2d'),
	Wrapper = document.getElementById('wrapper'),
	debugMode = false,
	speedMult = 1;

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

KEY_CODES = {
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6',
  65: 'a',
  83: 's',
  68: 'd',
  70: 'f',
  71: 'g',
  72: 'h',
  90: 'z',
  88: 'x',
  67: 'c',
  86: 'v',
  66: 'b',
  78: 'n',
  73: 'i'
};

KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[ KEY_CODES[ code ]] = false;
};

document.onkeydown = function(e) {
  // Firefox and opera use charCode instead of keyCode to
  // return which key was pressed.
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
};

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
	
	//Removing the AA of the canvas
	for(var i = 0; i < vendors.length; i++){
		window['Context'][vendors[i]+'imageSmoothingEnabled'] = false;
	}
	Context.imageSmoothingEnabled  = false;

}());

Math.hypot = Math.hypot || function() {
  var y = 0;
  var length = arguments.length;

  for (var i = 0; i < length; i++) {
    if (arguments[i] === Infinity || arguments[i] === -Infinity) {
      return Infinity;
    }
    y += arguments[i] * arguments[i];
  }
  return Math.sqrt(y);
};

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
			avarageFps = (sumFps/last10.length).toFixed(1);
		}
		last10.splice(0, last10.length);
		sumFps = 0;
	}

	Context.strokeStyle = "#fff";
	Context.font="bold 20.5px Arial Black, Gadget, sans-serif";
	Context.strokeText(avarageFps+" fps", 5, 20);
	Context.fillText(avarageFps+" fps", 5, 20);
};

Canvas.onmousemove = (e) => {
    mousePos = [e.clientX - Canvas.offsetLeft, e.clientY - Canvas.offsetTop];
	//console.log(mousePos);
}

Canvas.onmousedown = (e) => {
	
	if(!this.makeSelection){
		if(!this.isDrag){
			this.startSelect[0] = mousePos[0];
			this.startSelect[1] = mousePos[1];
		}
		this.isDrag = true;
	}else if(this.makeSelection){
		this.selectionPos = [mousePos[0], mousePos[1]];
		
		this.makeSelection = false;
	}
	game.handleUI.checkBox();
}

Canvas.onmouseup = (e) => {
	this.isDrag = false;
	if(game.handleUI.selectionRect[2] > 10 && game.handleUI.selectionRect[3] > 10){
		this.makeSelection = true;
		game.handleUI.selectionRect = [0,0,0,0];
	}
}

Canvas.onmouseout = (e) => {
	this.isDrag = false;
	if(game.handleUI.selectionRect[2] > 10 && game.handleUI.selectionRect[3] > 10){
		game.handleUI.selectionRect = [0,0,0,0];
		this.makeSelection = true;
	}
	mousePos = [0,0];
}