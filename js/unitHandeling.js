
function allEntities(){
	
	this.aliveUnits = [];
	this.playerUnits = [];
	this.enemyUnits = [];
	this.playerProjectiles = [];
	this.enemyProjectiles = [];
	this.dyingUnits = [];
	this.bloodDrops = [];

	this.spawn = function(unitType, unitParams){
		if(unitType === 'player'){
			var viking = new Sprite(unitParams[0]);
				viking.ai = new basicAi(unitParams[1]);
				viking.id = makeId('#VK' + this.playerUnits.length.toString(16));
				viking.spawn([0,0]);
			this.playerUnits.push(viking);
			this.aliveUnits.push(viking);
		}else if(unitType === 'monk'){
			var monk = new Sprite(unitParams[0]);
				monk.ai = new basicAi(unitParams[1]);
				monk.id = makeId('#MK' + this.enemyUnits.length.toString(16));
				monk.spawn(game.renderBg.slopePath[game.renderBg.slopePath.length-1]);
			this.enemyUnits.push(monk);
			this.aliveUnits.push(monk);
		}
	};

	this.fire = function(projType, projParams, dmg, pos){
		if(projType === 'playerArrow'){
			var arrow = new Sprite(projParams);
				arrow.ai = new arrowAi(pos[0], pos[1], arrow.size);
				arrow.dmg = dmg;
				arrow.id = makeId('#PA' + this.playerProjectiles.length.toString(16));
				arrow.spawn(pos[0], [1]);
			this.playerProjectiles.push(arrow);
			this.aliveUnits.push(arrow);
		}
	}

	this.spillBlood = function(origin){
		var blood = new bloodSpill(origin);
		this.bloodDrops.push(blood);
	}
	
	this.getItAll = function(){
		
		this.playerUnits = this.playerUnits.filter(removeDead);
		this.enemyUnits = this.enemyUnits.filter(removeDead);
		this.playerProjectiles = this.playerProjectiles.filter(removeDead);

		for(var i = 0; i < this.bloodDrops.length; i++){
			if(this.bloodDrops[i].currentLife > this.bloodDrops[i].lifeSpan){
				this.bloodDrops.splice(i, 1);
			}
		}
		
		//this.aliveUnits = this.aliveUnits.filter(removeDead);

		this.allUnits = [this.playerUnits, this.enemyUnits, this.playerProjectiles];

		return this.allUnits;
	}

};

