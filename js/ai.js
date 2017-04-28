
function basicAi(aiParams){ //minMaxRot, minMaxWep, rotSpeed, thrustSpeed, combatStyle
	
	var truePosOnPath = aiParams[6],
		posOnPath = Math.round(truePosOnPath),
		rotDir = 1,
		isFigthing = false,
		targetFound = false,
		weapDir = [1, 1],
		walkDir = aiParams[5],
		defWalkDir = walkDir,
		target = ['none'],
		rndAng,
		isWindingUp = true,
		prefDist = aiParams[4][0] + (Math.random() > .5 ? Math.random() * aiParams[4][0] * .06 : -Math.random() * aiParams[4][0] * .06),
		allegiance = aiParams[7],
		maxRot = walkDir > 0 ? PIby4 * Math.random() + PIby4 : -(PIby4 * Math.random() + PIby4),
		stepSize = .2,
		slope = (Math.random() * stepSize) * 2 - stepSize,
		maxSteepness = 1,
		maximumHeigth = Canvas.height*7/8,
		dtPos = 0,
		prevWalkDir = walkDir,
		rndHeigth = Math.random() * (maximumHeigth - game.renderBg.slopePath[posOnPath][1]) + game.renderBg.slopePath[posOnPath][1];
		
		if(allegiance){
			this.pos = [game.renderBg.slopePath[posOnPath][0], rndHeigth];
		}else if(!allegiance){
			var l = Math.floor(Math.random() * game.allEntities.structures.length)
			this.pos = [game.allEntities.structures[l].spawnPos[0], game.allEntities.structures[l].spawnPos[1]];
			truePosOnPath = this.pos[0];
			posOnPath = Math.round(truePosOnPath);
		}
		this.dead = false;
		this.selected = false;
		this.posChosen = false;
		this.customDest = [0,0];

		if(debugMode){
			this.pos = mousePos;
			truePosOnPath = this.pos[0];
			posOnPath = Math.round(truePosOnPath);
		}

	this.animate = function(dt, speed, rot, weaponPos, inCombat, dmg, wDir){		
		isFigthing = inCombat;
		this.rot = rot;
		this.weaponPos = weaponPos;
		
		if(typeof target[0] == 'undefined' || target[0].currentHealth <= 0 || target[0].dying || !target[0].alive){
				isFigthing = false;
				targetFound = false;
				isWindingUp = true;
				target[0] = 'none';
		}

		if(!isFigthing){
			
			target = findTarget(this.pos, allegiance, prefDist);

			if(!targetFound){
				
				walkDir = defWalkDir;
				
				dtPos = dt * speed * walkDir * ((Math.random() *  .5) + .5) * speedMult;
				truePosOnPath += dtPos;
				posOnPath = Math.round(truePosOnPath);
				this.pos[0] += dtPos;

				if(walkDir > 0 && this.pos[0] > Canvas.width + 29){
					return [this.pos, true];
				}else if(walkDir < 0 && this.pos[0] < -29){
					return [this.pos, true];
				}

				this.pos[1] += slope * speedMult;
				slope += (Math.random() * stepSize) * 2 - stepSize;
				
				if(slope > maxSteepness){
					slope = stepSize;
				}else if(slope < -maxSteepness){
					slope = -stepSize;
				}
				
				if(posOnPath < 0){
					posOnPath = 0;
				}else if(posOnPath > game.renderBg.slopePath.length - 1){
					posOnPath = game.renderBg.slopePath.length - 1;
				}
				
				if(target[0] !== 'none' && typeof target[0] !== 'undefined' && target[0].currentHealth > 0){
					targetFound = true;
				}
				
			}else if(targetFound && target[0] !== 'none' && typeof target[0] !== 'undefined' && target[0].currentHealth > 0){
				
				walkDir = wDir;
				
				dtPos = dt * speed * ((Math.random() *  .5) + .5) * speedMult;
				
				if(this.pos[0] > target[0].currentPos[0]){
					walkDir = -1;
				}else if(this.pos[0] < target[0].currentPos[0]){
					walkDir = 1;
				}
				
				if(target[2] > prefDist){
					truePosOnPath -= dtPos * Math.cos(target[1]);
					posOnPath = Math.round(truePosOnPath);
					this.pos[0] -= dtPos * Math.cos(target[1]);		
					this.pos[1] -= dtPos * Math.sin(target[1]);	
				}else{
					isFigthing = true;
				}
			}
						
			var rotResult = rotateWeapon(this.rot, aiParams[0], dt, rotDir, aiParams[2], walkDir);
			var thrustResult = thrustWeapon(this.weaponPos, weapDir, aiParams[1], dt, aiParams[3], walkDir);
		
			if(walkDir < prevWalkDir || walkDir > prevWalkDir){
				if(walkDir > 0){
					this.rot = aiParams[0][0];
				}else if(walkDir < 0){
					this.rot = Math.PI - PIby2 - aiParams[0][0];
				}
				while(this.rot < 0){this.rot+=PI2;};
				while(this.rot > PI2){this.rot-=PI2;};
			}else{
				this.rot = rotResult[0];
			}
			rotDir = rotResult[1];
			this.weaponPos = thrustResult[0];
			weapDir = thrustResult[1];
		}else if(isFigthing){
			var weapResult = window[aiParams[4][1]](this.weaponPos, this.rot, walkDir, dt, aiParams[3], aiParams[2], isWindingUp, target[0], this.pos, rndAng, dmg, allegiance);
			this.rot = weapResult[1];
			this.weaponPos = weapResult[0];
			isWindingUp = weapResult[2];
			rndAng = weapResult[3];
		}
		
		if(this.pos[0] < Canvas.width && this.pos[0] > 0 && this.pos[1] < game.renderBg.slopePath[posOnPath][1]){
			this.pos[1] = game.renderBg.slopePath[posOnPath][1];
			stepSize *= -1;
		}else if(this.pos[1] > maximumHeigth){
			this.pos[1] = maximumHeigth;
			stepSize *= -1;
		}

		prevWalkDir = walkDir;

		return [this.pos, this.dead, this.rot, this.weaponPos, isFigthing, walkDir];
	};
	
	this.animateDeath = function(dt, pos, rot, alpha){
		
		if(walkDir > 0 && rot <= maxRot){
			rot += 2*dt;
		}else if(walkDir < 0 && rot >= maxRot){
			rot -= 2*dt;	
		}

		if(walkDir > 0 && rot > maxRot){
			alpha -= dt/2;

			if(alpha <= 0){
				alpha = 0;
				return [null, null, null, true];
			}
			pos[1] += dt * 70;
		}else if(walkDir < 0 && rot < maxRot){
			alpha -= dt/2;

			if(alpha <= 0){
				alpha = 0;
				return [null, null, null, true];
			}
			pos[1] += dt * 30;
		}

		return [pos, rot, alpha, false];
	};
	
}

