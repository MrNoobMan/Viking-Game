
function basicAi(aiParams){ //minMaxRot, minMaxWep, rotSpeed, thrustSpeed, combatStyle
	
	var truePosOnPath = aiParams[6],
		posOnPath = Math.round(truePosOnPath),
		rotDir = 1,
		isFigthing = false,
		targetFound = false,
		weapDir = [1, 1],
		walkDir = aiParams[5],
		target = 'none',
		rndAng,
		isWindingUp = true,
		allegiance = aiParams[7];
		this.pos = game.renderBg.slopePath[posOnPath];
		
	if(aiParams[4][1] == 'shootBow'){
		aiParams[4][0] += Math.random() > .5 ? Math.random() * 25 : -Math.random() * 25;
	}

	this.animate = function(dt, speed, rot, weaponPos, inCombat, dmg){
		isFigthing = inCombat;
		this.dead = false;
		this.rot = rot;
		this.weaponPos = weaponPos;
		
		if(typeof target === 'undefined' || target.currentHealth <= 0){
				target.alive = false;
				isFigthing = false;
				targetFound = false;
				isWindingUp = true;
				target = 'none';
			}

		if(!isFigthing){
			
			target = findTarget(this.pos, allegiance);

			if(!targetFound){
				
				if(walkDir > 0){
					if(posOnPath < game.renderBg.slopePath.length){
						truePosOnPath += speed * dt * walkDir * ((Math.random() * .5) + .5);
						posOnPath = Math.round(truePosOnPath);
					
						this.pos = game.renderBg.slopePath[posOnPath];
					}
					if(posOnPath >= game.renderBg.slopePath.length){
						posOnPath = 0;
						truePosOnPath = 0;
						this.dead = true;
						return [0, true];
					}
				}else if(walkDir < 0){
					if(posOnPath > 0){
					truePosOnPath += speed * dt * walkDir;
					posOnPath = Math.round(truePosOnPath);
				
					this.pos = game.renderBg.slopePath[posOnPath];
					}
					if(posOnPath <= 0){
						posOnPath = 0;
						truePosOnPath = 0;
						this.dead = true;
						return [0, true];
					}
				}
				if(target != 'none' && typeof target != 'undefined'){
					targetFound = true;
				}
			}else if(targetFound && target != 'none' && typeof target != 'undefined'){
				if(walkDir > 0 && this.pos[0] < target.currentPos[0] - aiParams[4][0] + (Math.random() * 5 - Math.random() * 5)){
					truePosOnPath += speed * dt * walkDir;
					posOnPath = Math.round(truePosOnPath);
				
					this.pos = game.renderBg.slopePath[posOnPath];
				}else if(walkDir < 0 && this.pos[0] > target.currentPos[0] + aiParams[4][0] + (Math.random() * 5 - Math.random() * 5)){
					truePosOnPath += speed * dt * walkDir;
					posOnPath = Math.round(truePosOnPath);

					this.pos = game.renderBg.slopePath[posOnPath];
				}else{
					isFigthing = true;
				}
			}
						
			var rotResult = rotateWeapon(this.rot, aiParams[0], dt, rotDir, aiParams[2]);
			var thrustResult = thrustWeapon(this.weaponPos, weapDir, aiParams[1], dt, aiParams[3]);
		
			this.rot = rotResult[0];
			rotDir = rotResult[1];
			this.weaponPos = thrustResult[0];
			weapDir = thrustResult[1];
		}else if(isFigthing){
			var weapResult = window[aiParams[4][1]](this.weaponPos, this.rot, walkDir, dt, aiParams[3], aiParams[2], isWindingUp, target, this.pos, rndAng, dmg);
			this.rot = weapResult[1];
			this.weaponPos = weapResult[0];
			isWindingUp = weapResult[2];
			rndAng = weapResult[3];
		}
				
		return [this.pos, this.dead, this.rot, this.weaponPos, isFigthing];
	}
	
}