function unitStats(){
	
	this.axeViking = [[imageRepo.imgs[1],	//img
					[30,60],			//size
					[0,0],				//framPos
					100,				//maxHp
					35,					//px/sec
					'unit',				//type
					'player',			//allegiance
					[[0,0], [30,40]],	//weapon - [framPos, size]
					5,					//dmg
					100],				//worth
					[[-PIby2, PIby4], [[-5, 0],[-5, 2]], 7, 25, [30, 'slashWeapon'], 1, 0, true],	//[minMaxRot, minMaxWeap, rotSpeed, thrustSpeed, [preferedDist, cmbtStyle], dir, start]
					5,
					1500
	];

	this.bowViking = [[imageRepo.imgs[1],	//img
					[30,58],			//size
					[67,0],				//framPos
					70,					//maxHp
					30,					//px/sec
					'unit',				//type
					'player',			//allegiance
					[[310,0], [40,40]],	//weapon - [framPos, size]
					8,					//dmg
					100],
					[[PI2by3, Math.PI], [[10, 10], [15, 15]], 4, 25, [450, 'shootBow'], 1, 0, true],
					4,
					1250
	];
	
	this.spearViking = [[imageRepo.imgs[1],	//img
						[22,60],			//size
						[40,0],				//framPos
						85,					//maxHp
						30,					//px/sec
						'unit',				//type
						'player',			//allegiance
						[[40,0], [60,60]],	//weapon - [framPos, size]
						6,					//dmg
						150], 				//worth
						[[PIby8, PIby2], [[-2, 2], [13, 17]], 1, 25, [65, 'stabWeapon'], 1, 0, true],
						4,
						1250
	];
	
	this.bearserker = [[imageRepo.imgs[1],	//img
					[22,58],				//size
					[104,0],				//framPos
					65,					//maxHp
					50,					//px/sec
					'unit',				//type
					'player',			//allegiance
					[[110,0], [50,50]],	//weapon - [framPos, size]
					10,					//dmg
					200], 				//worth
					[[PIby2, Math.PI], [[-5, -5], [10, 10]], 6, 30, [40, 'slashWeapon'], 1, 0, true],
					2,
					750
	];
	
	this.swordViking = [[imageRepo.imgs[1],	//img
						[22,60],			//size
						[136,0],				//framPos
						130,				//maxHp
						20,					//px/sec
						'unit',				//type
						'player',			//allegiance
						[[170,0], [60,60]],	//weapon - [framPos, size]
						10,					//dmg
						250], 				//worth
						[[PIby2, Math.PI], [[5, 5], [10, 10]], 3, 40, [45, 'slashWeapon'], 1, 0, true],
						1,
						0
	];
	
	this.valkyrie = [[imageRepo.imgs[1],	//img
					[35,60],			//size
					[166,0],				//framPos
					120,				//maxHp
					35,					//px/sec
					'unit',				//type
					'player',			//allegiance
					[[240,0], [60,60]],	//weapon - [framPos, size]
					15,					//dmg
					300], 				//worth
					[[PIby8, PIby2], [[-5, -5], [15, 15]], 2, 30, [65, 'stabWeapon'], 1, 0, true],
					1,
					0
	];
	
	this.monk = [[imageRepo.imgs[3],
				[22, 56],
				[0,0],
				65,
				40,	
				'unit',
				'enemy',
				[[0, 70], [50,50]],
				5,
				50],
				[[-PIby4, PIby5], [[5,5], [15,15]], 3, 25, [50, 'stabWeapon'], -1, game.renderBg.slopePath.length-1, false] 
	];
	
	this.guardsMan = [[imageRepo.imgs[3],
				[26, 58],
				[57,0],
				75,
				35,
				'unit',
				'enemy',
				[[40,0], [60,60]],
				8,
				50],
				[[-PIby8, PIby2], [[20, 2], [25, 17]], 2, 25, [55, 'stabWeapon'], -1, game.renderBg.slopePath.length-1, false] 
	];
	
	this.zealot = [[imageRepo.imgs[3],
				[22, 56],
				[91,0],
				70,
				40,
				'unit',
				'enemy',
				[[119, 68],[60,60]],
				7,
				65],
				[[-PIby4, PIby8], [[-10, -10], [-5, 5]], 2.5, 30, [60, 'stabWeapon'], -1, game.renderBg.slopePath.length-1, false]
	];

	this.crusader = [[imageRepo.imgs[3],
				[26, 60],
				[27,0],
				85,
				35,
				'unit',
				'enemy',
				[[60, 70], [46,46]],
				8,
				50],
				[[PIby5, PIby2], [[-15,-15], [5,5]], 3, 25, [50, 'slashWeapon'], -1, game.renderBg.slopePath.length-1, false] 
	];

	this.friendlyArrow = [imageRepo.imgs[2],
				[44,44],
				[360, 0],
				1,
				60,
				'projectile',
				'player',
				[[],[]],
				1,
				1];

	this.enemyArrow = [imageRepo.imgs[2],
				[44,44],
				[360, 0],
				1,
				60,
				'projectile',
				'enemy',
				[[],[]],
				1,
				1];
};

function removeDead(unit){
	return unit.alive;
}

function makeId(prefix){
	
    var id = prefix + '',
		possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	if(id.length === 4){
		id += '0';
	}
    for( var i = 0; i < 8; i++){
		id += possible.charAt(Math.floor(Math.random() * possible.length));
		if(id.length >= 12){
			return id;
		}
	}

    return id;
}