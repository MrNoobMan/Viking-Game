
function Pool(maxSize){	//omstrukturere
	
	this.size = maxSize;
	var pool = [];
	
	this.getAlive = function(){
		var obj = [];
		for(var i = 0; i < this.size; i++){
			if(pool[i].alive){
				obj.push(pool[i]);
			}
		}
		return obj;
	};
		
	this.init = function(object){
		if(object == 'viking0'){	//ax man
			for(var i = 0; i < this.size; i++){
				var viking = new Sprite(imageRepo.imgs[1],	//bilde
										[30,60],			//size
										[0,0],				//framPos
										100,				//maxHp
										45,					//px/sec
										'viking',			//type
										'player',			//allegiance
										[[0,0], [30,40]],	//weapon - [framPos, size]
										25,					//dmg
										100					//worth
										);
				viking.alive = false;
				viking.ai = new vikingAi([-Math.PI/2, Math.PI/6], [-3,2], 7, 25);	//(minMaxRot, minMaxWeap, rotSpeed, thrustSpeed)
				pool[i] = viking;
			}
		}else if(object == 'viking1'){	//bow woman
			for(var i = 0; i < this.size; i++){
				var viking = new Sprite(imageRepo.imgs[1],	//bilde
										[30,58],			//size
										[67,0],				//framPos
										70,					//maxHp
										35,					//px/sec
										'viking',			//type
										'player',			//allegiance
										[[310,0], [40,40]],	//weapon - [framPos, size]
										35,					//dmg
										100					//worth
										);
				viking.alive = false;
				viking.ai = new vikingAi([Math.PI/2, Math.PI], [10, 15], 4, 25);	//(minMaxRot, minMaxWeap, rotSpeed, thrustSpeed)
				pool[i] = viking;
			}
		}else if(object == 'viking2'){	//spear man
			for(var i = 0; i < this.size; i++){
				var viking = new Sprite(imageRepo.imgs[1],	//bilde
										[22,60],			//size
										[40,0],				//framPos
										85,					//maxHp
										40,					//px/sec
										'viking',			//type
										'player',			//allegiance
										[[40,0], [60,60]],	//weapon - [framPos, size]
										30,					//dmg
										150					//worth
										);
				viking.alive = false;
				viking.ai = new vikingAi([Math.PI/8, Math.PI/2], [0, 15], 4, 25);	//(minMaxRot, minMaxWeap, rotSpeed, thrustSpeed)
				pool[i] = viking;
			}
		}else if(object == 'viking3'){	//berserker
			for(var i = 0; i < this.size; i++){
				var viking = new Sprite(imageRepo.imgs[1],	//bilde
										[22,68],			//size
										[104,0],			//framPos
										70,					//maxHp
										60,					//px/sec
										'viking',			//type
										'player',			//allegiance
										[[110,0], [50,50]],	//weapon - [framPos, size]
										40,					//dmg
										200					//worth
										);
				viking.alive = false;
				viking.ai = new vikingAi([Math.PI/2, Math.PI], [-5, 10], 6, 30);	//(minMaxRot, minMaxWeap, rotSpeed, thrustSpeed)
				pool[i] = viking;
			}
		}else if(object == 'viking4'){	//swords man
			for(var i = 0; i < this.size; i++){
				var viking = new Sprite(imageRepo.imgs[1],	//bilde
										[22,60],			//size
										[136,0],			//framPos
										130,				//maxHp
										25,					//px/sec
										'viking',			//type
										'player',			//allegiance
										[[170,0], [60,60]],	//weapon - [framPos, size]
										40,					//dmg
										250					//worth
										);
				viking.alive = false;
				viking.ai = new vikingAi([Math.PI/2, Math.PI], [5, 10], 3, 40);	//(minMaxRot, minMaxWeap, rotSpeed, thrustSpeed)
				pool[i] = viking;
			}
		}else if(object == 'viking5'){	//valkyrie
			for(var i = 0; i < this.size; i++){
				var viking = new Sprite(imageRepo.imgs[1],	//bilde
										[35,60],			//size
										[164,0],			//framPos
										120,				//maxHp
										45,					//px/sec
										'viking',			//type
										'player',			//allegiance
										[[240,0], [60,60]],	//weapon - [framPos, size]
										35,					//dmg
										300					//worth
										);
				viking.alive = false;
				viking.ai = new vikingAi([Math.PI/8, Math.PI/2], [-5, 15], 2, 30);	//(minMaxRot, minMaxWeap, rotSpeed, thrustSpeed)
				pool[i] = viking;
			}
		}
	}
	
	this.get = function(pos){
		if(!pool[this.size - 1].alive){
			pool[this.size - 1].spawn(pos);
			pool.unshift(pool.pop());
		}
	};
	
}