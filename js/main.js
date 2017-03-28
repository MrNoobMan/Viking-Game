
var lastTimeCalled = Date.now(),
	numLoaded = 0,
	themMonks = [],
	themVikings = [];
	
var tImer = 0;
	
const numImages = imageRepo.imgSources.length;
	
function main(){
	var now = Date.now(),
		Delta = (now - lastTimeCalled)/1000;
	lastTimeCalled = now;
	
	if(Delta > 1){Delta = 1/60;};
	
	var Entities = game.allEntities.getItAll();

	Entities = updateAll(Delta, Entities);
	
	renderAll(Delta, Entities);
		
	fpsMeter(Delta);
	
	if(tImer > 1){
		game.allEntities.spawn('monk', themMonks[Math.floor(Math.random() * themMonks.length)]);
		game.allEntities.spawn('player', themVikings[Math.floor(Math.random() * themVikings.length)]);
		tImer = 0;
	}
	tImer += Delta;
	
	requestAnimationFrame(main);
}

function updateAll(dt, entities){
	
	for(var x = 0; x < entities.length; x++){
		var i = entities[x].length - 1;
		
		while(i > -1){
			
			if(entities[x][i].type === 'unit'){

				if(entities[x][i].currentHealth <= 0 && !entities[x][i].dying && entities[x][i].alive){
					entities[x][i].dying = true;
				}else if(!entities[x][i].dying && entities[x][i].alive){
					var updateStatus = entities[x][i].ai.animate(dt, entities[x][i].speed, entities[x][i].weaponRot, entities[x][i].weaponPos, entities[x][i].isFigthing, entities[x][i].dmg);
					if(updateStatus[1]){
						entities[x][i].alive = false;
						entities[x].splice(i, 1);
						i--;
						continue;
					}else{
						entities[x][i].currentPos = updateStatus[0];
						entities[x][i].weaponRot = updateStatus[2];
						entities[x][i].weaponPos = updateStatus[3];
						entities[x][i].isFigthing = updateStatus[4];
					}
				}
				if(entities[x][i].dying){
					var updateStatus = entities[x][i].ai.animateDeath(dt, entities[x][i].currentPos, entities[x][i].rot, entities[x][i].weaponRot, entities[x][i].alpha);
					if(updateStatus[4]){
						entities[x][i].alive = false;
						entities[x].splice(i, 1);
						i--;
						continue;
					}else{
						entities[x][i].currentPos = updateStatus[0];
						entities[x][i].rot = updateStatus[1];
						entities[x][i].weaponRot = updateStatus[2];
						entities[x][i].alpha = updateStatus[3];
					}
				}
			}else if(entities[x][i].type === 'projectile'){
				if(!entities[x][i].dying){
					var updateStatus = entities[x][i].ai.animate(dt);
					if(updateStatus[1]){
						entities[x][i].dying = true;
					}else{
						entities[x][i].currentPos = updateStatus[0];
						entities[x][i].rot = updateStatus[2];
						entities[x][i].point = updateStatus[3];
						if(entities[x][i].unUsed && entities[x][i].allegiance === 'player'){
							for(var y = 0; y < entities[1].length; y++){
								if(!entities[1][y].dying){
									if(entities[x][i].ai.checkCollision(entities[1][y])){
										entities[1][y].currentHealth -= entities[x][i].dmg;
										entities[x][i].dmg = 0;
										entities[x][i].unUsed = false;
										entities[x][i].dying = true;
										break;
									}
								}
							}
						}
					}
				}else{
					var updateStatus = entities[x][i].ai.animateDeath(dt, entities[x][i].alpha);
					if(updateStatus[3]){
						entities[x][i].alive = false;
						entities[x].splice(i, 1);
						i--;
						continue;
					}else{
						entities[x][i].alpha = updateStatus[0];
						entities[x][i].currentPos = updateStatus[1];
						entities[x][i].rot = updateStatus[2];
					}
				}
			}
			i--;
		}
	}
	
	game.handleUI.updateUi(dt);

	return game.allEntities.aliveUnits.filter(removeDead);
}