function arrowAi(originPos, targetPos, thisSize){
	
	var leeWayX = Math.random() > .5 ? Math.random() * 50 : Math.random() * -50,
		leeWayY = Math.random() > .5 ? Math.random() * 25 : Math.random() * -25,
		p_0 = originPos,
		p_1 = [targetPos[0] + leeWayX, targetPos[1] + leeWayY],
		dir = originPos[0] > targetPos[0] ? 1 : -1,
		p_2 = [(p_0[0] + p_1[0])/2, (p_0[1] + p_1[1])/2 + dir * (p_1[0] - p_0[0])*3/4],
		prevPos = originPos,
		currentPos = originPos,
		posT = 0,
		dead = false,
		point = originPos,
		dist = Math.abs(p_0[0] - p_1[0]),
		box = 3,
		rot,
		angle,
		len = Math.hypot(thisSize[0]/2, thisSize[1]/2),
		xDiff = 0,
		yDiff = 0,
		attatchedTarget = {},
		x = 0,
		y = 0,
		oneMinPosT = 0;

	this.stuck = false;
		
	this.animate = function(dt){
		
		if(!this.stuck){
			prevPos = currentPos;

			posT += dt*250/((dist/1.5) + 0.5);
			oneMinPosT = (1 - posT)*(1 - posT);

			x = oneMinPosT * p_0[0] + 2 * (1 - posT) * posT * p_2[0] + posT * posT * p_1[0],
			y = oneMinPosT * p_0[1] + 2 * (1 - posT) * posT * p_2[1] + posT * posT * p_1[1];
		
			currentPos = [x, y];

			if((x < p_2[0] && y > (p_1[0] < p_0[0] ? p_1[1]: p_0[1])) || (x >= p_2[0] && y > (p_1[0] > p_0[0] ? p_1[1]: p_0[1]))){
				return [currentPos, true];
			}
			
			rot = Math.atan2(currentPos[1] - prevPos[1], currentPos[0] - prevPos[0]) + PI3by4;
			angle = rot + Math.atan((thisSize[1]/2)/(thisSize[0]/2)) + Math.PI;

			point = [
					(currentPos[0]) + Math.cos(angle) * len,
					(currentPos[1]) + Math.sin(angle) * len
					];
		}else{
			currentPos[0] = attatchedTarget.currentPos[0] + xDiff;
			currentPos[1] = attatchedTarget.currentPos[1] - yDiff;
		}
				
		return [currentPos, dead, rot, point];
	};
	
	this.animateDeath = function(dt, alpha){
		
		alpha -= dt/2;

		if(alpha <= 0){
			return [null, null, null, true];
		}
		if(this.stuck){
			if(typeof attatchedTarget.currentPos !== 'undefined' && attatchedTarget.currentHealth > 0){
				currentPos[0] = attatchedTarget.currentPos[0] + xDiff;
				currentPos[1] = attatchedTarget.currentPos[1] - yDiff;
			}else{
				currentPos[1] += dt * 100;
				if(rot > 0 && rot < Math.PI + PIby4){
					rot += dt/5;
				}else if(rot < 0 && rot > -PI3by4){
					rot -= dt/5;
				}
			}
		}
		
		return [alpha, currentPos, rot, false];
	};

	this.checkCollision = function(target){
		if(typeof target == 'undefined' || ((x < p_2[0] && p_0[1] - y > 80) || (x >= p_2[0] && p_1[1] - y > 80))){
			return false;
		}else if(point[0] + box >= target.currentPos[0] - target.size[0]/4 &&
				point[0] - box <= target.currentPos[0] + target.size[0]/4 &&
				point[1] + box >= target.currentPos[1] - target.size[1] &&
				point[1] - box <= target.currentPos[1]){
			var rndTing = Math.floor(Math.random() * 3) + 2;
			for(var i = 0; i < rndTing; i++){
				game.allEntities.spillBlood(point);
			}
			this.stuck = true;
			xDiff = currentPos[0] - target.currentPos[0];
			yDiff = Math.abs(currentPos[1] - target.currentPos[1]);
			attatchedTarget = target;
			game.soundFX.getSound('woundSounds');
			return true;
		}else{
			return false;
		}
	};
}

