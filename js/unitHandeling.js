
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
				viking.walkDir = unitParams[1][5];
				viking.weaponRot = unitParams[1][0][0];
				viking.spawn([0,0]);
			this.playerUnits.push(viking);
			this.aliveUnits.push(viking);
		}else if(unitType === 'monk'){
			var monk = new Sprite(unitParams[0]);
				monk.ai = new basicAi(unitParams[1]);
				monk.id = makeId('#MK' + this.enemyUnits.length.toString(16));
				monk.walkDir = unitParams[1][5];
				monk.weaponRot = unitParams[1][0][0];
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
					[[0,0], [40,40], true],	//weapon - [framPos, size, asym]
					5,					//dmg
					100],				//worth
					[[Math.PI-PIby8, Math.PI+PIby8], [[-15, -5],[-10, 1]], 5, 25, [50, 'slashWeapon'], 1, 0, true],	//[minMaxRot, minMaxWeap, rotSpeed, thrustSpeed, [preferedDist, cmbtStyle], dir, start]
					5,						//amoutn
					1500					//timer
	];

	this.bowViking = [[imageRepo.imgs[1],	//img
					[30,58],			//size
					[67,0],				//framPos
					70,					//maxHp
					30,					//px/sec
					'unit',				//type
					'player',			//allegiance
					[[310,0], [40,40], false],	//weapon - [framPos, size]
					8,					//dmg
					100],
					[[PIby8, PIby2-PIby8], [[-2, -20], [8, -15]], 4, 25, [450, 'shootBow'], 1, 0, true],
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
						[[44,0], [60,60], false],	//weapon - [framPos, size]
						6,					//dmg
						150], 				//worth
						[[Math.PI+PIby4-PIby10, Math.PI+PIby4+PIby12], [[-5, 2], [5, 17]], 1, 25, [70, 'stabWeapon'], 1, 0, true],
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
					[[110,0], [50,50], false],	//weapon - [framPos, size]
					5,					//dmg
					200], 				//worth
					[[PI2-PIby3, PI2-PIby8], [[-5, -5], [10, 10]], 6, 30, [50, 'slashWeapon'], 1, 0, true],
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
						[[170,0], [60,60], false],	//weapon - [framPos, size]
						10,					//dmg
						250], 				//worth
						[[PI2-PIby4, PI2-PIby8], [[5, 5], [10, 10]], 3, 40, [65, 'slashWeapon'], 1, 0, true],
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
					[[240,0], [60,60], false],	//weapon - [framPos, size]
					15,					//dmg
					300], 				//worth
					[[Math.PI+PIby4-PIby10, Math.PI+PIby4+PIby12], [[-15, -5], [-10, 10]], 2, 30, [70, 'stabWeapon'], 1, 0, true],
					1,
					0
	];
	
	this.monk = [[imageRepo.imgs[3],
				[22, 56],
				[0, 0],
				70,
				40,	
				'unit',
				'enemy',
				[[0, 88], [50,50], false],
				8,
				50],
				[[Math.PI+PIby4, Math.PI+PIby4+PIby8], [[10, 5], [15, 20]], 3, 25, [55, 'stabWeapon'], -1, game.renderBg.slopePath.length-1, false] 
	];

	this.guardsMan = [[imageRepo.imgs[3],
				[26, 58],
				[57, 0],
				80,
				35,
				'unit',
				'enemy',
				[[44,0], [60,60], false],
				10,
				50],
				[[Math.PI+PIby4-PIby10, Math.PI+PIby4+PIby12], [[-20, 5], [-5, 15]], 2, 25, [65, 'stabWeapon'], -1, game.renderBg.slopePath.length-1, false] 
	];
	
	this.zealot = [[imageRepo.imgs[3],
				[22, 56],
				[91, 0],
				75,
				40,
				'unit',
				'enemy',
				[[119, 88], [60,60], false],
				12,
				65],
				[[PI2-PI3by4, PI2-PIby2], [[1, 1], [5, 15]], 2.5, 30, [60, 'stabWeapon'], -1, game.renderBg.slopePath.length-1, false]
	];

	this.crusader = [[imageRepo.imgs[3],
				[26, 60],
				[27, 0],
				90,
				35,	
				'unit',
				'enemy',
				[[60, 88], [46,46]],
				10,
				50],
				[[Math.PI+PIby8, PI2-PIby2], [[10, -10],[15, -5]], 3, 25, [50, 'slashWeapon'], -1, game.renderBg.slopePath.length-1, false] 
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