function renderAll(dt, entities){
	
	game.renderBg.drawBg();

	entities.sort(function(a, b){
		if(a.type === 'projectile'){
			return 1;
		}else if(b.type === 'projectile'){
			return -1;
		}else{
			return a.currentPos[1] - b.currentPos[1];
		}
	});
	
	for(var i = 0; i < entities.length; i++){
		if(entities[i].alive){
			if(entities[i].type === 'unit'){
				Context.save();
				Context.translate(entities[i].currentPos[0], entities[i].currentPos[1]);
				if(entities[i].dying){
					Context.globalAlpha = entities[i].alpha;
					Context.rotate(entities[i].rot);
				}
				entities[i].draw(Context);
				entities[i].drawWeapon();
				Context.restore();
			}else if(entities[i].type === 'projectile'){
				Context.save();
				Context.globalAlpha = entities[i].alpha;
				Context.translate(entities[i].currentPos[0], entities[i].currentPos[1]);
				Context.rotate(entities[i].rot);
				Context.translate(-entities[i].size[0]/2, -entities[i].size[1]/2);
				entities[i].draw(Context);					
				Context.restore();

				//Context.fillRect(entities[x][i].point[0] - 3, entities[x][i].point[1] - 3, 6, 6);
				//makeCross(entities[x][i].point[0], entities[x][i].point[1])

				//makeCross(entities[x][i].currentPos[0], entities[x][i].currentPos[1]);
			}
		}
	}

	
	for(var i = 0; i < game.allEntities.bloodDrops.length; i++){
		game.allEntities.bloodDrops[i].animate(dt);
	}
	
	game.handleUI.draw(dt);
}

/*var ting = 0,
	isRndSet = false,
	isFirstSet = false,
	rndTingTang = 0,
	prevPos = [],
	currentPos = [];

function bezier(dt){
	
	ting+= dt*3/4;
	
	prevPos = currentPos;
	
	if(!isRndSet){
		rndTingTang = Math.random() > .5 ? Math.random() * 25 : Math.random() * -25;
		isRndSet = true;
	}
	
	var x_0 = 400,
		x_1 = 675;
		
	var	p_0 = [renderBg.slopePath[x_0][0], renderBg.slopePath[x_0][1]],
		p_1 = [renderBg.slopePath[x_1 + Math.round(rndTingTang)][0], renderBg.slopePath[x_1 + Math.round(rndTingTang)][1]],
		dir = p_0[0] > p_1[0] ? 1 : -1,
		p_2 = [(p_0[0] + p_1[0])/2, (p_0[1] + p_1[1])/2 + dir * (p_1[0] - p_0[0])*3/4];
	
	Context.strokeStyle = 'black';
	Context.beginPath();
	Context.moveTo(p_0[0], p_0[1]);
		
	var x = (Math.pow((1 - ting), 2) * p_0[0] + 2 * (1 - ting) * ting * p_2[0] + Math.pow(ting, 2) * p_1[0]),
		y = (Math.pow((1 - ting), 2) * p_0[1] + 2 * (1 - ting) * ting * p_2[1] + Math.pow(ting, 2) * p_1[1]);
		
	Context.lineTo(x,y);
	Context.stroke();
	Context.fillRect(x-5,y-5, 10, 10);
	
	if(y > renderBg.slopePath[Math.round(x + 30)][1]+25){
		ting = 0;
		isRndSet = false;
	}
	
	currentPos = [x, y];

	Context.strokeStyle = 'red';
	Context.beginPath();
	Context.moveTo(x, y);
	Context.lineTo(x - (prevPos[0] - x) * 100, y - (prevPos[1] - y) * 100);
	Context.lineTo(x - (prevPos[0] - x) * -100, y - (prevPos[1] - y) * -100);
	Context.stroke();
	
}*/

