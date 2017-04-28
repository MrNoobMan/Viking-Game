function handleUI(){
	
	var defaultUnitBarPos = Canvas.height-50,
		debugTimer = 0;
	
	this.unitBarPos = defaultUnitBarPos;
	this.selectionRect = [0,0,0,0]; //x, y, h, w
	
	this.init = function(){
		
		var uniBox = [100,100];
		
		this.buttons = [];
		//axe
		var button = new uIBox(uniBox, game.unitStats.axeViking,	[0, 0], 10);
		this.buttons.push(button);
				
		//bow 
		button = new uIBox(uniBox, game.unitStats.bowViking, [Canvas.width/9, 0], 8);
		this.buttons.push(button);
		
		//spear
		button = new uIBox(uniBox, game.unitStats.spearViking, [Canvas.width*2/9, 0], 11);
		this.buttons.push(button);
		
		//bearserker
		button = new uIBox(uniBox, game.unitStats.bearserker, [Canvas.width*3/9, 0], 12);
		this.buttons.push(button);
		
		//sword
		button = new uIBox(uniBox, game.unitStats.swordViking, [Canvas.width*4/9, 0], 18);							
		this.buttons.push(button);
		
		//valkyrie
		button = new uIBox(uniBox, game.unitStats.valkyrie, [Canvas.width*5/9, 0], 20);
		this.buttons.push(button);
		
		this.allTimer = 1.75;
		this.allCurrent = this.allTimer;
		
	};
	
	this.updateUi = function(dt){

		debugTimer += dt;
		
		if(!window.isDrag && mousePos[1] >= this.unitBarPos && this.unitBarPos >= Canvas.height - 150){
			this.unitBarPos -= 300 * dt;
		}else if(mousePos[1] < this.unitBarPos && this.unitBarPos < defaultUnitBarPos){
			this.unitBarPos += 300 * dt;
		}
		
		for(var i = 0; i < 6; i++){
			if(KEY_STATUS[(i+1).toString()]){
				this.buttons[i].spawnUnit();
			}
		}
		
		if(window.isDrag){
			this.selectionRect = [Math.min(mousePos[0], window.startSelect[0]), Math.min(mousePos[1], window.startSelect[1]), Math.abs(window.startSelect[0] - mousePos[0]), Math.abs(window.startSelect[1] - mousePos[1])];
		}
		
		if(debugMode && debugTimer > .25){
			if(KEY_STATUS.a){
				game.allEntities.spawn('player', game.unitStats.axeViking);
				debugTimer = 0;
			}else if(KEY_STATUS.s){
				game.allEntities.spawn('player', game.unitStats.bowViking);
				debugTimer = 0;
			}else if(KEY_STATUS.d){
				game.allEntities.spawn('player', game.unitStats.spearViking);
				debugTimer = 0;
			}else if(KEY_STATUS.f){
				game.allEntities.spawn('player', game.unitStats.bearserker);
				debugTimer = 0;
			}else if(KEY_STATUS.g){
				game.allEntities.spawn('player', game.unitStats.swordViking);
				debugTimer = 0;
			}else if(KEY_STATUS.h){
				game.allEntities.spawn('player', game.unitStats.valkyrie);
				debugTimer = 0;
			}else if(KEY_STATUS.z){
				game.allEntities.spawn('monk', game.unitStats.monk);
				debugTimer = 0;
			}else if(KEY_STATUS.x){
				game.allEntities.spawn('monk', game.unitStats.zealot);
				debugTimer = 0;
			}else if(KEY_STATUS.c){
				game.allEntities.spawn('monk', game.unitStats.guardsMan);
				debugTimer = 0;
			}else if(KEY_STATUS.v){
				game.allEntities.spawn('monk', game.unitStats.crusader);
				debugTimer = 0; 
			}else if(KEY_STATUS.b){
				game.allEntities.spawn('monk', game.unitStats.bowMan);
				debugTimer = 0; 
			}else if(KEY_STATUS.i){
				if(speedMult === 1){
					speedMult = 0;
				}else{
					speedMult = 1;
				}
				debugTimer = 0;
			}		
		}
	};
	
	this.draw = function(dt){
		
		Context.save();
		Context.fillStyle = '#cc6d00';
		Context.translate(0, this.unitBarPos);
		Context.fillRect(0,0, Canvas.width, Canvas.height - this.unitBarPos);
		Context.translate(80, 25);
		for(var i = 0; i < this.buttons.length; i++){
			this.buttons[i].draw(dt);
		}
		Context.restore();
		
		if(window.isDrag){
			Context.strokeRect(this.selectionRect[0], this.selectionRect[1], this.selectionRect[2], this.selectionRect[3]);
		}
	};
	
	this.checkBox = function(){
		for(var i = 0; i < this.buttons.length; i++){
			if(mousePos[0] > this.buttons[i].truePos[0] && mousePos[0] < this.buttons[i].truePos[0] + this.buttons[i].size[0]
			&& mousePos[1] > this.buttons[i].truePos[1] && mousePos[1] < this.buttons[i].truePos[1] + this.buttons[i].size[1]){
				this.buttons[i].spawnUnit();
			}
		}
	};
			
};

function uIBox(size, unitParams, pos, timer){
	
	this.size = size;
	this.unitParams = unitParams;
	this.pos = pos;
	this.truePos = [0,0];
	this.timer = timer;
	this.currentTimer = this.timer;

	this.onCD = false;
		
	this.draw = function(dt){
		Context.save();
		
		if(this.onCD || this.currentTimer > 0){
			Context.fillStyle = '#752f00';
		}else{
			Context.fillStyle = '#993d00';
		}
		Context.translate(this.pos[0], this.pos[1]);
		Context.fillRect(0,0, this.size[0], this.size[1]);
		Context.fillStyle = '#3d1800';
		if(this.currentTimer <= 0 && this.onCD){
			Context.fillRect(0,this.size[1], this.size[0], -this.size[1] * game.handleUI.allCurrent/game.handleUI.allTimer);
			if(game.handleUI.allCurrent > 0){
				game.handleUI.allCurrent -= dt;
			}else{
				game.handleUI.allCurrent = 0;
				this.onCD = false;
			}
		}else{
			Context.fillRect(0,this.size[1], this.size[0], -this.size[1] * this.currentTimer/this.timer);
			this.onCD = false;
		}
		Context.translate(this.size[0]/8, this.size[1]*9/10);
		Context.fillStyle = '#fff';
		Context.fillText(game.handleUI.buttons.indexOf(this) + 1, 0,0);
		Context.restore();
		this.truePos = [this.pos[0] + 80, game.handleUI.unitBarPos + 25];
		if(this.currentTimer > 0){
			this.currentTimer -= dt;
		}else{
			this.currentTimer = 0;
		}
	}
	
	this.spawnUnit = function(){
		var counter = 0;
		if(this.currentTimer <= 0 && !this.onCD && money >= this.unitParams[0][9]){
			money -= this.unitParams[0][9];
			var spawnEm = setInterval(function(){
				window['game']['allEntities']['spawn']('player', unitParams);
				counter++;
				if(counter >= unitParams[2]){
					clearInterval(spawnEm);
				}
			}, unitParams[3]);
			
			for(var i = 0; i < game.handleUI.buttons.length; i++){
				if(i !== game.handleUI.buttons.indexOf(this)){
					game.handleUI.buttons[i].onCD = true;
				}
			}
			
			this.currentTimer = this.timer;
			game.handleUI.allCurrent = game.handleUI.allTimer;
		}
	}
}