function arrowAi(originPos, targetPos, thisSize){
	
	var leeWay = Math.random() > .5 ? Math.random() * 25 : Math.random() * -50,
		p_0 = originPos,
		p_1 = [targetPos[0], targetPos[1] + leeWay],
		dir = originPos[0] > targetPos[0] ? 1 : -1,
		p_2 = [(p_0[0] + p_1[0])/2, (p_0[1] + p_1[1])/2 + dir * (p_1[0] - p_0[0])*3/4],
		prevPos = originPos,
		currentPos = originPos,
		posT = 0,
		dead = false,
		point = originPos,
		dist = Math.abs(p_0[0] - p_1[0]),
		box = 3;

	this.animate = function(dt){
		
		prevPos = currentPos;

		posT += dt*200/((dist/1.5) + 0.5); //dt * 3/4

		var x = Math.pow((1 - posT), 2) * p_0[0] + 2 * (1 - posT) * posT * p_2[0] + Math.pow(posT, 2) * p_1[0],
			y = Math.pow((1 - posT), 2) * p_0[1] + 2 * (1 - posT) * posT * p_2[1] + Math.pow(posT, 2) * p_1[1];
	
		currentPos = [x, y];

		if(typeof game.renderBg.slopePath[Math.round(x + 30)] === 'undefined' || y > game.renderBg.slopePath[Math.round(x + 30)][1]+25){
			return [currentPos, true];
		}
		
		var rot = Math.atan2(currentPos[1] - prevPos[1], currentPos[0] - prevPos[0]) + PI3by4,
			angle = rot + Math.atan((thisSize[1]/2)/(thisSize[0]/2)) + Math.PI,
			len = Math.sqrt(Math.pow((thisSize[1]/2),2) + Math.pow((thisSize[0]/2),2));
		
		point = [
				(currentPos[0]) + Math.cos(angle) * len,
				(currentPos[1]) + Math.sin(angle) * len
				];

		return [currentPos, dead, rot, point];
	};

	this.checkCollision = function(target){
		if(typeof target === 'undefined'){
			return false;
		}else if(point[0] + box >= target.currentPos[0] &&
				point[0] - box <= target.currentPos[0] + target.size[0] &&
				point[1] + box >= target.currentPos[1] &&
				point[1] - box <= target.currentPos[1] + target.size[1]){
			let rndTing = Math.floor(Math.random() * 2) + 1;
			for(var i = 0; i < rndTing; i++){
				game.allEntities.spillBlood(point);
			}
			return true;
		}else{
			return false;
		}
	}
	
}

function findTarget(position, Friend){
	
	var distance = Canvas.width,
		target = 'none';
	
	if(Friend){	//true = buddy
		for(var i = 0; i < game.allEntities.enemyUnits.length; i++){
			var checkedDist = game.allEntities.enemyUnits[i].currentPos[0] - position[0];
			if(checkedDist <= distance && position[0] < game.allEntities.enemyUnits[i].currentPos[0]){
				distance = checkedDist;
				target = game.allEntities.enemyUnits[i];
			}
		}
		return target;
	}else if(!Friend){	//false = not buddy
		for(var i = 0; i < game.allEntities.playerUnits.length; i++){
			var checkedDist = position[0] - game.allEntities.playerUnits[i].currentPos[0];
			if(checkedDist <= distance && position[0] > game.allEntities.playerUnits[i].currentPos[0]){
				distance = checkedDist;
				target = game.allEntities.playerUnits[i];
			}
		}
		return target;
	}else{
		return target;
	}
	
}

function rotateWeapon(rot, minMaxRot, dt, rotDir, rotSpeed){
		
	var rnd = Math.random();
	
	if(rot >= minMaxRot[0] && rot <= minMaxRot[1]){
		rot += rotSpeed * dt * rnd * rotDir;
	}else{
		if(rot < minMaxRot[0]){
			rot += rotSpeed * dt * rnd;
			rotDir = 1;
		}else if(rot > minMaxRot[1]){
			rot -= rotSpeed * dt * rnd;
			rotDir = -1;
		}
	}

	if(Math.random() * .75 >  Math.abs(minMaxRot[0])/Math.abs(rot) && rotDir > 0){
		rotDir *= -1;
	}else if(Math.random() * .75 > Math.abs(rot)/Math.abs(minMaxRot[1]) && rotDir < 0){
		rotDir *= -1;
	}
	
	return [rot, rotDir];
}

