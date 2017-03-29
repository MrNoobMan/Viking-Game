
var imageRepo = new function(){
	
	this.imgSources = [ "pics/bgStructures.png", //0
						"pics/vikings.png",		//1
						"pics/weapons.png",		//2
						"pics/monks.png"		//3
					];

	this.imgs = [];

	for(var i = 0; i < this.imgSources.length; i++){
		this.imgs[i] = new Image();
		this.imgs[i].src = this.imgSources[i];
		this.imgs[i].onload = function(){
				imageLoaded();
		}
		this.imgs[i].crossOrigin = "Anonymous";
	};
			
};

function imageLoaded(){
	numLoaded++;
	if(numLoaded === numImages){
		game.init();
	}
}

function Sprite(unitParams){	//img, size, framePos, maxHealth, speed, type, allegiance, weapon, dmg, worth
	
	this.img = unitParams[0];
	this.size = unitParams[1];
	this.framePos = unitParams[2];
	this.maxHealth = unitParams[3];
	this.speed = unitParams[4];
	this.type = unitParams[5]; //unit, structure, projectile
	this.allegiance = unitParams[6]; //player, monks, other?
	this.weapon =  unitParams[7];	//[framPos, size]
	this.dmg = unitParams[8];		
	this.worth = unitParams[9];
	this.alive = false;
	this.currentHealth = 0;
	this.isFigthing = false;
	this.dying = false;
	this.rot = 0;
	this.alpha = 1;
	this.walkDir = 1;
	
	var frameMod = 0,
		wFrameMod = 0;
	
	this.weaponRot = 0;
	this.weaponPos = [0,0];
	
	this.unUsed = true;
	this.point = [0,0];
	
	this.currentPos = [0,0];
	
	this.spawn = function(position){
		this.currentHealth = this.maxHealth;
		this.currentPos = position;
		this.alive = true;
	};

	this.draw = function(Context){
		
		if(this.walkDir > 0){
			frameMod = 0;
		}else if(this.walkDir < 0){
			frameMod = 70;
		}
		Context.drawImage(this.img, this.framePos[0], this.framePos[1] + frameMod, this.size[0], this.size[1], 0,0, this.size[0], this.size[1]);
		if(this.type === 'unit' && this.currentHealth > 0){
			Context.fillStyle = '#3d1400';
			Context.fillRect(this.size[0]/2 - 11, this.size[1] + 4, 22, 7);
			Context.fillStyle = '#029400';
			Context.fillRect(this.size[0]/2 - 10, this.size[1] + 5, (this.currentHealth/this.maxHealth) * 20, 5);
			Context.fillStyle = '#940000';
			Context.fillRect(this.size[0]/2 + 10, this.size[1] + 5, -(1 - (this.currentHealth/this.maxHealth)) * 20, 5);
		}
	};

	this.drawWeapon = function(){
		if(this.weapon[2]){
			if(this.walkDir > 0){
				wFrameMod = 0;
			}else if(this.walkDir < 0){
				wFrameMod = this.weapon[1][1] + 5;
			}
		}
		Context.save();
		Context.translate(this.size[0]/2, this.size[1]/2);
		Context.translate(this.weaponPos[0], this.weaponPos[1]);
		Context.rotate(this.weaponRot);
		Context.drawImage(imageRepo.imgs[2], this.weapon[0][0], this.weapon[0][1] + wFrameMod, this.weapon[1][0], this.weapon[1][1], 0, 0, this.weapon[1][0], this.weapon[1][1]);
		Context.restore();
	}

}

function bloodSpill(origin){
	
	var currentPos = origin,
		size = Math.floor(Math.random() * 3) + 2,
		targetPos = [currentPos[0] + (Math.random() > .5 ? (Math.random() * 15) + 15: -((Math.random() * 15) + 15)), currentPos[1] + (Math.random() > .5 ? (Math.random() * 15) + 15: -((Math.random() * 15) + 15))],
		dir = currentPos[0] > targetPos[0] ? 1 : -1,
		refPoint = [(currentPos[0] + targetPos[0])/2, (currentPos[1] + targetPos[1])/2 + dir * (targetPos[0] - currentPos[0])*2];
		
	this.currentLife = 0;
	this.lifeSpan = Math.random() * 1.5;
	
	this.animate = function(dt){
		this.currentLife += dt * 2;
		
		let x = Math.pow((1 - this.currentLife), 2) * currentPos[0] + 2 * (1 - this.currentLife) * this.currentLife * refPoint[0] + Math.pow(this.currentLife, 2) * targetPos[0],
			y = Math.pow((1 - this.currentLife), 2) * currentPos[1] + 2 * (1 - this.currentLife) * this.currentLife * refPoint[1] + Math.pow(this.currentLife, 2) * targetPos[1];
		
		currentPos = [x,y];
		
		Context.fillStyle = 'red';
		Context.beginPath();
		Context.arc(x, y, size, 0, PI2);
		Context.fill();
		size -= dt;
	}
	
};