
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
		prefDist = aiParams[4][0] + (Math.random() > .5 ? Math.random() * aiParams[4][0] * .06 : -Math.random() * aiParams[4][0] * .06),
		allegiance = aiParams[7],
		maxRot = walkDir > 0 ? PIby4 * Math.random() + PIby4 : -(PIby4 * Math.random() + PIby4),
		stepSize = .2,
		slope = (Math.random() * stepSize) * 2 - stepSize,
		maxSteepness = 1,
		maximumHeigth = Canvas.height*7/8;
		rndHeigth = Math.random() * (maximumHeigth - game.renderBg.slopePath[posOnPath][1]) + game.renderBg.slopePath[posOnPath][1];
		this.pos = [game.renderBg.slopePath[posOnPath][0], rndHeigth];
		this.dead = false;
		
	this.animate = function(dt, speed, rot, weaponPos, inCombat, dmg){		
		isFigthing = inCombat;
		this.rot = rot;
		this.weaponPos = weaponPos;
		
		if(typeof target === 'undefined' || target.currentHealth <= 0){
				target.dying = true;
				isFigthing = false;
				targetFound = false;
				isWindingUp = true;
				target = 'none';
		}

		if(!isFigthing){
			
			target = findTarget(this.pos, allegiance);

			if(!targetFound){
				
				var moveX = dt * speed * walkDir * ((Math.random() *  .5) + .5);
				truePosOnPath += moveX;
				posOnPath = Math.round(truePosOnPath);
				this.pos[0] += moveX;

				if(walkDir > 0 && this.pos[0] > Canvas.width + 29){
					return [this.pos, true];
				}else if(walkDir < 0 && this.pos[0] < -29){
					return [this.pos, true];
				}

				this.pos[1] += slope;
				slope += (Math.random() * stepSize) * 2 * dt * fps - stepSize;
				
				if(slope > maxSteepness){
					slope = stepSize;
				}else if(slope < -maxSteepness){
					slope = -stepSize;
				};
				
				if(this.pos[1] < game.renderBg.slopePath[posOnPath][1]){
					this.pos[1] = game.renderBg.slopePath[posOnPath][1];
					stepSize *= -1;
				}else if(this.pos[1] > maximumHeigth){
					this.pos[1] = maximumHeigth;
					stepSize *= -1;
				}
				if(target != 'none' && typeof target != 'undefined'){
					targetFound = true;
				};
				/*if(walkDir > 0){
					if(posOnPath < game.renderBg.slopePath.length - 1){
						truePosOnPath += speed * dt * walkDir * ((Math.random() * .5) + .5);
						posOnPath = Math.round(truePosOnPath);
					
					}
					if(posOnPath >= game.renderBg.slopePath.length - 1){
						this.dead = true;
						return [this.pos, true];
					}
					this.pos = [game.renderBg.slopePath[posOnPath][0], game.renderBg.slopePath[posOnPath][1] + rndHeigth];
				}else if(walkDir < 0){
					if(posOnPath > 1){
						truePosOnPath += speed * dt * walkDir;
						posOnPath = Math.round(truePosOnPath);
					}
					if(posOnPath <= 1){
						this.dead = true;
						return [this.pos, true];
					}
					this.pos = [game.renderBg.slopePath[posOnPath][0], game.renderBg.slopePath[posOnPath][1] + rndHeigth];
				}*/
			}else if(targetFound && target != 'none' && typeof target != 'undefined'){
				/*if(walkDir > 0 && this.pos[0] < target.currentPos[0] - prefDist){
					truePosOnPath += speed * dt * walkDir;
					posOnPath = Math.round(truePosOnPath);
				
					this.pos = [game.renderBg.slopePath[posOnPath][0], game.renderBg.slopePath[posOnPath][1] + rndHeigth];
				}else if(walkDir < 0 && this.pos[0] > target.currentPos[0] + prefDist){
					truePosOnPath += speed * dt * walkDir;
					posOnPath = Math.round(truePosOnPath);

					this.pos = [game.renderBg.slopePath[posOnPath][0], game.renderBg.slopePath[posOnPath][1] + rndHeigth];
				}else{
					isFigthing = true;
				}*/
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
	};
	
	this.animateDeath = function(dt, pos, rot, weapRot, alpha){
		
		alpha -= dt/2;

		if(alpha <= 0){
			alpha = 0;
			return [null, null, null, null, true];
		}
		if(walkDir > 0 && rot <= maxRot){
			rot += dt/2;
		}else if(walkDir < 0 && rot >= maxRot){
			rot -= dt/2;	
		}
		weapRot += dt/3 * walkDir;
		pos[1] += dt * 70;
		return [pos, rot, weapRot, alpha, false];
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
		depth = Math.random() * 10 + 30,
		rot,
		angle,
		len,
		xDiff = 0,
		yDiff = 0,
		attatchedTarget = {};

	this.stuck = false;
		
	this.animate = function(dt){
		
		if(!this.stuck){
			prevPos = currentPos;

			posT += dt*200/((dist/1.5) + 0.5);

			var x = Math.pow((1 - posT), 2) * p_0[0] + 2 * (1 - posT) * posT * p_2[0] + Math.pow(posT, 2) * p_1[0],
				y = Math.pow((1 - posT), 2) * p_0[1] + 2 * (1 - posT) * posT * p_2[1] + Math.pow(posT, 2) * p_1[1];
		
			currentPos = [x, y];

			if(typeof game.renderBg.slopePath[Math.round(x + depth)] === 'undefined' || y > game.renderBg.slopePath[Math.round(x + depth)][1]+depth){
				return [currentPos, true];
			}
			
			rot = Math.atan2(currentPos[1] - prevPos[1], currentPos[0] - prevPos[0]) + PI3by4;
			angle = rot + Math.atan((thisSize[1]/2)/(thisSize[0]/2)) + Math.PI;
			len = Math.sqrt(Math.pow((thisSize[1]/2),2) + Math.pow((thisSize[0]/2),2));
			
			point = [
					(currentPos[0]) + Math.cos(angle) * len,
					(currentPos[1]) + Math.sin(angle) * len
					];
		}else{
			currentPos[0] = attatchedTarget.currentPos[0] - xDiff;
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
			if(typeof attatchedTarget.currentPos != 'undefined' && attatchedTarget.currentHealth > 0){
				currentPos[0] = attatchedTarget.currentPos[0] - xDiff;
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
		if(typeof target === 'undefined'){
			return false;
		}else if(point[0] + box >= target.currentPos[0] &&
				point[0] - box <= target.currentPos[0] &&
				point[1] + box >= target.currentPos[1] &&
				point[1] - box <= target.currentPos[1]){
			let rndTing = Math.floor(Math.random() * 4) + 2;
			for(var i = 0; i < rndTing; i++){
				game.allEntities.spillBlood(point);
			}
			this.stuck = true;
			xDiff = Math.abs(currentPos[0] - target.currentPos[0]);
			yDiff = Math.abs(currentPos[1] - target.currentPos[1]);
			attatchedTarget = target;
			return true;
		}else{
			return false;
		}
	};
}

function findTarget(position, Friend){
	
	var distance = Canvas.width,
		target = 'none';
	
	if(Friend){	//true = buddy
		for(var i = 0; i < game.allEntities.enemyUnits.length; i++){
			var checkedDist = game.allEntities.enemyUnits[i].currentPos[0] - position[0];
			if(!game.allEntities.enemyUnits[i].dying && checkedDist <= distance && position[0] < game.allEntities.enemyUnits[i].currentPos[0]){
				distance = checkedDist;
				target = game.allEntities.enemyUnits[i];
			}
		}
		return target;
	}else if(!Friend){	//false = not buddy
		for(var i = 0; i < game.allEntities.playerUnits.length; i++){
			var checkedDist = position[0] - game.allEntities.playerUnits[i].currentPos[0];
			if(!game.allEntities.playerUnits[i].dying && checkedDist <= distance && position[0] > game.allEntities.playerUnits[i].currentPos[0]){
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
	
	if(Math.random() * dt * .5 > Math.abs(minMaxWep[0][0])/Math.abs(weaponPos[0]) && weapDir[0] > 0){
		weapDir[0] *= -1;
	}else if(Math.random() * dt * .5 > Math.abs(weaponPos[0])/Math.abs(minMaxWep[1][0]) && weapDir[0] < 0){
		weapDir[0] *= -1;
	}
	if(Math.random() * dt * .5 > Math.abs(minMaxWep[0][1])/Math.abs(weaponPos[1]) && weapDir[1] > 0){
		weapDir[1] *= -1;
	}else if(Math.random() * dt * .5 > Math.abs(weaponPos[1])/Math.abs(minMaxWep[1][1]) && weapDir[1] < 0){
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
						game.allEntities.spillBlood([target.currentPos[0] + (Math.random() * target.size[0]), target.currentPos[1] - (Math.random() * (target.size[1]/3) + target.size[1]/3)]);
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
						game.allEntities.spillBlood([target.currentPos[0] + (Math.random() * target.size[0]), target.currentPos[1] - (Math.random() * (target.size[1]/3)) + target.size[1]/3]);
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
					game.allEntities.spillBlood([target.currentPos[0] + (Math.random() * target.size[0]), target.currentPos[1] - (Math.random() * (target.size[1]/3) + target.size[1]/3)]);
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
		game.allEntities.fire('playerArrow', game.unitStats.friendlyArrow, dmg, [[thisPos[0]-10, thisPos[1]-20], target.currentPos]);
		weaponPos = [20, 30];
		isWindingUp = true;
	}

	return [weaponPos, rot, isWindingUp];
}