function thrustWeapon(weaponPos, weapDir, minMaxWep, dt, thrustSpeed){
	
	var rnd = Math.random();
	
	if(weaponPos[0] > minMaxWep[0][0] && weaponPos[0] < minMaxWep[1][0]){
		weaponPos[0] += thrustSpeed * dt * rnd * weapDir[0];
	}else{
		if(weaponPos[0] < minMaxWep[0][0]){
			weaponPos[0] += thrustSpeed * dt * rnd;
			weapDir[0] = 1;
		}else if(weaponPos[0] > minMaxWep[1][0]){
			weaponPos[0] -= thrustSpeed * dt * rnd;
			weapDir[0] = -1;
		}
	}
	
	if(weaponPos[1] > minMaxWep[0][1] && weaponPos[1] < minMaxWep[1][1]){
		weaponPos[1] += thrustSpeed * dt * rnd * weapDir[1];
	}else{
		if(weaponPos[1] < minMaxWep[0][1]){
			weaponPos[1] += thrustSpeed * dt * rnd;
			weapDir[1] = 1;
		}else if(weaponPos[1] > minMaxWep[1][1]){
			weaponPos[1] -= thrustSpeed * dt * rnd;
			weapDir[1] = -1;
		}
	}
	
	if(Math.random() * .5 > Math.abs(minMaxWep[0][0])/Math.abs(weaponPos[0]) && weapDir[0] > 0){
		weapDir[0] *= -1;
	}else if(Math.random() * .5 > Math.abs(weaponPos[0])/Math.abs(minMaxWep[0][0]) && weapDir[0] < 0){
		weapDir[0] *= -1;
	}
	if(Math.random() * .5 > Math.abs(minMaxWep[0][1])/Math.abs(weaponPos[1]) && weapDir[1] > 0){
		weapDir[1] *= -1;
	}else if(Math.random() * .5 > Math.abs(weaponPos[1])/Math.abs(minMaxWep[0][1]) && weapDir[1] < 0){
		weapDir[1] *= -1;
	}
		
	return [weaponPos, weapDir];
}

function slashWeapon(weaponPos, rot, direction, dt, thrustSpeed, rotSpeed, isWindingUp, target, thisPos, rndAng, dmg){
	
	var maxWind = direction > 0 ? PIby3 : PIby9,
		minWind = direction > 0 ? Math.PI: -PIby2;
	
	if(isWindingUp){
		if(rot > maxWind){
			rot -= rotSpeed/2 * dt * (Math.random() * .5 + .5);
		}else if(rot < maxWind + PIby10){
			rot += rotSpeed/2 * dt * (Math.random() * .5 + .5);
		}
		if(weaponPos[0] > direction * -8){
			weaponPos[0] -= direction * thrustSpeed * dt;
		}
		if(weaponPos[1] > -8){
			weaponPos[1] -= thrustSpeed * dt;
		}
		if(rot <= maxWind + PIby10 && rot >= maxWind && weaponPos[0] <= direction * -8 && weaponPos[1] <= direction * -8){
			isWindingUp = false;
		}
	}else{
		if(direction > 0){
			if(rot < minWind){
				rot += 10 * dt * ((minWind + (PIby10 * direction)) - rot);
				weaponPos[0] += 3 * dt;
				weaponPos[1] += 3 * dt;
			}else{
				if(typeof target != 'undefined'){
					let rndTing = Math.floor(Math.random() * 2) + 1;
					for(var i = 0; i < rndTing; i++){
						game.allEntities.spillBlood([target.currentPos[0] + (Math.random() * target.size[0]), target.currentPos[1] + (Math.random() * (target.size[1]/2))]);
					}
					target.currentHealth -= dmg;
				}
				isWindingUp = true;
			}
		}else if(direction < 0){
			if(rot > minWind){
				rot -= 10 * dt * (Math.abs(minWind + (PIby10 * direction)) - Math.abs(rot));
				weaponPos[0] -= 3 * dt;
				weaponPos[1] -= 3 * dt;
			}else{
				if(typeof target != 'undefined'){
					let rndTing = Math.floor(Math.random() * 2) + 1;
					for(var i = 0; i < rndTing; i++){
						game.allEntities.spillBlood([target.currentPos[0] + (Math.random() * target.size[0]), target.currentPos[1] + (Math.random() * (target.size[1]/2))]);
					}
					target.currentHealth -= dmg;
				}
				isWindingUp = true;
			}
		}
	}
	
	return [weaponPos, rot, isWindingUp];
}