function findTarget(position, Friend, prefDist){
	
	var distance = Canvas.width,
		target = 'none',
		yDiff = 100,
		targetAngle = 0,
		units = Friend ? game.allEntities.enemyUnits: game.allEntities.playerUnits; //true = buddy
	
	for(var i = 0; i < units.length; i++){
		if(units[i].currentHealth > 0 && !units[i].dying){
			var checkedDist = Math.hypot(position[0] - units[i].currentPos[0], position[1] - units[i].currentPos[1]);
			if(checkedDist <= distance && checkedDist <= prefDist/5 + prefDist && Math.abs(units[i].currentPos[1] - position[1]) <= yDiff){
					distance = checkedDist;
					target = units[i];
			}
		}
	}

	if(target !== 'none'){
		targetAngle = Math.atan2(position[1] - target.currentPos[1], position[0] - target.currentPos[0]);
	}

	return [target, targetAngle, distance];
}

function rotateWeapon(rot, minMaxRot, dt, rotDir, rotSpeed, walkDir){

	var rnd = Math.random(),
		minRot,
		maxRot;
		
	if(walkDir > 0){
		minRot = minMaxRot[0];
		maxRot = minMaxRot[1];
	}else if(walkDir < 0){
		minRot = Math.PI - PIby2 - minMaxRot[1];
		maxRot = Math.PI - PIby2 - minMaxRot[0];
		while(minRot < 0){minRot+=PI2;};
		while(minRot > PI2){minRot-=PI2;};
		while(maxRot < 0){maxRot+=PI2;};
		while(maxRot > PI2){maxRot-=PI2;};
	}

	if(rot >= minRot && rot <= maxRot){
		rot += rotSpeed * dt * rnd * rotDir;
	}else{
		if(rot < minRot){
			rot += rotSpeed * dt * rnd;
			rotDir = 1;
		}else if(rot > maxRot){
			rot -= rotSpeed * dt * rnd;
			rotDir = -1;
		}
	}

	return [rot, rotDir];
}