function renderBg(){

		this.bgData = new Image();
		this.isBgSet = false;
		this.slopePath = [];

	this.generateLvl = function(){

		var structurePos = [];
		this.slopePath = [];	

		Context.fillStyle = '#00cee0';
		Context.fillRect(0,0,Canvas.width, Canvas.height);

		generateLandscape(4, 1, Canvas.height/7, Canvas.height/3, '#2b4d00', false, 30); 
		generateLandscape(3, .5, Canvas.height/5, Canvas.height*2/3, '#518000', false, 50);
		generateLandscape(1.5, .2, Canvas.height/4, Canvas.height/2, '#16e000', true, 100);

		/*Context.strokeStyle = '#fff';
		Context.beginPath();
		Context.moveTo(this.slopePath[0][0], this.slopePath[0][1]+20);
		
		for(var i = 1; i < this.slopePath.length; i++){
			Context.lineTo(this.slopePath[i][0], this.slopePath[i][1]+20)
		}
		Context.stroke();*/
		
		this.bgData.src = Canvas.toDataURL();
		this.isBgSet = !this.isBgSet;
	}

	this.drawBg = function(){
		Context.drawImage(this.bgData, 0,0);
	};

};

function generateLandscape(maxSteepness, stepSize, maxHeigth, minHeigth, colour, pushPath, grdHeigth){

	const pathHeigth = 35;
	
	var attitude = (Math.random() * (minHeigth - maxHeigth)) + maxHeigth,
		slope =  (Math.random() * maxSteepness) * 2 - maxSteepness;
	
	Context.fillStyle = colour;
	Context.beginPath();
	Context.moveTo(0, Canvas.height);
	Context.lineTo(0, attitude);
	
	for(var i = -30; i <= 0; i++){
		game.renderBg.slopePath.push([i, attitude + pathHeigth]);
	}

	for(var x = 1; x <= Canvas.width + 30; x++){
			
		game.renderBg.slopePath.push([x, attitude + pathHeigth]);

		attitude += slope;
		slope += (Math.random() * stepSize) * 2 - stepSize;

		if(slope > maxSteepness){
			slope = stepSize;
		}else if(slope < -maxSteepness){
			slope = -stepSize;
		}
 
		if(attitude > minHeigth) { 
			attitude = minHeigth;
			slope *= -1;
		}else if(attitude < maxHeigth) { 
			attitude = maxHeigth;
			slope *= -1;
		}	

		Context.lineTo(x, attitude);

	}
	
	Context.lineTo(Canvas.width, Canvas.height);
	Context.closePath();
	Context.fill();
	
	for(var i = 1; i < game.renderBg.slopePath.length; i++){
		var grd = Context.createLinearGradient(0,game.renderBg.slopePath[i][1] + grdHeigth,0,Canvas.height);
		grd.addColorStop(0, colour);
		if(colour == '#16e000'){
			grd.addColorStop(1, '#0c7500');
		}else if(colour == '#518000'){
			grd.addColorStop(1, '#273d00');
		}else if(colour == '#2b4d00'){
			grd.addColorStop(1, '#090f00');
		}
		Context.strokeStyle = grd;
		Context.beginPath();
		Context.moveTo(game.renderBg.slopePath[i][0], Canvas.height);
		Context.lineTo(game.renderBg.slopePath[i][0], game.renderBg.slopePath[i][1] + grdHeigth);
		Context.stroke();
	}
	
	if(!pushPath){game.renderBg.slopePath = [];};
	
};

function Game(){
	
	this.init = function(){
	
		this.renderBg = new renderBg();
		this.renderBg.generateLvl();
	
		this.handleUI = new handleUI();
		this.allEntities = new allEntities();
		this.unitStats = new unitStats();
		
		this.handleUI.init();
	
		themMonks = [this.unitStats.monk, this.unitStats.guardsMan, this.unitStats.crusader, this.unitStats.zealot];
		themVikings = [this.unitStats.axeViking, this.unitStats.spearViking, this.unitStats.bowViking, this.unitStats.bearserker, this.unitStats.swordViking, this.unitStats.valkyrie];
		
		main();
	};

}

var game = new Game();