function stabWeapon(weaponPos, rot, direction, dt, thrustSpeed, rotSpeed, isWindingUp, target, thisPos, rndAng, dmg){
	
	var dx = (thisPos[0] - target.currentPos[0]),
		dy = (thisPos[1] - target.currentPos[1]);
	
	if(typeof rndAng != 'number'){
		rndAng = Math.random() > .5 ? Math.random() * PIby12: -(Math.random() * PIby12); 
	}
	
	var maxWind = thisPos[0] < target.currentPos[0] ? Math.atan2(dy, dx) - Math.PI/5 + rndAng : Math.atan2(dy, dx) - Math.PI/5 + rndAng - PI2;
	
	if(maxWind < 0){
		maxWind += PI2;
	} 
	
	if(isWindingUp){
		if(rot > maxWind){
			rot -= rotSpeed * dt * (Math.random() * .5 + .5);
		}else if(rot < maxWind - PIby10){
			rot += rotSpeed * dt * (Math.random() * .5 + .5);
		}
		if(weaponPos[0] < 15){
			weaponPos[0] += thrustSpeed * dt;
		}
		if(weaponPos[1] < 15){
			weaponPos[1] += thrustSpeed * dt;
		}
		if(rot <= maxWind && rot >= maxWind - PIby10 && weaponPos[0] >= 15 && weaponPos[1] >= 15){
			isWindingUp = false;
		}
	}else{
		if(weaponPos[0] > -15){
			weaponPos[0] -= 200 * dt;
		}
		if(weaponPos[1] > -15){
			weaponPos[1] -= 200 * dt;
		}
		
		if(weaponPos[0] <= -15 && weaponPos[1] <= -15){
			if(typeof target != 'undefined'){
				let rndTing = Math.floor(Math.random() * 2) + 1;
				for(var i = 0; i < rndTing; i++){
					game.allEntities.spillBlood([target.currentPos[0] + (Math.random() * target.size[0]), target.currentPos[1] + (Math.random() * (target.size[1]/2))]);
				}
				target.currentHealth -= dmg;
			}
			isWindingUp = true;
		}
	}
	
	return [weaponPos, rot, isWindingUp, rndAng];
}

function shootBow(weaponPos, rot, direction, dt, thrustSpeed, rotSpeed, isWindingUp, target, thisPos, rndAng, dmg){
	
	var aimPoint = [(thisPos[0] + target.currentPos[0])/2, (thisPos[1] + target.currentPos[1])/2 - (target.currentPos[0] - thisPos[0])*3/4];
	
	var maxWind = Math.atan2(aimPoint[1] - thisPos[1], aimPoint[0] - thisPos[0]) + PIby4;
	
	if(isWindingUp){
		
		if(rot >= maxWind - PIby12 && rot <= maxWind + PIby12 && weaponPos[1] >= 9 && weaponPos[1] <= 11 && weaponPos[0] >= 39 && weaponPos[0] <= 41){
			isWindingUp = false;
		}else{
			
			if(rot < maxWind - PIby12){
				rot += rotSpeed * dt * Math.random();
			}else if(rot > maxWind + PIby12){
				rot -= rotSpeed * dt * Math.random();
			}

			if(weaponPos[0] < 39){
				weaponPos[0] += thrustSpeed * dt * 1.5 * Math.random();
			}else if(weaponPos[0] > 41){
				weaponPos[0] -= thrustSpeed * dt * 1.5 * Math.random();
			}
			
			if(weaponPos[1] < 9){
				weaponPos[1] += thrustSpeed * dt * Math.random();
			}else if(weaponPos[1] > 11){
				weaponPos[1] -= thrustSpeed * dt * Math.random();
			}
		
		}
	}else{
		game.allEntities.fire('playerArrow', game.unitStats.friendlyArrow, dmg, [thisPos, target.currentPos]);
		weaponPos = [20, 30];
		isWindingUp = true;
	}
	
	return [weaponPos, rot, isWindingUp];
}