function thrustWeapon(weaponPos, weapDir, minMaxWep, dt, thrustSpeed, walkDir){
	
	var rnd = Math.random(),
		minWeap,
		maxWeap;
		
	if(walkDir > 0){
		minWeap = minMaxWep[0][0];
		maxWeap = minMaxWep[1][0];
	}else if(walkDir < 0){
		minWeap = -minMaxWep[1][0];
		maxWeap = -minMaxWep[0][0];
	}
		
	if(weaponPos[0] > minWeap && weaponPos[0] < maxWeap){
		weaponPos[0] += thrustSpeed * dt * rnd * weapDir[0];
	}else{
		if(weaponPos[0] < minWeap){
			weaponPos[0] += thrustSpeed * dt * rnd;
			weapDir[0] = 1;
		}else if(weaponPos[0] > maxWeap){
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
	
	if(rnd * 2 < .25){
		weapDir[0] *= -1;
	}
	if(rnd * 2 < .25){
		weapDir[1] *= -1;
	}
	
	return [weaponPos, weapDir];
}

function slashWeapon(weaponPos, rot, direction, dt, thrustSpeed, rotSpeed, isWindingUp, target, thisPos, rndAng, dmg, allegiance){
	
	var maxWind = direction > 0 ? Math.PI + PIby2: Math.PI,
		minWind = direction > 0 ? PI2: PIby2,
		maxPos = 8,
		isWeapMax = [false, false];
	
	if(isWindingUp){
		if(rot > maxWind){
			rot -= rotSpeed/2 * dt * (Math.random() * .5 + .5);
		}else if(rot < maxWind + PIby10){
			rot += rotSpeed/2 * dt * (Math.random() * .5 + .5);
		}
		if(direction < 0){
			if(weaponPos[0] > -maxPos){
				weaponPos[0] -= dt * thrustSpeed;
			}else{
				isWeapMax[0] = true;
			}
		}else if(direction > 0){
			if(weaponPos[0] < maxPos){
				weaponPos[0] += dt * thrustSpeed;
			}else{
				isWeapMax[0] = true;
			}
		}
		
		if(weaponPos[1] > -4){
			weaponPos[1] -= dt * thrustSpeed;
		}else{
			isWeapMax[1] = true;
		}
		if(rot <= maxWind + PIby10 && rot >= maxWind && isWeapMax[0] && isWeapMax[1]){
			isWindingUp = false;
		}
	}else{
		if(direction > 0){
			if(rot < minWind){
				rot += 10 * dt * (minWind + PIby10 - rot);
				weaponPos[0] -= 10 * dt;
				weaponPos[1] += 20 * dt;
			}else{
				if(typeof target !== 'undefined'){
					var rndTing = Math.floor(Math.random() * 4) + 2;
					for(var i = 0; i < rndTing; i++){
						game.allEntities.spillBlood([target.currentPos[0] + (Math.random() * target.size[0]/2), target.currentPos[1] - (Math.random() * (target.size[1]/3) + target.size[1]/3)]);
					}
					target.currentHealth -= dmg;
				}
				isWindingUp = true;
			}
		}else if(direction < 0){
			if(rot > minWind){
				rot -= 10 * dt * (rot + PIby10 - minWind);
				weaponPos[0] += 10 * dt;
				weaponPos[1] += 20 * dt;
			}else{
				if(typeof target !== 'undefined'){
					var rndTing = Math.floor(Math.random() * 4) + 2;
					for(var i = 0; i < rndTing; i++){
						game.allEntities.spillBlood([target.currentPos[0] + (Math.random() * target.size[0]/2), target.currentPos[1] - (Math.random() * (target.size[1]/3)) + target.size[1]/3]);
					}
					game.soundFX.getSound('woundSounds');
					target.currentHealth -= dmg;
				}
				isWindingUp = true;
			}
		}
	}
	
	return [weaponPos, rot, isWindingUp];
}

function stabWeapon(weaponPos, rot, direction, dt, thrustSpeed, rotSpeed, isWindingUp, target, thisPos, rndAng, dmg, allegiance){
	
	var dx = (thisPos[0] - target.currentPos[0]),
		dy = (thisPos[1] - target.currentPos[1]),
		inPos = [false, false, false];
	
	if(typeof rndAng !== 'number'){
		rndAng = Math.random() > .5 ? Math.random() * PIby12: -(Math.random() * PIby12); 
	}
	
	var arcTan = Math.atan2(dy, dx),
		maxWind = thisPos[0] < target.currentPos[0] ? arcTan - PIby4 + rndAng + Math.PI: arcTan - PIby4 + rndAng - PI2 + Math.PI,
		maxThrustX = Math.cos(arcTan),
		maxThrustY = Math.sin(arcTan);
	
	if(maxWind < 0){
		maxWind += PI2;
	}
	
	if(isWindingUp){
		if(rot > maxWind){
			rot -= rotSpeed * dt * (Math.random() * .5 + .5);
		}else if(rot < maxWind - PIby10){
			rot += rotSpeed * dt * (Math.random() * .5 + .5);
		}
		
		if(maxThrustX < 0 && weaponPos[0] > maxThrustX * 20){	
			weaponPos[0] += 2 * thrustSpeed * dt * maxThrustX;
		}else if(maxThrustX > 0 && weaponPos[0] < maxThrustX * 20){
			weaponPos[0] += 2 * thrustSpeed * dt * maxThrustX;
		}else{
			inPos[0] = true;
		}
		
		if(maxThrustY > 0 && weaponPos[1] < maxThrustY * 10){
			weaponPos[1] += 4 * thrustSpeed * dt * maxThrustY;
		}else if(maxThrustY < 0 && weaponPos[1] > maxThrustY * 10){
			weaponPos[1] += 4 * thrustSpeed * dt * maxThrustY;
		}else{
			inPos[1] = true;
		}
		
		if(rot <= maxWind && rot >= maxWind - PIby10 && inPos[0] && inPos[1]){
			isWindingUp = false;
		}
	}else{
		
		if(maxThrustX > 0 && weaponPos[0] > -maxThrustX * 18){
			weaponPos[0] -= 200 * dt * maxThrustX;
		}else if(maxThrustX < 0 && weaponPos[0] < -maxThrustX * 18){
			weaponPos[0] -= 200 * dt * maxThrustX;
		}else{
			inPos[2] = true;
		}
		if(weaponPos[1] < 30 && weaponPos[1] > -30){
			weaponPos[1] -= 200 * dt * maxThrustY;
		}
		
		if(inPos[2]){
			if(typeof target !== 'undefined'){
				var rndTing = Math.floor(Math.random() * 3) + 2;
				for(var i = 0; i < rndTing; i++){
					game.allEntities.spillBlood([target.currentPos[0], target.currentPos[1] - (Math.random() * (target.size[1]/3) + target.size[1]/3)]);
				}
				target.currentHealth -= dmg;
				game.soundFX.getSound('woundSounds');
			}
			inPos = [false, false, false];
			isWindingUp = true;
		}
	}
	
	return [weaponPos, rot, isWindingUp, rndAng];
}

function shootBow(weaponPos, rot, direction, dt, thrustSpeed, rotSpeed, isWindingUp, target, thisPos, rndAng, dmg, friend){
	
	var maxWind = direction > 0 ? -PIby2: Math.PI;

	if(isWindingUp){
		
		if(rot >= maxWind - PIby12 && rot <= maxWind + PIby12 && (direction > 0 ? weaponPos[0] >= 5: weaponPos[0] <= -5) && weaponPos[1] <= 5 && weaponPos[1] >= 0){
			isWindingUp = false;
		}else{
			if(rot < maxWind - PIby12){
				rot += rotSpeed * dt * Math.random();
			}else if(rot > maxWind + PIby12){
				rot -= rotSpeed * dt * Math.random();
			}
			if(direction > 0){
				if(weaponPos[0] < 5){
					weaponPos[0] += dt * thrustSpeed;
				}
			}else{
				if(weaponPos[0] > -5){
					weaponPos[0] -= dt * thrustSpeed;
				}
			}
			if(weaponPos[1] > 5){
				weaponPos[1] -= dt * thrustSpeed;
			}else if(weaponPos[1] < 0){
				weaponPos[1] += dt * thrustSpeed;
			}
		}
	}else{
		if(friend){
			game.allEntities.fire('playerArrow', game.unitStats.friendlyArrow, dmg, [[thisPos[0]-10, thisPos[1]-20], target.currentPos]);
		}else if(!friend){
			game.allEntities.fire('enemyArrow', game.unitStats.enemyArrow, dmg, [[thisPos[0]-10, thisPos[1]-20], target.currentPos]);
		}
		if(direction > 0){
			weaponPos = [-20, 20];
		}else{
			weaponPos = [20, 20];
		}
		
		game.soundFX.getSound('bowSounds');
		
		isWindingUp = true;
	}

	return [weaponPos, rot, isWindingUp];
}